const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PropertyService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    await delay(300);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "property_type" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "latitude" } },
          { field: { Name: "longitude" } },
          { field: { Name: "year_built" } },
          { field: { Name: "listing_date" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        orderBy: [
          {
            fieldName: "listing_date",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('property', params);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch properties');
      }

      // Transform data to match UI expectations
      return (response.data || []).map(property => ({
        Id: property.Id,
        title: property.title,
        price: property.price,
        address: property.address,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.square_feet,
        propertyType: property.property_type,
        images: property.images ? property.images.split('\n').filter(img => img.trim()) : [],
        description: property.description,
        features: property.features ? property.features.split('\n').filter(feature => feature.trim()) : [],
        latitude: property.latitude,
        longitude: property.longitude,
        yearBuilt: property.year_built,
        listingDate: property.listing_date
      }));
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  async getById(id) {
    await delay(200);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "property_type" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "latitude" } },
          { field: { Name: "longitude" } },
          { field: { Name: "year_built" } },
          { field: { Name: "listing_date" } }
        ]
      };

      const response = await this.apperClient.getRecordById('property', parseInt(id, 10), params);

      if (!response.success) {
        throw new Error(response.message || 'Property not found');
      }

      if (!response.data) {
        throw new Error('Property not found');
      }

      const property = response.data;
      // Transform data to match UI expectations
      return {
        Id: property.Id,
        title: property.title,
        price: property.price,
        address: property.address,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.square_feet,
        propertyType: property.property_type,
        images: property.images ? property.images.split('\n').filter(img => img.trim()) : [],
        description: property.description,
        features: property.features ? property.features.split('\n').filter(feature => feature.trim()) : [],
        latitude: property.latitude,
        longitude: property.longitude,
        yearBuilt: property.year_built,
        listingDate: property.listing_date
      };
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error);
      throw error;
    }
  }

  async search(filters = {}) {
    await delay(400);
    try {
      const whereConditions = [];

      if (filters.priceMin) {
        whereConditions.push({
          FieldName: "price",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.priceMin.toString()]
        });
      }
      if (filters.priceMax) {
        whereConditions.push({
          FieldName: "price",
          Operator: "LessThanOrEqualTo",
          Values: [filters.priceMax.toString()]
        });
      }
      if (filters.bedroomsMin) {
        whereConditions.push({
          FieldName: "bedrooms",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bedroomsMin.toString()]
        });
      }
      if (filters.bathroomsMin) {
        whereConditions.push({
          FieldName: "bathrooms",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bathroomsMin.toString()]
        });
      }
      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        whereConditions.push({
          FieldName: "property_type",
          Operator: "ExactMatch",
          Values: filters.propertyTypes
        });
      }
      if (filters.squareFeetMin) {
        whereConditions.push({
          FieldName: "square_feet",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.squareFeetMin.toString()]
        });
      }
      if (filters.query) {
        const query = filters.query.toLowerCase();
        whereConditions.push({
          FieldName: "title",
          Operator: "Contains",
          Values: [query]
        });
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "property_type" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "latitude" } },
          { field: { Name: "longitude" } },
          { field: { Name: "year_built" } },
          { field: { Name: "listing_date" } }
        ],
        where: whereConditions,
        orderBy: [
          {
            fieldName: "listing_date",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('property', params);

      if (!response.success) {
        throw new Error(response.message || 'Failed to search properties');
      }

      // Transform data to match UI expectations
      return (response.data || []).map(property => ({
        Id: property.Id,
        title: property.title,
        price: property.price,
        address: property.address,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.square_feet,
        propertyType: property.property_type,
        images: property.images ? property.images.split('\n').filter(img => img.trim()) : [],
        description: property.description,
        features: property.features ? property.features.split('\n').filter(feature => feature.trim()) : [],
        latitude: property.latitude,
        longitude: property.longitude,
        yearBuilt: property.year_built,
        listingDate: property.listing_date
      }));
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  }

  async create(property) {
    await delay(300);
    try {
      // Only include Updateable fields
      const createData = {
        Name: property.title || property.Name,
        Tags: property.Tags || '',
        Owner: property.Owner,
        title: property.title,
        price: parseInt(property.price, 10),
        address: property.address,
        bedrooms: parseInt(property.bedrooms, 10),
        bathrooms: parseFloat(property.bathrooms),
        square_feet: parseInt(property.squareFeet || property.square_feet, 10),
        property_type: property.propertyType || property.property_type,
        images: Array.isArray(property.images) ? property.images.join('\n') : property.images,
        description: property.description,
        features: Array.isArray(property.features) ? property.features.join('\n') : property.features,
        latitude: parseFloat(property.latitude),
        longitude: parseFloat(property.longitude),
        year_built: parseInt(property.yearBuilt || property.year_built, 10),
        listing_date: property.listingDate || property.listing_date || new Date().toISOString()
      };

      const params = {
        records: [createData]
      };

      const response = await this.apperClient.createRecord('property', params);

      if (!response.success) {
        throw new Error(response.message || 'Failed to create property');
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || 'Failed to create property');
        }
      }

      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  async update(id, data) {
    await delay(300);
    try {
      // Only include Updateable fields plus Id
      const updateData = {
        Id: parseInt(id, 10)
      };

      // Add only the fields that are being updated
      if (data.title !== undefined) updateData.title = data.title;
      if (data.Name !== undefined) updateData.Name = data.Name;
      if (data.Tags !== undefined) updateData.Tags = data.Tags;
      if (data.Owner !== undefined) updateData.Owner = data.Owner;
      if (data.price !== undefined) updateData.price = parseInt(data.price, 10);
      if (data.address !== undefined) updateData.address = data.address;
      if (data.bedrooms !== undefined) updateData.bedrooms = parseInt(data.bedrooms, 10);
      if (data.bathrooms !== undefined) updateData.bathrooms = parseFloat(data.bathrooms);
      if (data.squareFeet !== undefined) updateData.square_feet = parseInt(data.squareFeet, 10);
      if (data.square_feet !== undefined) updateData.square_feet = parseInt(data.square_feet, 10);
      if (data.propertyType !== undefined) updateData.property_type = data.propertyType;
      if (data.property_type !== undefined) updateData.property_type = data.property_type;
      if (data.images !== undefined) updateData.images = Array.isArray(data.images) ? data.images.join('\n') : data.images;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.features !== undefined) updateData.features = Array.isArray(data.features) ? data.features.join('\n') : data.features;
      if (data.latitude !== undefined) updateData.latitude = parseFloat(data.latitude);
      if (data.longitude !== undefined) updateData.longitude = parseFloat(data.longitude);
      if (data.yearBuilt !== undefined) updateData.year_built = parseInt(data.yearBuilt, 10);
      if (data.year_built !== undefined) updateData.year_built = parseInt(data.year_built, 10);
      if (data.listingDate !== undefined) updateData.listing_date = data.listingDate;
      if (data.listing_date !== undefined) updateData.listing_date = data.listing_date;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord('property', params);

      if (!response.success) {
        throw new Error(response.message || 'Failed to update property');
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || 'Failed to update property');
        }
      }

      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error(`Error updating property ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    await delay(200);
    try {
      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await this.apperClient.deleteRecord('property', params);

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete property');
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || 'Failed to delete property');
        }
      }

      return { success: true };
    } catch (error) {
      console.error(`Error deleting property ${id}:`, error);
      throw error;
    }
  }
}

export default new PropertyService();