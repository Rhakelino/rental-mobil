import BookingReceiptClient from './BookingReceiptClient';

export const runtime = 'edge';

export default function BookingReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  return <BookingReceiptClient params={params} />;
}
