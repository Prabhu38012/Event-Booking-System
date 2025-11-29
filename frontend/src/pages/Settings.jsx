import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { 
  Settings as SettingsIcon, User, Moon, Sun, Bell, Lock, 
  LogOut, ChevronRight, Shield, Palette, Globe, Smartphone
} from 'lucide-react';
import Button from '../components/ui/Button';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Edit Profile',
          description: 'Update your personal information',
          link: '/profile',
          color: 'bg-blue-500'
        },
        {
          icon: Lock,
          label: 'Change Password',
          description: 'Update your password',
          link: '/change-password',
          color: 'bg-purple-500'
        },
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: darkMode ? Moon : Sun,
          label: 'Theme',
          description: darkMode ? 'Dark mode enabled' : 'Light mode enabled',
          action: () => setDarkMode(!darkMode),
          toggle: true,
          toggleValue: darkMode,
          color: darkMode ? 'bg-indigo-500' : 'bg-yellow-500'
        },
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Manage notification preferences',
          link: '/notifications',
          color: 'bg-red-500'
        },
        {
          icon: Globe,
          label: 'Language',
          description: 'English (US)',
          link: '/language',
          color: 'bg-green-500'
        },
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: Shield,
          label: 'Privacy Settings',
          description: 'Control your privacy preferences',
          link: '/privacy',
          color: 'bg-teal-500'
        },
        {
          icon: Smartphone,
          label: 'Connected Devices',
          description: 'Manage your logged in devices',
          link: '/devices',
          color: 'bg-orange-500'
        },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200 dark:bg-primary-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }} 
          />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <SettingsIcon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Settings</h1>
              <p className="text-white/80 mt-1">Manage your account preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10">
        {/* User Card */}
        <div className="card bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-xl mb-8 animate-fade-in">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full capitalize">
                {user?.role}
              </span>
            </div>
            <Link to="/profile">
              <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {settingsSections.map((section, sectionIndex) => (
            <div key={section.title} className="animate-fade-in" style={{ animationDelay: `${sectionIndex * 100}ms` }}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 px-1">{section.title}</h3>
              <div className="card bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
                {section.items.map((item, index) => (
                  <div key={item.label}>
                    {item.toggle ? (
                      <button
                        onClick={item.action}
                        className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center shadow-md`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-gray-900 dark:text-white">{item.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                        </div>
                        {/* Toggle Switch */}
                        <div className={`w-14 h-8 rounded-full p-1 transition-colors ${item.toggleValue ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                          <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${item.toggleValue ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                      </button>
                    ) : (
                      <Link
                        to={item.link}
                        className="flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center shadow-md`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">{item.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </Link>
                    )}
                    {index < section.items.length - 1 && <div className="border-b border-gray-100 dark:border-gray-700 mx-5" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Section */}
        <div className="mt-10 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="card bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-red-200 dark:border-red-900 shadow-xl">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-xl"
            >
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-md">
                <LogOut className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-red-600 dark:text-red-400">Logout</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sign out of your account</p>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>

        {/* App Version */}
        <div className="text-center mt-10 text-gray-500 dark:text-gray-400 text-sm">
          <p>EventHub v1.0.0</p>
          <p className="mt-1">© 2024 EventHub. All rights reserved.</p>
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

export default Settings;
