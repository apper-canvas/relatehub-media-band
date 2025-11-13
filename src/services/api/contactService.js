import { getApperClient } from "@/services/apperClient";

class ContactService {
  constructor() {
    this.tableName = 'contacts_c';
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClientInstance();
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(contactData) {
    try {
      const apperClient = this.getApperClientInstance();
const params = {
        records: [{
          name_c: contactData.name_c || contactData.name,
          company_c: contactData.company_c || contactData.company,
          email_c: contactData.email_c || contactData.email,
          phone_c: contactData.phone_c || contactData.phone,
          tags_c: Array.isArray(contactData.tags_c || contactData.tags) 
            ? (contactData.tags_c || contactData.tags).join(",")
            : (contactData.tags_c || contactData.tags || ""),
          notes_c: contactData.notes_c || contactData.notes
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
          console.error(`Failed to create ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, contactData) {
    try {
      const apperClient = this.getApperClientInstance();
const params = {
        records: [{
          Id: parseInt(id),
          name_c: contactData.name_c || contactData.name,
          company_c: contactData.company_c || contactData.company,
          email_c: contactData.email_c || contactData.email,
          phone_c: contactData.phone_c || contactData.phone,
          tags_c: Array.isArray(contactData.tags_c || contactData.tags) 
            ? (contactData.tags_c || contactData.tags).join(",")
            : (contactData.tags_c || contactData.tags || ""),
          notes_c: contactData.notes_c || contactData.notes
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
          console.error(`Failed to update ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            console.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const contactService = new ContactService();