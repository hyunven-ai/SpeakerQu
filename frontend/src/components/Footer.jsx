import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-black tracking-tight mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              SpeakerQu
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Toko online spesialis speaker premium dengan transaksi langsung dan nyaman via WhatsApp. Temukan audio impianmu sekarang!
            </p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Katalog Produk</Link>
              </li>
              <li>
                <Link to="/cari" className="hover:text-white transition-colors">Pencarian</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Metode Pemesanan
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              1. Pilih speaker favorit Anda.<br />
              2. Klik tombol <strong>Pesan via WhatsApp</strong>.<br />
              3. Chat admin toko untuk ketersediaan & pembayaran.
            </p>
            <div className="text-xs text-slate-500">
              Copyright &copy; {new Date().getFullYear()} SpeakerQu. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
