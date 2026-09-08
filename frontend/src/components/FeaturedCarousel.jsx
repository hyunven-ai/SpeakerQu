import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingCart, Eye, Star, Flame, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function FeaturedCarousel({ products = [] }) {
  const scrollContainerRef = useRef(null);
  const { addToCart } = useCart();

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Only take top active products (max 8)
  const featuredList = products.slice(0, 8);

  if (featuredList.length === 0) return null;

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Produk Terpopuler
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Rekomendasi Audio Terbaik
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Speaker terfavorit pelanggan untuk panggung, karaoke, hingga cafe dengan kualitas suara teruji.
          </p>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => scroll('left')}
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
            aria-label="Geser ke kiri"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
            aria-label="Geser ke kanan"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {featuredList.map((product, idx) => {
          const mainImage = product.images && product.images.length > 0
            ? (product.images[0].url.startsWith('http') ? product.images[0].url : `http://localhost:5000${product.images[0].url}`)
            : 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80';
          
          const isOutOfStock = product.stok <= 0;

          return (
            <div
              key={product.id}
              className="flex-shrink-0 w-[270px] sm:w-[290px] bg-white rounded-3xl border border-slate-100 shadow-3d-soft hover:shadow-3d-glow-brand transition-all duration-300 flex flex-col group overflow-hidden"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Product Visual */}
              <div className="relative aspect-square overflow-hidden bg-slate-50 flex items-center justify-center p-4">
                {/* Ranking / Hot Badge */}
                <div className="absolute top-3 left-3 z-10 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-extrabold tracking-wide px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>#{idx + 1} Best Seller</span>
                </div>

                {product.category && (
                  <span className="absolute top-3 right-3 z-10 bg-blue-50 text-blue-700 border border-blue-200/60 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {product.category.nama.split(' ')[0]}
                  </span>
                )}

                <img
                  src={mainImage}
                  alt={product.nama}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Quick Eye Action Overlay */}
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    to={`/products/${product.slug}`}
                    className="bg-white hover:bg-slate-50 text-slate-900 p-3 rounded-full shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center"
                    title="Lihat Detail Produk"
                  >
                    <Eye className="w-5 h-5 text-slate-800" />
                  </Link>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex flex-col flex-1">
                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2 min-h-[2.5rem]">
                  <Link to={`/products/${product.slug}`}>
                    {product.nama}
                  </Link>
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">(4.9)</span>
                </div>

                <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Harga</div>
                    <div className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                      {formatRupiah(product.harga)}
                    </div>
                  </div>

                  {isOutOfStock ? (
                    <span className="w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-400 text-center bg-slate-50 border border-slate-100">
                      Stok Habis
                    </span>
                  ) : (
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2.5 px-3 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>+ Keranjang</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
