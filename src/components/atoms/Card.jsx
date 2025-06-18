import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg border transition-all duration-200';
  
  const variants = {
    default: 'border-gray-200 shadow-sm',
    elevated: 'border-gray-200 shadow-md',
    outlined: 'border-gray-300',
    surface: 'bg-surface-50 border-surface-200'
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const cardClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${paddings[padding]}
    ${hover ? 'hover:shadow-lg cursor-pointer' : ''}
    ${className}
  `.trim();

  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={cardClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;