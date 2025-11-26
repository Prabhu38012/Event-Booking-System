import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Calendar, Ticket, Search, ArrowRight, Star, MapPin } from 'lucide-react';
import EventCard from '../components/EventCard';
import { EventCardSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

const Home = () => {
  const { data: featuredEvents, isLoading } = useQuery({
    queryKey: ['featured-events'],
    queryFn: async () => {
      const { data } = await axios.get('/api/events?limit=6');
      return data.data;
    }
  });

  const categories = [
    { name: 'Music', icon: '🎵', color: 'bg-pink-100 text-pink-600' },
    { name: 'Sports', icon: '⚽', color: 'bg-green-100 text-green-600' },
    { name: 'Conference', icon: '💼', color: 'bg-blue-100 text-blue-600' },
    { name: 'Workshop', icon: '🎨', color: 'bg-purple-100 text-purple-600' },
    { name: 'Theater', icon: '🎭', color: 'bg-orange-100 text-orange-600' },
    { name: 'Other', icon: '✨', color: 'bg-gray-100 text-gray-600' }
  ];

  const stats = [
    { value: '10K+', label: 'Events' },
    { value: '50K+', label: 'Users' },
    { value: '100+', label: 'Cities' }
  ];

  const features = [
    {
      icon: Calendar,
      title: 'Wide Event Selection',
      description: 'Browse thousands of events across various categories and find your perfect match.'
    },
    {
      icon: Ticket,
      title: 'Easy Booking',
      description: 'Book tickets in seconds with our streamlined checkout process.'
    },
    {
      icon: Star,
      title: 'Real-Time Updates',
      description: 'Get instant notifications about ticket availability and event changes.'
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }} 
          />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Amazing
              <span className="block mt-2 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Events Near You
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-10">
              Book tickets for concerts, conferences, workshops & more. 
              Your next unforgettable experience awaits!
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-2 shadow-2xl max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events, artists, venues..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="relative md:w-48">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <Link to="/events">
                  <Button size="lg" className="w-full md:w-auto whitespace-nowrap">
                    Find Events
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse by Category</h2>
            <p className="text-gray-600">Find events that match your interests</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/events?category=${category.name.toLowerCase()}`}
                className="group p-6 bg-white rounded-xl hover:shadow-lg transition-all duration-300 text-center border border-gray-100"
              >
                <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <p className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
              <p className="text-gray-600">Don&apos;t miss out on these amazing events</p>
            </div>
            <Link 
              to="/events" 
              className="hidden md:flex items-center text-primary-600 hover:text-primary-700 font-medium group"
            >
              View All Events
              <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <EventCardSkeleton key={`skeleton-${i}`} />
              ))
            ) : (
              featuredEvents?.map((event) => (
                <EventCard key={event._id} event={event} />
              ))
            )}
          </div>

          <div className="text-center mt-10 md:hidden">
            <Link to="/events">
              <Button variant="outline" rightIcon={<ArrowRight className="w-5 h-5" />}>
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why Choose EventHub?</h2>
            <p className="text-gray-400">The best platform for discovering and booking events</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6">
                <div className="w-16 h-16 bg-primary-600/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <feature.icon className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Create Your Own Event?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of organizers who trust EventHub to manage their events
          </p>
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
