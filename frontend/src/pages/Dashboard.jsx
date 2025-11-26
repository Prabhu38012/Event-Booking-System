import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Calendar, Users, Ticket, TrendingUp, Edit, Trash2, 
  Plus, Eye, MoreVertical, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
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

  const statCards = [
    { 
      label: 'Total Users', 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      change: '+12%',
      isPositive: true
    },
    { 
      label: 'Total Events', 
      value: stats?.totalEvents || 0, 
      icon: Calendar, 
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      change: '+8%',
      isPositive: true
    },
    { 
      label: 'Total Bookings', 
      value: stats?.totalBookings || 0, 
      icon: Ticket, 
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      change: '+23%',
      isPositive: true
    },
    { 
      label: 'Revenue', 
      value: `₹${stats?.totalRevenue || 0}`, 
      icon: TrendingUp, 
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      change: '+18%',
      isPositive: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-white/80">Here&apos;s what&apos;s happening with your events</p>
            </div>
            <Link to="/create-event" className="animate-slide-up">
              <Button 
                className="bg-white text-primary-600 hover:bg-gray-100"
                leftIcon={<Plus className="w-5 h-5" />}
              >
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Admin Stats */}
        {user?.role === 'admin' && !statsLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
            {statCards.map((stat) => (
              <div key={stat.label} className="card hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions for Organizers */}
        {user?.role === 'organizer' && (
          <div className="grid md:grid-cols-3 gap-6 mb-8 animate-fade-in">
            <Link to="/create-event" className="card hover:shadow-lg transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <Plus className="w-7 h-7 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Create Event</h3>
                  <p className="text-sm text-gray-500">Start a new event</p>
                </div>
              </div>
            </Link>
            <Link to="/my-bookings" className="card hover:shadow-lg transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Ticket className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">View Bookings</h3>
                  <p className="text-sm text-gray-500">Manage ticket sales</p>
                </div>
              </div>
            </Link>
            <Link to="/events" className="card hover:shadow-lg transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Eye className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Browse Events</h3>
                  <p className="text-sm text-gray-500">Explore all events</p>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* My Events */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Events</h2>
            <Link to="/create-event">
              <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-4 font-medium text-gray-500">Event</th>
                    <th className="pb-4 font-medium text-gray-500 hidden md:table-cell">Date</th>
                    <th className="pb-4 font-medium text-gray-500 hidden lg:table-cell">Capacity</th>
                    <th className="pb-4 font-medium text-gray-500">Status</th>
                    <th className="pb-4 font-medium text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {myEvents?.slice(0, 10).map((event) => (
                    <tr key={event._id} className="group hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={event.images?.[0]?.url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100'} 
                            alt={event.title}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                          <div>
                            <Link 
                              to={`/events/${event._id}`}
                              className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-1"
                            >
                              {event.title}
                            </Link>
                            <p className="text-sm text-gray-500">{event.venue?.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600 hidden md:table-cell">
                        {format(new Date(event.date?.start), 'MMM d, yyyy')}
                      </td>
                      <td className="py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[100px]">
                            <div 
                              className="h-2 bg-primary-600 rounded-full" 
                              style={{ width: `${(event.capacity?.booked / event.capacity?.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {event.capacity?.booked}/{event.capacity?.total}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge 
                          variant={
                            event.status === 'published' ? 'success' :
                            event.status === 'draft' ? 'warning' : 'danger'
                          }
                        >
                          {event.status}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/events/${event._id}`}>
                            <button className="p-2 hover:bg-gray-200 rounded-lg" aria-label="View">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                          </Link>
                          <Link to={`/events/${event._id}/edit`}>
                            <button className="p-2 hover:bg-gray-200 rounded-lg" aria-label="Edit">
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDeleteEvent(event._id)}
                            className="p-2 hover:bg-red-100 rounded-lg"
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
    </div>
  );
};

export default Dashboard;
