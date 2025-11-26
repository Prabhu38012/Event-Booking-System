import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  actionLink,
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Icon className="w-10 h-10 text-gray-400" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 max-w-md mb-6">{description}</p>
      )}
      {actionLabel && (actionLink || onAction) && (
        actionLink ? (
          <Link to={actionLink}>
            <Button variant="primary">{actionLabel}</Button>
          </Link>
        ) : (
          <Button variant="primary" onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  actionLink: PropTypes.string,
  onAction: PropTypes.func
};

export default EmptyState;
