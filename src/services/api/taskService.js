import { getApperClient } from "@/services/apperClient";

class TaskService {
  constructor() {
    this.tableName = 'tasks_c';
  }

  getApperClientInstance() {
    const client = getApperClient();
    if (!client) {
      throw new Error('ApperClient not initialized');
    }
    return client;
  }

  async getAll() {
    try {
      const apperClient = this.getApperClientInstance();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
}

      // Validate date fields to prevent date-fns errors
      const validatedData = (response.data || []).map(task => ({
        ...task,
        dueDate_c: task.dueDate_c || task.dueDate || null,
        CreatedOn: task.CreatedOn || new Date().toISOString(),
        ModifiedOn: task.ModifiedOn || new Date().toISOString()
      }));

      return validatedData;
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClientInstance();
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
}

      // Validate date fields for single task
      const task = response.data;
      if (task) {
        return {
          ...task,
          dueDate_c: task.dueDate_c || task.dueDate || null,
          CreatedOn: task.CreatedOn || new Date().toISOString(),
          ModifiedOn: task.ModifiedOn || new Date().toISOString()
        };
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByContactId(contactId) {
    try {
      const apperClient = this.getApperClientInstance();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          FieldName: "contactId_c",
          Operator: "EqualTo",
          Values: [parseInt(contactId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
}

      // Validate date fields for search results
      const validatedData = (response.data || []).map(task => ({
        ...task,
        dueDate_c: task.dueDate_c || task.dueDate || null,
        CreatedOn: task.CreatedOn || new Date().toISOString(),
        ModifiedOn: task.ModifiedOn || new Date().toISOString()
      }));

      return validatedData;
    } catch (error) {
      console.error("Error searching tasks:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      const apperClient = this.getApperClientInstance();
      const params = {
        records: [{
          title_c: taskData.title_c || taskData.title,
          completed_c: taskData.completed_c !== undefined ? taskData.completed_c : (taskData.completed || false),
          dueDate_c: taskData.dueDate_c || taskData.dueDate,
          contactId_c: parseInt(taskData.contactId_c || taskData.contactId)
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      const apperClient = this.getApperClientInstance();
      const params = {
        records: [{
          Id: parseInt(id),
          title_c: taskData.title_c || taskData.title,
          completed_c: taskData.completed_c !== undefined ? taskData.completed_c : taskData.completed,
          dueDate_c: taskData.dueDate_c || taskData.dueDate,
          contactId_c: parseInt(taskData.contactId_c || taskData.contactId)
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = this.getApperClientInstance();
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            console.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const taskService = new TaskService();