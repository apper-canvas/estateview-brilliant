import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { savedPropertyService } from '@/services';

const PropertyCard = ({ property, className = '' }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const saved = await savedPropertyService.isPropertySaved(property.Id);
        setIsSaved(saved);
      } catch (error) {
        // Property not saved, no need to show error
      }
    };
    checkSavedStatus();
  }, [property.Id]);

  const handleToggleSaved = async (e) => {
    e.stopPropagation();
    setIsToggling(true);
    
    try {
      if (isSaved) {
        await savedPropertyService.unsaveProperty(property.Id);
        setIsSaved(false);
        toast.success('Property removed from saved list');
      } else {
        await savedPropertyService.saveProperty(property.Id);
        setIsSaved(true);
        toast.success('Property saved successfully');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update saved status');
    } finally {
      setIsToggling(false);
    }
  };

  const handleClick = () => {
    navigate(`/property/${property.Id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`property-card cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <Card variant="elevated" padding="none" className="overflow-hidden">
        {/* Property Image */}
        <div className="relative aspect-property">
          <img
            src={property.images?.[0] || '/placeholder-property.jpg'}
            alt={property.title}
            className="property-image w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop';
            }}
          />
          
          {/* Price Overlay */}
          <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-md font-semibold">
            {formatPrice(property.price)}
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleSaved}
            disabled={isToggling}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
              isSaved 
                ? 'bg-error text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
            }`}
          >
            <ApperIcon 
              name="Heart" 
              className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`}
            />
          </motion.button>
        </div>

        {/* Property Details */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-lg text-secondary mb-2 line-clamp-2">
            {property.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {property.address}
          </p>

          {/* Property Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
                {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center">
                <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
                {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
              </span>
            </div>
            <span className="flex items-center">
              <ApperIcon name="Square" className="w-4 h-4 mr-1" />
              {formatSquareFeet(property.squareFeet)} sqft
            </span>
          </div>

          {/* Property Type */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
              {property.propertyType}
            </span>
            <Button
              variant="ghost"
              size="sm"
              icon="ArrowRight"
              iconPosition="right"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              View Details
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PropertyCard;