import { taskService } from "./taskService";
import { activityService } from "./activityService";
import { contactService } from "./contactService";
import { format, isAfter, isToday, isTomorrow, subDays } from "date-fns";
import React from "react";
import Error from "@/components/ui/Error";

class AlertService {
  constructor() {
    this.dismissedAlerts = new Set();
  }

  // Simulate delay for realistic API behavior
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    
    try {
      const [tasks, activities, contacts] = await Promise.all([
        taskService.getAll(),
        activityService.getAll(),
        contactService.getAll()
      ]);

      const alerts = [];
      const now = new Date();

// Task-based alerts
      tasks.forEach(task => {
        if (task.dueDate_c || task.dueDate) {
          const dateValue = task.dueDate_c || task.dueDate;
          const dueDate = dateValue ? new Date(dateValue) : null;
          
          // Skip if date is invalid
          if (!dueDate || isNaN(dueDate.getTime())) {
            return;
          }
          
          const alertKey = `task-${task.Id}`;
          if (this.dismissedAlerts.has(alertKey)) return;

          // Overdue tasks
          if (isAfter(now, dueDate)) {
            alerts.push({
              Id: `overdue-${task.Id}`,
              type: 'task_overdue',
              priority: 'high',
              title: 'Overdue Task',
              message: `"${task.title}" was due ${format(dueDate, 'MMM d, yyyy')}`,
              taskId: task.Id,
              task: task,
              timestamp: task.dueDate,
              actions: [
                { type: 'complete', label: 'Mark Complete' },
                { type: 'dismiss', label: 'Dismiss' }
              ]
            });
          }
          // Tasks due today
          else if (isToday(dueDate)) {
            alerts.push({
              Id: `due-today-${task.Id}`,
              type: 'task_due_today',
              priority: 'medium',
              title: 'Due Today',
              message: `"${task.title}" is due today`,
              taskId: task.Id,
              task: task,
              timestamp: task.dueDate,
              actions: [
                { type: 'complete', label: 'Mark Complete' },
                { type: 'dismiss', label: 'Dismiss' }
              ]
            });
          }
          // Tasks due tomorrow
          else if (isTomorrow(dueDate)) {
            alerts.push({
              Id: `due-tomorrow-${task.Id}`,
              type: 'task_due_tomorrow',
              priority: 'low',
              title: 'Due Tomorrow',
              message: `"${task.title}" is due tomorrow`,
              taskId: task.Id,
              task: task,
              timestamp: task.dueDate,
              actions: [
                { type: 'dismiss', label: 'Dismiss' }
              ]
            });
          }
        }
      });
// Activity-based alerts (follow-ups needed)
      const sevenDaysAgo = subDays(now, 7);
      const recentActivities = activities.filter(activity => {
        if (activity.timestamp_c || activity.timestamp) {
          const dateValue = activity.timestamp_c || activity.timestamp;
          const activityDate = dateValue ? new Date(dateValue) : null;
          
          // Skip if date is invalid
          if (!activityDate || isNaN(activityDate.getTime())) {
            return false;
          }
          
          return isAfter(activityDate, sevenDaysAgo);
        }
        return false;
      }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      // Group by contact and suggest follow-ups for recent activities
      const contactActivityMap = {};
      recentActivities.forEach(activity => {
        if (!contactActivityMap[activity.contactId]) {
          contactActivityMap[activity.contactId] = [];
        }
        contactActivityMap[activity.contactId].push(activity);
      });
      Object.entries(contactActivityMap).forEach(([contactId, contactActivities]) => {
        const alertKey = `follow-up-${contactId}`;
        if (this.dismissedAlerts.has(alertKey)) return;

        const contact = contacts.find(c => c.Id === parseInt(contactId));
        const latestActivity = contactActivities[0];
        
        if (contact && contactActivities.length > 0) {
          alerts.push({
            Id: `follow-up-${contactId}`,
            type: 'contact_follow_up',
            priority: 'medium',
            title: 'Follow-up Needed',
            message: `${contact.name} - ${contactActivities.length} recent ${contactActivities.length === 1 ? 'activity' : 'activities'}`,
            contactId: parseInt(contactId),
            contact: contact,
            activities: contactActivities,
            timestamp: latestActivity.timestamp,
            actions: [
              { type: 'dismiss', label: 'Dismiss' }
            ]
          });
        }
      });

// Sort by priority and timestamp
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      alerts.sort((a, b) => {
        // First sort by priority
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        // Then sort by timestamp (most recent first) with safe date comparison
        const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
        const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
        
        // Handle invalid dates
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        
        return dateB.getTime() - dateA.getTime();
      });
      
      return alerts;
    } catch (error) {
      console.error('AlertService.getAll error:', error);
      throw new Error('Failed to load alerts');
    }
  }

  async dismissAlert(alertId) {
    await this.delay(100);
    this.dismissedAlerts.add(alertId.replace(/^(overdue|due-today|due-tomorrow|follow-up)-/, ''));
    return { success: true };
  }

  async completeTask(taskId) {
    await this.delay(200);
    try {
      await taskService.update(taskId, { completed: true });
      this.dismissedAlerts.add(`task-${taskId}`);
      return { success: true };
    } catch (error) {
      console.error('AlertService.completeTask error:', error);
      throw new Error('Failed to complete task');
    }
  }

  clearDismissedAlerts() {
    this.dismissedAlerts.clear();
  }
}

export const alertService = new AlertService();