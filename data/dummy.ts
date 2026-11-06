import { Car, Booking } from '@/types';

export const INITIAL_CARS: Car[] = [
  {
    id: 'car-1',
    name: 'Toyota Avanza 1.5 G',
    brand: 'Toyota',
    category: 'MPV',
    transmission: 'Matic',
    seats: 7,
    luggage: 3,
    fuelType: 'Bensin',
    pricePerDay: 400000,
    plateNumber: 'B 1234 ABC',
    year: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    features: ['Double Blower AC', 'Apple CarPlay & Android Auto', 'Dual SRS Airbags', 'Sensor Parkir'],
    status: 'Ready',
    description: 'Pilihan terfavorit keluarga Indonesia. Nyaman, irit bahan bakar, dan kabin lega untuk perjalanan luar kota.'
  },
  {
    id: 'car-2',
    name: 'Mitsubishi Xpander Ultimate',
    brand: 'Mitsubishi',
    category: 'MPV',
    transmission: 'Matic',
    seats: 7,
    luggage: 4,
    fuelType: 'Bensin',
    pricePerDay: 450000,
    plateNumber: 'B 4567 XYZ',
    year: 2024,
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    features: ['Keyless Operation', 'Cruiser Control', 'Ground Clearance Tinggi', 'Rear Camera'],
    status: 'Ready',
    description: 'Suspensi empuk ala sedan dengan ground clearance tinggi. Sangat stabil untuk rute santai maupun menanjak.'
  },
  {
    id: 'car-3',
    name: 'Toyota Innova Zenix 2.0 V',
    brand: 'Toyota',
    category: 'MPV',
    transmission: 'Matic',
    seats: 7,
    luggage: 4,
    fuelType: 'Bensin',
    pricePerDay: 750000,
    plateNumber: 'B 7890 DEF',
    year: 2024,
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    features: ['Captain Seat', 'Panoramic Sunroof', 'Dual Zone AC', 'Toyota Safety Sense'],
    status: 'Ready',
    description: 'Kenyamanan premium eksekutif. Ruang baris kedua ekstra lega dengan jok mewah dan handling modern.'
  },
  {
    id: 'car-4',
    name: 'Honda HR-V 1.5 SE',
    brand: 'Honda',
    category: 'SUV',
    transmission: 'Matic',
    seats: 5,
    luggage: 3,
    fuelType: 'Bensin',
    pricePerDay: 600000,
    plateNumber: 'B 2345 GHI',
    year: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    features: ['Honda Sensing', 'Panoramic Glass Roof', 'Electric Parking Brake', 'Full Digital Meter'],
    status: 'Ready',
    description: 'Compact SUV sporty dan stylish. Cocok untuk mobilitas perkotaan maupun liburan akhir pekan berkelas.'
  },
  {
    id: 'car-5',
    name: 'Mitsubishi Pajero Sport Dakar 4x2',
    brand: 'Mitsubishi',
    category: 'SUV',
    transmission: 'Matic',
    seats: 7,
    luggage: 4,
    fuelType: 'Diesel',
    pricePerDay: 1200000,
    plateNumber: 'B 9999 DKR',
    year: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    features: ['Sunroof', 'Paddle Shift', 'Torsi Mesin Buas Diesel', 'Leather Interior'],
    status: 'Ready',
    description: 'Tangguh dan bertenaga. Sangat prestisius untuk keperluan dinas, perjalanan bisnis, maupun jelajah alam.'
  },
  {
    id: 'car-6',
    name: 'Honda Brio RS',
    brand: 'Honda',
    category: 'City Car',
    transmission: 'Matic',
    seats: 5,
    luggage: 2,
    fuelType: 'Bensin',
    pricePerDay: 350000,
    plateNumber: 'B 3321 JKL',
    year: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
    features: ['Lincah & Irit', 'Audio Touchscreen', 'LED DRL', 'Sensor Parkir'],
    status: 'Ready',
    description: 'Mobil kompak tergesit di jalanan kota. Parkir mudah dan konsumsi bensin super hemat.'
  },
  {
    id: 'car-7',
    name: 'Honda Civic RS',
    brand: 'Honda',
    category: 'Sedan',
    transmission: 'Matic',
    seats: 5,
    luggage: 3,
    fuelType: 'Bensin',
    pricePerDay: 1100000,
    plateNumber: 'B 1111 CVC',
    year: 2024,
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',
    features: ['VTEC Turbo Engine', 'Bose Audio System', 'Honda Sensing', 'Low Driving Posture'],
    status: 'Ready',
    description: 'Sedan sport elegan dengan performa turbo responsif dan interior eksklusif.'
  },
  {
    id: 'car-8',
    name: 'Daihatsu Sigra 1.2 R DLX',
    brand: 'Daihatsu',
    category: 'MPV',
    transmission: 'Manual',
    seats: 7,
    luggage: 3,
    fuelType: 'Bensin',
    pricePerDay: 300000,
    plateNumber: 'B 6789 MNO',
    year: 2022,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    features: ['Manual Gearbox', 'Air Conditioner', 'Power Window', 'Kabin 3 Baris'],
    status: 'Maintenance',
    description: 'Solusi rental super hemat keluarga dengan kapasitas muat hingga 7 penumpang.'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [];

export const BANK_ACCOUNTS = [
  { bank: 'BCA', accountNumber: '8830-1234-56', accountHolder: 'PT RENTAL MOBIL INDONESIA' },
  { bank: 'Bank Mandiri', accountNumber: '137-00-9876543-2', accountHolder: 'PT RENTAL MOBIL INDONESIA' },
  { bank: 'BRI', accountNumber: '0341-01-000888-30-5', accountHolder: 'PT RENTAL MOBIL INDONESIA' }
];

export const DRIVER_RATE_PER_DAY = 200000;
export const DELIVERY_RATE = 100000;
export const ADMIN_WA_NUMBER = '6285194711558';

export function calculateDpAmounts(total: number) {
  const dp = Math.round(total * 0.3);
  const remaining = total - dp;
  return { dp, remaining };
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function isCarAvailable(
  carId: string,
  startDate: string,
  endDate: string,
  bookings: Booking[]
): boolean {
  if (!startDate || !endDate) return true;
  
  const targetStart = new Date(startDate).getTime();
  const targetEnd = new Date(endDate).getTime();

  return !bookings.some((b) => {
    if (b.carId !== carId) return false;
    if (b.status === 'Cancelled' || b.status === 'Completed') return false;

    const bStart = new Date(b.startDate).getTime();
    const bEnd = new Date(b.endDate).getTime();

    return targetStart <= bEnd && targetEnd >= bStart;
  });
}

export function calculateRentalDays(start: string, end: string): number {
  if (!start || !end) return 1;
  const s = new Date(start);
  const e = new Date(end);
  if (s.getTime() > e.getTime()) return 1;
  const diffTime = e.getTime() - s.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 1;
}

export function generateWhatsAppLink(booking: {
  id: string;
  carName: string;
  customerName: string;
  customerPhone: string;
  serviceType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  deliveryLocation?: string;
  totalPrice: number;
  dpAmount: number;
  remainingAmount: number;
}): string {
  const text = `Halo Admin Rental Mobil, saya sudah membuat pesanan sewa di website:

*No. Booking:* ${booking.id}
*Mobil:* ${booking.carName}
*Penyewa:* ${booking.customerName}
*No. WhatsApp:* ${booking.customerPhone}
*Layanan:* ${booking.serviceType}
*Tanggal Sewa:* ${booking.startDate} s/d ${booking.endDate} (${booking.totalDays} Hari)
${booking.deliveryLocation ? `*Lokasi Antar/Jemput:* ${booking.deliveryLocation}\n` : ''}*Total Biaya:* ${formatIDR(booking.totalPrice)}
*DP Wajib (30%):* ${formatIDR(booking.dpAmount)}
*Sisa Pelunasan di Lokasi:* ${formatIDR(booking.remainingAmount)}

*Link Resi Digital:* https://rental-mobil.local/pesanan/${booking.id}

Berikut saya kirimkan konfirmasi dan bukti transfer DP. Mohon dicek dan dikonfirmasi ketersediaan unitnya. Terima kasih!`;

  return `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
