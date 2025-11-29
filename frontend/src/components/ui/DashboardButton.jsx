import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const DashboardButton = forwardRef(({
  icon: Icon,
  title,
  description,
  to,
  onClick,
  variant = 'primary',
  size = 'md',
  showArrow = true,
  badge,
  className = '',
  ...props
}, ref) => {

  const variants = {
    primary: {
      container: 'bg-white/90 backdrop-blur-xl border border-gray-200 hover:border-primary-300',
      iconBg: 'bg-gradient-to-br from-primary-500 to-primary-600',
      iconColor: 'text-white',
      title: 'text-gray-900 group-hover:text-primary-600',
      description: 'text-gray-500',
      arrow: 'text-gray-400 group-hover:text-primary-600',
    },
    success: {
      container: 'bg-white/90 backdrop-blur-xl border border-gray-200 hover:border-green-300',
      iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
      iconColor: 'text-white',
      title: 'text-gray-900 group-hover:text-green-600',
      description: 'text-gray-500',
      arrow: 'text-gray-400 group-hover:text-green-600',
    },
    purple: {
      container: 'bg-white/90 backdrop-blur-xl border border-gray-200 hover:border-purple-300',
      iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      iconColor: 'text-white',
      title: 'text-gray-900 group-hover:text-purple-600',
      description: 'text-gray-500',
      arrow: 'text-gray-400 group-hover:text-purple-600',
    },
    warning: {
      container: 'bg-white/90 backdrop-blur-xl border border-gray-200 hover:border-amber-300',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
      iconColor: 'text-white',
      title: 'text-gray-900 group-hover:text-amber-600',
      description: 'text-gray-500',
      arrow: 'text-gray-400 group-hover:text-amber-600',
    },
    danger: {
      container: 'bg-white/90 backdrop-blur-xl border border-gray-200 hover:border-red-300',
      iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
      iconColor: 'text-white',
      title: 'text-gray-900 group-hover:text-red-600',
      description: 'text-gray-500',
      arrow: 'text-gray-400 group-hover:text-red-600',
    },
    gradient: {
      container: 'bg-gradient-to-r from-primary-600 to-purple-600 border-0',
      iconBg: 'bg-white/20 backdrop-blur-sm',
      iconColor: 'text-white',
      title: 'text-white',
      description: 'text-white/80',
      arrow: 'text-white/80',
    },
    dark: {
      container: 'bg-gradient-to-br from-gray-800 to-gray-900 border-0',
      iconBg: 'bg-white/10 backdrop-blur-sm',
      iconColor: 'text-white',
      title: 'text-white',
      description: 'text-gray-400',
      arrow: 'text-gray-400',
    },
  };

  const sizes = {
    sm: {
      container: 'p-4',
      icon: 'w-12 h-12',
      iconInner: 'w-6 h-6',
      title: 'text-base',
      description: 'text-xs',
    },
    md: {
      container: 'p-5',
      icon: 'w-14 h-14',
      iconInner: 'w-7 h-7',
      title: 'text-lg',
      description: 'text-sm',
    },
    lg: {
      container: 'p-6',
      icon: 'w-16 h-16',
      iconInner: 'w-8 h-8',
      title: 'text-xl',
      description: 'text-sm',
    },
  };

  const style = variants[variant];
  const sizeStyle = sizes[size];

  const content = (
    <div 
      ref={ref}
      className={`
        group relative overflow-hidden rounded-2xl shadow-lg
        hover:shadow-2xl transition-all duration-300
        hover:scale-[1.02] active:scale-[0.98]
        cursor-pointer
        ${style.container}
        ${sizeStyle.container}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <div className={`
          ${sizeStyle.icon} ${style.iconBg}
          rounded-2xl flex items-center justify-center
          shadow-lg group-hover:scale-110 transition-transform duration-300
        `}>
          <Icon className={`${sizeStyle.iconInner} ${style.iconColor}`} />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-bold ${sizeStyle.title} ${style.title} transition-colors truncate`}>
              {title}
            </h3>
            {badge && (
              <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className={`${sizeStyle.description} ${style.description} mt-0.5 truncate`}>
              {description}
            </p>
          )}
        </div>

        {/* Arrow */}
        {showArrow && (
          <ChevronRight className={`
            w-5 h-5 ${style.arrow}
            transition-all duration-300
            group-hover:translate-x-1
          `} />
        )}
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
});

DashboardButton.displayName = 'DashboardButton';

// Dashboard Button Grid
export const DashboardButtonGrid = ({ children, columns = 3, className = '' }) => (
  <div className={`grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} ${className}`}>
    {children}
  </div>
);

// Stat Card (similar style but for stats)
export const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  changeType = 'positive',
  variant = 'primary' 
}) => {
  const colors = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    warning: 'from-amber-500 to-orange-500',
  };

  return (
    <div className="group bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 bg-gradient-to-br ${colors[variant]} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`
            inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
            ${changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
          `}>
            {changeType === 'positive' ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
};

export default DashboardButton;
