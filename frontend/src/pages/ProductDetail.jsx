import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Share2, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  ShoppingCart, 
  Star, 
  Plus, 
  Minus, 
  Truck, 
  Award, 
  CheckCircle2, 
  Package, 
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { addToCart } = useCart();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc'); // 'desc', 'specs', 'included', 'warranty'
  const [shareSupported, setShareSupported] = useState(false);

  useEffect(() => {
    if (navigator.share) setShareSupported(true);

    // Fetch product details
    fetch(`/api/products/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Produk tidak ditemukan');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);

        // Fetch related products from same category
        if (data.categoryId) {
          fetch(`/api/products?category=${data.category?.slug || data.categoryId}`)
            .then(r => r.json())
            .then(rel => {
              setRelatedProducts(rel.filter(p => p.id !== data.id).slice(0, 4));
            })
            .catch(() => {});
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Fetch store settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-28 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-200 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-10 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-24 bg-slate-200 rounded w-full" />
            <div className="h-12 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Produk Tidak Ditemukan</h2>
        <p className="text-slate-500 text-sm mb-6">Speaker yang Anda cari tidak tersedia atau URL tidak valid.</p>
        <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog Produk
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stok <= 0;
  const brandName = product.nama.toLowerCase().includes('baretone') ? 'BareTone' : (product.nama.toLowerCase().includes('soundbest') ? 'SoundBest' : 'Nurseha Official');

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
  };

  const images = product.images && product.images.length > 0 
    ? product.images.map(img => getImageUrl(img.url))
    : ['https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80'];

  // Parse specifications
  let specifications = {};
  if (product.spesifikasi) {
    try {
      specifications = JSON.parse(product.spesifikasi);
    } catch (e) {
      console.error(e);
    }
  }

  const handleWhatsappOrder = async () => {
    const waNumber = settings?.nomorWhatsapp || '6287777835864';
    let textMessage = isOutOfStock
      ? `Halo Nurseha Audio, saya tertarik dengan speaker *${product.nama}* (Stok Habis). Apakah bisa preorder atau kapan ready kembali?`
      : `Halo Nurseha Audio, saya ingin memesan:\nProduk: *${product.nama}*\nJumlah: ${quantity} unit\nTotal: ${formatRupiah(product.harga * quantity)}\n\nMohon info ketersediaan stok dan rekening pembayarannya. Terima kasih!`;

    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(textMessage)}`;
    window.open(waUrl, '_blank');
  };

  const handleShare = () => {
    if (shareSupported) {
      navigator.share({
        title: product.nama,
        text: `Beli ${product.nama} di Nurseha Audio Harco Glodok!`,
        url: window.location.href
      }).catch(() => {});
    }
  };

  // Structured Data Schema for SEO
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.nama,
    "image": images[0],
    "description": product.deskripsi || product.nama,
    "brand": {
      "@type": "Brand",
      "name": brandName
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "IDR",
      "price": product.harga,
      "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen py-8 pb-24 bg-slate-50/60">
      <SEO 
        title={product.nama}
        description={`Beli ${product.nama} dengan harga ${formatRupiah(product.harga)} bergaransi resmi di Nurseha Audio Harco Glodok.`}
        ogImage={images[0]}
        schema={productSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600 transition-colors">Produk</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/products?category=${product.category.slug}`} className="hover:text-blue-600 transition-colors">
                {product.category.nama}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.nama}</span>
        </nav>

        {/* Main Product Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-16">
          
          {/* LEFT COLUMN: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-slate-200/80 bg-white shadow-3d-soft flex items-center justify-center p-6 group">
              {isOutOfStock ? (
                <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-black uppercase px-3 py-1.5 rounded-full shadow-md">
                  Stok Habis
                </span>
              ) : (
                <span className="absolute top-4 left-4 z-10 bg-emerald-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready Stock
                </span>
              )}

              <span className="absolute top-4 right-4 z-10 bg-slate-900/80 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md">
                100% Original
              </span>

              <img
                src={images[activeImageIndex]}
                alt={product.nama}
                className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all bg-white p-1.5 ${
                      activeImageIndex === index 
                        ? 'border-blue-600 scale-95 shadow-md ring-2 ring-blue-100' 
                        : 'border-slate-200/80 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Mini Strip below gallery */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/70 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-[11px]">
                  <div className="font-bold text-slate-900">Garansi 1 Tahun</div>
                  <div className="text-slate-400">Resmi Distributor</div>
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/70 flex items-center gap-3">
                <Truck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div className="text-[11px]">
                  <div className="font-bold text-slate-900">Packing Ekstra Aman</div>
                  <div className="text-slate-400">Bubble & Kayu</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Info & Buy Box */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            
            {/* Brand & Category Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
                {brandName}
              </span>
              {product.category && (
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {product.category.nama}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug mb-3">
              {product.nama}
            </h1>

            {/* Rating Stars & Unit Sold */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">4.9 / 5.0</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">Teruji & Terpercaya</span>
            </div>

            {/* Price Box */}
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/50 p-5 rounded-3xl border border-blue-100 mb-6">
              <div className="text-xs font-semibold text-slate-500 mb-0.5">Harga Resmi Toko:</div>
              <div className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
                {formatRupiah(product.harga)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Harga sudah termasuk Quality Control & konsultasi teknis via WhatsApp
              </p>
            </div>

            {/* Short description excerpt */}
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 whitespace-pre-line line-clamp-3">
              {product.deskripsi}
            </div>

            {/* Quantity Selector & Action CTAs */}
            {!isOutOfStock && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700">Jumlah:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 hover:bg-slate-100 transition-colors cursor-pointer"
                      aria-label="Kurang kuantitas"
                    >
                      <Minus className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                    <span className="px-4 py-1.5 text-xs font-black text-slate-900 min-w-[2.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stok || 99, q + 1))}
                      className="p-2 hover:bg-slate-100 transition-colors cursor-pointer"
                      aria-label="Tambah kuantitas"
                    >
                      <Plus className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">
                    Sisa stok: <strong className="text-slate-700">{product.stok} unit</strong>
                  </span>
                </div>

                {/* Main Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm cursor-pointer"
                  >
                    <ShoppingCart className="w-4.5 h-4.5" />
                    <span>+ Tambah ke Keranjang</span>
                  </button>

                  <button
                    onClick={handleWhatsappOrder}
                    className="flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm cursor-pointer"
                  >
                    <MessageCircle className="w-4.5 h-4.5 fill-white" />
                    <span>Beli Langsung via WA</span>
                  </button>

                  {shareSupported && (
                    <button
                      onClick={handleShare}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center justify-center"
                      title="Bagikan Produk"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {isOutOfStock && (
              <div className="mb-6">
                <button
                  onClick={handleWhatsappOrder}
                  className="w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-600 text-white shadow-md text-xs sm:text-sm"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span>Tanya Pre-Order & Ketersediaan Stok</span>
                </button>
              </div>
            )}

            {/* Store Information */}
            <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200/60 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-900">📍 Toko Fisik Resmi Nurseha Audio:</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                TM HARCO GLODOK, Lantai 6 Blok AOF No. 16, Jl. Hayam Wuruk, Jakarta Barat. Anda dapat datang langsung untuk uji coba suara sebelum membeli.
              </p>
            </div>

          </div>

        </div>

        {/* DETAILS, SPECS, INCLUDED, & WARRANTY TABS */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-3d-soft mb-16">
          <div className="flex border-b border-slate-200 gap-6 overflow-x-auto no-scrollbar pb-3 mb-8">
            <button
              onClick={() => setActiveTab('desc')}
              className={`text-sm font-bold pb-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'desc' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Deskripsi Lengkap
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`text-sm font-bold pb-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'specs' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Spesifikasi Teknis
            </button>
            <button
              onClick={() => setActiveTab('included')}
              className={`text-sm font-bold pb-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'included' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Kelengkapan Paket
            </button>
            <button
              onClick={() => setActiveTab('warranty')}
              className={`text-sm font-bold pb-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'warranty' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Garansi & Pengiriman
            </button>
          </div>

          {/* Tab Content */}
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-4 whitespace-pre-line">
                <h3 className="text-base font-bold text-slate-900">Tentang {product.nama}</h3>
                <p>{product.deskripsi}</p>
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Fitur Unggulan:</h4>
                  <ul className="space-y-1.5 text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      Konektivitas Bluetooth audio jernih dan minim delay.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      Material boks kokoh dengan peredaman akustik optimal.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      Pengaturan nada treble, bass, echo, dan volume terpisah.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 mb-4">Tabel Spesifikasi Teknis</h3>
                {Object.keys(specifications).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(specifications).map(([k, v]) => (
                      <div key={k} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                        <span className="font-semibold text-slate-500">{k}</span>
                        <span className="font-bold text-slate-900">{v}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">
                    Spesifikasi detail tertera pada deskripsi produk dan buku manual resmi di dalam kemasan.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'included' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 mb-3">Apa yang Ada di Dalam Kotak:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span>1x Unit Speaker {product.nama}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span>2x Wireless Microphone UHF (tipe tertentu)</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span>1x Kabel Power AC Adaptor</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span>1x Kartu Garansi Resmi & Buku Panduan</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'warranty' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">Ketentuan Garansi & Pengiriman</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-blue-900 space-y-1">
                    <div className="font-bold">🛡️ Garansi Resmi 1 Tahun:</div>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Klaim garansi dapat dilakukan melalui Nurseha Audio atau service center distributor resmi dengan menyertakan kartu garansi dan nota pembelian.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-emerald-900 space-y-1">
                    <div className="font-bold">📦 Pengiriman Seluruh Indonesia:</div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Barang dipacking rapi dengan bubble tebal. Untuk pengiriman antar kota atau luar pulau tersedia opsi packing kayu kargo untuk keamanan maksimal.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Produk Terkait Lainnya
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* STICKY MOBILE CTA BAR (Bottom Screen on Mobile) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-3.5 z-40 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <div className="text-[10px] text-slate-400 font-semibold">Harga:</div>
          <div className="text-base font-black text-blue-600">{formatRupiah(product.harga)}</div>
        </div>

        <div className="flex items-center gap-2">
          {!isOutOfStock && (
            <button
              onClick={() => addToCart(product, 1)}
              className="p-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs"
              title="Tambah Keranjang"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={handleWhatsappOrder}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chat WhatsApp</span>
          </button>
        </div>
      </div>

    </div>
  );
}
