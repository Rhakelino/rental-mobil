'use client';

import { useState, useId, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Booking, ServiceType } from '@/types';
import { createBooking } from '@/services/api';
import {
  formatIDR,
  calculateRentalDays,
  isCarAvailable,
  DRIVER_RATE_PER_DAY,
  DELIVERY_RATE
} from '@/data/dummy';
import {
  X,
  Calendar,
  User,
  Phone,
  MapPin,
  Upload,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  FileCheck
} from 'lucide-react';

const subscribe = () => () => {};
const getClientToday = () => new Date().toISOString().split('T')[0];
const getServerToday = () => '';

function buildNewBooking(
  car: Car,
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  serviceType: ServiceType,
  deliveryLocation: string | undefined,
  startDate: string,
  endDate: string,
  totalDays: number,
  driverFee: number,
  deliveryFee: number,
  totalPrice: number,
  dpAmount: number,
  remainingAmount: number,
  ktpUploaded: boolean,
  simUploaded: boolean
): Booking {
  const timestamp = Date.now().toString().slice(-6);
  return {
    id: `BK-${timestamp}`,
    carId: car.id,
    carName: car.name,
    carPlate: car.plateNumber,
    customerName,
    customerPhone,
    customerAddress,
    serviceType,
    deliveryLocation,
    startDate,
    endDate,
    totalDays,
    dailyPrice: car.pricePerDay,
    driverFee,
    deliveryFee,
    totalPrice,
    dpAmount,
    remainingAmount,
    paymentStatus: 'Menunggu DP',
    status: 'Pending Verification',
    ktpUrl: ktpUploaded ? 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80' : undefined,
    simUrl: simUploaded ? 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80' : undefined,
    createdAt: new Date().toISOString()
  };
}

interface BookingModalProps {
  car: Car | null;
  isOpen: boolean;
  initialStartDate: string;
  initialEndDate: string;
  existingBookings: Booking[];
  onClose: () => void;
  onReset?: () => void;
  onBookingSuccess: (newBooking: Booking) => void;
}

