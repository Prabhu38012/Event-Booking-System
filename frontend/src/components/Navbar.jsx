import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Calendar, User, LogOut, Menu, X, Ticket, LayoutDashboard, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, icon: Icon, mobile = false }) => (
    <Link
      to={to}
      onClick={() => setMobileMenuOpen(false)}
      className={`
        flex items-center gap-2 transition-colors
        ${mobile ? 'px-4 py-3 w-full hover:bg-gray-50' : 'px-3 py-2 rounded-lg'}
        ${isActive(to) 
          ? 'text-primary-600 font-semibold' 
          : 'text-gray-700 hover:text-primary-600'
        }
      `}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary-600 p-2 rounded-lg group-hover:bg-primary-700 transition-colors">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">EventHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/events">Events</NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/my-bookings" icon={Ticket}>My Bookings</NavLink>
                
                {(user?.role === 'organizer' || user?.role === 'admin') && (
                  <>
                    <NavLink to="/create-event" icon={PlusCircle}>Create</NavLink>
                    <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                  </>
                )}

                <div className="flex items-center ml-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-3 mr-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-4 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg animate-slide-down">
          <div className="py-2">
            <NavLink to="/events" mobile>Events</NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/my-bookings" icon={Ticket} mobile>My Bookings</NavLink>
                
                {(user?.role === 'organizer' || user?.role === 'admin') && (
                  <>
                    <NavLink to="/create-event" icon={PlusCircle} mobile>Create Event</NavLink>
                    <NavLink to="/dashboard" icon={LayoutDashboard} mobile>Dashboard</NavLink>
                  </>
                )}

                <div className="border-t my-2" />
                
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="px-4 py-3 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
