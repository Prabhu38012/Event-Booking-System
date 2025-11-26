import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Ticket, Download, Mail, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import Button from '../components/ui/Button';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};

  useEffect(() => {
    if (!booking) {
      navigate('/events');
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const handleShare = async () => {
    const shareText = `I'm attending ${booking.event?.title}! Join me at this event.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: booking.event?.title,
          text: shareText,
          url: `${globalThis.location.origin}/events/${booking.event?._id}`
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full animate-fade-in">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your tickets have been booked successfully</p>
        </div>

        {/* Booking Card */}
        <div className="card mb-6">
          {/* Booking Code Header */}
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl p-6 -mx-6 -mt-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Booking Code</p>
                <p className="text-2xl font-mono font-bold tracking-wider">{booking.bookingCode}</p>
              </div>
              <Ticket className="w-12 h-12 text-white/80" />
            </div>
          </div>

          {/* Event Details */}
          <h3 className="font-bold text-lg mb-4">{booking.event?.title}</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-gray-500">Date & Time</p>
                <p className="font-medium">
                  {booking.event?.date?.start 
                    ? format(new Date(booking.event.date.start), 'EEE, MMM d, yyyy · h:mm a') 
                    : 'N/A'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-gray-500">Venue</p>
                <p className="font-medium">{booking.event?.venue?.name}, {booking.event?.venue?.city}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Ticket className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-gray-500">Tickets</p>
                <p className="font-medium">{booking.numberOfTickets} ticket{booking.numberOfTickets > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t">
            <span className="text-gray-600">Total Paid</span>
            <span className="text-2xl font-bold text-primary-600">₹{booking.totalAmount}</span>
          </div>
        </div>

        {/* Email Notice */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Confirmation Email Sent</p>
            <p className="text-sm text-blue-700">
              We&apos;ve sent your booking details and e-ticket to your email address.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button fullWidth size="lg" leftIcon={<Download className="w-5 h-5" />}>
            Download Ticket
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              fullWidth 
              leftIcon={<Share2 className="w-5 h-5" />}
              onClick={handleShare}
            >
              Share
            </Button>
            <Link to="/my-bookings" className="w-full">
              <Button variant="outline" fullWidth>
                My Bookings
              </Button>
            </Link>
          </div>
        </div>

        {/* Browse More */}
        <div className="text-center mt-8">
          <Link to="/events" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Browse More Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
