import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const EmptyState = ({ 
  title = "No results found",
  description = "Try adjusting your search criteria or browse all properties.",
  actionLabel = "Browse All Properties",
  onAction,
  icon = "Search",
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 3,
          ease: "easeInOut"
        }}
      >
        <ApperIcon 
          name={icon} 
          className="w-20 h-20 text-gray-300 mb-6" 
        />
      </motion.div>
      
      <h3 className="text-2xl font-display font-semibold text-secondary mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      
      {onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onAction}
            variant="primary"
            size="lg"
            icon="Home"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;