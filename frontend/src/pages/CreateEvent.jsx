import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Calendar, MapPin, Users, IndianRupee, Image, Tag, 
  ChevronLeft, ChevronRight, Check, FileText, Sparkles
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 font-medium group transition-all"
            >
              <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Create New Event
              </h1>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-[73px] z-30 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center max-w-4xl mx-auto">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center w-full">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                    step > s.number 
                      ? 'bg-gradient-to-br from-green-500 to-green-600 text-white scale-110' 
                      : step === s.number 
                        ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white scale-110' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.number ? (
                      <Check className="w-7 h-7" />
                    ) : (
                      <s.icon className="w-7 h-7" />
                    )}
                  </div>
                  <span className={`text-sm mt-3 font-semibold ${
                    step >= s.number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1.5 flex-1 mx-4 rounded-full transition-all duration-300 ${
                    step > s.number ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="card bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl animate-fade-in space-y-6">
                <div className="pb-6 border-b border-gray-200">
                  <h2 className="text-3xl font-bold mb-2 text-gray-900">Basic Information</h2>
                  <p className="text-gray-600 text-lg">Tell us about your event</p>
                </div>

                <Input
                  label="Event Title"
                  placeholder="Enter an attractive event title"
                  error={errors.title?.message}
                  required
                  {...register('title', { required: 'Title is required' })}
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={`input-field h-40 resize-none ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Describe your event in detail..."
                    {...register('description', { required: 'Description is required' })}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map(cat => (
                      <label key={cat.value} className="relative cursor-pointer">
                        <input
                          type="radio"
                          value={cat.value}
                          {...register('category', { required: 'Category is required' })}
                          className="peer sr-only"
                        />
                        <div className="p-5 border-2 border-gray-200 rounded-2xl text-center peer-checked:border-primary-600 peer-checked:bg-primary-50 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md">
                          <span className="text-3xl block mb-2">{cat.emoji}</span>
                          <p className="font-semibold text-gray-900">{cat.label}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-3 font-medium">{errors.category.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Date & Venue */}
            {step === 2 && (
              <div className="card bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl animate-fade-in space-y-6">
                <div className="pb-6 border-b border-gray-200">
                  <h2 className="text-3xl font-bold mb-2 text-gray-900">Date & Venue</h2>
                  <p className="text-gray-600 text-lg">When and where is your event?</p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
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
              <div className="card bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl animate-fade-in space-y-6">
                <div className="pb-6 border-b border-gray-200">
                  <h2 className="text-3xl font-bold mb-2 text-gray-900">Pricing & Capacity</h2>
                  <p className="text-gray-600 text-lg">Set your ticket pricing</p>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-5">
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        value="free"
                        {...register('pricingType')}
                        className="peer sr-only"
                      />
                      <div className="p-8 border-2 border-gray-200 rounded-2xl text-center peer-checked:border-green-500 peer-checked:bg-green-50 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg">
                        <div className="text-4xl font-bold text-green-600 mb-2">FREE</div>
                        <p className="text-gray-600 font-medium">No charge for tickets</p>
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
                      <div className="p-8 border-2 border-gray-200 rounded-2xl text-center peer-checked:border-primary-600 peer-checked:bg-primary-50 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg">
                        <div className="text-4xl font-bold text-primary-600 mb-2">PAID</div>
                        <p className="text-gray-600 font-medium">Charge for tickets</p>
                      </div>
                    </label>
                  </div>
                </div>

                {watchPricingType === 'paid' && (
                  <div className="animate-fade-in">
                    <Input
                      label="Ticket Price (₹)"
                      type="number"
                      placeholder="Enter price per ticket"
                      icon={IndianRupee}
                      {...register('amount', { min: { value: 0, message: 'Price cannot be negative' } })}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Media */}
            {step === 4 && (
              <div className="card bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl animate-fade-in space-y-6">
                <div className="pb-6 border-b border-gray-200">
                  <h2 className="text-3xl font-bold mb-2 text-gray-900">Additional Details</h2>
                  <p className="text-gray-600 text-lg">Add tags and images (optional)</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  <p className="text-sm text-gray-500 mt-2">Help users find your event</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Event Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-primary-500 hover:bg-primary-50/50 transition-all cursor-pointer group">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-colors">
                      <Image className="w-8 h-8 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    </div>
                    <p className="text-gray-700 font-semibold mb-2">Drag and drop an image here</p>
                    <p className="text-sm text-gray-500">or click to browse (JPG, PNG up to 5MB)</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-2xl p-6">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-lg">
                    <Check className="w-5 h-5" />
                    Review your event
                  </h3>
                  <p className="text-blue-700 leading-relaxed">
                    Make sure all details are correct before publishing. You can edit your event later from the dashboard.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 animate-fade-in animation-delay-200">
              {step > 1 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep} 
                  leftIcon={<ChevronLeft className="w-5 h-5" />}
                  className="hover:bg-gray-100"
                  size="lg"
                >
                  Previous
                </Button>
              ) : (
                <div />
              )}

              {step < totalSteps ? (
                <Button 
                  type="button" 
                  onClick={nextStep} 
                  rightIcon={<ChevronRight className="w-5 h-5" />}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  loading={isSubmitting} 
                  rightIcon={<Check className="w-5 h-5" />}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  Create Event
                </Button>
              )}
            </div>
          </form>
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

export default CreateEvent;
