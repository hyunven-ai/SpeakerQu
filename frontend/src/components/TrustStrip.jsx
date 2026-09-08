import React from 'react';
import { ShieldCheck, MapPin, PackageCheck, Headphones } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: '100% Produk Original',
    desc: 'Garansi resmi distributor & unit baru bersegel'
  },
  {
    icon: MapPin,
    title: 'Toko Fisik Glodok',
    desc: 'TM Harco Glodok Lt. 6 Blok AOF No. 16, Jakbar'
  },
  {
    icon: PackageCheck,
    title: 'Packing Ekstra Aman',
    desc: 'Bubble tebal & opsi packing kayu antar pulau'
  },
  {
    icon: Headphones,
    title: 'Konsultasi Teknisi Gratis',
    desc: 'Bantu sesuaikan watt & akustik ruangan via WA'
  }
];

export default function TrustStrip() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-900/5 p-4 sm:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className={`flex items-start gap-3.5 ${idx > 0 ? 'pt-3 sm:pt-0 sm:pl-4' : ''}`}
              >
                <div className="bg-blue-50 border border-blue-100/80 p-2.5 rounded-xl text-blue-600 flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
