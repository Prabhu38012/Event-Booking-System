import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Calendar, User, Menu, X, Ticket, LayoutDashboard, PlusCircle, Settings } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

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

  // Minimal Settings Icon Button Component
  const SettingsIconButton = () => (
    <Link
      to="/settings"
      className="
        relative w-10 h-10 flex items-center justify-center
        bg-white rounded-xl border border-gray-200
        shadow-sm hover:shadow-lg hover:shadow-primary-500/20
        transition-all duration-300 ease-out
        hover:scale-110 hover:border-primary-300
        group
      "
      title="Settings"
    >
      <Settings 
        className="
          w-5 h-5 text-gray-500 
          group-hover:text-primary-600 
          group-hover:rotate-90
          transition-all duration-300
        " 
      />
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-primary-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
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

                {/* User Profile & Settings */}
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  
                  {/* Settings Icon Button */}
                  <SettingsIconButton />
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
                
                {/* Mobile User Section */}
                <div className="px-4 py-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  
                  {/* Mobile Settings Button */}
                  <Link
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-medium"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
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
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
      `}</style>
    </nav>
  );
};

export default Navbar;
