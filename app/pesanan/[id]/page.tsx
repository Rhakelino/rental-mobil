import BookingReceiptClient from './BookingReceiptClient';

export async function generateStaticParams() {
  return [];
}

export default function BookingReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  return <BookingReceiptClient params={params} />;
}
