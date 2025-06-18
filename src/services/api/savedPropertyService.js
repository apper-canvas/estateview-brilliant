const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SavedPropertyService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    await delay(200);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "property_id" } },
          { field: { Name: "saved_date" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        orderBy: [
          {
            fieldName: "saved_date",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('saved_property', params);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch saved properties');
      }

      // Transform data to match UI expectations
      return (response.data || []).map(saved => ({
        Id: saved.Id,
        propertyId: saved.property_id,
        savedDate: saved.saved_date
      }));
    } catch (error) {
      console.error('Error fetching saved properties:', error);
      throw error;
    }
  }

  async getById(id) {
    await delay(100);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "property_id" } },
          { field: { Name: "saved_date" } }
        ]
      };

      const response = await this.apperClient.getRecordById('saved_property', parseInt(id, 10), params);

      if (!response.success) {
        throw new Error(response.message || 'Saved property not found');
      }

      if (!response.data) {
        throw new Error('Saved property not found');
      }

      const saved = response.data;
      return {
        Id: saved.Id,
        propertyId: saved.property_id,
        savedDate: saved.saved_date
      };
    } catch (error) {
      console.error(`Error fetching saved property ${id}:`, error);
      throw error;
    }
  }

  async isPropertySaved(propertyId) {
    await delay(100);
    try {
      const params = {
        fields: [
          { field: { Name: "property_id" } }
        ],
        where: [
          {
            FieldName: "property_id",
            Operator: "EqualTo",
            Values: [parseInt(propertyId, 10).toString()]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('saved_property', params);

      if (!response.success) {
        return false;
      }

      return response.data && response.data.length > 0;
    } catch (error) {
      console.error(`Error checking if property ${propertyId} is saved:`, error);
      return false;
    }
  }

  async saveProperty(propertyId) {
    await delay(200);
    try {
      // Check if already saved
      const alreadySaved = await this.isPropertySaved(propertyId);
      if (alreadySaved) {
        throw new Error('Property already saved');
      }

      const createData = {
        Name: `Saved Property ${propertyId}`,
        Tags: '',
        Owner: null, // Will be set by backend based on current user
        property_id: parseInt(propertyId, 10),
        saved_date: new Date().toISOString()
      };

      const params = {
        records: [createData]
      };

      const response = await this.apperClient.createRecord('saved_property', params);

      if (!response.success) {
        throw new Error(response.message || 'Failed to save property');
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return {
            Id: result.data.Id,
            propertyId: result.data.property_id,
            savedDate: result.data.saved_date
          };
        } else {
          throw new Error(result.message || 'Failed to save property');
        }
      }

      throw new Error('No data returned from save operation');
    } catch (error) {
      console.error(`Error saving property ${propertyId}:`, error);
      throw error;
    }
  }

  async unsaveProperty(propertyId) {
    await delay(200);
    try {
      // First find the saved property record
      const params = {
        fields: [
          { field: { Name: "property_id" } }
        ],
        where: [
          {
            FieldName: "property_id",
            Operator: "EqualTo",
            Values: [parseInt(propertyId, 10).toString()]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('saved_property', params);

      if (!response.success || !response.data || response.data.length === 0) {
        throw new Error('Saved property not found');
      }

      const savedProperty = response.data[0];
      
      // Delete the saved property record
      const deleteParams = {
        RecordIds: [savedProperty.Id]
      };

      const deleteResponse = await this.apperClient.deleteRecord('saved_property', deleteParams);

      if (!deleteResponse.success) {
        throw new Error(deleteResponse.message || 'Failed to unsave property');
      }

      return {
        Id: savedProperty.Id,
        propertyId: parseInt(propertyId, 10),
        savedDate: savedProperty.saved_date
      };
    } catch (error) {
      console.error(`Error unsaving property ${propertyId}:`, error);
      throw error;
    }
  }

  async create(savedProperty) {
    await delay(200);
    return this.saveProperty(savedProperty.propertyId || savedProperty.property_id);
  }

  async update(id, data) {
    await delay(200);
    try {
      const updateData = {
        Id: parseInt(id, 10)
      };

      // Add only the fields that are being updated
      if (data.Name !== undefined) updateData.Name = data.Name;
      if (data.Tags !== undefined) updateData.Tags = data.Tags;
      if (data.Owner !== undefined) updateData.Owner = data.Owner;
      if (data.propertyId !== undefined) updateData.property_id = parseInt(data.propertyId, 10);
      if (data.property_id !== undefined) updateData.property_id = parseInt(data.property_id, 10);
      if (data.savedDate !== undefined) updateData.saved_date = data.savedDate;
      if (data.saved_date !== undefined) updateData.saved_date = data.saved_date;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord('saved_property', params);

      if (!response.success) {
        throw new Error(response.message || 'Failed to update saved property');
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return {
            Id: result.data.Id,
            propertyId: result.data.property_id,
            savedDate: result.data.saved_date
          };
        } else {
          throw new Error(result.message || 'Failed to update saved property');
        }
      }

      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error(`Error updating saved property ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    await delay(200);
    try {
      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await this.apperClient.deleteRecord('saved_property', params);

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete saved property');
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || 'Failed to delete saved property');
        }
      }

      return { success: true };
    } catch (error) {
      console.error(`Error deleting saved property ${id}:`, error);
      throw error;
    }
  }
}

export default new SavedPropertyService();