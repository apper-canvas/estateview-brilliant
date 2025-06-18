import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const FilterPanel = ({ 
  filters = {}, 
  onFiltersChange, 
  isOpen = true,
  onToggle,
  className = '' 
}) => {
  const [localFilters, setLocalFilters] = useState({
    priceMin: '',
    priceMax: '',
    bedroomsMin: '',
    bathroomsMin: '',
    propertyTypes: [],
    squareFeetMin: '',
    ...filters
  });

  const propertyTypeOptions = [
    { value: 'House', label: 'House' },
    { value: 'Condo', label: 'Condo' },
    { value: 'Townhouse', label: 'Townhouse' },
    { value: 'Apartment', label: 'Apartment' }
  ];

  const bedroomOptions = [
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' }
  ];

  const bathroomOptions = [
    { value: '1', label: '1+' },
    { value: '1.5', label: '1.5+' },
    { value: '2', label: '2+' },
    { value: '2.5', label: '2.5+' },
    { value: '3', label: '3+' }
  ];

  const handleInputChange = (field, value) => {
    const updatedFilters = { ...localFilters, [field]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const handlePropertyTypeToggle = (type) => {
    const currentTypes = localFilters.propertyTypes || [];
    const updatedTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    const updatedFilters = { ...localFilters, propertyTypes: updatedTypes };
    setLocalFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      priceMin: '',
      priceMax: '',
      bedroomsMin: '',
      bathroomsMin: '',
      propertyTypes: [],
      squareFeetMin: ''
    };
    setLocalFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.priceMin) count++;
    if (localFilters.priceMax) count++;
    if (localFilters.bedroomsMin) count++;
    if (localFilters.bathroomsMin) count++;
    if (localFilters.propertyTypes?.length > 0) count++;
    if (localFilters.squareFeetMin) count++;
    return count;
  };

  const activeCount = getActiveFilterCount();

  return (
    <div className={`bg-white border-r border-gray-200 ${className}`}>
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="font-semibold text-lg text-secondary">Filters</h2>
            {activeCount > 0 && (
              <Badge variant="primary" size="sm">
                {activeCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              icon={isOpen ? "ChevronLeft" : "ChevronRight"}
              onClick={onToggle}
              className="lg:hidden"
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-y-auto flex-1"
          >
            <div className="p-4 space-y-6">
              {/* Price Range */}
              <div>
                <h3 className="font-medium text-secondary mb-3">Price Range</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min Price"
                    value={localFilters.priceMin}
                    onChange={(e) => handleInputChange('priceMin', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max Price"
                    value={localFilters.priceMax}
                    onChange={(e) => handleInputChange('priceMax', e.target.value)}
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <h3 className="font-medium text-secondary mb-3">Property Type</h3>
                <div className="flex flex-wrap gap-2">
                  {propertyTypeOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePropertyTypeToggle(option.value)}
                      className={`filter-pill px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        localFilters.propertyTypes?.includes(option.value)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                      }`}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <h3 className="font-medium text-secondary mb-3">Bedrooms</h3>
                <Select
                  placeholder="Any"
                  options={bedroomOptions}
                  value={localFilters.bedroomsMin}
                  onChange={(e) => handleInputChange('bedroomsMin', e.target.value)}
                />
              </div>

              {/* Bathrooms */}
              <div>
                <h3 className="font-medium text-secondary mb-3">Bathrooms</h3>
                <Select
                  placeholder="Any"
                  options={bathroomOptions}
                  value={localFilters.bathroomsMin}
                  onChange={(e) => handleInputChange('bathroomsMin', e.target.value)}
                />
              </div>

              {/* Square Feet */}
              <div>
                <h3 className="font-medium text-secondary mb-3">Minimum Square Feet</h3>
                <Input
                  type="number"
                  placeholder="Min Square Feet"
                  value={localFilters.squareFeetMin}
                  onChange={(e) => handleInputChange('squareFeetMin', e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterPanel;