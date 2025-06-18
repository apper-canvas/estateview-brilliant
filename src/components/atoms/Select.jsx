import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Select = forwardRef(({ 
  label,
  options = [],
  placeholder = 'Select an option',
  error,
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const selectClasses = `
    w-full px-4 py-3 text-base border rounded-md transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    bg-white appearance-none pr-10
    ${error ? 'border-error' : 'border-gray-300'}
    ${className}
  `.trim();

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ApperIcon
          name="ChevronDown"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        />
      </div>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;