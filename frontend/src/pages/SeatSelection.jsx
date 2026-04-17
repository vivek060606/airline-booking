import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SeatSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flight, searchParams } = location.state || {};

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedClass, setSelectedClass] = useState(searchParams?.class || 'economy');

  if (!flight) {
    return <div className="text-center py-16">Flight information not found</div>;
  }

  const rows = 8;
  const seatsPerRow = 6;
  const seats = Array.from({ length: rows * seatsPerRow }, (_, i) => ({
    id: String.fromCharCode(65 + Math.floor(i / seatsPerRow)) + (i % seatsPerRow + 1),
    available: Math.random() > 0.3,
    booked: Math.random() > 0.8
  }));

  const classesConfig = {
    economy: { price: flight.price, color: 'bg-blue-100' },
    business: { price: flight.price * 1.5, color: 'bg-purple-100' },
    'first class': { price: flight.price * 2, color: 'bg-yellow-100' }
  };

  const handleSeatClick = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat.available || seat.booked) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length < (searchParams?.passengers || 1)) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        toast.error(`You can only select ${searchParams?.passengers} seat(s)`);
      }
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length !== (searchParams?.passengers || 1)) {
      toast.error(`Please select ${searchParams?.passengers} seat(s)`);
      return;
    }
    navigate('/baggage', { 
      state: { flight, searchParams, selectedSeats, selectedClass } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Select Your Seats</h2>
          <p className="text-gray-600 mb-8">
            {flight.airline} • {flight.from} → {flight.to} • {flight.departure} - {flight.arrival}
          </p>

          {/* Class Selection */}
          <div className="mb-8">
            <p className="font-semibold text-gray-800 mb-4">Cabin Class</p>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(classesConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedClass(key)}
                  className={`p-4 border-2 rounded-lg transition ${
                    selectedClass === key
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <p className="font-semibold text-gray-800 capitalize">{key}</p>
                  <p className="text-blue-600 font-bold">₹{config.price}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Seat Selection */}
          <div className="mb-8">
            <p className="font-semibold text-gray-800 mb-4">Select Seats (Passengers: {searchParams?.passengers || 1})</p>
            <div className="bg-gray-50 p-8 rounded-lg inline-block">
              <div className="space-y-3">
                {Array.from({ length: rows }).map((_, rowIdx) => (
                  <div key={rowIdx} className="flex gap-2 justify-center">
                    <div className="w-6 text-center font-semibold text-gray-600">
                      {String.fromCharCode(65 + rowIdx)}
                    </div>
                    <div className="flex gap-2">
                      {Array.from({ length: seatsPerRow }).map((_, seatIdx) => {
                        const seatId = String.fromCharCode(65 + rowIdx) + (seatIdx + 1);
                        const seat = seats.find(s => s.id === seatId);
                        const isSelected = selectedSeats.includes(seatId);

                        return (
                          <button
                            key={seatId}
                            onClick={() => handleSeatClick(seatId)}
                            disabled={!seat.available || seat.booked}
                            className={`w-8 h-8 rounded text-xs font-bold transition ${
                              isSelected
                                ? 'bg-green-600 text-white'
                                : seat.booked
                                ? 'bg-red-600 text-white cursor-not-allowed'
                                : 'bg-gray-200 text-gray-800 hover:bg-blue-300'
                            }`}
                          >
                            {seatId}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 flex gap-6 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-600 rounded"></div>
                  <span>Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  <span>Selected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Seats Info */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-8">
            <p className="font-semibold text-gray-800 mb-2">Selected Seats:</p>
            {selectedSeats.length > 0 ? (
              <p className="text-lg text-blue-600 font-bold">{selectedSeats.join(', ')}</p>
            ) : (
              <p className="text-gray-600">No seats selected yet</p>
            )}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={selectedSeats.length !== (searchParams?.passengers || 1)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold disabled:opacity-50"
          >
            Continue to Baggage Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
