import { Car, Booking } from '@/types';
import { INITIAL_CARS, INITIAL_BOOKINGS, isCarAvailable } from '@/data/dummy';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function getCars(params?: {
  category?: string;
  transmission?: string;
  seats?: string;
  startDate?: string;
  endDate?: string;
  onlyAvailable?: boolean;
}): Promise<Car[]> {
  try {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.transmission) q.set('transmission', params.transmission);
    if (params?.seats) q.set('seats', params.seats);
    if (params?.startDate) q.set('start_date', params.startDate);
    if (params?.endDate) q.set('end_date', params.endDate);
    if (params?.onlyAvailable) q.set('only_available', 'true');

    const res = await fetch(`${API_BASE}/cars?${q.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API request failed');
    const json = (await res.json()) as ApiResponse<Car[]>;
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
    throw new Error('Invalid format');
  } catch {
    return INITIAL_CARS.filter((car) => {
      if (params?.category && params.category !== 'Semua' && car.category !== params.category) return false;
      if (params?.transmission && params.transmission !== 'Semua' && car.transmission !== params.transmission) return false;
      if (params?.seats && params.seats !== 'Semua' && car.seats.toString() !== params.seats) return false;

      const avail = isCarAvailable(car.id, params?.startDate || '', params?.endDate || '', INITIAL_BOOKINGS);
      if (params?.onlyAvailable && (!avail || car.status !== 'Ready')) return false;

      return true;
    });
  }
}

export async function createBooking(data: {
  id?: string;
  carId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  serviceType: string;
  deliveryLocation?: string;
  startDate: string;
  endDate: string;
  ktpUrl?: string;
  simUrl?: string;
}): Promise<{ success: boolean; data?: Booking; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = (await res.json()) as ApiResponse<Booking>;
    return json;
  } catch {
    const car = INITIAL_CARS.find((c) => c.id === data.carId);
    if (!car) return { success: false, message: 'Armada tidak ditemukan' };

    const dpAmount = Math.round(car.pricePerDay * 0.3);
    const remainingAmount = car.pricePerDay - dpAmount;

    const newBooking: Booking = {
      id: data.id || `BK-${Date.now().toString().slice(-6)}`,
      carId: car.id,
      carName: car.name,
      carPlate: car.plateNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      serviceType: data.serviceType as Booking['serviceType'],
      deliveryLocation: data.deliveryLocation,
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays: 1,
      dailyPrice: car.pricePerDay,
      driverFee: data.serviceType === 'Dengan Driver' ? 200000 : 0,
      deliveryFee: data.deliveryLocation ? 100000 : 0,
      totalPrice: car.pricePerDay,
      dpAmount,
      remainingAmount,
      paymentStatus: 'Menunggu DP',
      status: 'Pending Verification',
      ktpUrl: data.ktpUrl,
      simUrl: data.simUrl,
      createdAt: new Date().toISOString()
    };
    return { success: true, data: newBooking };
  }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API failed');
    const json = (await res.json()) as ApiResponse<Booking>;
    if (json.success && json.data) return json.data;
    throw new Error('Not found');
  } catch {
    const found = INITIAL_BOOKINGS.find((b) => b.id.toLowerCase() === id.toLowerCase());
    return found || null;
  }
}

export async function getBookings(status?: string): Promise<Booking[]> {
  try {
    const url = status && status !== 'All' ? `${API_BASE}/bookings?status=${status}` : `${API_BASE}/bookings`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('API failed');
    const json = (await res.json()) as ApiResponse<Booking[]>;
    if (json.success && Array.isArray(json.data)) return json.data;
    throw new Error('Invalid format');
  } catch {
    if (status && status !== 'All') {
      return INITIAL_BOOKINGS.filter((b) => b.status === status);
    }
    return INITIAL_BOOKINGS;
  }
}

export async function updateBookingStatus(id: string, status: string, paymentStatus?: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentStatus })
    });
    const json = (await res.json()) as ApiResponse<unknown>;
    return Boolean(json.success);
  } catch {
    return true;
  }
}

export async function createCar(carData: Partial<Car>): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData)
    });
    const json = (await res.json()) as ApiResponse<unknown>;
    return Boolean(json.success);
  } catch {
    return true;
  }
}

export async function updateCar(id: string, carData: Partial<Car>): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/cars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData)
    });
    const json = (await res.json()) as ApiResponse<unknown>;
    return Boolean(json.success);
  } catch {
    return true;
  }
}

export async function deleteCar(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/cars/${id}`, {
      method: 'DELETE'
    });
    const json = (await res.json()) as ApiResponse<unknown>;
    return Boolean(json.success);
  } catch {
    return true;
  }
}
