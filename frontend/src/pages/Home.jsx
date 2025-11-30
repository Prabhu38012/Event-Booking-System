import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Calendar, 
  Ticket, 
  Search, 
  ArrowRight, 
  Star, 
  MapPin, 
  Sparkles, 
  TrendingUp, 
  Users,
  Music,
  Trophy,
  Briefcase,
  Palette,
  Theater,
  MoreHorizontal
} from 'lucide-react';
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
    { name: 'Music', icon: Music, color: 'bg-pink-100 text-pink-600', hoverColor: 'hover:bg-pink-200', iconBg: 'bg-pink-500' },
    { name: 'Sports', icon: Trophy, color: 'bg-green-100 text-green-600', hoverColor: 'hover:bg-green-200', iconBg: 'bg-green-500' },
    { name: 'Conference', icon: Briefcase, color: 'bg-blue-100 text-blue-600', hoverColor: 'hover:bg-blue-200', iconBg: 'bg-blue-500' },
    { name: 'Workshop', icon: Palette, color: 'bg-purple-100 text-purple-600', hoverColor: 'hover:bg-purple-200', iconBg: 'bg-purple-500' },
    { name: 'Theater', icon: Theater, color: 'bg-orange-100 text-orange-600', hoverColor: 'hover:bg-orange-200', iconBg: 'bg-orange-500' },
    { name: 'Other', icon: MoreHorizontal, color: 'bg-gray-100 text-gray-600', hoverColor: 'hover:bg-gray-200', iconBg: 'bg-gray-500' }
  ];

  const stats = [
    { value: '10K+', label: 'Events', icon: Calendar },
    { value: '50K+', label: 'Users', icon: Users },
    { value: '100+', label: 'Cities', icon: MapPin }
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
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }} 
          />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Your Gateway to Unforgettable Experiences</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in animation-delay-200">
              Discover Amazing
              <span className="block mt-2 bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Events Near You
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto animate-fade-in animation-delay-400">
              Book tickets for concerts, conferences, workshops & more. 
              Your next unforgettable experience awaits!
            </p>

            {/* Search Bar */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl max-w-3xl mx-auto border border-white/20 animate-fade-in animation-delay-600">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events, artists, venues..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>
                <div className="relative md:w-56">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>
                <Link to="/events">
                  <Button size="lg" className="w-full md:w-auto whitespace-nowrap bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl">
                    Find Events
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-16 animate-fade-in animation-delay-800">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center group cursor-pointer">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-white/80 group-hover:text-white transition-colors" />
                    <p className="text-4xl font-bold mb-1">{stat.value}</p>
                    <p className="text-white/70 text-sm font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-4">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">Popular Categories</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-gray-600 text-lg">Find events that match your interests</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/events?category=${category.name.toLowerCase()}`}
                className="group p-6 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 text-center border border-gray-100 hover:border-primary-200 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 ${category.color} ${category.hoverColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                  <category.icon className="w-8 h-8" />
                </div>
                <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-primary-50/30 to-white pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-12">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-4">
                <Star className="w-4 h-4" />
                <span className="text-sm font-semibold">Featured</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
              <p className="text-gray-600 text-lg">Don&apos;t miss out on these amazing events</p>
            </div>
            <Link 
              to="/events" 
              className="hidden md:flex items-center text-primary-600 hover:text-primary-700 font-semibold group transition-all"
            >
              View All Events
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <EventCardSkeleton key={`skeleton-${i}`} />
              ))
            ) : (
              featuredEvents?.map((event, index) => (
                <div 
                  key={event._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <EventCard event={event} />
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link to="/events">
              <Button variant="outline" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Why Choose EventHub?</h2>
            <p className="text-gray-400 text-lg">The best platform for discovering and booking events</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }} 
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Get Started Today</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Your Own Event?
            </h2>
            <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of organizers who trust EventHub to manage their events
            </p>
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-white text-primary-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

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

export default Home;
