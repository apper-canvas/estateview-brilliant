import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';
import PhotoGallery from '@/components/molecules/PhotoGallery';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { propertyService, savedPropertyService } from '@/services';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (id) {
      loadProperty();
      checkSavedStatus();
    }
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await propertyService.getById(id);
      setProperty(result);
    } catch (err) {
      const errorMsg = err.message || 'Failed to load property details';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const checkSavedStatus = async () => {
    try {
      const saved = await savedPropertyService.isPropertySaved(id);
      setIsSaved(saved);
    } catch (error) {
      // Property not saved, no need to show error
    }
  };

  const handleToggleSaved = async () => {
    setIsToggling(true);
    
    try {
      if (isSaved) {
        await savedPropertyService.unsaveProperty(id);
        setIsSaved(false);
        toast.success('Property removed from saved list');
      } else {
        await savedPropertyService.saveProperty(id);
        setIsSaved(true);
        toast.success('Property saved successfully');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update saved status');
    } finally {
      setIsToggling(false);
    }
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

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch {
      return 'Unknown';
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  if (loading) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.3 }}
        className="p-6 max-w-4xl mx-auto"
      >
        <SkeletonLoader count={1} type="detail" />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.3 }}
        className="h-full flex items-center justify-center"
      >
        <ErrorState
          title="Property not found"
          message={error}
          onRetry={loadProperty}
          actionLabel="Try Again"
        />
      </motion.div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto p-6 space-y-8 max-w-full overflow-hidden"
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        icon="ArrowLeft"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        Back to Results
      </Button>

      {/* Photo Gallery */}
      <PhotoGallery images={property.images} title={property.title} />

      {/* Property Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-secondary mb-2 break-words">
            {property.title}
          </h1>
          <p className="text-lg text-gray-600 mb-4 break-words">
            {property.address}
          </p>
          
          {/* Property Stats */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-4">
            <div className="flex items-center">
              <ApperIcon name="Bed" className="w-5 h-5 mr-2" />
              <span className="font-medium">{property.bedrooms}</span>
              <span className="ml-1">bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Bath" className="w-5 h-5 mr-2" />
              <span className="font-medium">{property.bathrooms}</span>
              <span className="ml-1">bathroom{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Square" className="w-5 h-5 mr-2" />
              <span className="font-medium">{formatSquareFeet(property.squareFeet)}</span>
              <span className="ml-1">sqft</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Calendar" className="w-5 h-5 mr-2" />
              <span className="font-medium">Built {property.yearBuilt}</span>
            </div>
          </div>

          {/* Property Type & Listing Date */}
          <div className="flex items-center gap-4">
            <Badge variant="accent" size="lg">
              {property.propertyType}
            </Badge>
            <span className="text-sm text-gray-500">
              Listed {formatDate(property.listingDate)}
            </span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="flex-shrink-0">
          <Card variant="elevated" padding="lg" className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              {formatPrice(property.price)}
            </div>
            
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                icon="Phone"
                className="w-full"
              >
                Contact Agent
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                icon="Calendar"
                className="w-full"
              >
                Schedule Tour
              </Button>
              
              <Button
                variant={isSaved ? "accent" : "ghost"}
                size="lg"
                icon="Heart"
                loading={isToggling}
                onClick={handleToggleSaved}
                className={`w-full ${isSaved ? 'heart-pulse' : ''}`}
              >
                {isSaved ? 'Saved' : 'Save Property'}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Property Description */}
      <Card variant="default" padding="lg">
        <h2 className="text-2xl font-display font-semibold text-secondary mb-4">
          About This Property
        </h2>
        <p className="text-gray-700 leading-relaxed break-words">
          {property.description}
        </p>
      </Card>

      {/* Property Features */}
      {property.features && property.features.length > 0 && (
        <Card variant="default" padding="lg">
          <h2 className="text-2xl font-display font-semibold text-secondary mb-4">
            Features & Amenities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {property.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center"
              >
                <ApperIcon name="Check" className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                <span className="text-gray-700 break-words">{feature}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Location Map Placeholder */}
      <Card variant="default" padding="lg">
        <h2 className="text-2xl font-display font-semibold text-secondary mb-4">
          Location
        </h2>
        <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Mock map with property marker */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                {[...Array(48)].map((_, i) => (
                  <div key={i} className="border border-gray-300" />
                ))}
              </div>
            </div>
          </div>
          
          {/* Property marker */}
          <div className="relative z-10 bg-primary text-white px-4 py-2 rounded-full shadow-lg">
            <ApperIcon name="MapPin" className="w-5 h-5" />
          </div>
          
          {/* Map controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <div className="bg-white p-2 rounded shadow">
              <ApperIcon name="Plus" className="w-4 h-4 text-gray-600" />
            </div>
            <div className="bg-white p-2 rounded shadow">
              <ApperIcon name="Minus" className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
        <p className="text-gray-600 mt-4 break-words">
          {property.address}
        </p>
      </Card>
    </motion.div>
  );
};

export default PropertyDetail;