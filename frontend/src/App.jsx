import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Layout from './components/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import MyBookings from './pages/MyBookings';
import Checkout from './pages/Checkout';
import BookingSuccess from './pages/BookingSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import { loadUser } from './store/slices/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Routes>
      {/* Auth pages without layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Main pages with layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetail />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="booking-success" element={<BookingSuccess />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="events/:id/edit" element={<EditEvent />} />
          <Route path="my-bookings" element={<MyBookings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
