import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send, 
  Sparkles, 
  CheckCircle2,
  Building2
} from 'lucide-react';

export default function ContactPage() {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    subject: 'Konsultasi Speaker Audio',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  const waNumber = settings?.nomorWhatsapp || '6287777835864';
  const storeAddress = settings?.alamat || 'TM HARCO GLODOK, lantai 6 blok AOF no 16\nJln Hayam Wuruk, kel. mangga besar, kec taman sari, jakarta barat - 11180';
  const mapLink = settings?.mapLink || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.8624103138865!2d106.81741517457788!3d-6.149174093837887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f7435f3dfd95%3A0xe54c15dfbb4927a4!2sHarco%20Glodok!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid';

  const handleSubmit = (e) => {
    e.preventDefault();
    // Launch WhatsApp with prefilled message
    const text = `Halo Nurseha Audio,\nNama: ${formData.name}\nWhatsApp: ${formData.whatsapp}\nEmail: ${formData.email || '-'}\nSubjek: ${formData.subject}\nPesan: ${formData.message}`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    setIsSubmitted(true);
  };

  // LocalBusiness Schema
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    "name": "Nurseha Audio",
    "image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80",
    "telephone": `+${waNumber}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "TM Harco Glodok Lantai 6 Blok AOF No. 16, Jl. Hayam Wuruk",
      "addressLocality": "Jakarta Barat",
      "postalCode": "11180",
      "addressCountry": "ID"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "09:00",
      "closes": "21:00"
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50/60">
      <SEO 
        title="Hubungi Kami - Lokasi & Layanan Konsultasi Audio"
        description="Hubungi Nurseha Audio di TM Harco Glodok Jakarta Barat. Konsultasikan kebutuhan speaker dan dapatkan penawaran terbaik via WhatsApp."
        schema={businessSchema}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-20 lg:py-24 rounded-b-[3rem] shadow-2xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 px-4 py-1.5 rounded-full text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Layanan Pelanggan & Showroom
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Hubungi Nurseha Audio
          </h1>
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
            Kunjungi toko fisik kami di TM Harco Glodok atau konsultasikan langsung kebutuhan tata suara Anda via chat WhatsApp.
          </p>
        </div>
      </section>

      {/* Main Contact Grid (Info + Form) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Informasi Lengkap</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Kunjungi Showroom Kami
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Anda dapat datang langsung untuk mendengarkan demo suara speaker, menguji microphone wireless, atau mengambil pesanan secara langsung.
              </p>
            </div>

            <div className="space-y-4">
              {/* Alamat Fisik */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-3d-soft flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Alamat Toko Fisik</h3>
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed mt-1">
                    {storeAddress}
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-3d-soft flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Nomor WhatsApp Resmi</h3>
                  <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 font-bold hover:underline block mt-1">
                    +{waNumber}
                  </a>
                  <p className="text-[11px] text-slate-400 mt-0.5">Respon cepat setiap hari</p>
                </div>
              </div>

              {/* Jam Operasional */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-3d-soft flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Jam Operasional</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Senin - Minggu: <strong>09.00 - 21.00 WIB</strong>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Buka setiap hari termasuk hari libur nasional</p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-3d-soft flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Email Resmi</h3>
                  <p className="text-xs text-slate-600 mt-1">info@nursehaaudio.com</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Untuk penawaran proyek & pengadaan instansi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-3d-soft">
              <h3 className="text-xl font-black text-slate-900 mb-2">Kirim Pesan Konsultasi</h3>
              <p className="text-xs text-slate-500 mb-6">
                Isi formulir di bawah ini dan pesan Anda akan langsung terhubung dengan tim teknisi kami via WhatsApp.
              </p>

              {isSubmitted && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Pesan Anda telah berhasil diteruskan ke WhatsApp! Kami akan segera merespons Anda.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">Nomor WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 08123456789"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">Email (Opsional)</label>
                    <input
                      type="email"
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">Subjek Keperluan</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option>Konsultasi Speaker Audio</option>
                      <option>Paket Sound System Cafe</option>
                      <option>Setting Karaoke Keluarga</option>
                      <option>Klaim Garansi & Servis</option>
                      <option>Pengadaan Instansi / Grosir</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Pesan atau Rencana Kebutuhan Anda *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ceritakan detail ruangan, anggaran, atau tipe speaker yang Anda minati..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan via WhatsApp</span>
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Google Maps Embed Section */}
        <div className="mt-16 rounded-3xl overflow-hidden border border-slate-200/80 shadow-3d-soft bg-white p-4">
          <div className="h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-100">
            <iframe
              src={mapLink}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Lokasi Toko Nurseha Audio"
            />
          </div>
        </div>

      </section>
    </div>
  );
}
