import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  required,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${Icon ? 'pl-10' : ''}
            ${error 
              ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
              : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.elementType,
  className: PropTypes.string,
  required: PropTypes.bool
};

export default Input;
