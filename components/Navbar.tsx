'use client';

import Link from 'next/link';
import { Car, PhoneCall, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Car className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">Rental<span className="text-blue-600">Mobil</span></span>
            <span className="hidden text-xs text-zinc-500 sm:inline ml-2">Digital Car Booking</span>
          </div>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6">
          <Link href="/#katalog" className="text-sm font-medium text-zinc-600 hover:text-blue-600 transition-colors">
            Katalog
          </Link>
          <Link href="/cek-pesanan" className="text-sm font-medium text-zinc-600 hover:text-blue-600 transition-colors">
            Cek Pesanan
          </Link>
          <Link href="/#syarat" className="hidden text-sm font-medium text-zinc-600 hover:text-blue-600 transition-colors sm:block">
            Syarat Sewa
          </Link>
          <a
            href="https://wa.me/6285194711558"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Hubungi WA</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
