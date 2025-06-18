import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const PropertyMap = ({ properties = [], className = "" }) => {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7589, lng: -73.9851 }); // Default to NYC

  useEffect(() => {
    // Calculate center based on properties
    if (properties.length > 0) {
      const avgLat = properties.reduce((sum, p) => sum + p.latitude, 0) / properties.length;
      const avgLng = properties.reduce((sum, p) => sum + p.longitude, 0) / properties.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
    }
  }, [properties]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleMarkerClick = (property) => {
    setSelectedProperty(property);
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  // Mock map implementation - in a real app, you'd use Google Maps, Mapbox, etc.
  return (
    <div className={`relative h-full bg-surface-100 rounded-lg overflow-hidden ${className}`}>
      {/* Map Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {[...Array(144)].map((_, i) => (
              <div key={i} className="border border-gray-300" />
            ))}
          </div>
        </div>

        {/* Street Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <defs>
            <pattern id="streets" patternUnits="userSpaceOnUse" width="100" height="100">
              <path d="M 0 50 L 100 50" stroke="#666" strokeWidth="2" />
              <path d="M 50 0 L 50 100" stroke="#666" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#streets)" />
        </svg>
      </div>

      {/* Property Markers */}
      {properties.map((property, index) => {
        // Calculate position based on lat/lng (mock positioning)
        const x = ((property.longitude + 180) / 360) * 100;
        const y = ((90 - property.latitude) / 180) * 100;
        
        return (
          <motion.button
            key={property.Id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMarkerClick(property)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: `${Math.max(10, Math.min(90, x))}%`,
              top: `${Math.max(10, Math.min(90, y))}%`
            }}
          >
            <div className={`relative ${selectedProperty?.Id === property.Id ? 'z-20' : 'z-10'}`}>
              {/* Marker Background */}
              <div className="bg-primary text-white px-3 py-1 rounded-full shadow-lg text-sm font-semibold whitespace-nowrap">
                {formatPrice(property.price)}
              </div>
              
              {/* Marker Arrow */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></div>
              </div>
            </div>
          </motion.button>
        );
      })}

      {/* Property Details Popup */}
      {selectedProperty && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-4 left-4 right-4 z-30 max-w-sm mx-auto"
        >
          <Card variant="elevated" className="p-0">
            <div className="flex">
              {/* Property Image */}
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={selectedProperty.images?.[0]}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover rounded-l-lg"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=200&fit=crop';
                  }}
                />
              </div>

              {/* Property Info */}
              <div className="flex-1 p-3">
                <h4 className="font-semibold text-sm text-secondary line-clamp-1 mb-1">
                  {selectedProperty.title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                  {selectedProperty.address}
                </p>
                
                {/* Stats */}
                <div className="flex items-center text-xs text-gray-500 space-x-3 mb-2">
                  <span className="flex items-center">
                    <ApperIcon name="Bed" className="w-3 h-3 mr-1" />
                    {selectedProperty.bedrooms}
                  </span>
                  <span className="flex items-center">
                    <ApperIcon name="Bath" className="w-3 h-3 mr-1" />
                    {selectedProperty.bathrooms}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary text-sm">
                    {formatPrice(selectedProperty.price)}
                  </span>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleViewProperty(selectedProperty.Id)}
                  >
                    View
                  </Button>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedProperty(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-20">
        <Button
          variant="outline"
          size="sm"
          icon="Plus"
          className="bg-white shadow-md"
        />
        <Button
          variant="outline"
          size="sm"
          icon="Minus"
          className="bg-white shadow-md"
        />
        <Button
          variant="outline"
          size="sm"
          icon="Locate"
          className="bg-white shadow-md"
        />
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-20">
        <Card variant="elevated" padding="sm">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <div className="w-4 h-2 bg-primary rounded"></div>
            <span>Property Price</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PropertyMap;