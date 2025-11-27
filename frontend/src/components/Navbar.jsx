import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Calendar, User, LogOut, Menu, X, Ticket, LayoutDashboard, PlusCircle, ChevronDown, Bell, Search } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, icon: Icon, mobile = false }) => (
    <Link
      to={to}
      onClick={() => setMobileMenuOpen(false)}
      className={`
        flex items-center gap-2 transition-all duration-200 font-medium
        ${mobile 
          ? 'px-4 py-3 w-full hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent' 
          : 'px-4 py-2 rounded-xl relative group'
        }
        ${isActive(to) 
          ? mobile 
            ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600' 
            : 'text-primary-600' 
          : 'text-gray-700 hover:text-primary-600'
        }
      `}
    >
      {Icon && <Icon className={`${mobile ? 'w-5 h-5' : 'w-4 h-4'}`} />}
      <span>{children}</span>
      {!mobile && isActive(to) && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full"></div>
      )}
      {!mobile && !isActive(to) && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform"></div>
      )}
    </Link>
  );

  return (
    <nav className="bg-white/95 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2.5 rounded-xl group-hover:shadow-lg group-hover:scale-105 transition-all duration-200 shadow-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              EventHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/events">Browse Events</NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/my-bookings" icon={Ticket}>My Bookings</NavLink>
                
                {(user?.role === 'organizer' || user?.role === 'admin') && (
                  <>
                    <NavLink to="/create-event" icon={PlusCircle}>Create</NavLink>
                    <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                  </>
                )}

                {/* Desktop Profile Dropdown */}
                <div className="relative ml-4 pl-4 border-l border-gray-200">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">My Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium">Settings</span>
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-4 py-2 rounded-xl font-medium transition-all hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2.5 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg font-medium transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-xl animate-slide-down">
          <div className="py-2">
            <NavLink to="/events" mobile>Browse Events</NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/my-bookings" icon={Ticket} mobile>My Bookings</NavLink>
                
                {(user?.role === 'organizer' || user?.role === 'admin') && (
                  <>
                    <NavLink to="/create-event" icon={PlusCircle} mobile>Create Event</NavLink>
                    <NavLink to="/dashboard" icon={LayoutDashboard} mobile>Dashboard</NavLink>
                  </>
                )}

                <div className="border-t border-gray-200 my-3" />
                
                {/* Mobile Profile Section */}
                <div className="px-4 py-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl mx-3 mb-3 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white text-gray-700 hover:text-primary-600 transition-colors text-sm font-medium"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white text-gray-700 hover:text-primary-600 transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </Link>
                  </div>
                </div>

                <div className="px-4 pb-3">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-semibold"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="px-4 py-3 space-y-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg font-semibold transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
