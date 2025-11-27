import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerUser, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Phone, ArrowRight, Calendar, CheckCircle, Sparkles, Shield, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/events');
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [isAuthenticated, error, navigate, dispatch]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  const benefits = [
    'Discover events tailored to your interests',
    'Book tickets instantly with secure payment',
    'Get real-time updates on your bookings',
    'Access exclusive member-only events'
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Left Side - Enhanced Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-lg text-white relative z-10">
          <div className="mb-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Join 50,000+ users today</span>
          </div>
          
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Start Your Journey
          </h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            Create an account and unlock a world of amazing events.
          </p>
          
          {/* Benefits List */}
          <div className="space-y-4 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-white/90">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-base font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-white/80 text-sm font-medium">Events</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-white/80 text-sm font-medium">Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-white/80 text-sm font-medium">Cities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto relative z-10">
        <div className="w-full max-w-md">
          {/* Logo with enhanced styling */}
          <Link to="/" className="flex items-center gap-3 mb-8 group">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              EventHub
            </span>
          </Link>

          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Create account
            </h1>
            <p className="text-gray-500 text-lg">
              Join us and start exploring events
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-8 mb-6 animate-fade-in animation-delay-200">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                icon={User}
                placeholder="Enter your full name"
                error={errors.name?.message}
                {...register('name', { required: 'Name is required' })}
              />

              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Invalid email address'
                  }
                })}
              />

              <Input
                label="Phone Number"
                type="tel"
                icon={Phone}
                placeholder="Enter your phone number"
                error={errors.phone?.message}
                {...register('phone', {
                  pattern: {
                    value: /^\d{10}$/,
                    message: 'Phone number must be 10 digits'
                  }
                })}
              />

              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />

              <Input
                label="Confirm Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="relative cursor-pointer">
                    <input 
                      type="radio" 
                      value="user" 
                      {...register('role')} 
                      defaultChecked 
                      className="peer sr-only" 
                    />
                    <div className="p-4 border-2 border-gray-200 rounded-xl text-center peer-checked:border-primary-600 peer-checked:bg-primary-50 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                      <User className="w-6 h-6 mx-auto mb-2 text-gray-600 peer-checked:text-primary-600 transition-colors" />
                      <span className="font-semibold text-sm block">Attendee</span>
                      <p className="text-xs text-gray-500 mt-1">Book & attend events</p>
                    </div>
                  </label>
                  <label className="relative cursor-pointer">
                    <input 
                      type="radio" 
                      value="organizer" 
                      {...register('role')} 
                      className="peer sr-only" 
                    />
                    <div className="p-4 border-2 border-gray-200 rounded-xl text-center peer-checked:border-primary-600 peer-checked:bg-primary-50 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                      <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-600 peer-checked:text-primary-600 transition-colors" />
                      <span className="font-semibold text-sm block">Organizer</span>
                      <p className="text-xs text-gray-500 mt-1">Create & manage events</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="terms"
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2 transition-all cursor-pointer" 
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">Privacy Policy</Link>
                </label>
              </div>

              <Button 
                type="submit" 
                fullWidth 
                size="lg"
                loading={loading}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                Create Account
              </Button>
            </form>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-gray-600 animate-fade-in animation-delay-400">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all"
            >
              Sign in
            </Link>
          </p>

          {/* Trust Badges */}
          <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in animation-delay-600">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Secure Registration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span>Instant Setup</span>
              </div>
            </div>
          </div>
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

export default Register;
