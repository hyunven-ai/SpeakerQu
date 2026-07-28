import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?search=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-200/60 pb-5">
        <Search className="w-6 h-6 text-slate-400" />
        <h1 className="text-2xl font-black text-slate-800">
          Hasil Pencarian untuk: <span className="text-blue-600">"{query}"</span>
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center max-w-lg mx-auto mt-10">
          <div className="text-slate-400 text-5xl mb-4 font-black">☹</div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Produk Tidak Ditemukan</h3>
          <p className="text-sm text-slate-500">
            Kami tidak menemukan speaker yang cocok dengan kata kunci "{query}". Silakan cari kata kunci lain seperti "JBL", "Bose", atau "Soundbar".
          </p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-slate-500 mb-6">Ditemukan {products.length} speaker yang cocok.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
