import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  Calendar, MapPin, Ticket, X, Download, 
  Clock, Search, Sparkles, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { EventCardSkeleton } from '../components/ui/Skeleton';

const MyBookings = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const { data } = await axios.get('/api/bookings/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return data.data;
    }
  });

  const handleCancelBooking = async (bookingId) => {
    if (!globalThis.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await axios.put(`/api/bookings/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Booking cancelled successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filteredBookings = bookings?.filter(booking => {
    if (filter !== 'all' && booking.status !== filter) return false;
    if (searchTerm && !booking.event?.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const statusConfig = {
    confirmed: { variant: 'success', label: 'Confirmed' },
    pending: { variant: 'warning', label: 'Pending' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
    refunded: { variant: 'info', label: 'Refunded' }
  };

  const stats = {
    total: bookings?.length || 0,
    confirmed: bookings?.filter(b => b.status === 'confirmed').length || 0,
    upcoming: bookings?.filter(b => b.status === 'confirmed' && new Date(b.event?.date?.start) > new Date()).length || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 0V4h-2V0h-4v2h4v4h2V2h4V0h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }} 
          />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Ticket className="w-4 h-4" />
            <span className="text-sm font-medium">Your Tickets</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in animation-delay-200">My Bookings</h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl animate-fade-in animation-delay-400">
            Manage all your event tickets in one place
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl animate-fade-in animation-delay-600">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-4xl font-bold mb-2">{stats.total}</div>
              <div className="text-white/80 text-sm font-medium">Total Bookings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-4xl font-bold mb-2">{stats.confirmed}</div>
              <div className="text-white/80 text-sm font-medium">Confirmed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-4xl font-bold mb-2">{stats.upcoming}</div>
              <div className="text-white/80 text-sm font-medium">Upcoming</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all border border-transparent hover:border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex bg-gray-100 rounded-xl p-1.5 shadow-sm">
              {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    filter === status 
                      ? 'bg-white shadow-md text-primary-600 scale-105' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 relative z-10">
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <EventCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        ) : filteredBookings?.length === 0 ? (
          <div className="animate-fade-in">
            <EmptyState
              icon={Ticket}
              title={filter === 'all' ? "No bookings yet" : `No ${filter} bookings`}
              description="When you book events, they will appear here."
              actionLabel="Browse Events"
              actionLink="/events"
            />
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {filteredBookings?.map((booking, index) => (
              <div 
                key={booking._id} 
                className="card bg-white/90 backdrop-blur-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <Link 
                    to={`/events/${booking.event?._id}`}
                    className="md:w-56 h-40 md:h-auto flex-shrink-0 overflow-hidden rounded-xl"
                  >
                    <img
                      src={booking.event?.images?.[0]?.url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'}
                      alt={booking.event?.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <Link 
                          to={`/events/${booking.event?._id}`}
                          className="text-2xl font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1 block mb-3"
                        >
                          {booking.event?.title}
                        </Link>
                        <Badge 
                          variant={statusConfig[booking.status]?.variant || 'default'}
                          className="font-semibold"
                        >
                          {booking.status === 'confirmed' && <CheckCircle className="w-3.5 h-3.5 mr-1" />}
                          {statusConfig[booking.status]?.label || booking.status}
                        </Badge>
                      </div>
                      <div className="text-right flex-shrink-0 bg-primary-50 rounded-2xl p-4 border border-primary-100">
                        <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                          ₹{booking.totalAmount}
                        </div>
                        <div className="text-sm text-gray-600 font-medium mt-1">
                          {booking.numberOfTickets} ticket{booking.numberOfTickets > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="font-medium">{booking.event?.date?.start ? format(new Date(booking.event.date.start), 'EEE, MMM d, yyyy') : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="font-medium">{booking.event?.date?.start ? format(new Date(booking.event.date.start), 'h:mm a') : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="truncate font-medium">{booking.event?.venue?.name}, {booking.event?.venue?.city}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Ticket className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="font-mono font-semibold">{booking.bookingCode}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-5 border-t-2 border-gray-100">
                      {booking.status === 'confirmed' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            leftIcon={<Download className="w-4 h-4" />}
                            className="hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700"
                          >
                            Download Ticket
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            leftIcon={<X className="w-4 h-4" />}
                            onClick={() => handleCancelBooking(booking._id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            Cancel Booking
                          </Button>
                        </>
                      )}
                      <Link to={`/events/${booking.event?._id}`} className="ml-auto">
                        <Button variant="ghost" size="sm" className="text-primary-600 hover:bg-primary-50">
                          View Event →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default MyBookings;
