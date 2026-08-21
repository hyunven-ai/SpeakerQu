import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { ArrowLeft, Sparkles, Layers } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    // Fetch Category info (optional, just to show title/desc, if we have such endpoint or we filter from all categories)
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        const found = data.find(c => c.slug === slug);
        if (found) {
          setCategory(found);
        } else {
          setError('Kategori tidak ditemukan');
        }
      })
      .catch(err => {
        console.error('Failed fetching categories:', err);
      });

    // Fetch Products by category
    fetch(`/api/products?category=${slug}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed fetching products:', err);
        setLoading(false);
      });
  }, [slug]);

  return (
    <div className="relative min-h-screen pb-16 bg-slate-50/50">
      {/* Modern Premium Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 mb-12 shadow-2xl rounded-b-[3rem]">
        {/* Dynamic blur blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=1200&q=80')] opacity-5 mix-blend-overlay object-cover" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <button 
            onClick={() => navigate(-1)}
            className="self-start flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8 font-semibold text-sm cursor-pointer bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>

          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 px-4 py-1.5 rounded-full text-blue-400 text-xs font-semibold backdrop-blur-md mb-6">
            <Layers className="w-3.5 h-3.5" /> Kategori Produk
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight capitalize mb-6 bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
            {category ? category.nama : slug.replace('-', ' ')}
          </h1>
          
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            {category && category.deskripsi 
              ? category.deskripsi 
              : `Jelajahi koleksi premium kami untuk kategori ${slug.replace('-', ' ')}. Dapatkan penawaran terbaik dan kualitas audio yang tak tertandingi.`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center max-w-lg mx-auto">
            <div className="text-slate-400 text-5xl mb-4 font-black">☹</div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Error</h3>
            <p className="text-sm text-slate-500">{error}</p>
          </div>
        ) : (
          <>
            {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center max-w-lg mx-auto mt-10">
              <div className="text-slate-400 text-5xl mb-4 font-black">☹</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Produk Kosong</h3>
              <p className="text-sm text-slate-500">
                Belum ada produk untuk kategori ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}
