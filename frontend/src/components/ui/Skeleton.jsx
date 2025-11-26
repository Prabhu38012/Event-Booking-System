import PropTypes from 'prop-types';

const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const variants = {
    rectangular: 'rounded-md',
    circular: 'rounded-full',
    text: 'rounded h-4'
  };

  return (
    <div
      className={`bg-gray-200 animate-pulse ${variants[variant]} ${className}`}
    />
  );
};

Skeleton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['rectangular', 'circular', 'text'])
};

export const EventCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <Skeleton className="w-full h-48" />
    <div className="p-5 space-y-3">
      <Skeleton variant="text" className="w-3/4 h-6" />
      <Skeleton variant="text" className="w-1/2 h-4" />
      <Skeleton variant="text" className="w-2/3 h-4" />
      <div className="flex justify-between pt-4 border-t">
        <Skeleton variant="text" className="w-20 h-6" />
        <Skeleton variant="text" className="w-16 h-4" />
      </div>
    </div>
  </div>
);

export const EventDetailSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <Skeleton className="w-full h-64 md:h-96" />
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card space-y-4">
            <Skeleton variant="text" className="w-1/2 h-8" />
            <Skeleton variant="text" className="w-full h-4" />
            <Skeleton variant="text" className="w-full h-4" />
            <Skeleton variant="text" className="w-3/4 h-4" />
          </div>
          <div className="card space-y-4">
            <Skeleton variant="text" className="w-1/3 h-6" />
            <Skeleton className="w-full h-24" />
          </div>
        </div>
        <div>
          <div className="card space-y-4">
            <Skeleton variant="text" className="w-1/2 h-8 mx-auto" />
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-12" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr>
    <td className="py-4 px-6"><Skeleton className="w-32 h-12 rounded-lg" /></td>
    <td className="py-4 px-6"><Skeleton variant="text" className="w-24 h-4" /></td>
    <td className="py-4 px-6"><Skeleton variant="text" className="w-20 h-4" /></td>
    <td className="py-4 px-6"><Skeleton variant="text" className="w-16 h-6 rounded-full" /></td>
    <td className="py-4 px-6"><Skeleton variant="text" className="w-20 h-4" /></td>
  </tr>
);

export default Skeleton;
