'use client';

import { Car } from '@/types';
import { formatIDR } from '@/data/dummy';
import { X, Check, Users, Briefcase, Fuel, Cog, CalendarCheck } from 'lucide-react';

interface CarDetailModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (car: Car) => void;
}

export default function CarDetailModal({
  car,
  isOpen,
  onClose,
  onBookNow
}: CarDetailModalProps) {
  if (!isOpen || !car) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-zinc-700 shadow-md backdrop-blur-sm hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative aspect-[16/9] w-full bg-zinc-100">
          <img
            src={car.imageUrl}
            alt={car.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-3 left-4 flex gap-2">
            <span className="rounded-lg bg-zinc-900/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {car.category}
            </span>
            <span className="rounded-lg bg-blue-600/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              Tahun {car.year}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{car.brand}</span>
            <h2 className="text-xl font-extrabold text-zinc-900">{car.name}</h2>
            <p className="mt-1 text-xs text-zinc-500">{car.description}</p>
          </div>

          <div className="grid grid-cols-4 gap-2 rounded-xl bg-zinc-50 p-3 text-center border border-zinc-100">
            <div>
              <Cog className="mx-auto h-4 w-4 text-blue-600" />
              <p className="mt-1 text-[11px] font-semibold text-zinc-800">{car.transmission}</p>
              <p className="text-[10px] text-zinc-400">Transmisi</p>
            </div>
            <div>
              <Users className="mx-auto h-4 w-4 text-blue-600" />
              <p className="mt-1 text-[11px] font-semibold text-zinc-800">{car.seats} Kursi</p>
              <p className="text-[10px] text-zinc-400">Kapasitas</p>
            </div>
            <div>
              <Briefcase className="mx-auto h-4 w-4 text-blue-600" />
              <p className="mt-1 text-[11px] font-semibold text-zinc-800">{car.luggage} Koper</p>
              <p className="text-[10px] text-zinc-400">Bagasi</p>
            </div>
            <div>
              <Fuel className="mx-auto h-4 w-4 text-blue-600" />
              <p className="mt-1 text-[11px] font-semibold text-zinc-800">{car.fuelType}</p>
              <p className="text-[10px] text-zinc-400">Bahan Bakar</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-zinc-700">Fasilitas & Keunggulan</h4>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {car.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-zinc-600">
                  <Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-5 py-4">
          <div>
            <span className="text-[11px] text-zinc-500">Harga Sewa Harian</span>
            <div className="text-lg font-black text-blue-700">{formatIDR(car.pricePerDay)} <span className="text-xs font-normal text-zinc-500">/ hari</span></div>
          </div>
          <button
            type="button"
            disabled={car.status !== 'Ready'}
            onClick={() => {
              onClose();
              onBookNow(car);
            }}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed"
          >
            <CalendarCheck className="h-4 w-4" />
            <span>Pesan Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
}
