import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = "http://localhost:5000";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user || !user.email) {
        toast.error('Please login first');
        return;
      }

      const res = await axios.get(
        `${BASE_URL}/api/bookings/user/${user.email}`
      );

      setBookings(res.data);

    } catch (err) {
      toast.error('Failed to load bookings');
    }
  };

  // ❌ Cancel booking
  const handleCancel = async (pnr) => {
    try {
      await axios.put(`${BASE_URL}/api/bookings/${pnr}/cancel`);

      toast.success("Booking cancelled");

      // 🔄 Refresh bookings
      fetchBookings();

    } catch (err) {
      toast.error("Cancel failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">

      <h2 className="text-xl font-semibold mb-4">My Bookings</h2>

      {bookings.length === 0 && (
        <p className="text-gray-500">No bookings found</p>
      )}

      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="border p-4 rounded">

            <p className="font-semibold">
              {b.flight?.airline} ({b.flight?.flight_number})
            </p>

            <p className="text-sm text-gray-600">
              {b.flight?.from} → {b.flight?.to}
            </p>

            <p className="text-sm">
              PNR: <span className="font-medium">{b.pnr}</span>
            </p>

            <p className="text-sm">
              Seats: {b.selectedSeats?.join(', ')}
            </p>

            <p className="text-sm">
              Amount: ₹{b.totalAmount}
            </p>

            <p className="text-sm">
              Status: {b.status}
            </p>

            {/* ❌ Cancel Button */}
            {b.status !== "cancelled" && (
              <button
                onClick={() => handleCancel(b.pnr)}
                className="mt-2 bg-red-600 text-white px-3 py-1 rounded"
              >
                Cancel Booking
              </button>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};

export default MyBookings;