import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BaggageSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flight, searchParams, selectedSeats, selectedClass } = location.state || {};

  const [baggage, setBaggage] = useState({
    checkedBags: 0,
    carryOns: 0
  });

  if (!flight) {
    return <div className="text-center py-16">Flight information not found</div>;
  }

  const baggageOptions = {
    checkedBags: [
      { quantity: 0, price: 0, label: 'None' },
      { quantity: 1, price: 0, label: '1 Bag (20kg)' },
      { quantity: 2, price: 1500, label: '2 Bags (20kg each)' },
      { quantity: 3, price: 3000, label: '3 Bags (20kg each)' }
    ],
    carryOns: [
      { quantity: 0, price: 0, label: 'None' },
      { quantity: 1, price: 0, label: '1 Carry-on (7kg)' },
      { quantity: 2, price: 500, label: '2 Carry-ons (7kg each)' }
    ]
  };

  const selectedBaggagePrice = 
    baggageOptions.checkedBags[baggage.checkedBags].price +
    baggageOptions.carryOns[baggage.carryOns].price;

  const handleContinue = () => {
    navigate('/payment', {
      state: { flight, searchParams, selectedSeats, selectedClass, baggage }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Add Baggage</h2>
          <p className="text-gray-600 mb-8">
            {flight.airline} • {flight.from} → {flight.to}
          </p>

          <div className="space-y-6">
            {/* Checked Bags */}
            <div className="border-2 border-gray-300 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">✈️ Checked Luggage</h3>
              <div className="space-y-3">
                {baggageOptions.checkedBags.map((option, idx) => (
                  <label key={idx} className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition">
                    <input
                      type="radio"
                      name="checkedBags"
                      value={idx}
                      checked={baggage.checkedBags === idx}
                      onChange={(e) => setBaggage({ ...baggage, checkedBags: parseInt(e.target.value) })}
                      className="mr-4 w-5 h-5"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{option.label}</p>
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {option.price === 0 ? 'Included' : `₹${option.price}`}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            {/* Carry-on */}
            <div className="border-2 border-gray-300 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🎒 Carry-on Baggage</h3>
              <div className="space-y-3">
                {baggageOptions.carryOns.map((option, idx) => (
                  <label key={idx} className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition">
                    <input
                      type="radio"
                      name="carryOns"
                      value={idx}
                      checked={baggage.carryOns === idx}
                      onChange={(e) => setBaggage({ ...baggage, carryOns: parseInt(e.target.value) })}
                      className="mr-4 w-5 h-5"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{option.label}</p>
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {option.price === 0 ? 'Included' : `₹${option.price}`}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-3">
                <p className="text-gray-700 font-semibold">Baggage Total:</p>
                <p className="text-2xl font-bold text-blue-600">₹{selectedBaggagePrice}</p>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaggageSelection;
