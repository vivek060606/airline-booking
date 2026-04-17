#  Airline Booking System

A full-stack airline booking system with authentication, flight search, seat selection, and booking features.

---

##  Tech Stack

* Backend: Node.js, Express.js
* Database: MySQL (Sequelize ORM)
* Authentication: JWT
* Others: bcrypt, dotenv

---

##  Project Structure

```
backend/
├── config/
├── controllers/
├── models/
├── routes/
├── middleware/
├── server.js
├── .env
```

---

##  Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/vivek060606/airline-booking.git
cd airline-booking/backend
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Setup Environment Variables

Create a `.env` file in the backend folder:

```
PORT=5000

DB_NAME=airline_db
DB_USER=root
DB_PASSWORD=root123
DB_HOST=localhost

JWT_SECRET=your_jwt_secret
```

---

### 4. Start MySQL

Make sure MySQL is running and database is created:

```sql
CREATE DATABASE airline_db;
```

---

### 5. Run the Server

```bash
npm start
```

or (for development)

```bash
npm run dev
```

---

##  API Base URL

```
http://localhost:5000/api
```

---

##  Main Features

* User Registration & Login
* Flight Listing & Search
* Seat Selection
* Booking System
* JWT Authentication

---

##  Notes

* Make sure MySQL credentials match your `.env` file
* Default port is `5000`
* Sequelize will auto-create tables

---

##  Future Improvements

* Add frontend (React)
* Payment integration
* Admin dashboard

---

##  Author

Vivek Kumar

---
