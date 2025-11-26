import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerUser, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Phone, ArrowRight, Calendar, CheckCircle } from 'lucide-react';
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
    <div className="min-h-screen flex">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 to-purple-700 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">Start Your Journey</h2>
          <p className="text-xl text-white/80 mb-8">
            Create an account and unlock a world of amazing events.
          </p>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-lg">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">EventHub</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
          <p className="text-gray-600 mb-8">Join us and start exploring events</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              placeholder="Enter your email"
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
              placeholder="Create a password"
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
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative">
                  <input 
                    type="radio" 
                    value="user" 
                    {...register('role')} 
                    defaultChecked 
                    className="peer sr-only" 
                  />
                  <div className="p-4 border-2 rounded-xl cursor-pointer text-center peer-checked:border-primary-600 peer-checked:bg-primary-50 hover:bg-gray-50 transition-all">
                    <User className="w-6 h-6 mx-auto mb-2 text-gray-600 peer-checked:text-primary-600" />
                    <span className="font-medium">Attendee</span>
                    <p className="text-xs text-gray-500 mt-1">Book & attend events</p>
                  </div>
                </label>
                <label className="relative">
                  <input 
                    type="radio" 
                    value="organizer" 
                    {...register('role')} 
                    className="peer sr-only" 
                  />
                  <div className="p-4 border-2 rounded-xl cursor-pointer text-center peer-checked:border-primary-600 peer-checked:bg-primary-50 hover:bg-gray-50 transition-all">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-600 peer-checked:text-primary-600" />
                    <span className="font-medium">Organizer</span>
                    <p className="text-xs text-gray-500 mt-1">Create & manage events</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                id="terms"
                className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              size="lg"
              loading={loading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
