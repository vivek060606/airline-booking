import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG as QRCode } from 'qrcode.react';

const ETicket = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* E-Ticket Card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 text-center">
            <p className="text-sm font-semibold mb-2">✓ BOOKING CONFIRMED</p>
            <p className="text-3xl font-bold">E-TICKET</p>
            <p className="text-blue-100 mt-2">Your ticket is ready to use</p>
          </div>

          {/* Ticket Content */}
          <div className="p-8 space-y-6">
            {/* Booking Reference */}
            <div className="border-b-2 border-dashed border-gray-300 pb-6">
              <p className="text-gray-600 text-sm mb-2">BOOKING REFERENCE</p>
              <p className="text-3xl font-bold text-blue-600 font-mono">
                {booking.bookingReference || 'BK' + bookingId.substring(0, 8).toUpperCase()}
              </p>
            </div>

            {/* Flight Info */}
            <div>
              <p className="text-gray-600 text-sm mb-3">FLIGHT DETAILS</p>
              <div className="flex justify-between items-center py-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-800">{booking.departure}</p>
                  <p className="text-gray-600 font-semibold">{booking.from}</p>
                  <p className="text-xs text-gray-500 mt-1">Departure</p>
                </div>
                <div className="flex-1 text-center px-4">
                  <p className="text-gray-500 text-sm mb-2">{booking.duration || '2h 30m'}</p>
                  <div className="border-t-2 border-gray-400 pt-2">
                    <p className="text-xs text-gray-600">Non-stop</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-800">{booking.arrival}</p>
                  <p className="text-gray-600 font-semibold">{booking.to}</p>
                  <p className="text-xs text-gray-500 mt-1">Arrival</p>
                </div>
              </div>
            </div>

            {/* Passenger & Seat Info */}
            <div className="grid grid-cols-2 gap-4 border-t-2 border-b-2 border-dashed border-gray-300 py-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">PASSENGER NAME</p>
                <p className="font-semibold text-gray-800">{booking.passengerName || 'Mr. John Doe'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">SEAT NUMBER</p>
                <p className="font-semibold text-gray-800 text-lg">{booking.seatNumber || '12A'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">AIRLINE</p>
                <p className="font-semibold text-gray-800">{booking.airline || 'SkyAir'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">FLIGHT NUMBER</p>
                <p className="font-semibold text-gray-800">{booking.flightNumber || 'SK101'}</p>
              </div>
            </div>

            {/* Baggage & Class */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">CABIN CLASS</p>
                <p className="font-semibold text-gray-800 capitalize">{booking.class || 'Economy'}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">BAGGAGE ALLOWANCE</p>
                <p className="font-semibold text-gray-800">20 kg + 7 kg</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center border-t-2 border-dashed border-gray-300 pt-6">
              <p className="text-gray-600 text-sm mb-4">SCAN TO CHECK-IN</p>
              <div className="flex justify-center">
                <div className="bg-white p-4 border-2 border-gray-300 rounded-lg">
                  <QRCode
                    value={booking.bookingReference || 'BK' + bookingId}
                    size={150}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <p className="font-semibold text-yellow-900 mb-2">📌 Important</p>
              <ul className="text-sm text-yellow-900 space-y-1">
                <li>✓ Arrive 2 hours before departure</li>
                <li>✓ Carry valid government ID</li>
                <li>✓ Check baggage restrictions</li>
                <li>✓ Online check-in available 24 hours before flight</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => window.print()}
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                🖨️ Print Ticket
              </button>
              <button
                className="bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition font-semibold"
              >
                📧 Email Ticket
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center border-t-2 border-gray-200">
            <p className="text-xs text-gray-600">
              This is your electronic ticket. No physical ticket required. Valid government ID must be presented at check-in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETicket;
