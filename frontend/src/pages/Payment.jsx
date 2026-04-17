import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flight, searchParams, selectedSeats, selectedClass, baggage } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);

  if (!flight) {
    return <div className="text-center py-16">Flight information not found</div>;
  }

  // Calculate total
  const baggagePrice = 
    (baggage?.checkedBags === 2 ? 1500 : baggage?.checkedBags === 3 ? 3000 : 0) +
    (baggage?.carryOns === 2 ? 500 : 0);

  const farePerPassenger = flight.price;
  const totalFare = farePerPassenger * (searchParams?.passengers || 1);
  const taxes = Math.round(totalFare * 0.05);
  const totalAmount = totalFare + taxes + baggagePrice;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const bookingData = {
        flightId: flight.id,
        passengers: searchParams.passengers,
        selectedSeats,
        class: selectedClass,
        baggage,
        totalAmount,
        paymentMethod,
        paymentDetails: paymentMethod === 'card' ? formData : {}
      };

      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        bookingData,
        { headers: { 'x-auth-token': token } }
      );

      toast.success('Booking confirmed! 🎉');
      navigate(`/booking/${response.data.bookingId}`, {
        state: { bookingData, bookingId: response.data.bookingId }
      });
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Secure Payment</h2>

          {/* Payment Method */}
          <div className="mb-8">
            <p className="font-semibold text-gray-800 mb-4">Payment Method</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'card', label: '💳 Debit/Credit Card', icon: '💳' },
                { id: 'upi', label: '🏦 UPI/Net Banking', icon: '🏦' },
                { id: 'wallet', label: '👛 Digital Wallet', icon: '👛' }
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 border-2 rounded-lg transition ${
                    paymentMethod === method.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <p className="text-2xl mb-2">{method.icon}</p>
                  <p className="text-sm font-semibold text-gray-800">{method.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Card Details (if card selected) */}
          {paymentMethod === 'card' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="cardholderName"
                placeholder="Cardholder Name"
                value={formData.cardholderName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
                required
              />
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number (16 digits)"
                value={formData.cardNumber}
                onChange={handleChange}
                maxLength="16"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  maxLength="5"
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
                  required
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleChange}
                  maxLength="3"
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-semibold disabled:opacity-50"
              >
                {loading ? '⏳ Processing...' : '✓ Complete Payment'}
              </button>
            </form>
          )}

          {/* Other payment methods info */}
          {paymentMethod !== 'card' && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <p className="text-gray-800">
                {paymentMethod === 'upi' && 'You will be redirected to your bank\'s UPI/Net Banking portal'}
                {paymentMethod === 'wallet' && 'You will be redirected to your digital wallet'}
              </p>
              <button
                onClick={() => handleSubmit({ preventDefault: () => {} })}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold"
              >
                Proceed to {paymentMethod === 'upi' ? 'UPI' : 'Wallet'}
              </button>
            </div>
          )}

          <p className="mt-6 text-xs text-gray-600 text-center">
            🔒 Your payment is secure and encrypted. We accept all major payment methods.
          </p>
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-xl shadow-xl p-8 h-fit">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Price Breakdown</h3>

          <div className="space-y-4 pb-4 border-b-2 border-gray-200">
            <div className="flex justify-between">
              <p className="text-gray-700">Base Fare (x{searchParams?.passengers})</p>
              <p className="font-semibold text-gray-800">₹{totalFare}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-700">Taxes & Fees (5%)</p>
              <p className="font-semibold text-gray-800">₹{taxes}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-700">Baggage</p>
              <p className="font-semibold text-gray-800">₹{baggagePrice}</p>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center mb-6">
            <p className="text-lg font-bold text-gray-800">Total Amount:</p>
            <p className="text-2xl font-bold text-blue-600">₹{totalAmount}</p>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-yellow-800 mb-2">💡 Trip Summary</p>
            <p className="text-yellow-900 text-xs leading-relaxed">
              {flight.airline} from {flight.from} to {flight.to} on {searchParams?.date}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
