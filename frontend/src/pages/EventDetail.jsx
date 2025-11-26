import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  Calendar, MapPin, User, IndianRupee, Clock, Users, 
  Share2, Heart, ChevronLeft, Minus, Plus, Star, Ticket
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { EventDetailSkeleton } from '../components/ui/Skeleton';

const socket = io('http://localhost:5000');

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [availableSeats, setAvailableSeats] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/events/${id}`);
      setAvailableSeats(data.data.capacity.available);
      return data.data;
    }
  });

  useEffect(() => {
    socket.emit('join:event', id);

    socket.on('seats:updated', ({ eventId, availableSeats: seats }) => {
      if (eventId === id) {
        setAvailableSeats(seats);
      }
    });

    return () => {
      socket.emit('leave:event', id);
      socket.off('seats:updated');
    };
  }, [id]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }

    const currentAvailable = availableSeats ?? event.capacity.available;
    if (numberOfTickets > currentAvailable) {
      toast.error('Not enough seats available');
      return;
    }

    setBookingLoading(true);
    try {
      const { data } = await axios.post('/api/bookings/lock-seats', {
        eventId: id,
        numberOfTickets
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      navigate('/checkout', { 
        state: { 
          bookingId: data.data._id,
          event,
          numberOfTickets 
        } 
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: globalThis.location.href
      });
    } else {
      await navigator.clipboard.writeText(globalThis.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <Link to="/events">
          <Button>Browse Events</Button>
        </Link>
      </div>
    );
  }

  const currentAvailable = availableSeats ?? event.capacity.available;
  const totalPrice = event.pricing.amount * numberOfTickets;
  const isSoldOut = currentAvailable === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Back to Events</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={event.images?.[0]?.url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Badges on Image */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="primary" size="lg">{event.category}</Badge>
          {isSoldOut && <Badge variant="danger" size="lg">Sold Out</Badge>}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all"
            aria-label="Like event"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all"
            aria-label="Share event"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Title on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              {event.title}
            </h1>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{format(new Date(event.date.start), 'EEE, MMM d')}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{event.venue.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Info Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="card flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">{format(new Date(event.date.start), 'MMM d, yyyy')}</p>
                </div>
              </div>

              <div className="card flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-semibold">{format(new Date(event.date.start), 'h:mm a')}</p>
                </div>
              </div>

              <div className="card flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="font-semibold">{currentAvailable} spots left</p>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">About This Event</h2>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {event.description}
              </p>

              {event.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                  {event.tags.map(tag => (
                    <Badge key={tag} variant="default">#{tag}</Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Venue */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Venue</h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{event.venue.name}</h3>
                  <p className="text-gray-600">
                    {event.venue.address}, {event.venue.city}
                    {event.venue.state && `, ${event.venue.state}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Organizer */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Organizer</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-7 h-7 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{event.organizer?.name}</h3>
                  <p className="text-gray-500 text-sm">{event.organizer?.email}</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            {event.averageRating > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Reviews</h2>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold">{event.averageRating.toFixed(1)}</span>
                    <span className="text-gray-500">({event.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <div className="text-center mb-6">
                {event.pricing.type === 'free' ? (
                  <div className="text-3xl font-bold text-green-600">FREE</div>
                ) : (
                  <div>
                    <span className="text-gray-500 text-sm">Price per ticket</span>
                    <div className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                      <IndianRupee className="w-7 h-7" />
                      {event.pricing.amount}
                    </div>
                  </div>
                )}
              </div>

              {/* Live Availability */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Available Seats</span>
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-primary-600" />
                    <span className={`font-bold text-lg ${
                      currentAvailable < 10 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {currentAvailable}
                    </span>
                  </div>
                </div>
                {currentAvailable < 10 && currentAvailable > 0 && (
                  <p className="text-red-600 text-sm mt-2">
                    ⚡ Hurry! Only {currentAvailable} spots left
                  </p>
                )}
              </div>

              {/* Ticket Selector */}
              {!isSoldOut && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Number of Tickets
                  </label>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setNumberOfTickets(Math.max(1, numberOfTickets - 1))}
                      className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                      disabled={numberOfTickets <= 1}
                      aria-label="Decrease tickets"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-2xl font-bold w-12 text-center">{numberOfTickets}</span>
                    <button
                      onClick={() => setNumberOfTickets(Math.min(currentAvailable, numberOfTickets + 1))}
                      className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                      disabled={numberOfTickets >= currentAvailable}
                      aria-label="Increase tickets"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Total */}
              {event.pricing.type !== 'free' && !isSoldOut && (
                <div className="flex items-center justify-between py-4 border-t border-b mb-6">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="text-2xl font-bold text-primary-600 flex items-center">
                    <IndianRupee className="w-6 h-6" />
                    {totalPrice}
                  </span>
                </div>
              )}

              {/* Book Button */}
              <Button
                fullWidth
                size="lg"
                onClick={handleBooking}
                disabled={isSoldOut}
                loading={bookingLoading}
              >
                {isSoldOut ? 'Sold Out' : 'Book Now'}
              </Button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Instant Confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
