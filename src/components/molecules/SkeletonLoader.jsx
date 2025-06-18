import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 1, type = 'card', className = '' }) => {
  const skeletons = Array.from({ length: count }, (_, index) => index);

  const PropertyCardSkeleton = () => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-property bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="space-y-2">
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
    </div>
  );

  const DetailSkeleton = () => (
    <div className="space-y-6">
      {/* Hero image skeleton */}
      <div className="aspect-property bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse" />
      
      {/* Title and price skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
      </div>
      
      {/* Stats skeleton */}
      <div className="flex space-x-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
        ))}
      </div>
      
      {/* Description skeleton */}
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
        ))}
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'property-card':
        return <PropertyCardSkeleton />;
      case 'list':
        return <ListSkeleton />;
      case 'detail':
        return <DetailSkeleton />;
      default:
        return <PropertyCardSkeleton />;
    }
  };

  return (
    <div className={className}>
      {skeletons.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;