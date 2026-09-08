import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import SEO from '../components/SEO';
import CategoryTabBar from '../components/CategoryTabBar';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const BRANDS = ['Semua Brand', 'BareTone', 'SoundBest', 'Lainnya'];
const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state from URL or default
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState('Semua Brand');
  const [priceRange, setPriceRange] = useState(10000000); // Max 10 Juta
  const [sortBy, setSortBy] = useState('newest'); // newest, price-asc, price-desc, name
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed fetching categories:', err));

    // Fetch products
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed fetching products:', err);
        setLoading(false);
      });
  }, []);

  // Synchronize URL search params
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) setSelectedCategory(urlCategory);
    const urlSearch = searchParams.get('search');
    if (urlSearch) setSearchQuery(urlSearch);
  }, [searchParams]);

  // Format IDR helper
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  // Filter and Sort logic
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category?.slug !== selectedCategory) {
          return false;
        }

        // Brand filter
        if (selectedBrand !== 'Semua Brand') {
          const isBaretone = p.nama.toLowerCase().includes('baretone');
          const isSoundbest = p.nama.toLowerCase().includes('soundbest');
          if (selectedBrand === 'BareTone' && !isBaretone) return false;
          if (selectedBrand === 'SoundBest' && !isSoundbest) return false;
          if (selectedBrand === 'Lainnya' && (isBaretone || isSoundbest)) return false;
        }

        // Price filter
        if (p.harga > priceRange) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.nama.toLowerCase().includes(q);
          const matchDesc = (p.deskripsi || '').toLowerCase().includes(q);
          const matchCat = (p.category?.nama || '').toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.harga - b.harga;
        if (sortBy === 'price-desc') return b.harga - a.harga;
        if (sortBy === 'name') return a.nama.localeCompare(b.nama);
        // Default newest
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [products, selectedCategory, selectedBrand, priceRange, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
    setSearchParams(slug === 'all' ? {} : { category: slug });
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('Semua Brand');
    setPriceRange(10000000);
    setSearchQuery('');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen py-10 bg-slate-50/70">
      <SEO 
        title="Katalog Produk Audio & Sound System"
        description="Eksplor speaker aktif BareTone, portable trolley Bluetooth, mixer SoundBest, dan wireless mic UHF bergaransi resmi di Nurseha Audio."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-block bg-blue-50 border border-blue-200/60 px-3.5 py-1 rounded-full text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
            Katalog Resmi Nurseha Audio
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Produk Audio
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Temukan perangkat audio yang sesuai dengan kebutuhan Anda. Semua produk 100% original bergaransi resmi distributor.
          </p>
        </div>

        {/* Category Navigation Segmented Tab Bar */}
        <CategoryTabBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryClick}
          products={products}
        />

        {/* Search & Sort Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari nama speaker, watt, atau tipe..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none text-xs transition-all"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 whitespace-nowrap">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Urutkan:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
              <option value="name">Nama (A-Z)</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-200 px-3.5 py-2.5 rounded-xl text-xs font-bold"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
          </div>

        </div>

        {/* Main Catalog Layout (Sidebar Filters + Products Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  Filter Produk
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {/* Brand Filter */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Brand Speaker
                </h4>
                <div className="space-y-2">
                  {BRANDS.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="brandFilter"
                        checked={selectedBrand === brand}
                        onChange={() => {
                          setSelectedBrand(brand);
                          setCurrentPage(1);
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Maks. Harga
                  </h4>
                  <span className="text-xs font-bold text-blue-600">
                    {formatRupiah(priceRange)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={10000000}
                  step={250000}
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Rp 500rb</span>
                  <span>Rp 10jt+</span>
                </div>
              </div>

              {/* Trust Badge in Sidebar */}
              <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/60 text-xs text-slate-600 space-y-2">
                <div className="font-bold text-blue-900">🛡️ Jaminan Nurseha Audio</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Semua unit melewati uji fungsi (Quality Control) sebelum dikirim ke alamat Anda.
                </p>
              </div>
            </div>
          </aside>

          {/* Products Grid (Desktop 3/4 cols, Mobile 2 cols) */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto shadow-xs">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Produk Tidak Ditemukan</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Tidak ada produk yang cocok dengan kombinasi filter atau kata kunci Anda saat ini.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                      aria-label="Halaman Sebelumnya"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                      aria-label="Halaman Selanjutnya"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
}
