import propertyData from '../mockData/properties.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PropertyService {
  constructor() {
    this.properties = [...propertyData];
  }

  async getAll() {
    await delay(300);
    return [...this.properties];
  }

  async getById(id) {
    await delay(200);
    const property = this.properties.find(p => p.Id === parseInt(id, 10));
    if (!property) {
      throw new Error('Property not found');
    }
    return { ...property };
  }

  async search(filters = {}) {
    await delay(400);
    let filtered = [...this.properties];

    if (filters.priceMin) {
      filtered = filtered.filter(p => p.price >= filters.priceMin);
    }
    if (filters.priceMax) {
      filtered = filtered.filter(p => p.price <= filters.priceMax);
    }
    if (filters.bedroomsMin) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedroomsMin);
    }
    if (filters.bathroomsMin) {
      filtered = filtered.filter(p => p.bathrooms >= filters.bathroomsMin);
    }
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter(p => filters.propertyTypes.includes(p.propertyType));
    }
    if (filters.squareFeetMin) {
      filtered = filtered.filter(p => p.squareFeet >= filters.squareFeetMin);
    }
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  async create(property) {
    await delay(300);
    const maxId = Math.max(...this.properties.map(p => p.Id), 0);
    const newProperty = {
      ...property,
      Id: maxId + 1,
      listingDate: new Date().toISOString()
    };
    this.properties.push(newProperty);
    return { ...newProperty };
  }

  async update(id, data) {
    await delay(300);
    const index = this.properties.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Property not found');
    }
    
    const { Id, ...updateData } = data;
    this.properties[index] = { ...this.properties[index], ...updateData };
    return { ...this.properties[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.properties.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Property not found');
    }
    
    const deleted = this.properties.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new PropertyService();