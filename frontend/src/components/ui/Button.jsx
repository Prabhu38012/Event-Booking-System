import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}, ref) => {
  
  const baseStyles = `
    relative inline-flex items-center justify-center gap-2
    font-semibold transition-all duration-300 ease-out
    rounded-2xl cursor-pointer select-none
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-60
    transform hover:scale-[1.02] active:scale-[0.98]
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-primary-600 to-primary-700
      hover:from-primary-700 hover:to-primary-800
      text-white shadow-lg hover:shadow-xl
      focus:ring-primary-500
      before:absolute before:inset-0 before:rounded-2xl
      before:bg-gradient-to-r before:from-primary-400 before:to-primary-500
      before:opacity-0 hover:before:opacity-20 before:transition-opacity
    `,
    secondary: `
      bg-gradient-to-r from-gray-100 to-gray-200
      hover:from-gray-200 hover:to-gray-300
      text-gray-800 shadow-md hover:shadow-lg
      focus:ring-gray-400
      border border-gray-200 hover:border-gray-300
    `,
    success: `
      bg-gradient-to-r from-green-500 to-green-600
      hover:from-green-600 hover:to-green-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-green-500
      before:absolute before:inset-0 before:rounded-2xl
      before:bg-gradient-to-r before:from-green-300 before:to-green-400
      before:opacity-0 hover:before:opacity-20 before:transition-opacity
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600
      hover:from-red-600 hover:to-red-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-red-500
      before:absolute before:inset-0 before:rounded-2xl
      before:bg-gradient-to-r before:from-red-300 before:to-red-400
      before:opacity-0 hover:before:opacity-20 before:transition-opacity
    `,
    warning: `
      bg-gradient-to-r from-amber-500 to-orange-500
      hover:from-amber-600 hover:to-orange-600
      text-white shadow-lg hover:shadow-xl
      focus:ring-amber-500
      before:absolute before:inset-0 before:rounded-2xl
      before:bg-gradient-to-r before:from-amber-300 before:to-orange-300
      before:opacity-0 hover:before:opacity-20 before:transition-opacity
    `,
    purple: `
      bg-gradient-to-r from-purple-600 to-purple-700
      hover:from-purple-700 hover:to-purple-800
      text-white shadow-lg hover:shadow-xl
      focus:ring-purple-500
      before:absolute before:inset-0 before:rounded-2xl
      before:bg-gradient-to-r before:from-purple-400 before:to-purple-500
      before:opacity-0 hover:before:opacity-20 before:transition-opacity
    `,
    outline: `
      bg-transparent border-2 border-primary-600
      text-primary-600 hover:bg-primary-50
      hover:border-primary-700 hover:text-primary-700
      shadow-sm hover:shadow-md
      focus:ring-primary-500
    `,
    outlineSecondary: `
      bg-transparent border-2 border-gray-300
      text-gray-700 hover:bg-gray-50
      hover:border-gray-400 hover:text-gray-900
      shadow-sm hover:shadow-md
      focus:ring-gray-400
    `,
    ghost: `
      bg-transparent text-gray-700
      hover:bg-gray-100 hover:text-gray-900
      focus:ring-gray-400
    `,
    ghostPrimary: `
      bg-transparent text-primary-600
      hover:bg-primary-50 hover:text-primary-700
      focus:ring-primary-500
    `,
    link: `
      bg-transparent text-primary-600
      hover:text-primary-700 hover:underline
      focus:ring-primary-500
      shadow-none hover:shadow-none
    `,
    glass: `
      bg-white/20 backdrop-blur-xl border border-white/30
      text-white hover:bg-white/30
      shadow-lg hover:shadow-xl
      focus:ring-white/50
    `,
    dark: `
      bg-gradient-to-r from-gray-800 to-gray-900
      hover:from-gray-900 hover:to-black
      text-white shadow-lg hover:shadow-xl
      focus:ring-gray-700
    `,
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs min-h-[32px]',
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-5 py-2.5 text-sm min-h-[42px]',
    lg: 'px-6 py-3 text-base min-h-[48px]',
    xl: 'px-8 py-4 text-lg min-h-[56px]',
  };

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Glow effect for primary variants */}
      {['primary', 'success', 'danger', 'purple', 'warning'].includes(variant) && (
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-current to-current opacity-0 blur-xl transition-opacity group-hover:opacity-30" />
      )}

      {/* Content wrapper */}
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : (
          leftIcon && <span className={iconSizes[size]}>{leftIcon}</span>
        )}
        
        <span>{children}</span>
        
        {rightIcon && !loading && (
          <span className={`${iconSizes[size]} transition-transform group-hover:translate-x-0.5`}>
            {rightIcon}
          </span>
        )}
      </span>
    </button>
  );
});

Button.displayName = 'Button';

// Icon Button variant
export const IconButton = forwardRef(({
  icon,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const sizes = {
    xs: 'w-8 h-8',
    sm: 'w-9 h-9',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  const iconSizes = {
    xs: 'w-4 h-4',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      className={`${sizes[size]} !p-0 !min-h-0 ${className}`}
      {...props}
    >
      <span className={iconSizes[size]}>{icon}</span>
    </Button>
  );
});

IconButton.displayName = 'IconButton';

// Button Group
export const ButtonGroup = ({ children, className = '' }) => (
  <div className={`inline-flex rounded-2xl overflow-hidden shadow-lg ${className}`}>
    {children}
  </div>
);

export default Button;
