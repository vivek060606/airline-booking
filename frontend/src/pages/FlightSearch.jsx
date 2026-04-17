// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { format } from 'date-fns';
// import toast from 'react-hot-toast';

// const FlightSearch = () => {
//   const [searchParams, setSearchParams] = useState({
//     origin: '',
//     destination: ''
//   });
//   const [flights, setFlights] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const searchFlights = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:5000/api/flights/search', {
//         params: searchParams
//       });
//       setFlights(response.data.flights);
//       if (response.data.flights.length === 0) {
//         toast('No flights found');
//       }
//     } catch (error) {
//       toast.error('Error searching flights');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     searchFlights();
//   }, []);

//   const handleBook = async (flight) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error('Please login to book flights');
//       return;
//     }

//     try {
//       const bookingData = {
//         flightId: flight.id,
//         passengers: [{ firstName: 'John', lastName: 'Doe', seatNumber: '12A' }],
//         totalAmount: flight.price
//       };
      
//       const response = await axios.post('http://localhost:5000/api/bookings', bookingData, {
//         headers: { 'x-auth-token': token }
//       });
      
//       toast.success(`Booking confirmed! Reference: ${response.data.booking.bookingReference}`);
//     } catch (error) {
//       toast.error('Booking failed');
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         <h2 className="text-2xl font-bold mb-4">Search Flights</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <input
//             type="text"
//             placeholder="From (City)"
//             className="border rounded-lg p-2"
//             value={searchParams.origin}
//             onChange={(e) => setSearchParams({...searchParams, origin: e.target.value})}
//           />
//           <input
//             type="text"
//             placeholder="To (City)"
//             className="border rounded-lg p-2"
//             value={searchParams.destination}
//             onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
//           />
//           <button
//             onClick={searchFlights}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//             disabled={loading}
//           >
//             {loading ? 'Searching...' : 'Search'}
//           </button>
//         </div>
//       </div>

//       {flights.length > 0 && (
//         <div className="space-y-4">
//           <h3 className="text-xl font-semibold mb-4">Available Flights ({flights.length})</h3>
//           {flights.map((flight) => (
//             <div key={flight.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <div className="text-lg font-bold">{flight.airline}</div>
//                   <div className="text-sm text-gray-600">{flight.flightNumber}</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-xl font-bold">{format(new Date(flight.departureTime), 'HH:mm')}</div>
//                   <div className="text-sm text-gray-600">{flight.origin.code}</div>
//                 </div>
//                 <div className="flex-1 text-center">
//                   <div className="text-sm text-gray-600">───── {flight.duration} min ─────</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-xl font-bold">{format(new Date(flight.arrivalTime), 'HH:mm')}</div>
//                   <div className="text-sm text-gray-600">{flight.destination.code}</div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-2xl font-bold text-blue-600">${flight.price}</div>
//                   <div className="text-sm text-gray-600">{flight.availableSeats} seats left</div>
//                   <button
//                     onClick={() => handleBook(flight)}
//                     className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
//                   >
//                     Book Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FlightSearch;



// import React, { useState } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const FlightSearch = () => {
//   const [searchParams, setSearchParams] = useState({
//     from: '',
//     to: ''
//   });

//   const [flights, setFlights] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [hasSearched, setHasSearched] = useState(false);

//   // 🔍 Search flights
//   const searchFlights = async () => {
//     setHasSearched(true);
//     setLoading(true);
//     try {
//       const endpoint = searchParams.from || searchParams.to ? '/api/flights/search' : '/api/flights';
//       const res = await axios.get(endpoint, {
//         params: searchParams
//       });

//       setFlights(res.data);

//       if (res.data.length === 0) {
//         toast('No flights found');
//       }
//     } catch (err) {
//       toast.error('Error searching flights');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✈️ Book flight
//   const handleBook = async (flight) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         toast.error('Please login first');
//         return;
//       }

//       const user = JSON.parse(localStorage.getItem('user')) || {};

//       const res = await axios.post(
//         '/api/bookings',
//         {
//           flightId: flight.id,
//           passengerDetails: {
//             firstName: user.firstName || 'Guest',
//             lastName: user.lastName || '',
//             email: user.email || '',
//             phone: user.phone || ''
//           },
//           selectedSeats: ['A1'],
//           travelClass: 'Economy',
//           totalAmount: flight.price
//         },
//         {
//           headers: { 'x-auth-token': token }
//         }
//       );

//       const bookingReference =
//         res.data.booking?.bookingReference ||
//         res.data.pnr ||
//         res.data.id ||
//         'confirmed';

//       toast.success(`Booking confirmed! Reference: ${bookingReference}`);
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.error ||
//         err.response?.data?.message ||
//         err.message ||
//         'Booking failed';
//       console.error('Booking error:', err.response?.data || err);
//       toast.error(errorMessage);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8">

//       {/* Search Box */}
//       <div className="border p-4 rounded mb-6">
//         <h2 className="text-lg font-semibold mb-3">Search Flights</h2>

//         <div className="grid md:grid-cols-3 gap-3">
//           <input
//             placeholder="From"
//             className="border p-2 rounded"
//             value={searchParams.from}
//             onChange={(e) =>
//               setSearchParams({ ...searchParams, from: e.target.value })
//             }
//           />

