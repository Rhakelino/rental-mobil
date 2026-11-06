'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getBookingById } from '@/services/api';
import { Booking } from '@/types';
import { formatIDR, generateWhatsAppLink, BANK_ACCOUNTS } from '@/data/dummy';
import {
  CheckCircle,
  Clock,
  Car,
  Calendar,
  MapPin,
  Phone,
  User,
  CreditCard,
  Download,
  MessageCircle,
  ArrowLeft,
  Loader2
} from 'lucide-react';

export default function BookingReceiptClient({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getBookingById(resolvedParams.id)
      .then((data) => {
        if (data) {
          setBooking(data);
        } else {
          setError('Pesanan tidak ditemukan');
        }
      })
      .catch(() => setError('Gagal memuat data pesanan'))
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-3 text-sm text-zinc-500">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="mt-4 text-lg font-bold text-zinc-900">Pesanan Tidak Ditemukan</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Booking ID <span className="font-mono font-bold">{resolvedParams.id}</span> tidak ada dalam sistem.
          </p>
          <Link
            href="/cek-pesanan"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Cek Pesanan Lain
          </Link>
        </div>
      </div>
    );
  }

  const statusColor =
    booking.status === 'Approved'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : booking.status === 'Ongoing'
      ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
      : booking.status === 'Pending Verification'
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : booking.status === 'Completed'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-zinc-100 text-zinc-600 border-zinc-200';

  const whatsappLink = generateWhatsAppLink(booking);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-blue-50/30 to-zinc-50 py-8 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <Download className="h-3.5 w-3.5" />
            Unduh Resi
          </button>
        </div>

        {/* Main Receipt Card */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
          {/* Status Banner */}
          <div className={`border-b px-6 py-4 ${statusColor}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {booking.status === 'Pending Verification' && <Clock className="h-5 w-5" />}
                {booking.status === 'Approved' && <CheckCircle className="h-5 w-5" />}
                {booking.status === 'Ongoing' && <Car className="h-5 w-5" />}
                {booking.status === 'Completed' && <CheckCircle className="h-5 w-5" />}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Status Pesanan</p>
                  <p className="text-base font-black">{booking.status}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Booking ID</p>
                <p className="font-mono text-lg font-black">{booking.id}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 p-6">
            {/* Car Info */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Car className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Armada yang Disewa</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900">{booking.carName}</p>
                  <p className="mt-0.5 font-mono text-xs text-zinc-500">Plat: {booking.carPlate}</p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-400" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-500">Nama Penyewa</p>
                    <p className="mt-0.5 text-sm font-bold text-zinc-900">{booking.customerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-400" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-500">Nomor WhatsApp</p>
                    <p className="mt-0.5 text-sm font-bold text-zinc-900">{booking.customerPhone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-400" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-500">Periode Sewa</p>
                    <p className="mt-0.5 text-sm font-bold text-zinc-900">
                      {booking.startDate} s/d {booking.endDate}
                    </p>
                    <p className="text-xs text-zinc-500">{booking.totalDays} Hari</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-400" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-500">Layanan</p>
                    <p className="mt-0.5 text-sm font-bold text-zinc-900">{booking.serviceType}</p>
                    {booking.deliveryLocation && (
                      <p className="text-xs text-zinc-500">Lokasi: {booking.deliveryLocation}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
              <div className="mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <p className="text-xs font-bold uppercase tracking-wider text-blue-900">Rincian Pembayaran</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Sewa Mobil ({booking.totalDays} hari)</span>
                  <span className="font-bold text-zinc-900">{formatIDR(booking.dailyPrice * booking.totalDays)}</span>
                </div>
                {booking.driverFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Biaya Sopir ({booking.totalDays} hari)</span>
                    <span className="font-bold text-zinc-900">{formatIDR(booking.driverFee)}</span>
                  </div>
                )}
                {booking.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Biaya Antar/Jemput</span>
                    <span className="font-bold text-zinc-900">{formatIDR(booking.deliveryFee)}</span>
                  </div>
                )}
                <div className="border-t border-blue-200 pt-2">
                  <div className="flex justify-between text-base">
                    <span className="font-bold text-zinc-900">Total Biaya</span>
                    <span className="font-black text-blue-700">{formatIDR(booking.totalPrice)}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs border-t border-blue-100 pt-2">
                  <span className="text-zinc-600">DP (30%)</span>
                  <span className="font-bold text-emerald-700">{formatIDR(booking.dpAmount)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-600">Sisa Pelunasan (70%)</span>
                  <span className="font-bold text-amber-700">{formatIDR(booking.remainingAmount)}</span>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div
              className={`rounded-xl border p-4 ${
                booking.paymentStatus === 'Lunas'
                  ? 'border-blue-200 bg-blue-50/30'
                  : booking.paymentStatus === 'DP Dikonfirmasi'
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : 'border-amber-200 bg-amber-50/30'
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-700">Status Pembayaran</p>
              <p className="mt-1 text-base font-black text-zinc-900">{booking.paymentStatus}</p>
            </div>

            {/* Bank Accounts (if pending) */}
            {booking.status === 'Pending Verification' && (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Transfer DP ke Rekening Berikut
                </p>
                <div className="space-y-2">
                  {BANK_ACCOUNTS.map((acc, idx) => (
                    <div key={idx} className="rounded-lg border border-zinc-200 bg-white p-3 text-xs">
                      <p className="font-bold text-zinc-900">{acc.bank}</p>
                      <p className="font-mono text-sm font-bold text-blue-700">{acc.accountNumber}</p>
                      <p className="text-zinc-500">{acc.accountHolder}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp CTA */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-emerald-700"
            >
              <MessageCircle className="h-5 w-5" />
              Hubungi Admin via WhatsApp
            </a>

            {/* Footer Note */}
            <div className="rounded-lg bg-zinc-100 p-3 text-center text-xs text-zinc-600">
              Simpan halaman ini sebagai bukti booking. Link resi:{' '}
              <span className="font-mono font-semibold">
                {typeof window !== 'undefined' && window.location.href}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
