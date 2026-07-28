import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stok <= 0;
  
  // Format price helper
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Get primary image url
  const mainImage = product.images && product.images.length > 0
    ? (product.images[0].url.startsWith('http') ? product.images[0].url : `http://localhost:5000${product.images[0].url}`)
    : 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80'; // Fallback

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-3d-soft hover:shadow-3d-glow-brand hover:scale-[1.03] transition-all duration-300 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {isOutOfStock && (
          <div className="absolute top-3 left-3 z-10 bg-red-600/90 text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs">
            Habis
          </div>
        )}
        
        {product.category && (
          <span className="absolute top-3 right-3 z-10 bg-slate-900/80 text-white text-[10px] font-medium tracking-wide px-2.5 py-1 rounded-full backdrop-blur-xs">
            {product.category.nama}
          </span>
        )}

        <img
          src={mainImage}
          alt={product.nama}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Hover overlay for quick action */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Link
            to={`/produk/${product.slug}`}
            className="bg-white hover:bg-slate-50 text-slate-900 p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center"
            title="Lihat Detail"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors mb-1.5">
          <Link to={`/produk/${product.slug}`}>
            {product.nama}
          </Link>
        </h3>
        
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
          {product.deskripsi}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
          <div>
            <div className="text-xs text-slate-400 font-medium">Harga</div>
            <div className="text-lg font-black text-slate-900 tracking-tight">
              {formatRupiah(product.harga)}
            </div>
          </div>
          
          {isOutOfStock ? (
            <Link
              to={`/produk/${product.slug}`}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/50 flex items-center gap-1.5"
            >
              Tanya Stok
            </Link>
          ) : (
            <button
              onClick={() => addToCart(product, 1)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> + Keranjang
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
