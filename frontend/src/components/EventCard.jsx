import { Link } from 'react-router-dom';
import { Calendar, MapPin, IndianRupee, Star, Users } from 'lucide-react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { Badge } from './ui';

const EventCard = ({ event }) => {
  const isAlmostFull = event.capacity.available < 10;
  const isSoldOut = event.capacity.available === 0;

  return (
    <Link
      to={`/events/${event._id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={event.images?.[0]?.url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <Badge
          variant="primary"
          className="absolute top-3 left-3 backdrop-blur-sm bg-white/90"
        >
          {event.category}
        </Badge>

        {/* Status Badge */}
        {isSoldOut ? (
          <Badge variant="danger" className="absolute top-3 right-3">
            Sold Out
          </Badge>
        ) : isAlmostFull ? (
          <Badge variant="warning" className="absolute top-3 right-3">
            Almost Full
          </Badge>
        ) : null}

        {/* Price on Image */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            {event.pricing.type === 'free' ? (
              <span className="text-green-600 font-bold">FREE</span>
            ) : (
              <span className="font-bold text-gray-900 flex items-center">
                <IndianRupee className="w-4 h-4" />
                {event.pricing.amount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" />
            <span>{format(new Date(event.date.start), 'EEE, MMM d · h:mm a')}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" />
            <span className="truncate">{event.venue.name}, {event.venue.city}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-1" />
            <span>{event.capacity.available} spots left</span>
          </div>

          {event.averageRating > 0 && (
            <div className="flex items-center text-sm">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="font-medium">{event.averageRating.toFixed(1)}</span>
              <span className="text-gray-400 ml-1">({event.totalReviews})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string
      })
    ),
    date: PropTypes.shape({
      start: PropTypes.string.isRequired
    }).isRequired,
    venue: PropTypes.shape({
      name: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired
    }).isRequired,
    pricing: PropTypes.shape({
      type: PropTypes.string.isRequired,
      amount: PropTypes.number
    }).isRequired,
    capacity: PropTypes.shape({
      available: PropTypes.number.isRequired
    }).isRequired,
    averageRating: PropTypes.number,
    totalReviews: PropTypes.number
  }).isRequired
};

export default EventCard;
