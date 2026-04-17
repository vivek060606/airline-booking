from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User, Flight, Booking, Baggage
from werkzeug.security import generate_password_hash, check_password_hash
import random
import string

app = Flask(__name__)
CORS(app)

# Configure SQLite database path
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy with Flask app
db.init_app(app)

def generate_booking_reference(length=8):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def seed_default_flights():
    if Flight.query.count() == 0:
        sample_flights = [
            Flight(
                flight_number='AP101',
                origin='New York',
                destination='London',
                departure_time='2026-05-01 08:00',
                arrival_time='2026-05-01 20:30',
                price=650.0,
                travel_class='Economy'
            ),
            Flight(
                flight_number='AP202',
                origin='New York',
                destination='London',
                departure_time='2026-05-01 09:30',
                arrival_time='2026-05-01 22:00',
                price=1200.0,
                travel_class='Business'
            ),
            Flight(
                flight_number='AP303',
                origin='San Francisco',
                destination='Tokyo',
                departure_time='2026-05-10 12:00',
                arrival_time='2026-05-11 16:30',
                price=980.0,
                travel_class='Economy'
            ),
            Flight(
                flight_number='AP404',
                origin='San Francisco',
                destination='Tokyo',
                departure_time='2026-05-10 14:00',
                arrival_time='2026-05-11 18:30',
                price=1550.0,
                travel_class='Business'
            ),
            Flight(
                flight_number='AP505',
                origin='Mumbai',
                destination='Dubai',
                departure_time='2026-05-15 03:15',
                arrival_time='2026-05-15 05:45',
                price=250.0,
                travel_class='Economy'
            )
        ]
        db.session.add_all(sample_flights)
        db.session.commit()

@app.route('/')
def home():
    return jsonify({'message': 'Flight Booking System API is running'})

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required.'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered.'}), 409

    hashed_password = generate_password_hash(password)
    user = User(name=name, email=email, password=hashed_password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Registration successful.', 'user': user.to_dict()})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid credentials.'}), 401

    return jsonify({'message': 'Login successful.', 'user': user.to_dict()})

@app.route('/flights', methods=['GET'])
def list_flights():
    origin = request.args.get('origin', '').strip().lower()
    destination = request.args.get('destination', '').strip().lower()
    travel_class = request.args.get('class', '').strip().title()
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)

    flights = Flight.query
    if origin:
        flights = flights.filter(Flight.origin.ilike(f'%{origin}%'))
    if destination:
        flights = flights.filter(Flight.destination.ilike(f'%{destination}%'))
    if travel_class:
        flights = flights.filter_by(travel_class=travel_class)
    if min_price is not None:
        flights = flights.filter(Flight.price >= min_price)
    if max_price is not None:
        flights = flights.filter(Flight.price <= max_price)

    result = [flight.to_dict() for flight in flights.all()]
    return jsonify({'flights': result})

@app.route('/book', methods=['POST'])
def book_flight():
    data = request.get_json() or {}
    user_id = data.get('user_id')
    flight_id = data.get('flight_id')
    seat_number = data.get('seat_number', '').strip().upper()
    offer_code = data.get('offer_code', '').strip().upper()

    if not user_id or not flight_id or not seat_number:
        return jsonify({'error': 'User, flight and seat selection are required.'}), 400

    user = User.query.get(user_id)
    flight = Flight.query.get(flight_id)
    if not user or not flight:
        return jsonify({'error': 'Valid user and flight are required.'}), 404

    fare = flight.price
    discount = 0.0
    if offer_code == 'SAVE10':
        discount = fare * 0.10
    elif offer_code == 'FLY5':
        discount = fare * 0.05

    total_fare = round(fare - discount, 2)
    booking_reference = generate_booking_reference()

    booking = Booking(
        booking_reference=booking_reference,
        user_id=user.id,
        flight_id=flight.id,
        seat_number=seat_number,
        fare=total_fare,
        status='confirmed'
    )
    db.session.add(booking)
    db.session.commit()

    return jsonify({'message': 'Booking confirmed.', 'booking': booking.to_dict()})

