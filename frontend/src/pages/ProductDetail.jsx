import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Share2, Sparkles, AlertCircle, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { addToCart } = useCart();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [shareSupported, setShareSupported] = useState(false);

  useEffect(() => {
    // Check if web share API is supported
    if (navigator.share) {
      setShareSupported(true);
    }

    // Fetch product details
    fetch(`/api/products/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Produk tidak ditemukan');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Fetch settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-20 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-200 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-10 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/4" />
            <div className="h-20 bg-slate-200 rounded w-full" />
            <div className="h-12 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Produk Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-6">Speaker yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stok <= 0;
  
  // Format Price
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Get image URLs
  const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
  };

  const images = product.images && product.images.length > 0 
    ? product.images.map(img => getImageUrl(img.url))
    : ['https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80'];

  // Parse specifications JSON
  let specifications = {};
  if (product.spesifikasi) {
    try {
      specifications = JSON.parse(product.spesifikasi);
    } catch (e) {
      console.error('Failed parsing specifications JSON:', e);
    }
  }

  // Handle WhatsApp Order & Tracking
  const handleWhatsappOrder = async () => {
    if (!settings) return;

    // 1. Track WhatsApp Click
    try {
      await fetch('/api/analytics/whatsapp-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop',
          referrer: document.referrer || null
        })
      });
    } catch (err) {
      console.error('Failed to log WhatsApp click analytics:', err);
    }

    // 2. Format Template Message
    let textMessage = settings.templatePesan;
    
    // Customize template for out-of-stock
    if (isOutOfStock) {
      textMessage = "Halo, saya tertarik dengan speaker *{nama}* (Stok Habis). Apakah saya bisa ikut pre-order atau kapan ready kembali?";
    }

    textMessage = textMessage
      .replace('{nama}', product.nama)
      .replace('{harga}', formatRupiah(product.harga));

    const encodedMessage = encodeURIComponent(textMessage);
    const waUrl = `https://wa.me/${settings.nomorWhatsapp}?text=${encodedMessage}`;
    
    // Open in new tab
    window.open(waUrl, '_blank');
  };

  // Handle Share Functionality
  const handleShare = () => {
    if (shareSupported) {
      navigator.share({
        title: product.nama,
        text: product.deskripsi || `Beli ${product.nama} di SpeakerQu!`,
        url: window.location.href
      })
      .then(() => console.log('Successfully shared'))
      .catch((err) => console.error('Share failed:', err));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-sm mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left: Product Images Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-slate-100 bg-white shadow-3d-soft flex items-center justify-center">
            {isOutOfStock && (
              <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-black uppercase px-3.5 py-1.5 rounded-full shadow-md">
                Stok Habis
              </div>
            )}
            <img
              src={images[activeImageIndex]}
              alt={product.nama}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    activeImageIndex === index ? 'border-blue-600 scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase */}
        <div className="flex flex-col justify-start">
          <div className="space-y-6 border-b border-slate-200/60 pb-6 mb-6">
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100/50">
                {product.category?.nama || 'Speaker'}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs font-bold ${isOutOfStock ? 'text-red-600' : 'text-emerald-600'}`}>
                <AlertCircle className="w-3.5 h-3.5" /> 
                {isOutOfStock ? 'Stok Habis' : `Tersedia ${product.stok} unit`}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.nama}
            </h1>

            <div className="text-3xl font-black text-blue-600 tracking-tight">
              {formatRupiah(product.harga)}
            </div>

            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {product.deskripsi}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {!isOutOfStock && (
              <button
                onClick={() => addToCart(product, 1)}
                className="flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all cursor-pointer text-sm"
              >
                <ShoppingCart className="w-5 h-5" /> Tambah ke Keranjang
              </button>
            )}

            {(!settings || settings.enableWhatsapp !== false) && (
              <button
                onClick={handleWhatsappOrder}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer text-sm ${
                  isOutOfStock
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white animate-pulse'
                    : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                {isOutOfStock ? 'Tanya Ketersediaan Stok' : 'Beli Langsung via WA'}
              </button>
            )}

            {shareSupported && (
              <button
                onClick={handleShare}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Share2 className="w-5 h-5" /> Bagikan
              </button>
            )}
          </div>

          {/* Guarantee / Safe badge */}
          <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 flex gap-3 text-slate-500">
            <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div className="text-xs leading-relaxed">
              <strong className="text-slate-800 block mb-0.5">Pemesanan WhatsApp Aman</strong>
              Transaksi ditangani langsung oleh admin toko resmi. Tidak perlu mengisi data kartu kredit atau formulir check-out yang rumit.
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table (JSON-parsed specifications) */}
      {Object.keys(specifications).length > 0 && (
        <div className="max-w-3xl border-t border-slate-200/60 pt-10">
          <h2 className="text-xl font-extrabold text-slate-900 mb-5 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" /> Spesifikasi Teknis
          </h2>
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-3d-soft">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <tbody className="divide-y divide-slate-100">
                {Object.entries(specifications).map(([key, val]) => (
                  <tr key={key} className="even:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-800 w-1/3 border-r border-slate-100">
                      {key}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {val}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
