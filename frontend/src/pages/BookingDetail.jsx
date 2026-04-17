import { useParams } from 'react-router-dom';

function BookingDetail() {
  const { bookingId } = useParams();

  return <h1>Booking Detail: {bookingId}</h1>;
}

export default BookingDetail;