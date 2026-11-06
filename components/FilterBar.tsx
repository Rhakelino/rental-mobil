'use client';

import { useSyncExternalStore } from 'react';
import { CarCategory, CarTransmission } from '@/types';
import { Calendar, Filter, RotateCcw } from 'lucide-react';

const subscribe = () => () => {};
const getClientToday = () => new Date().toISOString().split('T')[0];
const getServerToday = () => '';

interface FilterBarProps {
  startDate: string;
  endDate: string;
  selectedCategory: string;
  selectedTransmission: string;
  selectedSeats: string;
  onlyAvailable: boolean;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onTransmissionChange: (val: string) => void;
  onSeatsChange: (val: string) => void;
  onOnlyAvailableChange: (val: boolean) => void;
  onReset: () => void;
}

const CATEGORIES: ('Semua' | CarCategory)[] = ['Semua', 'MPV', 'SUV', 'City Car', 'Sedan'];
const TRANSMISSIONS: ('Semua' | CarTransmission)[] = ['Semua', 'Matic', 'Manual'];
const SEAT_OPTIONS = [
  { label: 'Semua Kursi', value: 'Semua' },
  { label: '5 Kursi', value: '5' },
  { label: '7 Kursi', value: '7' }
];

export default function FilterBar({
  startDate,
  endDate,
  selectedCategory,
  selectedTransmission,
  selectedSeats,
  onlyAvailable,
  onStartDateChange,
  onEndDateChange,
  onCategoryChange,
  onTransmissionChange,
  onSeatsChange,
  onOnlyAvailableChange,
  onReset
}: FilterBarProps) {
  const today = useSyncExternalStore(subscribe, getClientToday, getServerToday);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">
        {/* Date pickers for anti-overlapping check */}
        <div className="md:col-span-3">
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-zinc-700">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            <span>Tanggal Mulai</span>
          </label>
          <input
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-800 outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div className="md:col-span-3">
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-zinc-700">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            <span>Tanggal Selesai</span>
          </label>
          <input
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-800 outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        {/* Transmission & Seats */}
        <div className="grid grid-cols-2 gap-2 md:col-span-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-zinc-700">Transmisi</label>
            <select
              value={selectedTransmission}
              onChange={(e) => onTransmissionChange(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 py-2 text-xs font-medium text-zinc-800 outline-none focus:border-blue-500 focus:bg-white"
            >
              {TRANSMISSIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-zinc-700">Kapasitas</label>
            <select
              value={selectedSeats}
              onChange={(e) => onSeatsChange(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 py-2 text-xs font-medium text-zinc-800 outline-none focus:border-blue-500 focus:bg-white"
            >
              {SEAT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset button */}
        <div className="md:col-span-2 flex items-center justify-end">
          <button
            type="button"
            onClick={onReset}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 py-2 px-3 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Filter</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Availability Checkbox */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-semibold text-zinc-500 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Kategori:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-zinc-700">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => onOnlyAvailableChange(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Hanya tampilkan unit tersedia</span>
        </label>
      </div>
    </div>
  );
}
