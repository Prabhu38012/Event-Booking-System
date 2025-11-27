import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, X, SlidersHorizontal, Grid, List, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import EventCard from '../components/EventCard';
import { EventCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    priceType: searchParams.get('priceType') || '',
    sortBy: searchParams.get('sortBy') || 'date'
  });

  const { data, isLoading } = useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.city) params.append('city', filters.city);
      const { data } = await axios.get(`/api/events?${params.toString()}`);
      return data.data;
    }
  });

  const categories = [
    { value: 'music', label: 'Music', emoji: '🎵' },
    { value: 'sports', label: 'Sports', emoji: '⚽' },
    { value: 'conference', label: 'Conference', emoji: '💼' },
    { value: 'workshop', label: 'Workshop', emoji: '🎨' },
    { value: 'theater', label: 'Theater', emoji: '🎭' },
    { value: 'other', label: 'Other', emoji: '✨' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', city: '', priceType: '', sortBy: 'date' });
    setSearchParams({});
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'date').length;

  const filteredEvents = data?.filter(event => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!event.title.toLowerCase().includes(searchLower) &&
          !event.description?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (filters.priceType === 'free' && event.pricing.type !== 'free') return false;
    if (filters.priceType === 'paid' && event.pricing.type !== 'paid') return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }} 
          />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Browse All Events</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in animation-delay-200">
            Discover Events
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl animate-fade-in animation-delay-400">
            Find and book tickets to the best events happening near you
          </p>

          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl max-w-4xl border border-white/20 animate-fade-in animation-delay-600">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events, artists, venues..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <input
                type="text"
                placeholder="City"
                className="md:w-56 px-4 py-4 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />
              <Button size="lg" className="whitespace-nowrap bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg">
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 73.3C120 66.7 240 53.3 360 46.7C480 40 600 40 720 43.3C840 46.7 960 53.3 1080 56.7C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => handleFilterChange('category', '')}
              className={`px-5 py-2.5 rounded-xl whitespace-nowrap transition-all font-medium ${
                !filters.category 
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              All Events
            </button>
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => handleFilterChange('category', cat.value)}
                className={`px-5 py-2.5 rounded-xl whitespace-nowrap flex items-center gap-2 transition-all font-medium ${
                  filters.category === cat.value 
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                <span className="text-lg">{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200 sticky top-[73px] z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                className="md:hidden hover:bg-primary-50 hover:border-primary-300"
                leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>

              {/* Desktop Filters */}
              <div className="hidden md:flex items-center gap-3">
                <select
                  className="input-field py-2.5 text-sm min-w-[160px] rounded-xl border-gray-200 hover:border-primary-300 focus:border-primary-500 transition-all"
                  value={filters.priceType}
                  onChange={(e) => handleFilterChange('priceType', e.target.value)}
                >
                  <option value="">All Prices</option>
                  <option value="free">Free Events</option>
                  <option value="paid">Paid Events</option>
                </select>

                <select
                  className="input-field py-2.5 text-sm min-w-[160px] rounded-xl border-gray-200 hover:border-primary-300 focus:border-primary-500 transition-all"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>

                {activeFiltersCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearFilters} 
                    leftIcon={<X className="w-4 h-4" />}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {/* View Toggle & Results Count */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600 hidden sm:block">
                {isLoading ? 'Loading...' : `${filteredEvents?.length || 0} events found`}
              </span>
              <div className="flex bg-gray-100 rounded-xl p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-white shadow-md text-primary-600' : 'hover:bg-gray-200 text-gray-600'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-white shadow-md text-primary-600' : 'hover:bg-gray-200 text-gray-600'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="md:hidden mt-4 p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 shadow-lg space-y-4 animate-slide-down">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                <select
                  className="input-field rounded-xl"
                  value={filters.priceType}
                  onChange={(e) => handleFilterChange('priceType', e.target.value)}
                >
                  <option value="">All Prices</option>
                  <option value="free">Free Events</option>
                  <option value="paid">Paid Events</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                  className="input-field rounded-xl"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" fullWidth onClick={clearFilters} className="rounded-xl">
                  Clear
                </Button>
                <Button fullWidth onClick={() => setShowFilters(false)} className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-700">
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-10 relative z-10">
        {isLoading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        ) : filteredEvents?.length === 0 ? (
          <div className="animate-fade-in">
            <EmptyState
              icon={Calendar}
              title="No events found"
              description="Try adjusting your filters or search terms to find what you're looking for."
              actionLabel="Clear Filters"
              onAction={clearFilters}
            />
          </div>
        ) : (
          <div className={`grid gap-6 animate-fade-in ${
            viewMode === 'grid' 
              ? 'md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {filteredEvents?.map((event, index) => (
              <div 
                key={event._id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <EventCard event={event} />
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
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Events;
