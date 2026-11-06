'use client';

import { Car } from '@/types';
import { formatIDR } from '@/data/dummy';
import { Users, Briefcase, Fuel, Cog, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface CarCardProps {
  car: Car;
  isAvailableOnDate: boolean;
  startDate?: string;
  endDate?: string;
  onOpenDetail: (car: Car) => void;
  onBook: (car: Car) => void;
}

export default function CarCard({
  car,
  isAvailableOnDate,
  onOpenDetail,
  onBook
}: CarCardProps) {
  const isReady = car.status === 'Ready' && isAvailableOnDate;

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-zinc-300">
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
          <img
            src={car.imageUrl}
            alt={car.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="rounded-md bg-zinc-900/80 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
              {car.category}
            </span>
            <span className="rounded-md bg-blue-600/90 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
              {car.year}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            {car.status === 'Maintenance' ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/90 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                <AlertCircle className="h-3 w-3" /> Bengkel
              </span>
            ) : isReady ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/90 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                <CheckCircle2 className="h-3 w-3" /> Tersedia
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-600/90 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                <XCircle className="h-3 w-3" /> Terbooking
              </span>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{car.brand}</p>
              <h3 className="text-base font-bold text-zinc-900 line-clamp-1">{car.name}</h3>
            </div>
            <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-mono text-zinc-600">
              {car.plateNumber}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-zinc-600">
            <div className="flex items-center gap-1.5">
              <Cog className="h-3.5 w-3.5 text-zinc-400" />
              <span>{car.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-zinc-400" />
              <span>{car.seats} Kursi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-zinc-400" />
              <span>{car.luggage} Koper</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="h-3.5 w-3.5 text-zinc-400" />
              <span>{car.fuelType}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-100 p-4 sm:p-5 pt-3">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-xs text-zinc-500">Harga Sewa</span>
          <div className="text-right">
            <span className="text-lg font-extrabold text-blue-700">{formatIDR(car.pricePerDay)}</span>
            <span className="text-xs text-zinc-500"> / hari</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onOpenDetail(car)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            Spesifikasi
          </button>
          <button
            type="button"
            onClick={() => onBook(car)}
            disabled={!isReady}
            className={`w-full rounded-xl py-2 text-xs font-semibold text-white transition-colors ${
              isReady
                ? 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                : 'cursor-not-allowed bg-zinc-300 text-zinc-500'
            }`}
          >
            {isReady ? 'Sewa Sekarang' : 'Tidak Tersedia'}
          </button>
        </div>
      </div>
    </div>
  );
}
