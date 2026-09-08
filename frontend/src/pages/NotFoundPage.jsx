import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { VolumeX, ArrowLeft, Home, ShoppingBag, MessageCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
      <SEO 
        title="404 - Halaman Tidak Ditemukan"
        description="Maaf, halaman audio yang Anda cari tidak ditemukan atau telah dipindahkan."
      />

      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-3d-soft">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto">
          <VolumeX className="w-10 h-10" />
        </div>

        <div>
          <span className="text-4xl sm:text-5xl font-black text-blue-600 tracking-tight block">
            404
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Sepertinya gelombang frekuensi yang Anda tuju sedang terputus atau alamat URL telah dipindahkan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Home</span>
          </Link>
          <Link
            to="/products"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3.5 px-4 rounded-xl transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Katalog Produk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
