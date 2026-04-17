// import React from 'react';
// import { Link } from 'react-router-dom';

// const Home = () => {
//   return (
//     <div className="container mx-auto px-4 py-16">
//       <div className="text-center">
//         <h1 className="text-5xl font-bold text-gray-800 mb-4">
//           Welcome to Airline System
//         </h1>
//         <p className="text-xl text-gray-600 mb-8">
//           Book flights, manage bookings, and check-in online
//         </p>
//         <Link
//           to="/flights"
//           className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700"
//         >
//           Search Flights
//         </Link>
//       </div>
      
//       <div className="grid md:grid-cols-3 gap-8 mt-16">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
//           <p className="text-gray-600">Search and book flights in minutes</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
//           <p className="text-gray-600">Get the best deals on flights</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
//           <p className="text-gray-600">We're here to help anytime</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;




import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: 'url(/images/airplane.jpeg)',
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">
            Airline Booking System
          </h1>

          <p className="text-xl text-white mb-8">
            Search flights, book tickets, and manage your journey easily.
          </p>

          <Link
            to="/flights"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Search Flights
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 bg-white bg-opacity-90 p-8 rounded-lg">
          
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-1">Easy Booking</h3>
            <p className="text-sm text-gray-600">
              Book flights quickly with a simple interface.
            </p>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-1">Best Prices</h3>
            <p className="text-sm text-gray-600">
              Compare and get affordable flight deals.
            </p>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-1">24/7 Support</h3>
            <p className="text-sm text-gray-600">
              Assistance available anytime you need.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;