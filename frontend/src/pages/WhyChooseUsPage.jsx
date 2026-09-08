import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  ShieldCheck, 
  Award, 
  Headphones, 
  Tag, 
  PackageCheck, 
  Truck, 
  Wrench, 
  ArrowRight, 
  MessageCircle, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const REASONS = [
  {
    id: 1,
    title: '100% Produk Original Bersegel Pabrik',
    icon: ShieldCheck,
    color: 'blue',
    desc: 'Kami adalah authorized dealer resmi untuk brand-brand audio terkemuka seperti BareTone dan SoundBest. Setiap unit yang kami jual dijamin keaslian komponennya, bukan barang rekondisi atau tiruan.',
    points: [
      'Segel resmi distributor utuh',
      'Nomor seri mesin terdaftar resmi',
      'Komponen driver & trafo original standar pabrik',
      'Jaminan uang kembali jika barang terbukti tidak asli'
    ]
  },
  {
    id: 2,
    title: 'Garansi Resmi 1 Tahun Penuh',
    icon: Award,
    color: 'emerald',
    desc: 'Memberikan rasa aman maksimal bagi setiap pembeli. Garansi mencakup biaya servis dan penggantian suku cadang resmi selama 1 tahun sejak tanggal pembelian.',
    points: [
      'Kartu garansi resmi distributor disertakan',
      'Klaim dibantu penuh oleh tim Nurseha Audio',
      'Bisa diservis di jaringan service center resmi seluruh Indonesia',
      'Proses klaim cepat tanpa birokrasi berbelit'
    ]
  },
  {
    id: 3,
    title: 'Konsultasi Teknis Audio Gratis & Berpengalaman',
    icon: Headphones,
    color: 'indigo',
    desc: 'Banyak konsumen membeli speaker yang kekecilan atau kebesaran untuk ruangannya. Tim teknisi kami membantu menghitung kebutuhan watt, cakupan sudut suara, dan pencocokan impedansi tanpa biaya.',
    points: [
      'Konsultasi langsung via WhatsApp responsif',
      'Bimbingan panduan setting mixer dan equalizer',
      'Dukungan panduan video call saat instalasi mandiri',
      'Rekomendasi disesuaikan dengan anggaran Anda'
    ]
  },
  {
    id: 4,
    title: 'Harga Bersaing Langsung dari Pusat Glodok',
    icon: Tag,
    color: 'amber',
    desc: 'Berlokasi strategis di pusat grosir elektronik Harco Glodok, kami menawarkan harga tangan pertama yang sangat kompetitif baik untuk pembelian retail maupun paket proyek.',
    points: [
      'Harga transparan tanpa biaya tersembunyi',
      'Penawaran paket hemat untuk instalasi lengkap',
      'Diskon khusus untuk pengurus tempat ibadah dan yayasan',
      'Faktur invoice resmi untuk kebutuhan administrasi instansi'
    ]
  },
  {
    id: 5,
    title: 'Packing Ekstra Aman Berlapis & Opsi Peti Kayu',
    icon: PackageCheck,
    color: 'cyan',
    desc: 'Perangkat audio dan magnet speaker memerlukan proteksi khusus. Kami menerapkan standar kemasan berlapis untuk mencegah kerusakan fisik akibat benturan saat pengiriman jarak jauh.',
    points: [
      'Lapisan bubble wrap tebal dan kardus ganda',
      'Bungkus plastik tahan air (waterproof shrink)',
      'Opsi peti kayu kokoh untuk kiriman antar pulau',
      'Stiker Fragile penanganan hati-hati di setiap sisi'
    ]
  },
  {
    id: 6,
    title: 'Pengiriman Menjangkau Seluruh Nusantara',
    icon: Truck,
    color: 'purple',
    desc: 'Bekerja sama dengan ekspedisi kargo terpercaya di Indonesia (JNE Trucking, Sentral Cargo, Indah Kargo, Baraka, dll) untuk tarif ongkos kirim yang sangat hemat bagi barang berbobot berat.',
    points: [
      'Tarif kargo ekonomis mulai dari 10 kg',
      'Nomor resi pengiriman terlacak otomatis',
      'Pengiriman cepat dari hub logistik Jakarta Pusat',
      'Asuransi pengiriman penuh terhadap kehilangan'
    ]
  },
  {
    id: 7,
    title: 'Layanan Purna Jual & Suku Cadang Terjamin',
    icon: Wrench,
    color: 'rose',
    desc: 'Hubungan kami dengan pelanggan tidak berakhir setelah barang sampai. Kami menyediakan suku cadang lengkap (aki kering speaker, spul mic, modul bluetooth) untuk masa pakai jangka panjang.',
    points: [
      'Ketersediaan aki kering 12V cadangan original',
      'Sparepart microphone wireless dan receiver',
      'Bantuan troubleshooting jika terjadi kendala teknis',
      'Servis berkala di workshop Harco Glodok'
    ]
  }
];

export default function WhyChooseUsPage() {
  return (
    <div className="min-h-screen pb-20 bg-slate-50/60">
      <SEO 
        title="Mengapa Memilih Kami - 7 Keunggulan Nurseha Audio"
        description="Pelajari 7 alasan mengapa ribuan pelanggan dan instansi mempercayakan kebutuhan tata suara mereka kepada Nurseha Audio Harco Glodok."
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-20 lg:py-24 rounded-b-[3rem] shadow-2xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 px-4 py-1.5 rounded-full text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Standar Pelayanan Premium
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Mengapa Nurseha Audio?
          </h1>
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
            Komitmen kami menghadirkan ketenangan pikiran di setiap transaksi audio Anda melalui 7 pilar keunggulan utama.
          </p>
        </div>
      </section>

      {/* 7 Reasons Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REASONS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-3d-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Keuntungan Anda:
                  </div>
                  {item.points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Final CTA Strip */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Siap Menemukan Speaker Impian Anda?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Hubungi tim teknisi kami sekarang dan dapatkan penawaran harga terbaik langsung via WhatsApp.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/6287777835864"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black shadow-lg transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-blue-600" />
              <span>Chat WhatsApp</span>
            </a>
            <Link
              to="/products"
              className="bg-blue-700/80 hover:bg-blue-700 text-white border border-white/20 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all"
            >
              Lihat Produk
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
