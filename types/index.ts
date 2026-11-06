export type CarCategory = 'SUV' | 'Sedan' | 'MPV' | 'City Car';
export type CarTransmission = 'Matic' | 'Manual';
export type CarStatus = 'Ready' | 'Booked' | 'Maintenance';
export type ServiceType = 'Lepas Kunci' | 'Dengan Driver';
export type BookingStatus = 'Pending Verification' | 'Approved' | 'Ongoing' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Menunggu DP' | 'DP Dikonfirmasi' | 'Pelunasan Dikonfirmasi' | 'Lunas';

export interface Car {
  id: string;
  name: string;
  brand: string;
  category: CarCategory;
  transmission: CarTransmission;
  seats: number;
  luggage: number;
  fuelType: string;
  pricePerDay: number;
  plateNumber: string;
  year: number;
  imageUrl: string;
  features: string[];
  status: CarStatus;
  description: string;
}

export interface Booking {
  id: string;
  carId: string;
  carName: string;
  carPlate: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  serviceType: ServiceType;
  deliveryLocation?: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyPrice: number;
  driverFee: number;
  deliveryFee: number;
  totalPrice: number;
  dpAmount: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  ktpUrl?: string;
  simUrl?: string;
  createdAt: string;
}
