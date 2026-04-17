from models import db, Flight
from app import app

with app.app_context():
    db.create_all()

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

        for flight in sample_flights:
            db.session.add(flight)
        db.session.commit()
        print('Seeded flight data.')
    else:
        print('Flight data already exists.')
