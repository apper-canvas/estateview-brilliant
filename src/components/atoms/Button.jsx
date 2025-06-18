import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-sm hover:shadow-md',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary shadow-sm hover:shadow-md',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-primary hover:bg-primary/10 focus:ring-primary',
    accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent shadow-sm hover:shadow-md'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim();

  const content = (
    <>
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className={`animate-spin ${children ? 'mr-2' : ''} w-4 h-4`}
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon 
          name={icon} 
          className={`${children ? 'mr-2' : ''} w-4 h-4`}
        />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon 
          name={icon} 
          className={`${children ? 'ml-2' : ''} w-4 h-4`}
        />
      )}
    </>
  );

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </motion.button>
  );
};

export default Button;