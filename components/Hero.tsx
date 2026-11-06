import { Shield, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white py-14 sm:py-20 border-b border-zinc-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Rental Mobil Resmi & Terpercaya #1</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl sm:leading-tight">
              Sewa Mobil Cepat, <span className="text-blue-600">Anti-Ribet</span>, & Siap Jalan Kapan Saja
            </h1>

            <p className="max-w-xl text-base text-zinc-600 sm:text-lg">
              Pilihan armada terlengkap dari City Car hingga Luxury SUV. Cek ketersediaan tanggal real-time, pilih lepas kunci atau dengan driver, konfirmasi instan langsung via WhatsApp.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Unit Terawat & Wangi</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-700">
                <Shield className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>Asuransi All-Risk</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-700">
                <Clock className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <span>Layanan Siaga 24 Jam</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl shadow-blue-500/5">
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
                alt="Rental Mobil Terpercaya"
                className="h-64 w-full rounded-xl object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Promo Spesial Bulan Ini</span>
                    <h3 className="text-sm font-bold text-zinc-900">Diskon 10% Sewa Lebih dari 3 Hari</h3>
                  </div>
                  <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">Hemat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
