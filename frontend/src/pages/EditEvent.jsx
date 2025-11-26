import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ChevronLeft, Save, Trash2, Eye } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/events/${id}`);
      return data.data;
    }
  });

  useEffect(() => {
    if (event) {
      setValue('title', event.title);
      setValue('description', event.description);
      setValue('category', event.category);
      setValue('totalCapacity', event.capacity.total);
      setValue('startDate', format(new Date(event.date.start), "yyyy-MM-dd'T'HH:mm"));
      setValue('endDate', format(new Date(event.date.end), "yyyy-MM-dd'T'HH:mm"));
      setValue('venueName', event.venue.name);
      setValue('venueAddress', event.venue.address);
      setValue('city', event.venue.city);
      setValue('state', event.venue.state || '');
      setValue('country', event.venue.country);
      setValue('pricingType', event.pricing.type);
      setValue('amount', event.pricing.amount);
      setValue('tags', event.tags?.join(', ') || '');
      setValue('status', event.status);
    }
  }, [event, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const eventData = {
        title: data.title,
        description: data.description,
        category: data.category,
        status: data.status,
        date: {
          start: data.startDate,
          end: data.endDate
        },
        venue: {
          name: data.venueName,
          address: data.venueAddress,
          city: data.city,
          state: data.state,
          country: data.country
        },
        pricing: {
          type: data.pricingType,
          amount: data.pricingType === 'paid' ? Number.parseFloat(data.amount) || 0 : 0,
          currency: 'INR'
        },
        capacity: {
          total: Number.parseInt(data.totalCapacity, 10),
          booked: event.capacity.booked
        },
        tags: data.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || []
      };

      await axios.put(`/api/events/${id}`, eventData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success('Event updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!globalThis.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/api/events/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Event deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const categories = [
    { value: 'music', label: 'Music' },
    { value: 'sports', label: 'Sports' },
    { value: 'conference', label: 'Conference' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'theater', label: 'Theater' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
              <div>
                <h1 className="text-xl font-bold">Edit Event</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={event.status === 'published' ? 'success' : event.status === 'draft' ? 'warning' : 'danger'}>
                    {event.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {event.capacity.booked} / {event.capacity.total} booked
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                leftIcon={<Eye className="w-4 h-4" />}
                onClick={() => navigate(`/events/${id}`)}
              >
                View
              </Button>
              <Button 
                variant="danger" 
                size="sm"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="card">
              <h2 className="text-xl font-bold mb-6">Basic Information</h2>
              
              <div className="space-y-4">
                <Input
                  label="Event Title"
                  placeholder="Enter event title"
                  error={errors.title?.message}
                  required
                  {...register('title', { required: 'Title is required' })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={`input-field h-32 resize-none ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Describe your event..."
                    {...register('description', { required: 'Description is required' })}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="input-field" {...register('category')}>
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select className="input-field" {...register('status')}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="card">
              <h2 className="text-xl font-bold mb-6">Date & Time</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Start Date & Time"
                  type="datetime-local"
                  error={errors.startDate?.message}
                  required
                  {...register('startDate', { required: 'Start date is required' })}
                />
                <Input
                  label="End Date & Time"
                  type="datetime-local"
                  error={errors.endDate?.message}
                  required
                  {...register('endDate', { required: 'End date is required' })}
                />
              </div>
            </div>

            {/* Venue */}
            <div className="card">
              <h2 className="text-xl font-bold mb-6">Venue Details</h2>
              
              <div className="space-y-4">
                <Input
                  label="Venue Name"
                  placeholder="e.g., Convention Center"
                  error={errors.venueName?.message}
                  required
                  {...register('venueName', { required: 'Venue name is required' })}
                />

                <Input
                  label="Address"
                  placeholder="Street address"
                  error={errors.venueAddress?.message}
                  required
                  {...register('venueAddress', { required: 'Address is required' })}
                />

                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    placeholder="City"
                    error={errors.city?.message}
                    required
                    {...register('city', { required: 'City is required' })}
                  />
                  <Input
                    label="State"
                    placeholder="State"
                    {...register('state')}
                  />
                  <Input
                    label="Country"
                    placeholder="Country"
                    error={errors.country?.message}
                    required
                    {...register('country', { required: 'Country is required' })}
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="card">
              <h2 className="text-xl font-bold mb-6">Pricing & Capacity</h2>
              
              <div className="space-y-4">
                <div>
                  <Input
                    label="Total Capacity"
                    type="number"
                    placeholder="Number of seats"
                    error={errors.totalCapacity?.message}
                    required
                    {...register('totalCapacity', { 
                      required: 'Capacity is required',
                      min: { value: event.capacity.booked, message: `Cannot be less than ${event.capacity.booked} (current bookings)` }
                    })}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Current bookings: {event.capacity.booked}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                    <select className="input-field" {...register('pricingType')}>
                      <option value="paid">Paid</option>
                      <option value="free">Free</option>
                    </select>
                  </div>
                  <Input
                    label="Ticket Price (₹)"
                    type="number"
                    placeholder="Enter price"
                    {...register('amount')}
                  />
                </div>

                <Input
                  label="Tags (comma separated)"
                  placeholder="music, live, concert"
                  {...register('tags')}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                loading={isSubmitting}
                leftIcon={<Save className="w-5 h-5" />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
