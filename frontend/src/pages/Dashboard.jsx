import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Calendar, Users, Ticket, TrendingUp, Edit, Trash2, 
  Plus, Eye, MapPin, ArrowUpRight, ArrowDownRight, Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import DashboardButton, { StatCard, DashboardButtonGrid } from '../components/ui/DashboardButton';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { EventCardSkeleton } from '../components/ui/Skeleton';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return data.data;
    },
    enabled: user?.role === 'admin'
  });

  const { data: myEvents, isLoading: eventsLoading, refetch } = useQuery({
    queryKey: ['my-events'],
    queryFn: async () => {
      const { data } = await axios.get('/api/events', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return data.data;
    }
  });

  const handleDeleteEvent = async (eventId) => {
    if (!globalThis.confirm('Are you sure you want to delete this event?')) return;

    try {
      await axios.delete(`/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Event deleted successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
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

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Welcome back, {user?.name}!</h1>
              <p className="text-white/90 text-lg">Here&apos;s what&apos;s happening with your events</p>
            </div>
            <Link to="/create-event" className="animate-fade-in animation-delay-200">
              <Button 
                variant="glass"
                size="lg"
                leftIcon={<Plus className="w-5 h-5" />}
              >
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10">
        {/* Admin Stats - Using new StatCard component */}
        {user?.role === 'admin' && !statsLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in">
            <StatCard 
              icon={Users}
              label="Total Users"
              value={stats?.totalUsers || 0}
              change="+12%"
              changeType="positive"
              variant="primary"
            />
            <StatCard 
              icon={Calendar}
              label="Total Events"
              value={stats?.totalEvents || 0}
              change="+8%"
              changeType="positive"
              variant="success"
            />
            <StatCard 
              icon={Ticket}
              label="Total Bookings"
              value={stats?.totalBookings || 0}
              change="+23%"
              changeType="positive"
              variant="purple"
            />
            <StatCard 
              icon={TrendingUp}
              label="Revenue"
              value={`₹${stats?.totalRevenue || 0}`}
              change="+18%"
              changeType="positive"
              variant="warning"
            />
          </div>
        )}

        {/* Quick Actions for Organizers - Using new DashboardButton component */}
        {user?.role === 'organizer' && (
          <DashboardButtonGrid columns={3} className="mb-10">
            <DashboardButton
              to="/create-event"
              icon={Plus}
              title="Create Event"
              description="Start a new event"
              variant="primary"
              size="md"
            />
            <DashboardButton
              to="/my-bookings"
              icon={Ticket}
              title="View Bookings"
              description="Manage ticket sales"
              variant="success"
              size="md"
            />
            <DashboardButton
              to="/events"
              icon={Eye}
              title="Browse Events"
              description="Explore all events"
              variant="purple"
              size="md"
            />
          </DashboardButtonGrid>
        )}

        {/* My Events */}
        <div className="card bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl animate-fade-in animation-delay-600">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">My Events</h2>
              <p className="text-gray-500">Manage and track your events</p>
            </div>
            <Link to="/create-event">
              <Button 
                variant="outline" 
                size="sm" 
                leftIcon={<Plus className="w-4 h-4" />}
                className="hover:bg-primary-50 hover:border-primary-300"
              >
                New Event
              </Button>
            </Link>
          </div>
          
          {eventsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <EventCardSkeleton key={`skeleton-${i}`} />
              ))}
            </div>
          ) : myEvents?.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No events yet"
              description="Create your first event and start selling tickets."
              actionLabel="Create Event"
              actionLink="/create-event"
            />
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b-2 border-gray-200">
                    <th className="pb-4 font-semibold text-gray-700">Event</th>
                    <th className="pb-4 font-semibold text-gray-700 hidden md:table-cell">Date</th>
                    <th className="pb-4 font-semibold text-gray-700 hidden lg:table-cell">Capacity</th>
                    <th className="pb-4 font-semibold text-gray-700">Status</th>
                    <th className="pb-4 font-semibold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myEvents?.slice(0, 10).map((event, index) => (
                    <tr 
                      key={event._id} 
                      className="group hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent transition-all animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="py-5">
                        <div className="flex items-center gap-4">
                          <img 
                            src={event.images?.[0]?.url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100'} 
                            alt={event.title}
                            className="w-16 h-16 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow"
                          />
                          <div>
                            <Link 
                              to={`/events/${event._id}`}
                              className="font-bold text-gray-900 hover:text-primary-600 line-clamp-1 transition-colors"
                            >
                              {event.title}
                            </Link>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {event.venue?.city}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-gray-600 font-medium hidden md:table-cell">
                        {format(new Date(event.date?.start), 'MMM d, yyyy')}
                      </td>
                      <td className="py-5 hidden lg:table-cell">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2.5 bg-gray-200 rounded-full max-w-[120px]">
                            <div 
                              className="h-2.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all" 
                              style={{ width: `${(event.capacity?.booked / event.capacity?.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 font-medium min-w-[60px]">
                            {event.capacity?.booked}/{event.capacity?.total}
                          </span>
                        </div>
                      </td>
                      <td className="py-5">
                        <Badge 
                          variant={
                            event.status === 'published' ? 'success' :
                            event.status === 'draft' ? 'warning' : 'danger'
                          }
                          className="font-semibold"
                        >
                          {event.status}
                        </Badge>
                      </td>
                      <td className="py-5">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/events/${event._id}`}>
                            <button className="p-2.5 hover:bg-primary-100 rounded-xl transition-colors" aria-label="View">
                              <Eye className="w-4 h-4 text-primary-600" />
                            </button>
                          </Link>
                          <Link to={`/events/${event._id}/edit`}>
                            <button className="p-2.5 hover:bg-blue-100 rounded-xl transition-colors" aria-label="Edit">
                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDeleteEvent(event._id)}
                            className="p-2.5 hover:bg-red-100 rounded-xl transition-colors"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

export default Dashboard;
