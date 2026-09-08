import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  ShieldCheck, 
  MapPin, 
  Award, 
  Users, 
  Clock, 
  Headphones, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle,
  Sparkles,
  Building2
} from 'lucide-react';

export default function AboutPage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  const waNumber = settings?.nomorWhatsapp || '6287777835864';
  const storeAddress = settings?.alamat || 'TM HARCO GLODOK, lantai 6 blok AOF no 16\nJln Hayam Wuruk, kel. mangga besar, kec taman sari, jakarta barat - 11180';

  return (
    <div className="min-h-screen pb-20 bg-slate-50/60">
      <SEO 
        title="Tentang Kami - Partner Audio Terpercaya Anda"
        description="Mengenal Nurseha Audio, toko spesialis sound system dan speaker profesional bergaransi resmi di TM Harco Glodok Jakarta Barat."
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-20 lg:py-24 rounded-b-[3rem] shadow-2xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 px-4 py-1.5 rounded-full text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Tentang Nurseha Audio
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Partner Audio Terpercaya Anda
          </h1>
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
            Menghadirkan solusi tata suara profesional, speaker aktif berkualitas tinggi, dan perangkat karaoke terbaik dengan integritas dan garansi resmi.
          </p>
        </div>
      </section>

      {/* Story & Heritage Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80"
                alt="Nurseha Audio Showroom"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white p-4 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-white/10">
                <div className="text-xs font-bold text-blue-400">Pusat Audio Glodok</div>
                <div className="text-sm font-black">TM Harco Glodok Lantai 6 Blok AOF No. 16</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Sejarah Kami</div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Dedikasi untuk Kualitas Audio yang Jujur dan Berkualitas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Berakar dari pusat elektronik legendaris Harco Glodok Jakarta Barat, <strong>Nurseha Audio</strong> hadir menjawab kebutuhan konsumen akan perangkat sound system yang tidak hanya berdaya besar, namun memiliki ketahanan komponen yang teruji dan garansi resmi.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Kami menyadari bahwa membeli speaker audio seringkali membingungkan karena banyaknya istilah teknis. Oleh karena itu, prinsip utama kami adalah memberikan rekomendasi yang jujur, ramah, dan solutif, baik untuk kebutuhan personal rumahan maupun komersial.
            </p>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                <div className="text-2xl font-black text-blue-600">100%</div>
                <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Produk Original</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                <div className="text-2xl font-black text-blue-600">5.000+</div>
                <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Unit Terkirim</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                <div className="text-2xl font-black text-blue-600">1 Tahun</div>
                <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Garansi Resmi</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Vision, Mission, & Values */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Visi */}
            <div className="bg-slate-950/60 border border-white/10 p-8 rounded-3xl backdrop-blur-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Visi Kami</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Menjadi rujukan terdepan dan toko audio nomor satu di Indonesia yang dikenal karena keaslian produk, transparansi spesifikasi, dan pelayanan purna jual terbaik.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-slate-950/60 border border-white/10 p-8 rounded-3xl backdrop-blur-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Misi Kami</h3>
              <ul className="text-xs sm:text-sm text-slate-400 space-y-2 leading-relaxed">
                <li>• Menyediakan produk audio bergaransi resmi distributor.</li>
                <li>• Memberikan panduan dan konsultasi teknis tanpa biaya komitmen.</li>
                <li>• Memastikan packing dan pengiriman ke seluruh nusantara aman.</li>
              </ul>
            </div>

            {/* Nilai / Values */}
            <div className="bg-slate-950/60 border border-white/10 p-8 rounded-3xl backdrop-blur-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Nilai Perusahaan</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Kejujuran spesifikasi, kecepatan respon pelayanan, serta tanggung jawab penuh terhadap barang yang diterima pelanggan hingga berfungsi sempurna.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Physical Store & Technical Support */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-3d-soft">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" /> Toko Fisik Resmi
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Kunjungi Showroom & Test Suara Langsung
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Kami mengundang Anda untuk berkunjung ke toko fisik kami di TM Harco Glodok. Anda dapat mendengarkan langsung dentuman bass dan kejelasan suara speaker sebelum memutuskan untuk membeli.
              </p>
              
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 whitespace-pre-line font-medium leading-relaxed">{storeAddress}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">Buka Setiap Hari: 09.00 - 21.00 WIB</span>
                </div>
                <div className="flex items-center gap-3">
                  <Headphones className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">Tim Teknisi siap mendampingi uji fungsi unit</span>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo Nurseha Audio, saya ingin janjian datang ke toko di Harco Glodok untuk test speaker.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Janjian Kunjungan via WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 h-80 bg-slate-100 relative">
              {settings?.mapLink ? (
                <iframe
                  src={settings.mapLink}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Lokasi Toko Nurseha Audio"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                  Peta Harco Glodok Jakarta Barat
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