//           <input
//             placeholder="To"
//             className="border p-2 rounded"
//             value={searchParams.to}
//             onChange={(e) =>
//               setSearchParams({ ...searchParams, to: e.target.value })
//             }
//           />

//           <button
//             onClick={searchFlights}
//             className="bg-blue-600 text-white rounded"
//           >
//             {loading ? 'Searching...' : 'Search'}
//           </button>
//         </div>
//       </div>

//       {/* Flights List */}
//       <div className="space-y-4">
//         {!hasSearched ? (
//           <div className="text-center text-gray-600 py-12 border rounded">
//             Click the search button to view available flights.
//           </div>
//         ) : flights.length === 0 && !loading ? (
//           <div className="text-center text-gray-600 py-12 border rounded">
//             No flights found for that search.
//           </div>
//         ) : (
//           flights.map((flight) => (
//             <div key={flight.id} className="border p-4 rounded">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="font-semibold">
//                     {flight.airline} ({flight.flight_number})
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     {flight.from} → {flight.to}
//                   </p>
//                 </div>

//                 <div className="text-center">
//                   <p>{flight.departure_time}</p>
//                   <p className="text-sm text-gray-500">{flight.duration}</p>
//                   <p>{flight.arrival_time}</p>
//                 </div>

//                 <div className="text-right">
//                   <p className="font-bold text-blue-600">
//                     ₹{flight.price}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {flight.available_seats} seats
//                   </p>

//                   <button
//                     onClick={() => handleBook(flight)}
//                     className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
//                   >
//                     Book
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//     </div>
//   );
// };

// export default FlightSearch;


import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:5000";

const FlightSearch = () => {
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: ""
  });

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Filters
  const [maxPrice, setMaxPrice] = useState("");
  const [minSeats, setMinSeats] = useState("");

  // 🔍 Fetch flights
  const searchFlights = async () => {
    setLoading(true);
    try {
      const endpoint =
        searchParams.from || searchParams.to
          ? "/api/flights/search"
          : "/api/flights";

      const res = await axios.get(`${BASE_URL}${endpoint}`, {
        params: searchParams
      });

      setFlights(res.data);
    } catch (err) {
      toast.error("Error fetching flights");
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Load all flights on page load
  useEffect(() => {
    searchFlights();
  }, []);

  // ⚡ Debounce search (auto search when typing)
  useEffect(() => {
    const delay = setTimeout(() => {
      searchFlights();
    }, 500);

    return () => clearTimeout(delay);
  }, [searchParams]);

  // 🎯 Apply filters
  const filteredFlights = flights.filter((f) => {
    if (maxPrice && f.price > maxPrice) return false;
    if (minSeats && f.available_seats < minSeats) return false;
    return true;
  });

  // ✈️ Book flight
  const handleBook = async (flight) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user")) || {};

      const res = await axios.post(
        `${BASE_URL}/api/bookings`,
        {
          flightId: flight.id,
          passengerDetails: {
            firstName: user.firstName || "Guest",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || ""
          },
          selectedSeats: ["A1"],
          travelClass: "Economy",
          totalAmount: flight.price
        },
        {
          headers: { "x-auth-token": token }
        }
      );

      toast.success("Booking confirmed!");
    } catch (err) {
      toast.error("Booking failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* 🔍 Search Box */}
      <div className="border p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-3">Search Flights</h2>

        <div className="grid md:grid-cols-3 gap-3">
          <input
            placeholder="From"
            className="border p-2 rounded"
            value={searchParams.from}
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                from: e.target.value
              })
            }
          />

          <input
            placeholder="To"
            className="border p-2 rounded"
            value={searchParams.to}
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                to: e.target.value
              })
            }
          />

          <button
            onClick={searchFlights}
            className="bg-blue-600 text-white rounded"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* 🎯 Filters */}
        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <input
            type="number"
            placeholder="Max Price"
            className="border p-2 rounded"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Min Seats"
            className="border p-2 rounded"
            value={minSeats}
            onChange={(e) => setMinSeats(e.target.value)}
          />
        </div>
      </div>

      {/* ✈️ Flights List */}
      <div className="space-y-4">
        {filteredFlights.length === 0 && !loading ? (
          <div className="text-center text-gray-600 py-12 border rounded">
            No flights found.
          </div>
        ) : (
          filteredFlights.map((flight) => (
            <div key={flight.id} className="border p-4 rounded">
              <div className="flex justify-between items-center">

                <div>
                  <p className="font-semibold">
                    {flight.airline} ({flight.flight_number})
                  </p>
                  <p className="text-sm text-gray-600">
                    {flight.from} → {flight.to}
                  </p>
                </div>

                <div className="text-center">
                  <p>{flight.departure_time}</p>
                  <p className="text-sm text-gray-500">
                    {flight.duration}
                  </p>
                  <p>{flight.arrival_time}</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-blue-600">
                    ₹{flight.price}
                  </p>
                  <p className="text-sm text-gray-500">
                    {flight.available_seats} seats
                  </p>

                  <button
                    onClick={() => handleBook(flight)}
                    className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Book
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default FlightSearch;