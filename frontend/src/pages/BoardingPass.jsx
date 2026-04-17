import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG as QRCode } from 'qrcode.react';

const BoardingPass = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

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
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (!booking) return <div className="text-center py-16">Booking not found</div>;

  const boardingTime = new Date(new Date(booking.departureTime || new Date()).getTime() - 60 * 60000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Boarding Pass */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-blue-600">
          {/* Header - Airline Info */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 flex justify-between items-center">
            <div>
              <p className="text-xl font-bold">BOARDING PASS</p>
              <p className="text-xs text-blue-100">Electronic Copy</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-100">FLIGHT</p>
              <p className="text-2xl font-bold">{booking.flightNumber || 'SK101'}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-4">
            {/* Passenger & Seat */}
            <div className="flex justify-between items-start border-b-2 border-dashed border-gray-300 pb-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold">PASSENGER</p>
                <p className="text-2xl font-bold text-gray-800">{booking.passengerName || 'MR. JOHN DOE'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 font-semibold">SEAT</p>
                <p className="text-3xl font-bold text-blue-600">{booking.seatNumber || '12A'}</p>
              </div>
            </div>

            {/* From - To - Boarding Gate */}
            <div className="grid grid-cols-3 gap-4 border-b-2 border-dashed border-gray-300 pb-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold">FROM</p>
                <p className="text-3xl font-bold text-gray-800">{booking.from || 'BOM'}</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">→</div>
                <p className="text-xs text-gray-600">NON-STOP</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 font-semibold">TO</p>
                <p className="text-3xl font-bold text-gray-800">{booking.to || 'DEL'}</p>
              </div>
            </div>

            {/* Flight Details Row 1 */}
            <div className="grid grid-cols-4 gap-4 border-b-2 border-dashed border-gray-300 pb-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold">DATE</p>
                <p className="text-sm font-bold text-gray-800">{booking.date || '15 Apr'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">TIME</p>
                <p className="text-sm font-bold text-gray-800">{booking.departure || '14:30'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">GATE</p>
                <p className="text-sm font-bold text-blue-600">A12</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">BOARDING</p>
                <p className="text-sm font-bold text-gray-800">{boardingTime}</p>
              </div>
            </div>

            {/* Flight Details Row 2 */}
            <div className="grid grid-cols-4 gap-4 border-b-2 border-dashed border-gray-300 pb-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold">CLASS</p>
                <p className="text-sm font-bold text-gray-800 capitalize">{booking.class || 'ECONOMY'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">BOARDING GROUP</p>
                <p className="text-sm font-bold text-blue-600">B</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">AIRLINE</p>
                <p className="text-sm font-bold text-gray-800">{booking.airline || 'SK'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">BOOKING REF</p>
                <p className="text-sm font-bold text-gray-800">SK{Math.random().toString(36).substring(2, 7).toUpperCase()}</p>
              </div>
            </div>

            {/* QR Code and Barcode */}
            <div className="flex justify-between items-end pt-4">
              <div className="text-center">
                <p className="text-xs text-gray-600 font-semibold mb-2">QR CODE</p>
                <div className="bg-white p-2 border-2 border-gray-300 rounded">
                  <QRCode value={booking.seatNumber || '12A'} size={80} />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2 text-center">BARCODE</p>
                <div className="flex flex-col items-center space-y-1">
                  <svg width="120" height="40" viewBox="0 0 120 40">
                    {[...Array(20)].map((_, i) => (
                      <rect key={i} x={i * 6} y="0" width={Math.random() > 0.5 ? 3 : 2} height="40" fill="black" />
                    ))}
                  </svg>
                  <p className="text-xs font-mono text-gray-600">SK0012ABC</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t-2 border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-600 mb-4">
              <div>
                <p className="font-semibold">🚪 ENTRANCE</p>
                <p>Use Main Gate</p>
              </div>
              <div>
                <p className="font-semibold">⏱️ ARRIVE</p>
                <p>2 hours before</p>
              </div>
              <div>
                <p className="font-semibold">📱 MOBILE</p>
                <p>Show on phone</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center border-t pt-3">
              Present this boarding pass and valid government ID at the gate. No physical copy required.
            </p>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <p className="font-semibold text-gray-800 mb-2">✓ Check-in Status</p>
            <p className="text-green-600 font-bold">Checked In</p>
            <p className="text-xs text-gray-600">Seat: {booking.seatNumber}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <p className="font-semibold text-gray-800 mb-2">🧳 Baggage</p>
            <p className="text-gray-800 font-bold">1 x 20kg</p>
            <p className="text-xs text-gray-600">20kg + 7kg carryon</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            🖨️ Print Pass
          </button>
          <button
            className="bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition font-semibold"
          >
            📱 Save to Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardingPass;
