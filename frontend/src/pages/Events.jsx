import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, X, SlidersHorizontal, Grid, List, Calendar } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Discover Events
          </h1>
          <p className="text-xl text-white/80 mb-8 animate-slide-up">
            Find and book tickets to the best events happening near you
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-2 shadow-xl max-w-4xl animate-slide-up">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events, artists, venues..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <input
                type="text"
                placeholder="City"
                className="md:w-48 px-4 py-3.5 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />
              <Button size="lg" className="whitespace-nowrap">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => handleFilterChange('category', '')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                !filters.category 
                  ? 'bg-primary-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Events
            </button>
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => handleFilterChange('category', cat.value)}
                className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 transition-all ${
                  filters.category === cat.value 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>

              {/* Desktop Filters */}
              <div className="hidden md:flex items-center gap-3">
                <select
                  className="input-field py-2 text-sm min-w-[140px]"
                  value={filters.priceType}
                  onChange={(e) => handleFilterChange('priceType', e.target.value)}
                >
                  <option value="">All Prices</option>
                  <option value="free">Free Events</option>
                  <option value="paid">Paid Events</option>
                </select>

                <select
                  className="input-field py-2 text-sm min-w-[140px]"
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
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {/* View Toggle & Results Count */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:block">
                {isLoading ? 'Loading...' : `${filteredEvents?.length || 0} events`}
              </span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
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
            <div className="md:hidden mt-4 p-4 bg-gray-50 rounded-xl space-y-4 animate-slide-down">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <select
                  className="input-field"
                  value={filters.priceType}
                  onChange={(e) => handleFilterChange('priceType', e.target.value)}
                >
                  <option value="">All Prices</option>
                  <option value="free">Free Events</option>
                  <option value="paid">Paid Events</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  className="input-field"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="secondary" fullWidth onClick={clearFilters}>
                  Clear
                </Button>
                <Button fullWidth onClick={() => setShowFilters(false)}>
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
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
          <EmptyState
            icon={Calendar}
            title="No events found"
            description="Try adjusting your filters or search terms to find what you're looking for."
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        ) : (
          <div className={`grid gap-6 animate-fade-in ${
            viewMode === 'grid' 
              ? 'md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {filteredEvents?.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
