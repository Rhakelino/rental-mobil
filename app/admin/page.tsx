'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  INITIAL_CARS,
  INITIAL_BOOKINGS,
  formatIDR
} from '@/data/dummy';
import {
  getCars,
  getBookings,
  updateBookingStatus,
  createCar,
  updateCar,
  deleteCar
} from '@/services/api';
import {
  Car,
  Booking,
  CarCategory,
  CarTransmission,
  CarStatus,
  BookingStatus,
  PaymentStatus
} from '@/types';
import {
  Car as CarIcon,
  ShoppingBag,
  Calendar,
  TrendingUp,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Eye,
  ArrowLeft,
  Search,
  KeyRound,
  LogOut,
  ExternalLink,
  MessageCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'cars' | 'orders' | 'schedule'>('overview');

  // Core Data
  const [cars, setCars] = useState<Car[]>(INITIAL_CARS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = () => {
    setIsRefreshing(true);
    Promise.all([
      getCars().then(setCars).catch(() => {}),
      getBookings().then(setBookings).catch(() => {})
    ]).finally(() => {
      setTimeout(() => setIsRefreshing(false), 500);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filters & Search
  const [searchCar, setSearchCar] = useState('');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>('All');

  // Modals
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // New/Edit Car Form State
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState<CarCategory>('MPV');
  const [formTransmission, setFormTransmission] = useState<CarTransmission>('Matic');
  const [formSeats, setFormSeats] = useState(7);
  const [formPrice, setFormPrice] = useState(400000);
  const [formPlate, setFormPlate] = useState('');
  const [formYear, setFormYear] = useState(2024);
  const [formStatus, setFormStatus] = useState<CarStatus>('Ready');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80');

  // Order Review Modal
  const [reviewOrder, setReviewOrder] = useState<Booking | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin123' || passwordInput === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Password salah. Gunakan: admin');
    }
  };

  // Car actions
  const openAddCarModal = () => {
    setEditingCar(null);
    setFormName('');
    setFormBrand('');
    setFormCategory('MPV');
    setFormTransmission('Matic');
    setFormSeats(7);
    setFormPrice(400000);
    setFormPlate('');
    setFormYear(2024);
    setFormStatus('Ready');
    setFormImage('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80');
    setIsCarModalOpen(true);
  };

  const openEditCarModal = (car: Car) => {
    setEditingCar(car);
    setFormName(car.name);
    setFormBrand(car.brand);
    setFormCategory(car.category);
    setFormTransmission(car.transmission);
    setFormSeats(car.seats);
    setFormPrice(car.pricePerDay);
    setFormPlate(car.plateNumber);
    setFormYear(car.year);
    setFormStatus(car.status);
    setFormImage(car.imageUrl);
    setIsCarModalOpen(true);
  };

  const handleSaveCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCar) {
      updateCar(editingCar.id, {
        name: formName,
        brand: formBrand,
        category: formCategory,
        transmission: formTransmission,
        seats: formSeats,
        pricePerDay: formPrice,
        plateNumber: formPlate,
        year: formYear,
        status: formStatus,
        imageUrl: formImage
      });
      setCars((prev) =>
        prev.map((c) =>
          c.id === editingCar.id
            ? {
                ...c,
                name: formName,
                brand: formBrand,
                category: formCategory,
                transmission: formTransmission,
                seats: formSeats,
                pricePerDay: formPrice,
                plateNumber: formPlate,
                year: formYear,
                status: formStatus,
                imageUrl: formImage
              }
            : c
        )
      );
    } else {
      const newCar: Car = {
        id: `car-${Date.now()}`,
        name: formName,
        brand: formBrand,
        category: formCategory,
        transmission: formTransmission,
        seats: formSeats,
        luggage: 3,
        fuelType: 'Bensin',
        pricePerDay: formPrice,
        plateNumber: formPlate,
        year: formYear,
        imageUrl: formImage,
        features: ['Air Conditioner', 'Multimedia Screen', 'Dual Airbags'],
        status: formStatus,
        description: 'Armada baru siap pakai dengan performa prima.'
      };
      createCar(newCar);
      setCars((prev) => [newCar, ...prev]);
    }
    setIsCarModalOpen(false);
  };

  const handleDeleteCar = (id: string) => {
    if (confirm('Yakin ingin menghapus armada ini?')) {
      deleteCar(id);
      setCars((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Order status actions
  const handleUpdateOrderStatus = (orderId: string, status: BookingStatus, paymentStatus?: PaymentStatus) => {
    updateBookingStatus(orderId, status);
    setBookings((prev) =>
      prev.map((b) =>
        b.id === orderId
          ? { ...b, status, ...(paymentStatus ? { paymentStatus } : {}) }
          : b
      )
    );
    if (reviewOrder?.id === orderId) {
      setReviewOrder((prev) =>
        prev
          ? { ...prev, status, ...(paymentStatus ? { paymentStatus } : {}) }
          : null
      );
    }
  };

  // Financial & Fleet calculations
  const totalIncome = bookings
    .filter((b) => b.status === 'Approved' || b.status === 'Completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const readyCount = cars.filter((c) => c.status === 'Ready').length;
  const maintenanceCount = cars.filter((c) => c.status === 'Maintenance').length;
  const pendingOrders = bookings.filter((b) => b.status === 'Pending Verification').length;

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
        <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white mb-4">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="text-center text-lg font-bold text-zinc-900">Login Admin Rental</h2>
          <p className="text-center text-xs text-zinc-500 mb-6">Masukkan kata sandi untuk mengelola armada</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Kata sandi"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-800 outline-none focus:border-blue-500"
              />
              {authError && <p className="mt-1 text-[11px] text-rose-600">Kata sandi salah</p>}
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-700"
            >
              Masuk Dashboard
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-800 flex items-center justify-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Kembali ke Katalog Publik
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-zinc-800 hover:text-blue-600">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-xs font-semibold hidden sm:inline">Lihat Web Publik</span>
            </Link>
            <div className="h-4 w-px bg-zinc-200" />
            <h1 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <CarIcon className="h-4 w-4 text-blue-600" />
              <span>Admin Rental Dashboard</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={isRefreshing}
              className="rounded-lg border border-zinc-200 p-1.5 text-zinc-500 hover:bg-zinc-50 hover:text-blue-600 disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              Admin Online
            </span>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="rounded-lg border border-zinc-200 p-1.5 text-zinc-500 hover:bg-zinc-50 hover:text-rose-600"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex gap-2 border-t border-zinc-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Ringkasan & Laporan</span>
          </button>

          <button
            onClick={() => setActiveTab('cars')}
            className={`flex items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'cars'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <CarIcon className="h-3.5 w-3.5" />
            <span>Manajemen Armada ({cars.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-bold transition-colors whitespace-nowrap relative ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Pesanan & Dokumen</span>
            {pendingOrders > 0 && (
              <span className="ml-1 rounded-full bg-rose-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                {pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'schedule'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Jadwal Mobil Keluar/Masuk</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="mx-auto max-w-7xl flex-1 px-4 py-6 sm:px-6 w-full">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <span className="text-xs text-zinc-500 font-medium">Total Pemasukan</span>
                <div className="mt-1 text-lg sm:text-xl font-black text-emerald-600">{formatIDR(totalIncome)}</div>
                <span className="text-[11px] text-zinc-400">Dari order disetujui</span>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <span className="text-xs text-zinc-500 font-medium">Armada Siap (Ready)</span>
                <div className="mt-1 text-lg sm:text-xl font-black text-blue-600">{readyCount} Unit</div>
                <span className="text-[11px] text-zinc-400">Dari total {cars.length} mobil</span>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <span className="text-xs text-zinc-500 font-medium">Menunggu Verifikasi</span>
                <div className="mt-1 text-lg sm:text-xl font-black text-amber-600">{pendingOrders} Order</div>
                <span className="text-[11px] text-zinc-400">Perlu cek KTP/SIM</span>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <span className="text-xs text-zinc-500 font-medium">Dalam Perawatan</span>
                <div className="mt-1 text-lg sm:text-xl font-black text-zinc-600">{maintenanceCount} Unit</div>
                <span className="text-[11px] text-zinc-400">Bengkel / Servis</span>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-zinc-900">Pesanan Masuk Terbaru</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Kelola Semua Pesanan →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-zinc-600 border-y border-zinc-100">
                    <tr>
                      <th className="py-2.5 px-3">No. Booking</th>
                      <th className="py-2.5 px-3">Mobil</th>
                      <th className="py-2.5 px-3">Penyewa</th>
                      <th className="py-2.5 px-3">Tanggal Sewa</th>
                      <th className="py-2.5 px-3">Total Biaya</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-zinc-50/50">
                        <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">{b.id}</td>
                        <td className="py-2.5 px-3 text-zinc-800 font-medium">{b.carName}</td>
                        <td className="py-2.5 px-3 text-zinc-600">{b.customerName}</td>
                        <td className="py-2.5 px-3 text-zinc-600">{b.startDate} s/d {b.endDate}</td>
                        <td className="py-2.5 px-3 font-bold text-blue-700">{formatIDR(b.totalPrice)}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              b.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : b.status === 'Pending Verification'
                                ? 'bg-amber-100 text-amber-800'
                                : b.status === 'Completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-zinc-100 text-zinc-600'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. FLEET / CARS MANAGEMENT TAB */}
        {activeTab === 'cars' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Cari nama mobil atau plat nomor..."
                  value={searchCar}
                  onChange={(e) => setSearchCar(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white pl-8 pr-3 py-2 text-xs text-zinc-800 outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={openAddCarModal}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Armada Baru</span>
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-zinc-600 border-b border-zinc-200">
                    <tr>
                      <th className="py-3 px-4">Mobil</th>
                      <th className="py-3 px-3">Kategori</th>
                      <th className="py-3 px-3">Transmisi</th>
                      <th className="py-3 px-3">Plat Nomor</th>
                      <th className="py-3 px-3">Harga/Hari</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {cars
                      .filter(
                        (c) =>
                          c.name.toLowerCase().includes(searchCar.toLowerCase()) ||
                          c.plateNumber.toLowerCase().includes(searchCar.toLowerCase())
                      )
                      .map((car) => (
                        <tr key={car.id} className="hover:bg-zinc-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={car.imageUrl}
                                alt={car.name}
                                className="h-10 w-14 rounded-lg object-cover bg-zinc-100"
                              />
                              <div>
                                <p className="font-bold text-zinc-900">{car.name}</p>
                                <p className="text-[11px] text-zinc-400">{car.brand} • {car.year}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-zinc-700">{car.category}</td>
                          <td className="py-3 px-3 text-zinc-700">{car.transmission}</td>
                          <td className="py-3 px-3 font-mono font-medium text-zinc-800">{car.plateNumber}</td>
                          <td className="py-3 px-3 font-bold text-blue-700">{formatIDR(car.pricePerDay)}</td>
                          <td className="py-3 px-3">
                            <select
                              value={car.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as CarStatus;
                                setCars((prev) =>
                                  prev.map((c) => (c.id === car.id ? { ...c, status: newStatus } : c))
                                );
                              }}
                              className={`rounded-lg border px-2 py-1 text-[11px] font-bold outline-none ${
                                car.status === 'Ready'
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                  : car.status === 'Booked'
                                  ? 'border-blue-200 bg-blue-50 text-blue-800'
                                  : 'border-amber-200 bg-amber-50 text-amber-800'
                              }`}
                            >
                              <option value="Ready">Ready</option>
                              <option value="Booked">Booked</option>
                              <option value="Maintenance">Maintenance</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditCarModal(car)}
                                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                                title="Edit"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCar(car.id)}
                                className="rounded-lg p-1.5 text-zinc-500 hover:bg-rose-50 hover:text-rose-600"
                                title="Hapus"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ORDER MANAGEMENT & DOCUMENT VERIFICATION */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-zinc-500">Filter Status:</span>
              {['All', 'Pending Verification', 'Approved', 'Completed', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedOrderStatus(st)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    selectedOrderStatus === st
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-zinc-600 border-b border-zinc-200">
                    <tr>
                      <th className="py-3 px-4">No. Booking</th>
                      <th className="py-3 px-3">Mobil</th>
                      <th className="py-3 px-3">Penyewa & Kontak</th>
                      <th className="py-3 px-3">Layanan</th>
                      <th className="py-3 px-3">Jadwal Sewa</th>
                      <th className="py-3 px-3">Total Biaya</th>
                      <th className="py-3 px-3">Dokumen</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {bookings
                      .filter((b) => selectedOrderStatus === 'All' || b.status === selectedOrderStatus)
                      .map((booking) => (
                        <tr key={booking.id} className="hover:bg-zinc-50">
                          <td className="py-3 px-4 font-mono font-bold text-zinc-900">{booking.id}</td>
                          <td className="py-3 px-3">
                            <p className="font-bold text-zinc-800">{booking.carName}</p>
                            <p className="text-[11px] font-mono text-zinc-400">{booking.carPlate}</p>
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-semibold text-zinc-900">{booking.customerName}</p>
                            <a
                              href={`https://wa.me/${booking.customerPhone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1"
                            >
                              <MessageCircle className="h-3 w-3" />
                              {booking.customerPhone}
                            </a>
                          </td>
                          <td className="py-3 px-3">
                            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-700">
                              {booking.serviceType}
                            </span>
                            {booking.deliveryLocation && (
                              <p className="text-[10px] text-zinc-400 mt-0.5">Antar: {booking.deliveryLocation}</p>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <p className="text-zinc-800 font-medium">{booking.startDate} s/d {booking.endDate}</p>
                            <p className="text-[11px] text-zinc-400">{booking.totalDays} Hari</p>
                          </td>
                          <td className="py-3 px-3 font-bold text-blue-700">{formatIDR(booking.totalPrice)}</td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => setReviewOrder(booking)}
                              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100"
                            >
                              <Eye className="h-3 w-3" /> Cek KTP/SIM
                            </button>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold block w-fit mb-1 ${
                                booking.paymentStatus === 'DP Dikonfirmasi'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : booking.paymentStatus === 'Pelunasan Dikonfirmasi'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : booking.paymentStatus === 'Lunas'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {booking.paymentStatus}
                            </span>
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-medium block w-fit ${
                                booking.status === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : booking.status === 'Ongoing'
                                  ? 'bg-indigo-50 text-indigo-700'
                                  : booking.status === 'Pending Verification'
                                  ? 'bg-amber-50 text-amber-700'
                                  : booking.status === 'Completed'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-zinc-100 text-zinc-600'
                              }`}
                            >
                              {booking.status === 'Ongoing' ? 'Mobil Sedang Digunakan' : booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {booking.status === 'Pending Verification' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(booking.id, 'Approved', 'DP Dikonfirmasi')}
                                    className="rounded-lg bg-emerald-600 p-1.5 text-white hover:bg-emerald-700"
                                    title="Konfirmasi DP & Setujui"
                                  >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(booking.id, 'Cancelled')}
                                    className="rounded-lg bg-rose-600 p-1.5 text-white hover:bg-rose-700"
                                    title="Tolak / Cancel"
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              )}
                              {booking.status === 'Approved' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(booking.id, 'Ongoing', 'Pelunasan Dikonfirmasi')}
                                  className="rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100"
                                  title="Serah Terima Kunci & Pelunasan 70%"
                                >
                                  Serah Terima Kunci
                                </button>
                              )}
                              {booking.status === 'Ongoing' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(booking.id, 'Completed', 'Lunas')}
                                  className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 hover:bg-blue-100"
                                  title="Mobil Sudah Kembali & Sewa Selesai"
                                >
                                  Mobil Kembali
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. SCHEDULE / CALENDAR TAB */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-900 mb-2">Jadwal & Status Armada Real-Time</h3>
              <p className="text-xs text-zinc-500 mb-4">Pantau unit yang sedang di luar, siap berangkat, dan antrean verifikasi DP</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Ongoing: Mobil sedang di luar */}
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5 mb-3">
                    <CarIcon className="h-3.5 w-3.5" /> Mobil Sedang di Luar ({bookings.filter((b) => b.status === 'Ongoing').length})
                  </h4>
                  <div className="space-y-2">
                    {bookings
                      .filter((b) => b.status === 'Ongoing')
                      .map((b) => (
                        <div key={b.id} className="rounded-lg bg-white p-3 border border-indigo-100 shadow-xs flex justify-between items-start">
                          <div>
                            <p className="text-xs font-bold text-zinc-900">{b.carName} ({b.carPlate})</p>
                            <p className="text-[11px] text-zinc-500">Penyewa: {b.customerName}</p>
                            <p className="text-[10px] text-indigo-700 font-semibold mt-1">
                              Wajib kembali: {b.endDate}
                            </p>
                          </div>
                          <button
                            onClick={() => handleUpdateOrderStatus(b.id, 'Completed', 'Lunas')}
                            className="rounded bg-blue-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-blue-700"
                          >
                            Mobil Kembali
                          </button>
                        </div>
                      ))}
                    {bookings.filter((b) => b.status === 'Ongoing').length === 0 && (
                      <p className="text-xs text-zinc-400">Semua unit ada di garasi.</p>
                    )}
                  </div>
                </div>

                {/* Approved: Siap Serah Terima */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-3">
                    <CheckCircle className="h-3.5 w-3.5" /> DP Lunas, Siap Serah Terima ({bookings.filter((b) => b.status === 'Approved').length})
                  </h4>
                  <div className="space-y-2">
                    {bookings
                      .filter((b) => b.status === 'Approved')
                      .map((b) => (
                        <div key={b.id} className="rounded-lg bg-white p-3 border border-emerald-100 shadow-xs flex justify-between items-start">
                          <div>
                            <p className="text-xs font-bold text-zinc-900">{b.carName} ({b.carPlate})</p>
                            <p className="text-[11px] text-zinc-500">Penyewa: {b.customerName}</p>
                            <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                              Mulai sewa: {b.startDate}
                            </p>
                          </div>
                          <button
                            onClick={() => handleUpdateOrderStatus(b.id, 'Ongoing', 'Pelunasan Dikonfirmasi')}
                            className="rounded bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-indigo-700"
                          >
                            Serah Terima
                          </button>
                        </div>
                      ))}
                    {bookings.filter((b) => b.status === 'Approved').length === 0 && (
                      <p className="text-xs text-zinc-400">Tidak ada unit siap serah terima.</p>
                    )}
                  </div>
                </div>

                {/* Pending: Antrean Verifikasi DP */}
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-3">
                    <Clock className="h-3.5 w-3.5" /> Antrean Verifikasi DP ({bookings.filter((b) => b.status === 'Pending Verification').length})
                  </h4>
                  <div className="space-y-2">
                    {bookings
                      .filter((b) => b.status === 'Pending Verification')
                      .map((b) => (
                        <div key={b.id} className="rounded-lg bg-white p-3 border border-amber-100 shadow-xs flex justify-between items-start">
                          <div>
                            <p className="text-xs font-bold text-zinc-900">{b.carName}</p>
                            <p className="text-[11px] text-zinc-500">Mulai sewa: {b.startDate} s/d {b.endDate}</p>
                            <p className="text-[11px] text-zinc-600 font-medium">Penyewa: {b.customerName}</p>
                          </div>
                          <button
                            onClick={() => {
                              setActiveTab('orders');
                              setReviewOrder(b);
                            }}
                            className="rounded bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-600"
                          >
                            Verifikasi
                          </button>
                        </div>
                      ))}
                    {bookings.filter((b) => b.status === 'Pending Verification').length === 0 && (
                      <p className="text-xs text-zinc-400">Semua pesanan telah diverifikasi.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD / EDIT CAR */}
      {isCarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-zinc-900 mb-4">
              {editingCar ? 'Edit Data Mobil' : 'Tambah Mobil Baru'}
            </h3>

            <form onSubmit={handleSaveCar} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Nama Mobil</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Toyota Avanza 1.5 G"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Merk / Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="Toyota / Honda"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Plat Nomor</label>
                  <input
                    type="text"
                    required
                    placeholder="B 1234 ABC"
                    value={formPlate}
                    onChange={(e) => setFormPlate(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CarCategory)}
                    className="w-full rounded-xl border border-zinc-200 px-2 py-2 outline-none focus:border-blue-500"
                  >
                    <option value="MPV">MPV</option>
                    <option value="SUV">SUV</option>
                    <option value="City Car">City Car</option>
                    <option value="Sedan">Sedan</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Transmisi</label>
                  <select
                    value={formTransmission}
                    onChange={(e) => setFormTransmission(e.target.value as CarTransmission)}
                    className="w-full rounded-xl border border-zinc-200 px-2 py-2 outline-none focus:border-blue-500"
                  >
                    <option value="Matic">Matic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Kapasitas</label>
                  <input
                    type="number"
                    min={2}
                    max={15}
                    value={formSeats}
                    onChange={(e) => setFormSeats(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Tahun</label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Harga / Hari (IDR)</label>
                  <input
                    type="number"
                    step={25000}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Status Unit</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as CarStatus)}
                    className="w-full rounded-xl border border-zinc-200 px-2 py-2 outline-none focus:border-blue-500"
                  >
                    <option value="Ready">Ready</option>
                    <option value="Booked">Booked</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">URL Foto Mobil</label>
                <input
                  type="url"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsCarModalOpen(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2 font-semibold text-zinc-600 hover:bg-zinc-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Simpan Armada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER & DOCUMENT REVIEW */}
      {reviewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl p-6 max-h-[92vh] overflow-y-auto space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="text-base font-black text-zinc-900">Verifikasi & Proses Pesanan</h3>
                <p className="text-xs text-zinc-500 font-mono">ID: {reviewOrder.id}</p>
              </div>
              <button
                onClick={() => setReviewOrder(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                ✕
              </button>
            </div>

            {/* Step-by-Step Lifecycle Banner */}
            {reviewOrder.status === 'Pending Verification' && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-950">Langkah 1: Menunggu Verifikasi DP</p>
                  <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                    Periksa mutasi rekening bank rental. Jika uang DP 30% (<strong>{formatIDR(reviewOrder.dpAmount)}</strong>) sudah masuk, klik tombol hijau di bawah untuk mengunci unit mobil.
                  </p>
                </div>
              </div>
            )}

            {reviewOrder.status === 'Approved' && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-emerald-950">Langkah 2: DP Terverifikasi & Unit Terkunci</p>
                  <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                    Armada aman terkunci. Sisa pelunasan 70% (<strong>{formatIDR(reviewOrder.remainingAmount)}</strong>) ditagihkan saat serah terima kunci mobil.
                  </p>
                </div>
              </div>
            )}

            {reviewOrder.status === 'Ongoing' && (
              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3.5 flex items-start gap-3">
                <CarIcon className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-indigo-950">Langkah 3: Mobil Sedang Digunakan Penyewa</p>
                  <p className="text-[11px] text-indigo-800 mt-0.5 leading-relaxed">
                    Unit mobil sedang di luar dan belum tersedia untuk booking lain. Sewa berakhir <strong>{reviewOrder.endDate}</strong>. Klik tombol biru setelah mobil kembali.
                  </p>
                </div>
              </div>
            )}

            {reviewOrder.status === 'Completed' && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3.5 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-blue-950">Langkah 4: Sewa Selesai & Lunas</p>
                  <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
                    Unit mobil telah kembali dan seluruh tagihan telah dilunasi oleh penyewa.
                  </p>
                </div>
              </div>
            )}

            {reviewOrder.status === 'Cancelled' && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 flex items-start gap-3">
                <XCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-rose-950">Pesanan Dibatalkan / Ditolak</p>
                  <p className="text-[11px] text-rose-800 mt-0.5 leading-relaxed">
                    Pesanan ini tidak aktif. Unit mobil bebas disewa oleh pelanggan lain.
                  </p>
                </div>
              </div>
            )}

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Customer Box */}
              <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3.5 space-y-2">
                <p className="font-bold text-zinc-800 uppercase tracking-wider text-[11px]">Data Penyewa</p>
                <div>
                  <span className="text-zinc-500 text-[11px] block">Nama:</span>
                  <span className="font-bold text-zinc-900">{reviewOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[11px] block">WhatsApp:</span>
                  <a
                    href={`https://wa.me/${reviewOrder.customerPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono font-bold text-emerald-600 hover:underline"
                  >
                    <MessageCircle className="h-3 w-3" />
                    <span>{reviewOrder.customerPhone}</span>
                  </a>
                </div>
                <div>
                  <span className="text-zinc-500 text-[11px] block">Domisili:</span>
                  <span className="text-zinc-700">{reviewOrder.customerAddress}</span>
                </div>
              </div>

              {/* Booking Box */}
              <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3.5 space-y-2">
                <p className="font-bold text-zinc-800 uppercase tracking-wider text-[11px]">Armada & Sewa</p>
                <div>
                  <span className="text-zinc-500 text-[11px] block">Mobil:</span>
                  <span className="font-bold text-zinc-900">{reviewOrder.carName}</span>
                  <span className="ml-1 text-[11px] font-mono text-zinc-400">({reviewOrder.carPlate})</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[11px] block">Layanan:</span>
                  <span className="font-semibold text-blue-700">{reviewOrder.serviceType}</span>
                  {reviewOrder.deliveryLocation && (
                    <span className="block text-[11px] text-zinc-500">Antar: {reviewOrder.deliveryLocation}</span>
                  )}
                </div>
                <div>
                  <span className="text-zinc-500 text-[11px] block">Jadwal:</span>
                  <span className="text-zinc-800 font-medium">
                    {reviewOrder.startDate} s/d {reviewOrder.endDate} ({reviewOrder.totalDays} Hari)
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Summary Box */}
            <div className="rounded-xl border border-zinc-200 p-3.5 space-y-2 text-xs bg-white">
              <div className="flex justify-between items-center">
                <span className="font-bold text-zinc-800 uppercase tracking-wider text-[11px]">Rincian Keuangan</span>
                <Link
                  href={`/pesanan/${reviewOrder.id}`}
                  target="_blank"
                  className="text-[11px] text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>Buka Resi Digital Customer</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Total Tarif</span>
                  <span className="font-extrabold text-zinc-900 text-xs sm:text-sm">{formatIDR(reviewOrder.totalPrice)}</span>
                </div>

                <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 uppercase font-semibold block">DP 30%</span>
                  <span className="font-extrabold text-emerald-700 text-xs sm:text-sm">{formatIDR(reviewOrder.dpAmount)}</span>
                  <span className="text-[10px] block mt-0.5 text-emerald-800 font-medium">
                    {reviewOrder.paymentStatus === 'Menunggu DP' ? '⏳ Belum Dikonfirmasi' : '✓ Telah Diterima'}
                  </span>
                </div>

                <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                  <span className="text-[10px] text-blue-800 uppercase font-semibold block">Sisa 70%</span>
                  <span className="font-extrabold text-blue-700 text-xs sm:text-sm">{formatIDR(reviewOrder.remainingAmount)}</span>
                  <span className="text-[10px] block mt-0.5 text-blue-800 font-medium">
                    {reviewOrder.paymentStatus === 'Lunas' ? '✓ Lunas' : 'Saat Serah Terima'}
                  </span>
                </div>
              </div>
            </div>

            {/* Document Uploads Preview */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                Dokumen Persyaratan (KTP & SIM)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-zinc-200 p-2 text-center bg-zinc-50">
                  <p className="text-[11px] font-bold text-zinc-700 mb-1">Foto KTP</p>
                  {reviewOrder.ktpUrl ? (
                    <>
                      <img
                        src={reviewOrder.ktpUrl}
                        alt="KTP"
                        className="h-28 w-full rounded-lg object-cover border border-zinc-200"
                      />
                      <a
                        href={reviewOrder.ktpUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-blue-600 hover:underline font-semibold"
                      >
                        Buka Foto Asli <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </>
                  ) : (
                    <div className="h-28 flex flex-col justify-center items-center text-zinc-400 text-xs">
                      <span>Belum diunggah di web</span>
                      <span className="text-[10px] text-zinc-400 mt-1">(Bisa diminta via WhatsApp)</span>
                    </div>
                  )}
                </div>

                {reviewOrder.serviceType === 'Lepas Kunci' ? (
                  <div className="rounded-xl border border-zinc-200 p-2 text-center bg-zinc-50">
                    <p className="text-[11px] font-bold text-zinc-700 mb-1">Foto SIM A</p>
                    {reviewOrder.simUrl ? (
                      <>
                        <img
                          src={reviewOrder.simUrl}
                          alt="SIM A"
                          className="h-28 w-full rounded-lg object-cover border border-zinc-200"
                        />
                        <a
                          href={reviewOrder.simUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-blue-600 hover:underline font-semibold"
                        >
                          Buka Foto Asli <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </>
                    ) : (
                      <div className="h-28 flex flex-col justify-center items-center text-zinc-400 text-xs">
                        <span>Belum diunggah di web</span>
                        <span className="text-[10px] text-zinc-400 mt-1">(Bisa diminta via WhatsApp)</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-zinc-200 p-4 text-center flex flex-col justify-center items-center text-zinc-400 text-xs">
                    <span className="font-semibold">Bebas Syarat SIM A</span>
                    <span className="text-[10px] mt-1 text-zinc-500">(Pakai Layanan Driver)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Clear Contextual Footer Actions */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              {reviewOrder.status === 'Pending Verification' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus(reviewOrder.id, 'Cancelled')}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
                  >
                    Tolak / Batalkan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus(reviewOrder.id, 'Approved', 'DP Dikonfirmasi')}
                    className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-700"
                  >
                    ✓ DP Sudah Masuk, Kunci Unit
                  </button>
                </>
              )}

              {reviewOrder.status === 'Approved' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus(reviewOrder.id, 'Cancelled')}
                    className="text-xs text-zinc-400 font-semibold hover:text-rose-600"
                  >
                    Batalkan Sewa
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus(reviewOrder.id, 'Ongoing', 'Pelunasan Dikonfirmasi')}
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-700"
                  >
                    ✓ Pelunasan Diterima & Serah Terima Kunci
                  </button>
                </>
              )}

              {reviewOrder.status === 'Ongoing' && (
                <>
                  <button
                    type="button"
                    onClick={() => setReviewOrder(null)}
                    className="text-xs text-zinc-400 font-semibold hover:text-zinc-600"
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus(reviewOrder.id, 'Completed', 'Lunas')}
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-700"
                  >
                    ✓ Mobil Sudah Kembali, Sewa Selesai
                  </button>
                </>
              )}

              {(reviewOrder.status === 'Completed' || reviewOrder.status === 'Cancelled') && (
                <div className="flex justify-end w-full">
                  <button
                    type="button"
                    onClick={() => setReviewOrder(null)}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
