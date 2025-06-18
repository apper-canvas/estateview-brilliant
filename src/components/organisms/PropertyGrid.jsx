import { motion } from 'framer-motion';
import PropertyCard from '@/components/molecules/PropertyCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';

const PropertyGrid = ({ 
  properties = [],
  loading = false,
  error = null,
  onRetry,
  className = ""
}) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        <SkeletonLoader count={6} type="property-card" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load properties"
        message={error}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  if (properties.length === 0) {
    return (
      <EmptyState
        title="No properties found"
        description="Try adjusting your search criteria or browse all available properties."
        actionLabel="Clear Filters"
        onAction={onRetry}
        icon="Home"
        className={className}
      />
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {properties.map((property) => (
        <motion.div
          key={property.Id}
          variants={itemVariants}
        >
          <PropertyCard property={property} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PropertyGrid;