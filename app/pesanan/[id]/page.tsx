import BookingReceiptClient from './BookingReceiptClient';

export default function BookingReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  return <BookingReceiptClient params={params} />;
}
