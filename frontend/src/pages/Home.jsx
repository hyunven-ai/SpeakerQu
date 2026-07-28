import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { Sparkles, Music, Radio, Volume2, SlidersHorizontal, Tv, X, ChevronRight, MessageCircle } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('6281234567890');
  const location = useLocation();

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed fetching categories:', err));

    // Fetch settings for whatsapp number
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.nomorWhatsapp) {
          setWhatsappNumber(data.nomorWhatsapp);
        }
      })
      .catch(err => console.error('Failed fetching settings in Home:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = '/api/products';
    if (selectedCategory !== 'all') {
      url += `?category=${selectedCategory}`;
    }
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed fetching products:', err);
        setLoading(false);
      });
  }, [selectedCategory]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTarget = params.get('scroll');
    if (scrollTarget) {
      const element = document.getElementById(scrollTarget === 'katalog' ? 'katalog' : scrollTarget);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  }, [location, loading]);

  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'all':
        return <Volume2 className="w-4 h-4" />;
      case 'portable-bluetooth':
        return <Radio className="w-4 h-4" />;
      case 'partybox-karaoke':
        return <Music className="w-4 h-4" />;
      case 'home-theater-soundbar':
        return <Tv className="w-4 h-4" />;
      default:
        return <Volume2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative min-h-screen pb-16">
      
      {/* Split Modern Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white min-h-[85vh] flex items-center mb-16 rounded-b-[3.5rem] shadow-2xl">
        {/* Dynamic blur blobs */}
        <div className="absolute top-1/4 -left-16 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-0 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2.5 bg-blue-500/10 border border-blue-400/20 px-4 py-1.5 rounded-full text-blue-400 text-xs font-semibold self-start backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> High-Fidelity Audio Experience
                <div className="flex items-end gap-[3px] h-3 w-5">
                  <div className="w-[2.5px] h-full bg-blue-400 rounded-full animate-wave-1" />
                  <div className="w-[2.5px] h-full bg-blue-400 rounded-full animate-wave-2" />
                  <div className="w-[2.5px] h-full bg-blue-400 rounded-full animate-wave-3" />
                  <div className="w-[2.5px] h-full bg-blue-400 rounded-full animate-wave-4" />
                  <div className="w-[2.5px] h-full bg-blue-400 rounded-full animate-wave-5" />
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Smart Living <br />
                Starts Here With <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">
                  Speaker Premium Terbaik
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
                Koleksi speaker portable bluetooth, partybox karaoke, hingga home theater berkualitas tinggi. Nikmati kualitas audio premium dengan koneksi mudah dan penawaran terbaik langsung via WhatsApp.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#katalog"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                >
                  Lihat Produk &rarr;
                </a>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold px-8 py-3.5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                >
                  Hubungi Kami &rarr;
                </a>
              </div>

              {/* Quick Icons */}
              <div className="flex gap-8 text-slate-400 pt-4">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="bg-white/5 p-3 rounded-full border border-white/10">
                    <Music className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xs">HD Audio</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="bg-white/5 p-3 rounded-full border border-white/10">
                    <Radio className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xs">Wireless</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="bg-white/5 p-3 rounded-full border border-white/10">
                    <Volume2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xs">Deep Bass</span>
                </div>
              </div>
            </div>

            {/* Right Wallpaper Image with horizontal fade */}
            <div className="lg:col-span-5 relative w-full h-[350px] lg:h-[550px] rounded-3xl overflow-hidden shadow-3d-soft flex items-center justify-center">
              {/* Wallpaper image */}
              <img
                src="https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80"
                alt="Premium Speaker Wallpaper"
                className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[4000ms]"
              />
              {/* Gradient masks (fade to left and bottom for mobile) */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent lg:hidden" />

              {/* Floating Benefit Card (Glassmorphic) */}
              <div className="absolute bottom-6 right-6 left-6 lg:left-auto lg:w-72 glass bg-slate-950/65 border border-white/10 p-5 rounded-2xl backdrop-blur-md text-white shadow-2xl">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Keuntungan Belanja</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span>Smart Audio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span>Reliable Quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span>Direct Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span>Best Value</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div id="about-us" className="py-20 bg-white border-y border-slate-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80"
                  alt="About SpeakerQu"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-blue-600/10" />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <div className="text-blue-600 font-bold uppercase tracking-widest text-xs">About Us</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Menghadirkan Audio Premium Berkualitas Langsung ke Rumah Anda
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                Di SpeakerQu, kami berkomitmen untuk menyediakan speaker kelas dunia yang memberikan pengalaman audio terbaik. Baik Anda membutuhkan kejelasan suara untuk home theater, kepraktisan speaker nirkabel bluetooth, atau kekuatan dentuman bass untuk karaoke partybox, kami memiliki produk yang tepat untuk Anda.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">
                Semua produk kami dipilih secara cermat dari brand-brand terpercaya untuk menjamin kualitas material yang andal, kejernihan audio yang tinggi, dan kepuasan pelanggan yang optimal.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <div className="text-2xl font-black text-blue-600">100%</div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">Produk Original</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-600">24/7</div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">Layanan Bantuan</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-600">5k+</div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">Pelanggan Puas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div id="why-choose-us" className="py-20 bg-slate-50/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="text-blue-600 font-bold uppercase tracking-widest text-xs">Why Choose Us</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mengapa Berbelanja di SpeakerQu?
            </h2>
            <p className="text-slate-500 text-sm">
              Layanan profesional, produk berkualitas tinggi, dan dukungan purna jual yang andal untuk kenyamanan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100/85 hover:shadow-md transition-all space-y-4 text-left">
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-lg">
                🔊
              </div>
              <h3 className="text-base font-bold text-slate-900">Audio Premium</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Kualitas suara tinggi yang jernih dengan dentuman bass mendalam untuk kepuasan mendengarkan musik sejati.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100/85 hover:shadow-md transition-all space-y-4 text-left">
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-lg">
                🛡️
              </div>
              <h3 className="text-base font-bold text-slate-900">Garansi Resmi</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Jaminan keaslian barang 100% dan garansi resmi distributor untuk perlindungan barang Anda.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100/85 hover:shadow-md transition-all space-y-4 text-left">
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-lg">
                💬
              </div>
              <h3 className="text-base font-bold text-slate-900">Dukungan Cepat</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Konsultasikan kebutuhan audio Anda langsung kepada tim ahli kami via chat WhatsApp yang responsif.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100/85 hover:shadow-md transition-all space-y-4 text-left">
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-lg">
                💎
              </div>
              <h3 className="text-base font-bold text-slate-900">Harga Kompetitif</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Dapatkan penawaran terbaik untuk produk speaker berkualitas tanpa menguras dompet Anda.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog & Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter Section */}
        <div id="katalog" className="mb-10 scroll-mt-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Pilih Kategori Speaker
            </h2>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="md:hidden flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-2xs cursor-pointer active:scale-95 transition-transform"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              Filter
            </button>
          </div>

          {/* Desktop Filter (Pills) */}
          <div className="hidden md:flex flex-wrap gap-2.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/60 shadow-xs'
              }`}
            >
              {getCategoryIcon('all')}
              Semua Produk
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  selectedCategory === cat.slug
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/60 shadow-xs'
                }`}
              >
                {getCategoryIcon(cat.slug)}
                {cat.nama}
              </button>
            ))}
          </div>

          {/* Mobile Filter (Horizontal Swiper) */}
          <div className="md:hidden flex overflow-x-auto no-scrollbar gap-2.5 pb-2 -mx-4 px-4 scroll-smooth">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md scale-95'
                  : 'bg-white text-slate-600 border border-slate-200/80 shadow-xs'
              }`}
            >
              {getCategoryIcon('all')}
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.slug
                    ? 'bg-blue-600 text-white shadow-md scale-95'
                    : 'bg-white text-slate-600 border border-slate-200/80 shadow-xs'
                }`}
              >
                {getCategoryIcon(cat.slug)}
                {cat.nama.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Modern Glassmorphic Bottom Sheet Drawer for Mobile */}
        {isFilterDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setIsFilterDrawerOpen(false)}
            />
            
            {/* Sheet */}
            <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-[2.5rem] shadow-2xl max-h-[85vh] overflow-y-auto pb-8 pt-4 px-6 transition-transform duration-300 ease-out border-t border-slate-200/50 flex flex-col">
              {/* Drag Handle Indicator */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Kategori Speaker</h3>
                  <p className="text-xs text-slate-400">Pilih kategori untuk memfilter katalog produk</p>
                </div>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mt-4">
                {/* Option: Semua */}
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setIsFilterDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                    selectedCategory === 'all'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-xs font-bold'
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50/50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 shadow-2xs'}`}>
                      {getCategoryIcon('all')}
                    </div>
                    <div>
                      <div className="text-sm font-bold">Semua Produk</div>
                      <div className="text-xs text-slate-400 font-normal">Tampilkan seluruh koleksi speaker</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${selectedCategory === 'all' ? 'text-blue-600' : 'text-slate-300'}`} />
                </button>

                {/* Options: Categories */}
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setIsFilterDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                      selectedCategory === cat.slug
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-xs font-bold'
                        : 'border-slate-100 hover:border-slate-200 bg-slate-50/50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${selectedCategory === cat.slug ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 shadow-2xs'}`}>
                        {getCategoryIcon(cat.slug)}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{cat.nama}</div>
                        {cat.deskripsi && (
                          <div className="text-xs text-slate-400 font-normal line-clamp-1 max-w-[200px]">{cat.deskripsi}</div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${selectedCategory === cat.slug ? 'text-blue-600' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product Catalog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center max-w-lg mx-auto">
            <div className="text-slate-400 text-5xl mb-4 font-black">☹</div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Produk Tidak Ditemukan</h3>
            <p className="text-sm text-slate-500">
              Maaf, belum ada speaker yang tersedia untuk kategori yang Anda pilih saat ini. Silakan coba kategori lainnya.
            </p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3rem] text-white p-8 sm:p-16 relative overflow-hidden shadow-2xl">
            {/* Blobs */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-block bg-blue-500/10 border border-blue-400/20 px-4 py-1.5 rounded-full text-blue-400 text-xs font-semibold backdrop-blur-md">
                  Hubungi Kami
                </div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Konsultasikan Kebutuhan <br />Audio Anda Sekarang
                </h2>
                <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                  Bingung memilih speaker yang sesuai dengan ruangan atau acara Anda? Hubungi customer service kami dan dapatkan rekomendasi terbaik langsung via WhatsApp.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 pt-4 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📞</span>
                    <div>
                      <div className="text-slate-400 font-medium">Nomor WhatsApp</div>
                      <div className="font-bold text-white">+{whatsappNumber}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🕒</span>
                    <div>
                      <div className="text-slate-400 font-medium">Jam Operasional</div>
                      <div className="font-bold text-white">Setiap Hari (09.00 - 21.00 WIB)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-10 py-5 rounded-2xl shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-3 w-full sm:w-auto justify-center cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white" /> Hubungi via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