@app.route('/checkin', methods=['POST'])
def checkin():
    data = request.get_json() or {}
    booking_reference = data.get('booking_reference', '').strip().upper()

    booking = Booking.query.filter_by(booking_reference=booking_reference).first()
    if not booking:
        return jsonify({'error': 'Booking reference not found.'}), 404

    boarding_pass = {
        'booking_reference': booking.booking_reference,
        'passenger': booking.user.name,
        'flight_number': booking.flight.flight_number,
        'origin': booking.flight.origin,
        'destination': booking.flight.destination,
        'departure_time': booking.flight.departure_time,
        'arrival_time': booking.flight.arrival_time,
        'seat_number': booking.seat_number,
        'status': booking.status
    }
    return jsonify({'boarding_pass': boarding_pass})

@app.route('/status', methods=['GET'])
def flight_status():
    flight_number = request.args.get('flight_number', '').strip().upper()
    if not flight_number:
        return jsonify({'error': 'Flight number is required.'}), 400

    flight = Flight.query.filter_by(flight_number=flight_number).first()
    if not flight:
        return jsonify({'error': 'Flight not found.'}), 404

    delays = [
        'On time',
        'Delayed by 20 minutes',
        'Delayed by 40 minutes',
        'Boarding soon',
        'Gate change: See display'
    ]
    status_text = random.choice(delays)

    return jsonify({
        'flight': flight.to_dict(),
        'status': status_text
    })

@app.route('/booking/<booking_ref>', methods=['GET'])
def get_booking(booking_ref):
    booking = Booking.query.filter_by(booking_reference=booking_ref.upper()).first()
    if not booking:
        return jsonify({'error': 'Booking not found.'}), 404
    return jsonify({'booking': booking.to_dict()})

@app.route('/manage/<booking_ref>', methods=['PUT'])
def manage_booking(booking_ref):
    booking = Booking.query.filter_by(booking_reference=booking_ref.upper()).first()
    if not booking:
        return jsonify({'error': 'Booking not found.'}), 404

    data = request.get_json() or {}
    new_seat = data.get('seat_number', '').strip().upper()
    if new_seat:
        booking.seat_number = new_seat
        db.session.commit()
        return jsonify({'message': 'Seat updated.', 'booking': booking.to_dict()})

    return jsonify({'error': 'No changes provided.'}), 400

@app.route('/cancel/<booking_ref>', methods=['DELETE'])
def cancel_booking(booking_ref):
    booking = Booking.query.filter_by(booking_reference=booking_ref.upper()).first()
    if not booking:
        return jsonify({'error': 'Booking not found.'}), 404

    booking.status = 'cancelled'
    db.session.commit()
    return jsonify({'message': 'Booking cancelled.', 'booking': booking.to_dict()})

@app.route('/baggage', methods=['POST'])
def add_baggage():
    data = request.get_json() or {}
    booking_reference = data.get('booking_reference', '').strip().upper()
    weight = data.get('weight', 0.0)

    booking = Booking.query.filter_by(booking_reference=booking_reference).first()
    if not booking:
        return jsonify({'error': 'Booking not found.'}), 404

    baggage = Baggage(
        booking_id=booking.id,
        weight=weight,
        status='checked in'
    )
    db.session.add(baggage)
    db.session.commit()

    return jsonify({'message': 'Baggage added.', 'baggage': baggage.to_dict()})

@app.route('/baggage/<booking_ref>', methods=['GET'])
def baggage_status(booking_ref):
    booking = Booking.query.filter_by(booking_reference=booking_ref.upper()).first()
    if not booking:
        return jsonify({'error': 'Booking not found.'}), 404

    baggage = Baggage.query.filter_by(booking_id=booking.id).order_by(Baggage.created_at.desc()).first()
    if not baggage:
        return jsonify({'error': 'No baggage records found for this booking.'}), 404

    return jsonify({'baggage': baggage.to_dict()})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_default_flights()
    app.run(debug=True)
