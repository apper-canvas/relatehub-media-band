import { getApperClient } from "@/services/apperClient";

class ActivityService {
  constructor() {
    this.tableName = 'activities_c';
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "dealId_c"}, "referenceField": {"field": {"Name": "title_c"}}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
}

      // Validate date fields to prevent date-fns errors
      const validatedData = (response.data || []).map(activity => ({
        ...activity,
        timestamp_c: activity.timestamp_c || activity.timestamp || new Date().toISOString(),
        CreatedOn: activity.CreatedOn || new Date().toISOString(),
        ModifiedOn: activity.ModifiedOn || new Date().toISOString()
      }));

      return validatedData;
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClientInstance();
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "dealId_c"}, "referenceField": {"field": {"Name": "title_c"}}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
}

      // Validate date fields for single activity
      const activity = response.data;
      if (activity) {
        return {
          ...activity,
          timestamp_c: activity.timestamp_c || activity.timestamp || new Date().toISOString(),
          CreatedOn: activity.CreatedOn || new Date().toISOString(),
          ModifiedOn: activity.ModifiedOn || new Date().toISOString()
        };
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByContactId(contactId) {
    try {
      const apperClient = this.getApperClientInstance();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "dealId_c"}, "referenceField": {"field": {"Name": "title_c"}}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          FieldName: "contactId_c",
          Operator: "EqualTo",
          Values: [parseInt(contactId)]
        }],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
}

      // Validate date fields for search results
      const validatedData = (response.data || []).map(activity => ({
        ...activity,
        timestamp_c: activity.timestamp_c || activity.timestamp || new Date().toISOString(),
        CreatedOn: activity.CreatedOn || new Date().toISOString(),
        ModifiedOn: activity.ModifiedOn || new Date().toISOString()
      }));

      return validatedData;
    } catch (error) {
      console.error("Error searching activities:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByDealId(dealId) {
    try {
      const apperClient = this.getApperClientInstance();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "dealId_c"}, "referenceField": {"field": {"Name": "title_c"}}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          FieldName: "dealId_c",
          Operator: "EqualTo",
          Values: [parseInt(dealId)]
        }],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
}

      // Validate date fields for recent activities
      const validatedData = (response.data || []).map(activity => ({
        ...activity,
        timestamp_c: activity.timestamp_c || activity.timestamp || new Date().toISOString(),
        CreatedOn: activity.CreatedOn || new Date().toISOString(),
        ModifiedOn: activity.ModifiedOn || new Date().toISOString()
      }));

      return validatedData;
    } catch (error) {
      console.error("Error fetching recent activities:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(activityData) {
    try {
      const apperClient = this.getApperClientInstance();
      const params = {
        records: [{
          type_c: activityData.type_c || activityData.type,
          description_c: activityData.description_c || activityData.description,
          timestamp_c: activityData.timestamp_c || activityData.timestamp || new Date().toISOString(),
          contactId_c: activityData.contactId_c || (activityData.contactId ? parseInt(activityData.contactId) : null),
          dealId_c: activityData.dealId_c || (activityData.dealId ? parseInt(activityData.dealId) : null)
        }]
      };

      // Remove null values
      Object.keys(params.records[0]).forEach(key => {
        if (params.records[0][key] === null || params.records[0][key] === undefined) {
          delete params.records[0][key];
        }
      });

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activities:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, activityData) {
    try {
      const apperClient = this.getApperClientInstance();
      const params = {
        records: [{
          Id: parseInt(id),
          type_c: activityData.type_c || activityData.type,
          description_c: activityData.description_c || activityData.description,
          timestamp_c: activityData.timestamp_c || activityData.timestamp,
          contactId_c: activityData.contactId_c || (activityData.contactId ? parseInt(activityData.contactId) : null),
          dealId_c: activityData.dealId_c || (activityData.dealId ? parseInt(activityData.dealId) : null)
        }]
      };

      // Remove null/undefined values except required ones
      Object.keys(params.records[0]).forEach(key => {
        if (key !== 'Id' && (params.records[0][key] === null || params.records[0][key] === undefined)) {
          delete params.records[0][key];
        }
      });

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} activities:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} activities:`, failed);
          failed.forEach(record => {
            console.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const activityService = new ActivityService();