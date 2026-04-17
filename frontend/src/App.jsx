// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import Navbar from './components/Navbar.jsx';
// import Home from './pages/Home.jsx';
// import Login from './pages/Login.jsx';
// import Register from './pages/Register.jsx';
// import FlightSearch from './pages/FlightSearch.jsx';
// import MyBookings from './pages/MyBookings.jsx';
// import BookingDetail from './pages/BookingDetail.jsx';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('token'));

//   return (
//     <BrowserRouter>
//     <Router>
//       <div className="min-h-screen bg-gray-50">
//         <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
//         <Toaster position="top-right" />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
//           <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
//           <Route path="/flights" element={<FlightSearch />} />
//           <Route path="/my-bookings" element={isAuthenticated ? <MyBookings /> : <Navigate to="/login" />} />
//           <Route path="/booking/:bookingId" element={isAuthenticated ? <BookingDetail /> : <Navigate to="/login" />} />
//         </Routes>
//       </div>
//     </Router>
//     </BrowserRouter>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import FlightSearch from './pages/FlightSearch.jsx';
import SeatSelection from './pages/SeatSelection.jsx';
import BaggageSelection from './pages/BaggageSelection.jsx';
import Payment from './pages/Payment.jsx';
import MyBookings from './pages/MyBookings.jsx';
import BookingDetail from './pages/BookingDetail.jsx';
import Profile from './pages/Profile.jsx';
import ETicket from './pages/ETicket.jsx';
import CheckIn from './pages/CheckIn.jsx';
import BoardingPass from './pages/BoardingPass.jsx';


function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('token'));

  return (
    <BrowserRouter>   {/* ✅ ONLY ONE ROUTER */}
      <div className="min-h-screen bg-gray-50">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Toaster position="top-right" />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/flights" element={<FlightSearch />} />
          <Route path="/booking/:flightId" element={isAuthenticated ? <SeatSelection /> : <Navigate to="/login" />} />
          <Route path="/baggage" element={isAuthenticated ? <BaggageSelection /> : <Navigate to="/login" />} />
          <Route path="/payment" element={isAuthenticated ? <Payment /> : <Navigate to="/login" />} />
          <Route path="/booking-detail/:bookingId" element={isAuthenticated ? <BookingDetail /> : <Navigate to="/login" />} />
          <Route path="/eticket/:bookingId" element={isAuthenticated ? <ETicket /> : <Navigate to="/login" />} />
          <Route path="/checkin/:bookingId" element={isAuthenticated ? <CheckIn /> : <Navigate to="/login" />} />
          <Route path="/boarding-pass/:bookingId" element={isAuthenticated ? <BoardingPass /> : <Navigate to="/login" />} />
          <Route path="/my-bookings" element={isAuthenticated ? <MyBookings /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;