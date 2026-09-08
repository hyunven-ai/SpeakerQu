import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import TrustStrip from '../components/TrustStrip';
import FeaturedCarousel from '../components/FeaturedCarousel';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import CategoryTabBar from '../components/CategoryTabBar';
import SEO from '../components/SEO';
import { 
  Sparkles, 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Truck, 
  HelpCircle, 
  ChevronDown, 
  Star,
  Mic,
  Tv,
  Radio,
  Volume2,
  Sliders,
  Music,
  Headphones,
  PartyPopper
} from 'lucide-react';
import { TESTIMONIALS_DATA, AUDIO_SOLUTIONS } from '../data/testimonialsData';
import { FAQ_DATA } from '../data/faqData';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('6287777835864');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed fetching categories:', err));

    // Fetch settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.nomorWhatsapp) setWhatsappNumber(data.nomorWhatsapp);
      })
      .catch(err => console.error('Failed fetching settings:', err));

    // Fetch all products
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

  // Filter products for Section 1
  const filteredProducts = selectedCategory === 'all' 
    ? products.slice(0, 8)
    : products.filter(p => p.category?.slug === selectedCategory).slice(0, 8);

  // FAQ preview (take first 5 questions)
  const faqPreviewList = FAQ_DATA.flatMap(cat => cat.questions).slice(0, 5);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const getSolutionIcon = (iconName) => {
    switch (iconName) {
      case 'Mic': return <Mic className="w-5 h-5" />;
      case 'Radio': return <Radio className="w-5 h-5" />;
      case 'Volume2': return <Volume2 className="w-5 h-5" />;
      case 'Sliders': return <Sliders className="w-5 h-5" />;
      case 'Headphones': return <Headphones className="w-5 h-5" />;
      case 'Tv': return <Tv className="w-5 h-5" />;
      case 'Music': return <Music className="w-5 h-5" />;
      case 'PartyPopper': return <PartyPopper className="w-5 h-5" />;
      default: return <Volume2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="relative min-h-screen pb-16">
      <SEO 
        title="Pusat Sound System & Speaker Premium Terlengkap"
        description="Jual speaker aktif BareTone, portable trolley Bluetooth, paket karaoke dan audio cafe bergaransi resmi di TM Harco Glodok Jakarta."
      />

      {/* HERO SECTION: Flagship Carousel */}
      <HeroCarousel 
        whatsappNumber={whatsappNumber}
        onSelectCategory={(slug) => {
          setSelectedCategory(slug);
          document.getElementById('produk-pilihan')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* TRUST STRIP SECTION */}
      <TrustStrip />

      {/* SECTION 1: FEATURED PRODUCTS (PRODUK PILIHAN) */}
      <section id="produk-pilihan" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/60 px-3.5 py-1 rounded-full text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Katalog Unggulan
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Produk Pilihan
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Audio equipment pilihan untuk berbagai kebutuhan indoor, outdoor, cafe, hingga panggung profesional.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 group self-start md:self-auto"
          >
            <span>Lihat Semua Produk</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Segmented Tab Bar */}
        <CategoryTabBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          products={products}
        />

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="text-4xl mb-3">🎧</div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Belum ada produk di kategori ini</h3>
            <p className="text-xs text-slate-500 mb-6">Silakan pilih kategori lainnya atau hubungi kami via WhatsApp.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Tampilkan Semua Produk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* CTA below grid */}
        <div className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Eksplor Seluruh Katalog Produk ({products.length} Unit)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* SECTION 2: WHY CHOOSE NURSEHA AUDIO (4 PREMIUM CARDS) */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-block bg-blue-500/20 border border-blue-400/30 px-3.5 py-1 rounded-full text-blue-300 text-xs font-bold uppercase tracking-wider">
              Keunggulan Kami
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Mengapa Memilih Nurseha Audio?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Kombinasi produk original, toko fisik terpercaya di TM Harco Glodok, dan dukungan teknisi berpengalaman.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-950/70 border border-white/10 hover:border-blue-500/40 p-6 rounded-3xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">100% Produk Original</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Jaminan keaslian barang resmi pabrik distributor terkemuka (BareTone, SoundBest, dll) dengan segel utuh.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-950/70 border border-white/10 hover:border-blue-500/40 p-6 rounded-3xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Garansi Resmi 1 Tahun</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Perlindungan servis dan suku cadang penuh selama 1 tahun dengan kartu garansi distributor resmi.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-950/70 border border-white/10 hover:border-blue-500/40 p-6 rounded-3xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Konsultasi Audio Ahli</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bantu sesuaikan kebutuhan watt, luas ruangan, dan budget Anda via WhatsApp responsif sebelum membeli.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-slate-950/70 border border-white/10 hover:border-blue-500/40 p-6 rounded-3xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Pengiriman Ekstra Aman</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bubble wrap tebal berlapis dan opsi peti kayu kokoh untuk pengiriman kargo hemat ke seluruh pelosok Indonesia.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/why-choose-us"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Pelajari 7 Pilar Keunggulan Nurseha Audio Selengkapnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: AUDIO SOLUTIONS (USE CASES) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-block bg-blue-50 border border-blue-100 px-3.5 py-1 rounded-full text-blue-600 text-xs font-bold uppercase tracking-wider">
            Solusi Tata Suara
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Kebutuhan Audio Apapun, Kami Punya Solusinya
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Pilihan konfigurasi audio yang dirancang khusus untuk berbagai kebutuhan aktivitas dan ruangan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AUDIO_SOLUTIONS.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl overflow-hidden border border-slate-200/70 bg-white shadow-3d-soft hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Preview */}
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                  {item.badge}
                </span>
                <div className="absolute bottom-3 left-3 p-2 rounded-xl bg-blue-600/90 text-white backdrop-blur-md">
                  {getSolutionIcon(item.icon)}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">
                  {item.desc}
                </p>
                <Link
                  to={`/products?search=${encodeURIComponent(item.title.split(' ')[0])}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 mt-auto group-hover:underline"
                >
                  <span>Lihat Rekomendasi Unit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: BEST SELLER SHOWCASE */}
      {!loading && products.length > 0 && (
        <FeaturedCarousel products={products} />
      )}

      {/* SECTION 5: CUSTOMER TESTIMONIALS */}
      <section className="py-20 bg-slate-100/60 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-block bg-white border border-slate-200 px-3.5 py-1 rounded-full text-slate-700 text-xs font-bold uppercase tracking-wider shadow-2xs">
              Ulasan Pelanggan
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Dipercaya Ribuan Pelanggan di Seluruh Indonesia
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Lihat apa kata mereka yang telah merasakan kualitas audio dan layanan terbaik dari Nurseha Audio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS_DATA.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-3d-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic mb-4">
                    "{item.review}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                    <p className="text-[10px] text-slate-400">{item.role} • {item.location}</p>
                    <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">{item.product}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: FAQ PREVIEW */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-block bg-blue-50 border border-blue-100 px-3.5 py-1 rounded-full text-blue-600 text-xs font-bold uppercase tracking-wider">
            Tanya Jawab Populer
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Jawaban cepat untuk pertanyaan yang paling sering ditanyakan seputar pembelian dan pengiriman.
          </p>
        </div>

        <div className="space-y-3">
          {faqPreviewList.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>Lihat Semua FAQ & Bantuan Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* SECTION 7: FINAL CTA (WHATSAPP & KATALOG) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 rounded-[2.5rem] sm:rounded-[3.5rem] text-white p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-4 py-1.5 rounded-full text-blue-300 text-xs font-bold">
              <MessageCircle className="w-4 h-4" /> Bantuan Pemilihan Audio Gratis
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Butuh Bantuan Memilih Peralatan Audio?
            </h2>

            <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
              Konsultasikan kebutuhan audio Anda dengan tim teknisi kami. Kami siap merekomendasikan speaker dan setup yang tepat sesuai luas ruangan dan anggaran Anda.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Halo Nurseha Audio, saya butuh bantuan memilih perangkat audio yang sesuai.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 cursor-pointer"
              >
                <MessageCircle className="w-4.5 h-4.5 fill-white" />
                <span>Chat WhatsApp Sekarang</span>
              </a>

              <Link
                to="/products"
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs sm:text-sm px-8 py-4 rounded-2xl backdrop-blur-md transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
              >
                <span>Lihat Semua Produk</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
