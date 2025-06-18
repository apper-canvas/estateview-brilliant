import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ErrorState = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading the data.",
  onRetry,
  actionLabel = "Try Again",
  icon = "AlertCircle",
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ApperIcon 
          name={icon} 
          className="w-16 h-16 text-error mb-4" 
        />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-secondary mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          icon="RefreshCw"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;