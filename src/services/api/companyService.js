import { getApperClient } from '@/services/apperClient';

const tableName = 'companies_c';

const getApperClientInstance = () => {
  const client = getApperClient();
  if (!client) {
    throw new Error('ApperClient not initialized');
  }
  return client;
};

export const companyService = {
  async getAll() {
    try {
      const apperClient = getApperClientInstance();
      const response = await apperClient.fetchRecords(tableName, {
        fields: [
          { field: { Name: 'name_c' } },
          { field: { Name: 'address_c' } },
          { field: { Name: 'city_c' } },
          { field: { Name: 'state_c' } },
          { field: { Name: 'zip_c' } },
          { field: { Name: 'phone_c' } },
          { field: { Name: 'website_c' } },
        ],
        orderBy: [{ fieldName: 'name_c', sorttype: 'ASC' }],
        pagingInfo: { limit: 100, offset: 0 },
      });

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch companies');
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching companies:', error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClientInstance();
      const response = await apperClient.getRecordById(tableName, id, {
        fields: [
          { field: { Name: 'name_c' } },
          { field: { Name: 'address_c' } },
          { field: { Name: 'city_c' } },
          { field: { Name: 'state_c' } },
          { field: { Name: 'zip_c' } },
          { field: { Name: 'phone_c' } },
          { field: { Name: 'website_c' } },
        ],
      });

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch company');
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(companyData) {
    try {
      const apperClient = getApperClientInstance();
      
      const payload = {
        records: [
          {
            name_c: companyData.name_c || '',
            address_c: companyData.address_c || '',
            city_c: companyData.city_c || '',
            state_c: companyData.state_c || '',
            zip_c: companyData.zip_c || '',
            phone_c: companyData.phone_c || '',
            website_c: companyData.website_c || '',
          },
        ],
      };

      const response = await apperClient.createRecord(tableName, payload);

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to create company');
      }

      if (response.results) {
        const successful = response.results.filter((r) => r.success);
        const failed = response.results.filter((r) => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          failed.forEach((record) => {
            record.errors?.forEach((error) => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return response.data || null;
    } catch (error) {
      console.error('Error creating company:', error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, companyData) {
    try {
      const apperClient = getApperClientInstance();
      
      const payload = {
        records: [
          {
            Id: id,
            name_c: companyData.name_c || '',
            address_c: companyData.address_c || '',
            city_c: companyData.city_c || '',
            state_c: companyData.state_c || '',
            zip_c: companyData.zip_c || '',
            phone_c: companyData.phone_c || '',
            website_c: companyData.website_c || '',
          },
        ],
      };

      const response = await apperClient.updateRecord(tableName, payload);

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to update company');
      }

      if (response.results) {
        const successful = response.results.filter((r) => r.success);
        const failed = response.results.filter((r) => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          failed.forEach((record) => {
            record.errors?.forEach((error) => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return response.data || null;
    } catch (error) {
      console.error('Error updating company:', error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClientInstance();
      
      const response = await apperClient.deleteRecord(tableName, {
        RecordIds: [id],
      });

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to delete company');
      }

      if (response.results) {
        const successful = response.results.filter((r) => r.success);
        const failed = response.results.filter((r) => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          failed.forEach((record) => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successful.length === 1;
      }

      return true;
    } catch (error) {
      console.error('Error deleting company:', error?.response?.data?.message || error);
      throw error;
    }
  },
};