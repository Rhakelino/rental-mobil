import { Car, MapPin, Phone, Clock, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="syarat" className="border-t border-zinc-200 bg-zinc-900 text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Car className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">Rental<span className="text-blue-500">Mobil</span></span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400 max-w-sm">
              Layanan sewa mobil terpercaya di Jabodetabek & kota-kota besar. Armada tahun muda, terawat rutin, dengan pilihan lepas kunci dan driver profesional.
            </p>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span>Jl. Raya Pasar Minggu No. 88, Jakarta Selatan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span>+62 851-9471-1558 (Customer Care 24 Jam)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span>Buka Setiap Hari: 06.00 - 23.00 WIB</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Syarat & Ketentuan Sewa</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Lepas Kunci:</strong> Wajib KTP asli, SIM A aktif, & akun media sosial/ID pendukung.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Dengan Driver:</strong> Cukup reservasi dan tentukan titik penjemputan.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Durasi sewa 1 hari dihitung per 24 jam terhitung dari jam serah terima.</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Layanan Cepat</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>• Antar Jemput Bandara Soetta / Halim</li>
              <li>• Drop-off Stasiun Gambir & Senen</li>
              <li>• Sewa Mingguan & Bulanan Korporasi</li>
              <li>• Sewa Mobil Pengantin / VIP</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-500">
          <p>© 2026 RentalMobil Digital Platform. Hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
