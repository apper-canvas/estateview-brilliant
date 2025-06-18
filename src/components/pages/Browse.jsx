import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import FilterPanel from '@/components/molecules/FilterPanel';
import PropertyGrid from '@/components/organisms/PropertyGrid';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { propertyService } from '@/services';

const Browse = () => {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-low', 'price-high'

  useEffect(() => {
    // Handle search query from navigation state
    const searchQuery = location.state?.searchQuery;
    if (searchQuery) {
      setFilters(prev => ({ ...prev, query: searchQuery }));
    }
  }, [location.state]);

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
      
      // Apply sorting
      const sorted = sortProperties(result, sortBy);
      setProperties(sorted);
    } catch (err) {
      const errorMsg = err.message || 'Failed to load properties';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const sortProperties = (props, sortType) => {
    const sorted = [...props];
    
switch (sortType) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
      default:
        return sorted;
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    const sorted = sortProperties(properties, newSort);
    setProperties(sorted);
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
      } lg:w-80`}>
        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
          className="h-full"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-display font-bold text-secondary">
                Browse Properties
              </h1>
              
              {/* Results Count */}
              <span className="text-gray-600">
                {loading ? 'Loading...' : `${properties.length} properties`}
              </span>
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                icon="Grid3X3"
                onClick={() => setViewMode('grid')}
              />
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                icon="List"
                onClick={() => setViewMode('list')}
              />
            </div>
          </div>

          {/* Filter Status and Sort */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Show/Hide Filters Button (Mobile) */}
              <Button
                variant="outline"
                size="sm"
                icon={isFilterOpen ? "ChevronLeft" : "SlidersHorizontal"}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden"
              >
                {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                {getActiveFilterCount() > 0 && (
                  <Badge variant="primary" size="sm" className="ml-2">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>

              {/* Active Filters */}
              {getActiveFilterCount() > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  <Badge variant="primary" size="sm">
                    {getActiveFilterCount()} active
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <PropertyGrid
            properties={properties}
            loading={loading}
            error={error}
            onRetry={loadProperties}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Browse;