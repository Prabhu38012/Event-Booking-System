import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  Calendar, MapPin, User, IndianRupee, Clock, Users, 
  Share2, Heart, ChevronLeft, Minus, Plus, Star, Ticket, Sparkles, Shield, CheckCircle
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Event not found</h2>
          <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/events">
            <Button size="lg" className="bg-gradient-to-r from-primary-600 to-primary-700">
              Browse Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentAvailable = availableSeats ?? event.capacity.available;
  const totalPrice = event.pricing.amount * numberOfTickets;
  const isSoldOut = currentAvailable === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Back Button */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 relative">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-all hover:gap-2 gap-1 font-medium group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Events</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-72 md:h-[500px] overflow-hidden">
        <img
          src={event.images?.[0]?.url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'}
          alt={event.title}
          className="w-full h-full object-cover animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Badges on Image */}
        <div className="absolute top-6 left-6 flex gap-3 animate-fade-in animation-delay-200">
          <Badge variant="primary" size="lg" className="backdrop-blur-sm bg-primary-600/90 shadow-lg">
            {event.category}
          </Badge>
          {isSoldOut && (
            <Badge variant="danger" size="lg" className="backdrop-blur-sm bg-red-600/90 shadow-lg">
              Sold Out
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-3 animate-fade-in animation-delay-400">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-3.5 bg-white/95 backdrop-blur-xl rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl hover:scale-110"
            aria-label="Like event"
          >
            <Heart className={`w-5 h-5 transition-all ${isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-700'}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-3.5 bg-white/95 backdrop-blur-xl rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl hover:scale-110"
            aria-label="Share event"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Title on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-8 animate-fade-in animation-delay-600">
          <div className="container mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Featured Event</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/95">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="font-medium">{format(new Date(event.date.start), 'EEE, MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="font-medium">{event.venue.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Info Cards */}
            <div className="grid sm:grid-cols-3 gap-4 animate-fade-in">
              <div className="card bg-white/80 backdrop-blur-xl flex items-center gap-4 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Date</p>
                  <p className="font-bold text-gray-900">{format(new Date(event.date.start), 'MMM d, yyyy')}</p>
                </div>
              </div>

              <div className="card bg-white/80 backdrop-blur-xl flex items-center gap-4 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Time</p>
                  <p className="font-bold text-gray-900">{format(new Date(event.date.start), 'h:mm a')}</p>
                </div>
              </div>

              <div className="card bg-white/80 backdrop-blur-xl flex items-center gap-4 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Available</p>
                  <p className="font-bold text-gray-900">{currentAvailable} spots</p>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="card bg-white/80 backdrop-blur-xl border border-gray-100 animate-fade-in animation-delay-200">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">About This Event</h2>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed text-lg">
                {event.description}
              </p>

              {event.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-200">
                  {event.tags.map(tag => (
                    <Badge key={tag} variant="default" className="text-sm">#{tag}</Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Venue */}
            <div className="card bg-white/80 backdrop-blur-xl border border-gray-100 animate-fade-in animation-delay-400">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Venue</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <MapPin className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900">{event.venue.name}</h3>
                  <p className="text-gray-600 text-lg">
                    {event.venue.address}, {event.venue.city}
                    {event.venue.state && `, ${event.venue.state}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Organizer */}
            <div className="card bg-white/80 backdrop-blur-xl border border-gray-100 animate-fade-in animation-delay-600">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Organizer</h2>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{event.organizer?.name}</h3>
                  <p className="text-gray-500">{event.organizer?.email}</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            {event.averageRating > 0 && (
              <div className="card bg-white/80 backdrop-blur-xl border border-gray-100 animate-fade-in animation-delay-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                  <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-lg">{event.averageRating.toFixed(1)}</span>
                    <span className="text-gray-500">({event.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-28 bg-white/90 backdrop-blur-xl border-2 border-gray-200 shadow-2xl animate-fade-in animation-delay-200">
              <div className="text-center mb-6">
                {event.pricing.type === 'free' ? (
                  <div>
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-6 py-3 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-bold text-lg">FREE EVENT</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-gray-500 text-sm font-medium block mb-2">Price per ticket</span>
                    <div className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent flex items-center justify-center">
                      <IndianRupee className="w-9 h-9" />
                      {event.pricing.amount}
                    </div>
                  </div>
                )}
              </div>

              {/* Live Availability */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 mb-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">Available Seats</span>
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-primary-600" />
                    <span className={`font-bold text-2xl ${
                      currentAvailable < 10 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {currentAvailable}
                    </span>
                  </div>
                </div>
                {currentAvailable < 10 && currentAvailable > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-3">
                    <p className="text-red-700 text-sm font-semibold flex items-center gap-2">
                      ⚡ Hurry! Only {currentAvailable} spots left
                    </p>
                  </div>
                )}
              </div>

              {/* Ticket Selector */}
              {!isSoldOut && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Number of Tickets
                  </label>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setNumberOfTickets(Math.max(1, numberOfTickets - 1))}
                      className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center hover:from-gray-200 hover:to-gray-300 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={numberOfTickets <= 1}
                      aria-label="Decrease tickets"
                    >
                      <Minus className="w-6 h-6 text-gray-700" />
                    </button>
                    <div className="w-20 h-14 bg-primary-50 border-2 border-primary-200 rounded-xl flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary-600">{numberOfTickets}</span>
                    </div>
                    <button
                      onClick={() => setNumberOfTickets(Math.min(currentAvailable, numberOfTickets + 1))}
                      className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center hover:from-gray-200 hover:to-gray-300 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={numberOfTickets >= currentAvailable}
                      aria-label="Increase tickets"
                    >
                      <Plus className="w-6 h-6 text-gray-700" />
                    </button>
                  </div>
                </div>
              )}

              {/* Total */}
              {event.pricing.type !== 'free' && !isSoldOut && (
                <div className="flex items-center justify-between py-5 border-t-2 border-b-2 border-gray-200 mb-6">
                  <span className="text-gray-600 font-semibold text-lg">Total Amount</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent flex items-center">
                    <IndianRupee className="w-7 h-7" />
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
                className="mb-6 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-lg py-6"
              >
                {isSoldOut ? 'Sold Out' : 'Book Now'}
              </Button>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Instant Confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        .animation-delay-800 {
          animation-delay: 800ms;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EventDetail;
