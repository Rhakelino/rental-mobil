'use client';

import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FilterBar from '@/components/FilterBar';
import CarCard from '@/components/CarCard';
import CarDetailModal from '@/components/CarDetailModal';
import BookingModal from '@/components/BookingModal';
import Footer from '@/components/Footer';
import { INITIAL_CARS, INITIAL_BOOKINGS, isCarAvailable } from '@/data/dummy';
import { getCars, getBookings } from '@/services/api';
import { Car, Booking } from '@/types';
import { Search } from 'lucide-react';

export default function Home() {
  const [cars, setCars] = useState<Car[]>(INITIAL_CARS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  useEffect(() => {
    getCars().then(setCars).catch(() => {});
    getBookings().then(setBookings).catch(() => {});
  }, []);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedTransmission, setSelectedTransmission] = useState('Semua');
  const [selectedSeats, setSelectedSeats] = useState('Semua');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Modals state
  const [detailCar, setDetailCar] = useState<Car | null>(null);
  const [bookingCar, setBookingCar] = useState<Car | null>(null);

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (endDate && val > endDate) {
      setEndDate(val);
    }
  };

  const handleEndDateChange = (val: string) => {
    if (startDate && val < startDate) {
      setEndDate(startDate);
    } else {
      setEndDate(val);
    }
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedCategory('Semua');
    setSelectedTransmission('Semua');
    setSelectedSeats('Semua');
    setOnlyAvailable(false);
  };

  const handleNewBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  // Filtered cars logic
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (selectedCategory !== 'Semua' && car.category !== selectedCategory) {
        return false;
      }
      if (selectedTransmission !== 'Semua' && car.transmission !== selectedTransmission) {
        return false;
      }
      if (selectedSeats !== 'Semua' && car.seats.toString() !== selectedSeats) {
        return false;
      }

      const available = isCarAvailable(car.id, startDate, endDate, bookings);
      if (onlyAvailable && (!available || car.status !== 'Ready')) {
        return false;
      }

      return true;
    });
  }, [cars, bookings, selectedCategory, selectedTransmission, selectedSeats, startDate, endDate, onlyAvailable]);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 flex flex-col justify-between">
      <div>
        <Navbar />
        <Hero />

        {/* Catalog Section */}
        <main id="katalog" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">Pilihan Armada Rental</h2>
              <p className="text-xs text-zinc-500 mt-1">Pilih mobil idaman Anda dengan harga terbaik dan kondisi prima</p>
            </div>
            <div className="text-xs font-semibold text-zinc-500">
              Menampilkan <span className="font-bold text-blue-600">{filteredCars.length}</span> armada
            </div>
          </div>

          {/* Filter Bar */}
          <FilterBar
            startDate={startDate}
            endDate={endDate}
            selectedCategory={selectedCategory}
            selectedTransmission={selectedTransmission}
            selectedSeats={selectedSeats}
            onlyAvailable={onlyAvailable}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            onCategoryChange={setSelectedCategory}
            onTransmissionChange={setSelectedTransmission}
            onSeatsChange={setSelectedSeats}
            onOnlyAvailableChange={setOnlyAvailable}
            onReset={handleResetFilters}
          />

          {/* Car Grid */}
          <div className="mt-8">
            {filteredCars.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
                <Search className="mx-auto h-10 w-10 text-zinc-300" />
                <h3 className="mt-4 text-sm font-bold text-zinc-800">Tidak ada mobil yang cocok</h3>
                <p className="mt-1 text-xs text-zinc-500">Coba ubah filter kategori atau ganti tanggal sewa Anda.</p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCars.map((car) => {
                  const availableOnDate = isCarAvailable(car.id, startDate, endDate, bookings);
                  return (
                    <CarCard
                      key={car.id}
                      car={car}
                      isAvailableOnDate={availableOnDate}
                      startDate={startDate}
                      endDate={endDate}
                      onOpenDetail={(c) => setDetailCar(c)}
                      onBook={(c) => setBookingCar(c)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* 3 Step Booking Section */}
          <section className="mt-20 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-10">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Alur Sewa Praktis</span>
              <h3 className="text-xl font-bold text-zinc-900 sm:text-2xl mt-1">Sewa Mobil Hanya Dalam 3 Langkah</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl bg-zinc-50 p-5 text-center border border-zinc-100">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 font-bold text-base mb-3">
                  1
                </div>
                <h4 className="text-sm font-bold text-zinc-900">Pilih Mobil & Tanggal</h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Cari armada sesuai kapasitas dan kebutuhan, tentukan tanggal sewa untuk cek ketersediaan.
                </p>
              </div>

              <div className="rounded-xl bg-zinc-50 p-5 text-center border border-zinc-100">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 font-bold text-base mb-3">
                  2
                </div>
                <h4 className="text-sm font-bold text-zinc-900">Isi Data & Dokumen</h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Lengkapi identitas, pilih opsi lepas kunci atau dengan supir, dan upload foto KTP / SIM.
                </p>
              </div>

              <div className="rounded-xl bg-zinc-50 p-5 text-center border border-zinc-100">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 font-bold text-base mb-3">
                  3
                </div>
                <h4 className="text-sm font-bold text-zinc-900">Konfirmasi via WhatsApp</h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Pesan ter-generate otomatis ke WhatsApp admin. Verifikasi kilat dan unit siap diantar.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Modals */}
      <CarDetailModal
        car={detailCar}
        isOpen={Boolean(detailCar)}
        onClose={() => setDetailCar(null)}
        onBookNow={(c) => {
          setDetailCar(null);
          setBookingCar(c);
        }}
      />

      <BookingModal
        car={bookingCar}
        isOpen={Boolean(bookingCar)}
        initialStartDate={startDate}
        initialEndDate={endDate}
        existingBookings={bookings}
        onClose={() => setBookingCar(null)}
        onBookingSuccess={handleNewBooking}
      />

      <Footer />
    </div>
  );
}
