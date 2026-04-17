import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const FlightSearch = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    class: 'economy',
    passengers: 1
  });

  const [filters, setFilters] = useState({
    maxPrice: 10000,
    minPrice: 0
  });

  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const classes = ['Economy', 'Business', 'First Class'];

  const searchFlights = async () => {
    if (!searchParams.from || !searchParams.to || !searchParams.date) {
      toast.error('Please fill in all search fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/flights/search', {
        params: searchParams
      });
      setFlights(response.data.flights || []);
      setFilteredFlights(response.data.flights || []);
      if (!response.data.flights || response.data.flights.length === 0) {
        toast('No flights found for your search');
      }
    } catch (error) {
      toast.error('Error searching flights');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceFilter = (e) => {
    const maxPrice = e.target.value;
    setFilters({ ...filters, maxPrice });
    const filtered = flights.filter(f => f.price <= maxPrice);
    setFilteredFlights(filtered);
  };

  const handleBooking = (flight) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to book flights');
      navigate('/login');
      return;
    }
    navigate(`/booking/${flight.id}`, { state: { flight, searchParams } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Search Flights</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="From (City or Code)"
              value={searchParams.from}
              onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
            />
            <input
              type="text"
              placeholder="To (City or Code)"
              value={searchParams.to}
              onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
            />
            <input
              type="date"
              value={searchParams.date}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
            />
            <select
              value={searchParams.class}
              onChange={(e) => setSearchParams({ ...searchParams, class: e.target.value })}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
            >
              {classes.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <select
              value={searchParams.passengers}
              onChange={(e) => setSearchParams({ ...searchParams, passengers: parseInt(e.target.value) })}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
            >
              {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>

          <button
            onClick={searchFlights}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold disabled:opacity-50"
          >
            {loading ? '🔍 Searching...' : '🔍 Search Flights'}
          </button>
        </div>

        {/* Results */}
        {filteredFlights.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Found {filteredFlights.length} Flight{filteredFlights.length > 1 ? 's' : ''}
              </h3>
              <div className="w-64">
                <label className="block text-gray-700 font-semibold mb-2">Max Price: ₹{filters.maxPrice}</label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={filters.maxPrice}
                  onChange={handlePriceFilter}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredFlights.map((flight) => (
                <div key={flight.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-gray-600 text-sm">Airline</p>
                      <p className="text-xl font-bold text-gray-800">{flight.airline || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{flight.flightNumber || 'N/A'}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{flight.departure || '00:00'}</p>
                      <p className="text-gray-600">{flight.from || 'N/A'}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-gray-600">─── {flight.duration || '0'} min ───</p>
                      <p className="text-sm text-gray-500">{flight.stops || 'Non-stop'}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{flight.arrival || '00:00'}</p>
                      <p className="text-gray-600">{flight.to || 'N/A'}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">₹{flight.price || '0'}</p>
                      <p className="text-sm text-gray-600 mb-3">{flight.availableSeats || '0'} seats</p>
                      <button
                        onClick={() => handleBooking(flight)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold w-full"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {flights.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <p className="text-3xl mb-4">✈️</p>
            <p className="text-gray-600 text-lg">Search for flights to see available options</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearch;
