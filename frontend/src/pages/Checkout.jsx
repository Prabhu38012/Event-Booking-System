import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { 
  CreditCard, Calendar, MapPin, Ticket, IndianRupee, 
  User, Mail, Phone, Smartphone, QrCode, Wallet,
  ChevronRight, Shield, Clock
} from 'lucide-react';
import { format } from 'date-fns';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// Payment Method Selection Component
const PaymentMethodSelector = ({ selected, onSelect, isFreeEvent }) => {
  if (isFreeEvent) return null;

  const methods = [
    { id: 'razorpay', name: 'UPI / Cards / Wallets', icon: Wallet, description: 'GPay, PhonePe, Paytm, Cards', recommended: true },
    { id: 'stripe', name: 'International Cards', icon: CreditCard, description: 'Visa, Mastercard, Amex' }
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">Select Payment Method</h3>
      {methods.map((method) => (
        <button
          key={method.id}
          type="button"
          onClick={() => onSelect(method.id)}
          className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4
            ${selected === method.id 
              ? 'border-primary-600 bg-primary-50' 
              : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center
            ${selected === method.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            <method.icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{method.name}</span>
              {method.recommended && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{method.description}</p>
          </div>
          <ChevronRight className={`w-5 h-5 ${selected === method.id ? 'text-primary-600' : 'text-gray-400'}`} />
        </button>
      ))}
    </div>
  );
};

PaymentMethodSelector.propTypes = {
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  isFreeEvent: PropTypes.bool
};

// Razorpay Payment Component
const RazorpayPayment = ({ bookingData, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      console.log('Sending payment request:', {
        eventId: bookingData.event._id,
        numberOfTickets: bookingData.numberOfTickets
      });

      // Create order
      const { data } = await api.post('/api/payments/razorpay/create-order', {
        eventId: bookingData.event._id,
        numberOfTickets: bookingData.numberOfTickets
      });

      console.log('Payment response:', data);

      if (data.mockMode) {
        toast.error('Razorpay not configured. Please configure API keys.');
        setLoading(false);
        return;
      }

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: data.key,
          amount: data.order.amount,
          currency: 'INR',
          name: 'EventHub',
          description: `Booking for ${bookingData.event.title}`,
          order_id: data.order.id,
          handler: async (response) => {
            try {
              const verifyResponse = await api.post('/api/payments/razorpay/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                eventId: bookingData.event._id,
                numberOfTickets: bookingData.numberOfTickets,
                attendeeInfo: bookingData.attendeeInfo
              });

              onSuccess(verifyResponse.data.booking);
            } catch (error) {
              onError(error.response?.data?.message || 'Payment verification failed');
            }
          },
          prefill: {
            name: bookingData.attendeeInfo.name,
            email: bookingData.attendeeInfo.email,
            contact: bookingData.attendeeInfo.phone
          },
          theme: {
            color: '#0284c7'
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (error) {
      console.error('Payment error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to initiate payment';
      onError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Button 
      fullWidth 
      size="lg" 
      onClick={handlePayment} 
      loading={loading}
      leftIcon={<Wallet className="w-5 h-5" />}
    >
      Pay ₹{bookingData.totalAmount} with UPI/Cards
    </Button>
  );
};

RazorpayPayment.propTypes = {
  bookingData: PropTypes.object.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired
};

// Stripe Payment Form
const StripePaymentForm = ({ bookingData, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const createIntent = async () => {
      try {
        const { data } = await api.post('/api/payments/stripe/create-intent', {
          eventId: bookingData.event._id,
          numberOfTickets: bookingData.numberOfTickets
        });

        if (data.mockMode) {
          setClientSecret('mock');
        } else {
          setClientSecret(data.clientSecret);
        }
      } catch (error) {
        onError('Failed to initialize payment');
      }
    };

    createIntent();
  }, [bookingData, onError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (clientSecret === 'mock') {
      // Mock payment for development
      try {
        const { data } = await api.post('/api/payments/stripe/confirm', {
          paymentIntentId: 'mock_' + Date.now(),
          eventId: bookingData.event._id,
          numberOfTickets: bookingData.numberOfTickets,
          attendeeInfo: bookingData.attendeeInfo
        });
        onSuccess(data.booking);
      } catch (error) {
        onError(error.response?.data?.message || 'Booking failed');
      }
      setLoading(false);
      return;
    }

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement }
    });

    if (error) {
      onError(error.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        const { data } = await api.post('/api/payments/stripe/confirm', {
          paymentIntentId: paymentIntent.id,
          eventId: bookingData.event._id,
          numberOfTickets: bookingData.numberOfTickets,
          attendeeInfo: bookingData.attendeeInfo
        });
        onSuccess(data.booking);
      } catch (error) {
        onError(error.response?.data?.message || 'Booking failed');
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Card Details</label>
        <div className="p-4 border border-gray-300 rounded-xl bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1f2937',
                  '::placeholder': { color: '#9ca3af' },
                },
                invalid: { color: '#ef4444' },
              },
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Test: 4242 4242 4242 4242 | 12/34 | 123
        </p>
      </div>
      <Button type="submit" fullWidth size="lg" loading={loading}>
        Pay ₹{bookingData.totalAmount}
      </Button>
    </form>
  );
};

StripePaymentForm.propTypes = {
  bookingData: PropTypes.object.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired
};

// Main Checkout Component
const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [attendeeInfo, setAttendeeInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [countdown, setCountdown] = useState(600);

  const { bookingId, event, numberOfTickets } = location.state || {};
  const isFreeEvent = event?.pricing?.type === 'free';

  const handleExpiry = useCallback(async () => {
    if (bookingId && event) {
      try {
        await api.post('/api/bookings/unlock-seats', { bookingId });
      } catch (error) {
        console.error('Failed to unlock seats:', error);
      }
      toast.error('Session expired. Please try again.');
      navigate(`/events/${event._id}`);
    }
  }, [bookingId, event, navigate]);

  useEffect(() => {
    if (!event || !numberOfTickets) {
      navigate('/events');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleExpiry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [event, numberOfTickets, navigate, handleExpiry]);

  const handleSuccess = (booking) => {
    toast.success('Payment successful!');
    navigate('/booking-success', { state: { booking } });
  };

  const handleError = (message) => {
    toast.error(message);
  };

  const handleFreeBooking = async () => {
    try {
      const { data } = await api.post('/api/payments/free-booking', {
        eventId: event._id,
        numberOfTickets,
        attendeeInfo
      });
      handleSuccess(data.booking);
    } catch (error) {
      handleError(error.response?.data?.message || 'Booking failed');
    }
  };

  if (!event) return null;

  const totalAmount = event.pricing.amount * numberOfTickets;
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const bookingData = {
    event,
    numberOfTickets,
    totalAmount,
    attendeeInfo,
    bookingId
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Timer Bar */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2 text-yellow-800">
            <Clock className="w-5 h-5" />
            <span>Complete payment in</span>
            <span className="font-mono font-bold text-lg">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Attendee Info */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Attendee Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={attendeeInfo.name}
                      onChange={(e) => setAttendeeInfo({ ...attendeeInfo, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      value={attendeeInfo.email}
                      onChange={(e) => setAttendeeInfo({ ...attendeeInfo, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="input-field"
                      value={attendeeInfo.phone}
                      onChange={(e) => setAttendeeInfo({ ...attendeeInfo, phone: e.target.value })}
                      placeholder="10 digit mobile number"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Payment</h2>
                
                {isFreeEvent ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Ticket className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Free Event</h3>
                    <p className="text-gray-600 mb-6">No payment required for this event</p>
                    <Button fullWidth size="lg" onClick={handleFreeBooking}>
                      Confirm Booking
                    </Button>
                  </div>
                ) : (
                  <>
                    <PaymentMethodSelector
                      selected={paymentMethod}
                      onSelect={setPaymentMethod}
                      isFreeEvent={isFreeEvent}
                    />

                    <div className="mt-6 pt-6 border-t">
                      {paymentMethod === 'razorpay' && (
                        <RazorpayPayment
                          bookingData={bookingData}
                          onSuccess={handleSuccess}
                          onError={handleError}
                        />
                      )}

                      {paymentMethod === 'stripe' && (
                        <Elements stripe={stripePromise}>
                          <StripePaymentForm
                            bookingData={bookingData}
                            onSuccess={handleSuccess}
                            onError={handleError}
                          />
                        </Elements>
                      )}
                    </div>
                  </>
                )}

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <img
                  src={event.images?.[0]?.url || '/placeholder-event.jpg'}
                  alt={event.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23e5e7eb" width="400" height="200"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="18"%3EEvent Image%3C/text%3E%3C/svg%3E';
                  }}
                />

                <h3 className="font-semibold text-lg mb-3">{event.title}</h3>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(event.date.start), 'EEE, MMM d · h:mm a')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.venue.name}, {event.venue.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4" />
                    <span>{numberOfTickets} ticket{numberOfTickets > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Price × {numberOfTickets}</span>
                    <span>₹{event.pricing.amount} × {numberOfTickets}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Convenience Fee</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary-600">
                      {isFreeEvent ? 'FREE' : `₹${totalAmount}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
