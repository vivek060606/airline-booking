const express = require('express');
const router = express.Router();

const flights = [
  {
    id: 1,
    flightNumber: "AI101",
    airline: "Air India",
    origin: { code: "DEL", city: "New Delhi" },
    destination: { code: "BOM", city: "Mumbai" },
    departureTime: new Date(Date.now() + 86400000).toISOString(),
    arrivalTime: new Date(Date.now() + 86400000 + 7200000).toISOString(),
    duration: 120,
    price: 149,
    availableSeats: 45,
    class: "Economy"
  },
  {
    id: 2,
    flightNumber: "SG202",
    airline: "SpiceJet",
    origin: { code: "BOM", city: "Mumbai" },
    destination: { code: "BLR", city: "Bangalore" },
    departureTime: new Date(Date.now() + 172800000).toISOString(),
    arrivalTime: new Date(Date.now() + 172800000 + 5400000).toISOString(),
    duration: 90,
    price: 89,
    availableSeats: 30,
    class: "Economy"
  },
  {
    id: 3,
    flightNumber: "6E303",
    airline: "IndiGo",
    origin: { code: "DEL", city: "New Delhi" },
    destination: { code: "BLR", city: "Bangalore" },
    departureTime: new Date(Date.now() + 259200000).toISOString(),
    arrivalTime: new Date(Date.now() + 259200000 + 1500000).toISOString(),
    duration: 150,
    price: 199,
    availableSeats: 52,
    class: "Economy"
  },
  {
    id: 4,
    flightNumber: "AI202",
    airline: "Air India",
    origin: { code: "BOM", city: "Mumbai" },
    destination: { code: "DEL", city: "New Delhi" },
    departureTime: new Date(Date.now() + 345600000).toISOString(),
    arrivalTime: new Date(Date.now() + 345600000 + 7200000).toISOString(),
    duration: 120,
    price: 159,
    availableSeats: 38,
    class: "Business"
  }
];

router.get('/search', (req, res) => {
  const { origin, destination, date } = req.query;
  
  let filteredFlights = [...flights];
  
  if (origin) {
    filteredFlights = filteredFlights.filter(f => 
      f.origin.city.toLowerCase().includes(origin.toLowerCase())
    );
  }
  
  if (destination) {
    filteredFlights = filteredFlights.filter(f => 
      f.destination.city.toLowerCase().includes(destination.toLowerCase())
    );
  }
  
  res.json({
    success: true,
    count: filteredFlights.length,
    flights: filteredFlights
  });
});

router.get('/:id', (req, res) => {
  const flight = flights.find(f => f.id === parseInt(req.params.id));
  if (!flight) {
    return res.status(404).json({ message: 'Flight not found' });
  }
  res.json(flight);
});

module.exports = router;