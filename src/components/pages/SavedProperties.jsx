import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PropertyGrid from '@/components/organisms/PropertyGrid';
import EmptyState from '@/components/molecules/EmptyState';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import { propertyService, savedPropertyService } from '@/services';

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const loadSavedProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get saved property IDs
      const saved = await savedPropertyService.getAll();
      setSavedProperties(saved);
      
      if (saved.length > 0) {
        // Get full property details for each saved property
const propertyPromises = saved.map(s => 
          propertyService.getById(s.propertyId).catch(() => null)
        );
        const propertyResults = await Promise.all(propertyPromises);
        const validProperties = propertyResults.filter(p => p !== null);
        setProperties(validProperties);
      } else {
        setProperties([]);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to load saved properties';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
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
        className="p-6"
      >
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader count={6} type="property-card" />
        </div>
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
          title="Failed to load saved properties"
          message={error}
          onRetry={loadSavedProperties}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-full overflow-hidden"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-secondary mb-2">
          Saved Properties
        </h1>
        <p className="text-gray-600">
          {properties.length === 0 
            ? "You haven't saved any properties yet" 
            : `You have ${properties.length} saved ${properties.length === 1 ? 'property' : 'properties'}`
          }
        </p>
      </div>

      {/* Content */}
      {properties.length === 0 ? (
        <EmptyState
          title="No saved properties"
          description="Start browsing properties and save your favorites to see them here. Click the heart icon on any property to add it to your saved list."
          actionLabel="Browse Properties"
          onAction={() => window.location.href = '/'}
          icon="Heart"
        />
      ) : (
        <PropertyGrid
          properties={properties}
          loading={false}
          error={null}
          onRetry={loadSavedProperties}
        />
      )}
    </motion.div>
  );
};

export default SavedProperties;