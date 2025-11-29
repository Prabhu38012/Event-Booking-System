import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  User, Mail, Phone, Camera, Save, ArrowLeft, Shield, Calendar, MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axios.put('/api/users/profile', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/settings" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Settings
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your personal information</p>
        </div>

        <div className="max-w-2xl">
          {/* Profile Card */}
          <div className="card bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl animate-fade-in">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 pb-8 border-b border-gray-200 mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500 capitalize flex items-center gap-2 mt-1">
                  <Shield className="w-4 h-4" />
                  {user?.role}
                </p>
                <p className="text-gray-500 flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  Member since {new Date().getFullYear()}
                </p>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                disabled
                {...register('email')}
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

              <div className="pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  size="lg"
                  loading={isSubmitting}
                  leftIcon={<Save className="w-5 h-5" />}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Profile;
