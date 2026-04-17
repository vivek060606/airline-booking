import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold flex items-center gap-2">
            <span className="text-3xl">✈️</span>
            SkyBook
          </Link>
          <div className="flex items-center gap-8">
            <Link to="/flights" className="hover:text-blue-200 transition font-medium">Search Flights</Link>
            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" className="hover:text-blue-200 transition font-medium">My Bookings</Link>
                <Link to="/profile" className="hover:text-blue-200 transition font-medium">Profile</Link>
                <button onClick={handleLogout} className="hover:text-blue-200 transition font-medium">Logout</button>
                <span className="text-sm text-blue-100">({user.firstName})</span>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition font-medium">Login</Link>
                <Link to="/register" className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-800 transition">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;