import { getApperClient } from "@/services/apperClient";

class DealService {
  constructor() {
    this.tableName = 'deals_c';
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
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expectedCloseDate_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "name_c"}}},
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
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClientInstance();
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expectedCloseDate_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "name_c"}}},
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
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(dealData) {
    try {
      const apperClient = this.getApperClientInstance();
      const params = {
        records: [{
          title_c: dealData.title_c || dealData.title,
          value_c: parseFloat(dealData.value_c || dealData.value),
          stage_c: dealData.stage_c || dealData.stage,
          probability_c: parseInt(dealData.probability_c || dealData.probability),
          expectedCloseDate_c: dealData.expectedCloseDate_c || dealData.expectedCloseDate,
          contactId_c: parseInt(dealData.contactId_c || dealData.contactId)
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
          console.error(`Failed to create ${failed.length} deals:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, dealData) {
    try {
      const apperClient = this.getApperClientInstance();
      const params = {
        records: [{
          Id: parseInt(id),
          title_c: dealData.title_c || dealData.title,
          value_c: parseFloat(dealData.value_c || dealData.value),
          stage_c: dealData.stage_c || dealData.stage,
          probability_c: parseInt(dealData.probability_c || dealData.probability),
          expectedCloseDate_c: dealData.expectedCloseDate_c || dealData.expectedCloseDate,
          contactId_c: parseInt(dealData.contactId_c || dealData.contactId)
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
          console.error(`Failed to update ${failed.length} deals:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} deals:`, failed);
          failed.forEach(record => {
            console.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const dealService = new DealService();