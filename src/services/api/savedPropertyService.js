import savedPropertyData from '../mockData/savedProperties.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SavedPropertyService {
  constructor() {
    // Initialize from localStorage if available, otherwise use mock data
    const saved = localStorage.getItem('estateview_saved_properties');
    this.savedProperties = saved ? JSON.parse(saved) : [...savedPropertyData];
  }

  _saveToStorage() {
    localStorage.setItem('estateview_saved_properties', JSON.stringify(this.savedProperties));
  }

  async getAll() {
    await delay(200);
    return [...this.savedProperties];
  }

  async getById(id) {
    await delay(100);
    const saved = this.savedProperties.find(s => s.Id === parseInt(id, 10));
    if (!saved) {
      throw new Error('Saved property not found');
    }
    return { ...saved };
  }

  async isPropertySaved(propertyId) {
    await delay(100);
    return this.savedProperties.some(s => s.propertyId === parseInt(propertyId, 10));
  }

  async saveProperty(propertyId) {
    await delay(200);
    const exists = this.savedProperties.some(s => s.propertyId === parseInt(propertyId, 10));
    if (exists) {
      throw new Error('Property already saved');
    }

    const maxId = Math.max(...this.savedProperties.map(s => s.Id), 0);
    const newSaved = {
      Id: maxId + 1,
      propertyId: parseInt(propertyId, 10),
      savedDate: new Date().toISOString()
    };

    this.savedProperties.push(newSaved);
    this._saveToStorage();
    return { ...newSaved };
  }

  async unsaveProperty(propertyId) {
    await delay(200);
    const index = this.savedProperties.findIndex(s => s.propertyId === parseInt(propertyId, 10));
    if (index === -1) {
      throw new Error('Saved property not found');
    }

    const deleted = this.savedProperties.splice(index, 1)[0];
    this._saveToStorage();
    return { ...deleted };
  }

  async create(savedProperty) {
    await delay(200);
    return this.saveProperty(savedProperty.propertyId);
  }

  async update(id, data) {
    await delay(200);
    const index = this.savedProperties.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    
    const { Id, ...updateData } = data;
    this.savedProperties[index] = { ...this.savedProperties[index], ...updateData };
    this._saveToStorage();
    return { ...this.savedProperties[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.savedProperties.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    
    const deleted = this.savedProperties.splice(index, 1)[0];
    this._saveToStorage();
    return { ...deleted };
  }
}

export default new SavedPropertyService();