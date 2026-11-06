'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getBookings } from '@/services/api';
import { Booking } from '@/types';
import { formatIDR } from '@/data/dummy';
import Link from 'next/link';
import { Search, Receipt, ArrowRight, AlertCircle, Calendar, User, Car } from 'lucide-react';

export default function CheckOrderPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const term = keyword.trim().toLowerCase();
    if (!term) return;

    // If matches standard booking ID format directly, quick navigate
    if (term.startsWith('bk-') && !term.includes(' ')) {
      router.push(`/pesanan/${term.toUpperCase()}`);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const allBookings = await getBookings();
      const matched = allBookings.filter(
        (b) =>
          b.id.toLowerCase().includes(term) ||
          b.customerPhone.replace(/[^0-9]/g, '').includes(term.replace(/[^0-9]/g, '')) ||
          b.customerName.toLowerCase().includes(term)
      );
      setResults(matched);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between">
      <Navbar />

      <main className="mx-auto max-w-2xl w-full px-4 py-12 sm:py-16 flex-1">
        <div className="text-center space-y-2 mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-3">
            <Receipt className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight sm:text-3xl">Lacak Status Pesanan Sewa</h1>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Masukkan Nomor Booking (contoh: <span className="font-mono font-bold">BK-202611-001</span>) atau Nomor WhatsApp yang didaftarkan saat booking.
          </p>
        </div>

        {/* Search Box */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                required
                placeholder="Nomor Booking (BK-XXXXXX) atau No. WhatsApp"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-2.5 text-xs text-zinc-800 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-700 disabled:bg-zinc-300"
            >
              {loading ? (
                <span>Mencari pesanan...</span>
              ) : (
                <>
                  <span>Cari Resi Pesanan</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="mt-6 space-y-3">
            {results && results.length > 0 ? (
              results.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/pesanan/${booking.id}`}
                  className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs transition-all hover:border-blue-500 hover:shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-blue-700">{booking.id}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          booking.paymentStatus === 'DP Dikonfirmasi'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
                      <Car className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{booking.carName} ({booking.carPlate})</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {booking.customerName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {booking.startDate} s/d {booking.endDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-zinc-400 block">Total Biaya</span>
                      <span className="text-xs font-extrabold text-zinc-900">{formatIDR(booking.totalPrice)}</span>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-2">
                <AlertCircle className="mx-auto h-8 w-8 text-zinc-400" />
                <h4 className="text-xs font-bold text-zinc-800">Tidak ada pesanan yang sesuai</h4>
                <p className="text-[11px] text-zinc-500">
                  Pastikan nomor booking atau nomor WhatsApp yang Anda masukkan sudah benar.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