export default function BookingModal({
  car,
  isOpen,
  initialStartDate,
  initialEndDate,
  existingBookings,
  onClose,
  onBookingSuccess
}: BookingModalProps) {
  const today = useSyncExternalStore(subscribe, getClientToday, getServerToday);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const activeStartDate = startDate || initialStartDate || today;
  const rawEndDate = endDate || initialEndDate || today;
  const activeEndDate = activeStartDate && rawEndDate < activeStartDate ? activeStartDate : rawEndDate;

  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    if (activeEndDate && newStart > activeEndDate) {
      setEndDate(newStart);
    }
  };

  const handleEndDateChange = (newEnd: string) => {
    if (activeStartDate && newEnd < activeStartDate) {
      setEndDate(activeStartDate);
    } else {
      setEndDate(newEnd);
    }
  };

  const [serviceType, setServiceType] = useState<ServiceType>('Lepas Kunci');
  const [needDelivery, setNeedDelivery] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('');

  // Customer Data
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Document mock uploads (optional)
  const [ktpUploaded, setKtpUploaded] = useState(false);
  const [simUploaded, setSimUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();
  const ktpInputId = useId();
  const simInputId = useId();

  if (!isOpen || !car) return null;

  const totalDays = calculateRentalDays(activeStartDate, activeEndDate);
  const rentalFee = car.pricePerDay * totalDays;
  const driverFee = serviceType === 'Dengan Driver' ? DRIVER_RATE_PER_DAY * totalDays : 0;
  const deliveryFee = needDelivery ? DELIVERY_RATE : 0;
  const totalPrice = rentalFee + driverFee + deliveryFee;
  const dpAmount = Math.round(totalPrice * 0.3);
  const remainingAmount = totalPrice - dpAmount;

  const available = isCarAvailable(car.id, activeStartDate, activeEndDate, existingBookings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!available) {
      setErrorMessage('Mobil ini sudah terbooking pada rentang tanggal tersebut. Silakan pilih tanggal lain.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setErrorMessage('Lengkapi nama lengkap, nomor WhatsApp, dan alamat domisili.');
      return;
    }

    setSubmitting(true);
    try {
      const newBooking = buildNewBooking(
        car,
        customerName,
        customerPhone,
        customerAddress,
        serviceType,
        needDelivery ? deliveryLocation : undefined,
        activeStartDate,
        activeEndDate,
        totalDays,
        driverFee,
        deliveryFee,
        totalPrice,
        dpAmount,
        remainingAmount,
        ktpUploaded,
        simUploaded
      );

      const res = await createBooking({
        id: newBooking.id,
        carId: car.id,
        customerName,
        customerPhone,
        customerAddress,
        serviceType,
        deliveryLocation: needDelivery ? deliveryLocation : undefined,
        startDate: activeStartDate,
        endDate: activeEndDate,
        ktpUrl: newBooking.ktpUrl,
        simUrl: newBooking.simUrl
      });

      const finalBooking = res.data || newBooking;
      onBookingSuccess(finalBooking);
      onClose();
      router.push(`/pesanan/${finalBooking.id}`);
    } catch {
      setErrorMessage('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 bg-zinc-50">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Formulir Booking Sewa Mobil</h3>
            <p className="text-xs text-zinc-500">{car.name} ({car.plateNumber})</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Pilih Tanggal Sewa */}
              <div className="rounded-xl border border-zinc-200 p-3.5 space-y-3 bg-zinc-50/50">
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-blue-600" />
                  1. Tanggal Sewa
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Mulai</label>
                    <input
                      type="date"
                      min={today}
                      value={activeStartDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-800 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Selesai</label>
                    <input
                      type="date"
                      min={activeStartDate || today}
                      value={activeEndDate}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-800 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {!available && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Unit mobil ini tidak tersedia di tanggal terpilih (Sudah dibooking).</span>
                  </div>
                )}
              </div>

              {/* 2. Pilihan Layanan & Add-ons */}
              <div className="rounded-xl border border-zinc-200 p-3.5 space-y-3">
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                  2. Jenis Layanan & Add-ons
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setServiceType('Lepas Kunci')}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      serviceType === 'Lepas Kunci'
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                        : 'border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-zinc-900">Lepas Kunci</div>
                    <div className="text-[11px] text-zinc-500">Kendarai sendiri, bebas rute</div>
                    <div className="mt-1 text-[11px] font-semibold text-emerald-700">Tanpa Biaya Tambahan</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('Dengan Driver')}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      serviceType === 'Dengan Driver'
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                        : 'border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-zinc-900">Dengan Driver</div>
                    <div className="text-[11px] text-zinc-500">Santai bersama supir ahli</div>
                    <div className="mt-1 text-[11px] font-semibold text-blue-700">+ {formatIDR(DRIVER_RATE_PER_DAY)} / hari</div>
                  </button>
                </div>

                {/* Delivery Option */}
                <div className="pt-2 border-t border-zinc-100">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-800">
                    <input
                      type="checkbox"
                      checked={needDelivery}
                      onChange={(e) => setNeedDelivery(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-300 text-blue-600"
                    />
                    <span>Layanan Antar-Jemput Unit (+ {formatIDR(DELIVERY_RATE)})</span>
                  </label>
                  {needDelivery && (
                    <div className="mt-2 pl-6">
                      <input
                        type="text"
                        placeholder="Contoh: Bandara Soekarno Hatta Terminal 3 / Hotel Santika"
                        value={deliveryLocation}
                        onChange={(e) => setDeliveryLocation(e.target.value)}
                        className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-800 outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Data Diri Penyewa */}
              <div className="rounded-xl border border-zinc-200 p-3.5 space-y-3">
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                  3. Informasi Penyewa
                </span>
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 flex items-center gap-1 mb-1">
                      <User className="h-3 w-3 text-zinc-400" /> Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Sesuai KTP"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-800 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 flex items-center gap-1 mb-1">
                      <Phone className="h-3 w-3 text-zinc-400" /> No. WhatsApp Aktif
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="081234567890"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-800 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 flex items-center gap-1 mb-1">
                      <MapPin className="h-3 w-3 text-zinc-400" /> Alamat Domisili
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Alamat tempat tinggal / hotel menginap"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-800 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Dokumen Syarat (Opsional di Web) */}
              <div className="rounded-xl border border-zinc-200 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                    4. Dokumen Persyaratan (Opsional)
                  </span>
                  <span className="text-[11px] text-zinc-400">Bisa dikirim via WhatsApp</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-dashed border-zinc-300 p-3 text-center">
                    <p className="text-xs font-semibold text-zinc-800">Foto KTP</p>
                    <p className="text-[10px] text-zinc-400 mb-2">Upload sekarang / via WA nanti</p>
                    <input
                      type="file"
                      id={ktpInputId}
                      className="hidden"
                      accept="image/*"
                      onChange={() => setKtpUploaded(true)}
                    />
                    <label
                      htmlFor={ktpInputId}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                        ktpUploaded ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      <Upload className="h-3 w-3" />
                      <span>{ktpUploaded ? 'KTP Terunggah' : 'Pilih Foto KTP'}</span>
                    </label>
                  </div>

                  {serviceType === 'Lepas Kunci' && (
                    <div className="rounded-lg border border-dashed border-zinc-300 p-3 text-center">
                      <p className="text-xs font-semibold text-zinc-800">Foto SIM A</p>
                      <p className="text-[10px] text-zinc-400 mb-2">Upload sekarang / via WA nanti</p>
                      <input
                        type="file"
                        id={simInputId}
                        className="hidden"
                        accept="image/*"
                        onChange={() => setSimUploaded(true)}
                      />
                      <label
                        htmlFor={simInputId}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                          simUploaded ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        }`}
                      >
                        <Upload className="h-3 w-3" />
                        <span>{simUploaded ? 'SIM A Terunggah' : 'Pilih Foto SIM'}</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Kalkulator Ringkasan Biaya & DP */}
              <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4 space-y-2.5">
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                  Rincian Biaya & Skema DP
                </span>
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>{car.name} ({totalDays} hari x {formatIDR(car.pricePerDay)})</span>
                  <span className="font-semibold text-zinc-900">{formatIDR(rentalFee)}</span>
                </div>
                {serviceType === 'Dengan Driver' && (
                  <div className="flex justify-between text-xs text-zinc-600">
                    <span>Layanan Driver ({totalDays} hari)</span>
                    <span className="font-semibold text-zinc-900">{formatIDR(driverFee)}</span>
                  </div>
                )}
                {needDelivery && (
                  <div className="flex justify-between text-xs text-zinc-600">
                    <span>Layanan Antar-Jemput Unit</span>
                    <span className="font-semibold text-zinc-900">{formatIDR(deliveryFee)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-blue-200 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-zinc-800">Total Tarif Sewa</span>
                  <span className="text-base font-black text-blue-700">{formatIDR(totalPrice)}</span>
                </div>

                {/* DP & Pelunasan Box */}
                <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg bg-white p-2.5 border border-blue-200">
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-700 uppercase">DP Wajib (30%)</span>
                    <p className="text-xs font-extrabold text-emerald-700">{formatIDR(dpAmount)}</p>
                    <span className="text-[10px] text-zinc-400">Kunci unit & tanggal</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-zinc-600 uppercase">Sisa Pelunasan (70%)</span>
                    <p className="text-xs font-extrabold text-zinc-800">{formatIDR(remainingAmount)}</p>
                    <span className="text-[10px] text-zinc-400">Bayar saat serah terima</span>
                  </div>
                </div>
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={!available || submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
              >
                <FileCheck className="h-4 w-4" />
                <span>{submitting ? 'Memproses Pesanan...' : 'Lanjut ke Pembayaran DP & Resi'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
        </div>
      </div>
    </div>
  );
}
