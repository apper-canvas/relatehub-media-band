import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import CompanyModal from "@/components/organisms/CompanyModal";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { taskService } from "@/services/api/taskService";
import { activityService } from "@/services/api/activityService";
import { alertService } from "@/services/api/alertService";
import { companyService } from "@/services/api/companyService";
import ContactModal from "@/components/organisms/ContactModal";
import TaskModal from "@/components/organisms/TaskModal";
import DealModal from "@/components/organisms/DealModal";
import Header from "@/components/organisms/Header";

function Layout() {
  const [modals, setModals] = useState({
    contact: false,
    deal: false,
    task: false,
    company: false,
  });

  const [selectedItems, setSelectedItems] = useState({
    contact: null,
    deal: null,
    task: null,
    company: null,
  });

  const openModal = (type, data = null) => {
    setModals(prev => ({ ...prev, [type]: true }));
    if (data) setSelectedItems(prev => ({ ...prev, [type]: data }));
  };

  const closeModal = (type) => {
    setModals(prev => ({ ...prev, [type]: false }));
    setSelectedItems(prev => ({ ...prev, [type]: null }));
  };

  const handleSaveContact = async (contactData) => {
    try {
      if (selectedItems.contact) {
        await contactService.update(selectedItems.contact.Id, contactData);
        await activityService.create({
          contactId: selectedItems.contact.Id,
          dealId: null,
          type: "note",
          description: `Contact updated: ${contactData.name}`,
          timestamp: new Date().toISOString(),
        });
      } else {
        const newContact = await contactService.create(contactData);
        await activityService.create({
          contactId: newContact.Id,
          dealId: null,
          type: "note",
          description: `New contact added: ${contactData.name}`,
          timestamp: new Date().toISOString(),
        });
      }
      closeModal('contact');
    } catch (error) {
      console.error('Failed to save contact:', error);
      alertService.error('Failed to save contact');
    }
  };

  const handleSaveDeal = async (dealData) => {
    try {
      if (selectedItems.deal) {
        await dealService.update(selectedItems.deal.Id, dealData);
        await activityService.create({
          contactId: parseInt(dealData.contactId),
          dealId: selectedItems.deal.Id,
          type: "deal",
          description: `Deal updated: ${dealData.title}`,
          timestamp: new Date().toISOString(),
        });
      } else {
        const newDeal = await dealService.create(dealData);
        await activityService.create({
          contactId: parseInt(dealData.contactId),
          dealId: newDeal.Id,
          type: "deal",
          description: `New deal created: ${dealData.title}`,
          timestamp: new Date().toISOString(),
        });
      }
      closeModal('deal');
    } catch (error) {
      console.error('Failed to save deal:', error);
      alertService.error('Failed to save deal');
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedItems.task) {
        await taskService.update(selectedItems.task.Id, taskData);
        await activityService.create({
          contactId: parseInt(taskData.contactId),
          dealId: null,
          type: "task",
          description: `Task updated: ${taskData.title}`,
          timestamp: new Date().toISOString(),
        });
      } else {
        const newTask = await taskService.create(taskData);
        await activityService.create({
          contactId: parseInt(taskData.contactId),
          dealId: null,
          type: "task",
          description: `New task created: ${taskData.title}`,
          timestamp: new Date().toISOString(),
        });
      }
      closeModal('task');
    } catch (error) {
      console.error('Failed to save task:', error);
      alertService.error('Failed to save task');
    }
  };

  const handleSaveCompany = async (companyData) => {
    try {
      if (selectedItems.company) {
        await companyService.update(selectedItems.company.Id, companyData);
      } else {
        await companyService.create(companyData);
      }
      closeModal('company');
    } catch (error) {
      console.error('Failed to save company:', error);
      alertService.error('Failed to save company');
    }
  };

return (
    <div className="min-h-screen bg-background">
      <Header
        onAddContact={() => openModal("contact")}
        onAddDeal={() => openModal("deal")}
        onAddTask={() => openModal("task")}
      />
      <main className="flex-1 max-w-7xl mx-auto">
        <Outlet context={{ openModal, closeModal }} />
      </main>

      <ContactModal
        isOpen={modals.contact}
        onClose={() => closeModal("contact")}
        contact={selectedItems.contact}
        onSave={handleSaveContact}
      />

      <DealModal
        isOpen={modals.deal}
        onClose={() => closeModal("deal")}
        deal={selectedItems.deal}
        onSave={handleSaveDeal}
      />

      <TaskModal
        isOpen={modals.task}
        onClose={() => closeModal("task")}
        task={selectedItems.task}
        onSave={handleSaveTask}
      />

      <CompanyModal
        isOpen={modals.company}
        onClose={() => closeModal("company")}
        company={selectedItems.company}
        onSave={handleSaveCompany}
      />
    </div>
  );
}

export default Layout;

export default Layout;