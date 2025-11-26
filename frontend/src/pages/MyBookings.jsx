import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  Calendar, MapPin, Ticket, X, Download, 
  Clock, Search
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">My Bookings</h1>
          <p className="text-xl text-white/80 mb-8 animate-slide-up">
            Manage all your event tickets in one place
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg animate-slide-up">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-white/70 text-sm">Total</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{stats.confirmed}</div>
              <div className="text-white/70 text-sm">Confirmed</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{stats.upcoming}</div>
              <div className="text-white/70 text-sm">Upcoming</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex bg-gray-100 rounded-xl p-1">
              {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === status 
                      ? 'bg-white shadow-sm text-primary-600' 
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
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <EventCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        ) : filteredBookings?.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title={filter === 'all' ? "No bookings yet" : `No ${filter} bookings`}
            description="When you book events, they will appear here."
            actionLabel="Browse Events"
            actionLink="/events"
          />
        ) : (
          <div className="space-y-4 animate-fade-in">
            {filteredBookings?.map((booking) => (
              <div key={booking._id} className="card hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  <Link 
                    to={`/events/${booking.event?._id}`}
                    className="md:w-48 h-32 md:h-auto flex-shrink-0"
                  >
                    <img
                      src={booking.event?.images?.[0]?.url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'}
                      alt={booking.event?.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <Link 
                          to={`/events/${booking.event?._id}`}
                          className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1"
                        >
                          {booking.event?.title}
                        </Link>
                        <Badge 
                          variant={statusConfig[booking.status]?.variant || 'default'}
                          className="mt-2"
                        >
                          {statusConfig[booking.status]?.label || booking.status}
                        </Badge>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold text-primary-600">
                          ₹{booking.totalAmount}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.numberOfTickets} ticket{booking.numberOfTickets > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-500" />
                        <span>{booking.event?.date?.start ? format(new Date(booking.event.date.start), 'EEE, MMM d, yyyy') : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary-500" />
                        <span>{booking.event?.date?.start ? format(new Date(booking.event.date.start), 'h:mm a') : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        <span className="truncate">{booking.event?.venue?.name}, {booking.event?.venue?.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-primary-500" />
                        <span className="font-mono">{booking.bookingCode}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
                      {booking.status === 'confirmed' && (
                        <>
                          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                            Download Ticket
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            leftIcon={<X className="w-4 h-4" />}
                            onClick={() => handleCancelBooking(booking._id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      <Link to={`/events/${booking.event?._id}`} className="ml-auto">
                        <Button variant="ghost" size="sm">View Event →</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
