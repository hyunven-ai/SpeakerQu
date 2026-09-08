import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { SERVICES_LIST } from '../data/servicesData';
import { Sparkles, MessageCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  const waNumber = '6287777835864';

  return (
    <div className="min-h-screen pb-20 bg-slate-50/60">
      <SEO 
        title="Layanan Tata Suara Profesional & Instalasi Audio"
        description="Solusi lengkap layanan audio: konsultasi, instalasi speaker cafe, setup karaoke keluarga, hingga maintenance audio di Harco Glodok Jakarta."
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-20 lg:py-24 rounded-b-[3rem] shadow-2xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 px-4 py-1.5 rounded-full text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Layanan Audio Komprehensif
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Layanan Tata Suara Profesional
          </h1>
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
            Mulai dari perencanaan denah akustik, rekomendasi watt, instalasi speaker cafe & ruang ibadah, hingga servis suku cadang resmi.
          </p>
        </div>
      </section>

      {/* Services Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {SERVICES_LIST.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-3d-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {svc.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {svc.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {svc.description}
                  </p>

                  {/* Benefits */}
                  <div className="pt-3 space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Keuntungan Layanan:
                    </div>
                    {svc.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  {/* Target Users */}
                  <div className="pt-2 text-[11px] text-slate-500">
                    <strong>Cocok untuk:</strong> {svc.targetUsers}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo Nurseha Audio, saya tertarik dengan layanan *${svc.title}*. Boleh dibantu konsultasi?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{svc.ctaText} via WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
