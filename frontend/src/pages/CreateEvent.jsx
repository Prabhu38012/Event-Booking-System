import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Calendar, MapPin, Users, IndianRupee, Image, Tag, 
  ChevronLeft, ChevronRight, Check, FileText
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const CreateEvent = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm();
  const navigate = useNavigate();

  const totalSteps = 4;
  const watchPricingType = watch('pricingType', 'paid');

  const steps = [
    { number: 1, title: 'Basic Info', icon: FileText },
    { number: 2, title: 'Date & Venue', icon: Calendar },
    { number: 3, title: 'Pricing', icon: IndianRupee },
    { number: 4, title: 'Media', icon: Image }
  ];

  const nextStep = async () => {
    let fields = [];
    if (step === 1) fields = ['title', 'description', 'category'];
    if (step === 2) fields = ['startDate', 'endDate', 'venueName', 'venueAddress', 'city', 'country'];
    if (step === 3) fields = ['totalCapacity', 'pricingType'];
    
    const isValid = await trigger(fields);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const eventData = {
        title: data.title,
        description: data.description,
        category: data.category,
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
          booked: 0
        },
        tags: data.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || []
      };

      await axios.post('/api/events', eventData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success('Event created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'music', label: 'Music', emoji: '🎵' },
    { value: 'sports', label: 'Sports', emoji: '⚽' },
    { value: 'conference', label: 'Conference', emoji: '💼' },
    { value: 'workshop', label: 'Workshop', emoji: '🎨' },
    { value: 'theater', label: 'Theater', emoji: '🎭' },
    { value: 'other', label: 'Other', emoji: '✨' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <h1 className="text-xl font-bold">Create New Event</h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    step > s.number 
                      ? 'bg-green-500 text-white' 
                      : step === s.number 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <s.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`text-sm mt-2 font-medium ${
                    step >= s.number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-1 mx-2 rounded ${
                    step > s.number ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="card animate-fade-in space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
                  <p className="text-gray-600">Tell us about your event</p>
                </div>

                <Input
                  label="Event Title"
                  placeholder="Enter an attractive event title"
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
                    placeholder="Describe your event in detail..."
                    {...register('description', { required: 'Description is required' })}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map(cat => (
                      <label key={cat.value} className="relative cursor-pointer">
                        <input
                          type="radio"
                          value={cat.value}
                          {...register('category', { required: 'Category is required' })}
                          className="peer sr-only"
                        />
                        <div className="p-4 border-2 rounded-xl text-center peer-checked:border-primary-600 peer-checked:bg-primary-50 hover:bg-gray-50 transition-all">
                          <span className="text-2xl">{cat.emoji}</span>
                          <p className="font-medium mt-1">{cat.label}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-2">{errors.category.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Date & Venue */}
            {step === 2 && (
              <div className="card animate-fade-in space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Date & Venue</h2>
                  <p className="text-gray-600">When and where is your event?</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Start Date & Time"
                    type="datetime-local"
                    icon={Calendar}
                    error={errors.startDate?.message}
                    required
                    {...register('startDate', { required: 'Start date is required' })}
                  />
                  <Input
                    label="End Date & Time"
                    type="datetime-local"
                    icon={Calendar}
                    error={errors.endDate?.message}
                    required
                    {...register('endDate', { required: 'End date is required' })}
                  />
                </div>

                <Input
                  label="Venue Name"
                  placeholder="e.g., Convention Center"
                  icon={MapPin}
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
            )}

            {/* Step 3: Pricing */}
            {step === 3 && (
              <div className="card animate-fade-in space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Pricing & Capacity</h2>
                  <p className="text-gray-600">Set your ticket pricing</p>
                </div>

                <Input
                  label="Total Capacity"
                  type="number"
                  placeholder="Number of available seats"
                  icon={Users}
                  error={errors.totalCapacity?.message}
                  required
                  {...register('totalCapacity', { required: 'Capacity is required', min: { value: 1, message: 'Minimum 1' } })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        value="free"
                        {...register('pricingType')}
                        className="peer sr-only"
                      />
                      <div className="p-6 border-2 rounded-xl text-center peer-checked:border-green-500 peer-checked:bg-green-50 hover:bg-gray-50 transition-all">
                        <div className="text-3xl font-bold text-green-600">FREE</div>
                        <p className="text-gray-500 mt-1">No charge for tickets</p>
                      </div>
                    </label>
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        value="paid"
                        defaultChecked
                        {...register('pricingType')}
                        className="peer sr-only"
                      />
                      <div className="p-6 border-2 rounded-xl text-center peer-checked:border-primary-600 peer-checked:bg-primary-50 hover:bg-gray-50 transition-all">
                        <div className="text-3xl font-bold text-primary-600">PAID</div>
                        <p className="text-gray-500 mt-1">Charge for tickets</p>
                      </div>
                    </label>
                  </div>
                </div>

                {watchPricingType === 'paid' && (
                  <Input
                    label="Ticket Price (₹)"
                    type="number"
                    placeholder="Enter price per ticket"
                    icon={IndianRupee}
                    {...register('amount', { min: { value: 0, message: 'Price cannot be negative' } })}
                  />
                )}
              </div>
            )}

            {/* Step 4: Media */}
            {step === 4 && (
              <div className="card animate-fade-in space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Additional Details</h2>
                  <p className="text-gray-600">Add tags and images (optional)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags (comma separated)
                    </div>
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="music, live, concert, weekend"
                    {...register('tags')}
                  />
                  <p className="text-sm text-gray-500 mt-1">Help users find your event</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Image
                  </label>
                  <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag and drop an image here</p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">📝 Review your event</h3>
                  <p className="text-blue-700 text-sm">
                    Make sure all details are correct before publishing. You can edit your event later from the dashboard.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep} leftIcon={<ChevronLeft className="w-5 h-5" />}>
                  Previous
                </Button>
              ) : (
                <div />
              )}

              {step < totalSteps ? (
                <Button type="button" onClick={nextStep} rightIcon={<ChevronRight className="w-5 h-5" />}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" loading={isSubmitting} rightIcon={<Check className="w-5 h-5" />}>
                  Create Event
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
