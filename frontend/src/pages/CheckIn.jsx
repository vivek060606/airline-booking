import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const CheckIn = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkInData, setCheckInData] = useState({
    mealPreference: 'vegetarian',
    seatPreference: 'window',
    specialRequests: ''
  });
  const [checkInComplete, setCheckInComplete] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/bookings/${bookingId}`,
        { headers: { 'x-auth-token': token } }
      );
      setBooking(response.data.booking);
    } catch (error) {
      toast.error('Error fetching booking');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/bookings/${bookingId}/checkin`,
        checkInData,
        { headers: { 'x-auth-token': token } }
      );
      toast.success('Check-in successful! Your boarding pass is ready.');
      setCheckInComplete(true);
      setTimeout(() => {
        navigate(`/boarding-pass/${bookingId}`);
      }, 2000);
    } catch (error) {
      toast.error('Check-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (!booking) return <div className="text-center py-16">Booking not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <p className="text-5xl mb-4">{checkInComplete ? '✓' : '✈️'}</p>
            <h2 className="text-3xl font-bold text-gray-800">
              {checkInComplete ? 'Check-in Complete!' : 'Online Check-in'}
            </h2>
            <p className="text-gray-600 mt-2">
              {booking.airline} Flight {booking.flightNumber}
            </p>
          </div>

          {!checkInComplete ? (
            <form onSubmit={handleCheckIn} className="space-y-6">
              {/* Flight Info Summary */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-gray-600 text-sm">From</p>
                    <p className="font-bold text-lg text-gray-800">{booking.from}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">To</p>
                    <p className="font-bold text-lg text-gray-800">{booking.to}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Seat</p>
                    <p className="font-bold text-lg text-blue-600">{booking.seatNumber}</p>
                  </div>
                </div>
              </div>

              {/* Meal Preference */}
              <div>
                <label className="block text-gray-800 font-semibold mb-3">🍽️ Meal Preference</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
                    { value: 'nonvegetarian', label: 'Non-Veg', icon: '🍗' },
                    { value: 'vegan', label: 'Vegan', icon: '🥕' }
                  ].map(option => (
                    <label key={option.value} className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      checkInData.mealPreference === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}>
                      <input
                        type="radio"
                        name="mealPreference"
                        value={option.value}
                        checked={checkInData.mealPreference === option.value}
                        onChange={(e) => setCheckInData({ ...checkInData, mealPreference: e.target.value })}
                        className="mr-2"
                      />
                      <span className="text-sm font-semibold">{option.icon} {option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Seat Preference */}
              <div>
                <label className="block text-gray-800 font-semibold mb-3">💺 Seat Preference</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'window', label: 'Window', icon: '🪟' },
                    { value: 'middle', label: 'Middle', icon: '◯' },
                    { value: 'aisle', label: 'Aisle', icon: '→' }
                  ].map(option => (
                    <label key={option.value} className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      checkInData.seatPreference === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}>
                      <input
                        type="radio"
                        name="seatPreference"
                        value={option.value}
                        checked={checkInData.seatPreference === option.value}
                        onChange={(e) => setCheckInData({ ...checkInData, seatPreference: e.target.value })}
                        className="mr-2"
                      />
                      <span className="text-sm font-semibold">{option.icon} {option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">📝 Special Requests</label>
                <textarea
                  value={checkInData.specialRequests}
                  onChange={(e) => setCheckInData({ ...checkInData, specialRequests: e.target.value })}
                  placeholder="e.g., Wheelchair assistance, Extra legroom needed..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
                  rows="3"
                />
              </div>

              {/* Check-in Info */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="font-semibold text-green-900 mb-2">✓ Web Check-in Enabled</p>
                <p className="text-sm text-green-800">
                  Check-in is now open! You can check-in up to 24 hours before departure.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-semibold disabled:opacity-50"
              >
                {loading ? '⏳ Processing Check-in...' : '✓ Complete Check-in'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="text-6xl text-green-600">✓</div>
              <p className="text-xl font-semibold text-gray-800">You're all set!</p>
              <p className="text-gray-600">Your boarding pass is being prepared...</p>
              <button
                onClick={() => navigate(`/boarding-pass/${bookingId}`)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                View Boarding Pass
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
