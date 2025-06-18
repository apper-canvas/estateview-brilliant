import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PropertyMap from '@/components/organisms/PropertyMap';
import FilterPanel from '@/components/molecules/FilterPanel';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import { propertyService } from '@/services';

const MapView = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Closed by default on map view

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      if (Object.keys(filters).length > 0 && Object.values(filters).some(v => v && (Array.isArray(v) ? v.length > 0 : true))) {
        result = await propertyService.search(filters);
      } else {
        result = await propertyService.getAll();
      }
      setProperties(result);
    } catch (err) {
      const errorMsg = err.message || 'Failed to load properties';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priceMin) count++;
    if (filters.priceMax) count++;
    if (filters.bedroomsMin) count++;
    if (filters.bathroomsMin) count++;
    if (filters.propertyTypes?.length > 0) count++;
    if (filters.squareFeetMin) count++;
    if (filters.query) count++;
    return count;
  };

  const clearAllFilters = () => {
    setFilters({});
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
        className="h-full flex items-center justify-center bg-surface-50"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse mb-4 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mx-auto mb-2" />
          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse mx-auto" />
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
          title="Failed to load map"
          message={error}
          onRetry={loadProperties}
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
      className="h-full flex overflow-hidden max-w-full"
    >
      {/* Filter Sidebar */}
      <div className={`flex-shrink-0 transition-all duration-300 ${
        isFilterOpen ? 'w-80' : 'w-0'
      } bg-white border-r border-gray-200 z-30`}>
        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
          className="h-full"
        />
      </div>

      {/* Map Container */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Map Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-display font-bold text-secondary">
                Map View
              </h1>
              
              {/* Results Count */}
              <span className="text-gray-600">
                {properties.length} properties
              </span>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant={isFilterOpen ? "primary" : "outline"}
                size="sm"
                icon="SlidersHorizontal"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                Filters
                {getActiveFilterCount() > 0 && (
                  <Badge variant="accent" size="sm" className="ml-2">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>

              {getActiveFilterCount() > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <PropertyMap properties={properties} className="h-full" />
        </div>
      </div>
    </motion.div>
  );
};

export default MapView;