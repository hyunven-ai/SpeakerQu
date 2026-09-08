import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  MessageCircle, 
  ShoppingBag, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotalPrice, cartTotalItems } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerAlamat, setCustomerAlamat] = useState('');
  const [customerCatatan, setCustomerCatatan] = useState('');
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=300&q=80';
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
  };

  const handleCheckoutWA = () => {
    const waNumber = settings?.nomorWhatsapp || '6287777835864';
    
    let message = `*HALO NURSEHA AUDIO - PESANAN BARU*\n\n`;
    if (customerName) message += `*Nama:* ${customerName}\n`;
    if (customerAlamat) message += `*Alamat Kirim:* ${customerAlamat}\n`;
    if (customerCatatan) message += `*Catatan:* ${customerCatatan}\n`;
    message += `\n*Daftar Produk:*\n`;

    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.product.nama}\n   Jumlah: ${item.quantity} unit @ ${formatRupiah(item.product.harga)}\n   Subtotal: ${formatRupiah(item.product.harga * item.quantity)}\n\n`;
    });

    message += `*TOTAL PEMBAYARAN:* ${formatRupiah(cartTotalPrice)}\n\n`;
    message += `Mohon konfirmasi ketersediaan stok, ongkir ekspedisi, dan rekening pembayarannya. Terima kasih!`;

    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen py-10 pb-24 bg-slate-50/60">
      <SEO 
        title="Keranjang Belanja"
        description="Periksa daftar produk audio pilihan Anda dan selesaikan pesanan langsung via WhatsApp resmi Nurseha Audio."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link to="/products" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" /> Lanjut Belanja Produk Lain
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
            Keranjang Belanja ({cartTotalItems} Item)
          </h1>
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto shadow-3d-soft my-12">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Keranjang Anda Masih Kosong</h2>
            <p className="text-xs text-slate-500 mb-6">
              Jelajahi koleksi speaker aktif, portable trolley, dan paket karaoke bergaransi resmi kami.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-md transition-all"
            >
              <span>Mulai Belanja Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Cart Content Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Cart Items Table */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-3d-soft divide-y divide-slate-100">
                {cartItems.map((item) => {
                  const p = item.product;
                  const img = p.images && p.images.length > 0 ? getImageUrl(p.images[0].url) : getImageUrl('');

                  return (
                    <div key={p.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      {/* Product Thumbnail & Name */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-20 h-20 rounded-2xl border border-slate-100 bg-slate-50 p-2 flex-shrink-0 flex items-center justify-center">
                          <img src={img} alt={p.nama} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div>
                          <Link to={`/products/${p.slug}`} className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1">
                            {p.nama}
                          </Link>
                          <div className="text-xs text-blue-600 font-bold mt-1">
                            {formatRupiah(p.harga)}
                          </div>
                          {p.category && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              Kategori: {p.category.nama}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                          <button
                            onClick={() => updateQuantity(p.id, item.quantity - 1)}
                            className="p-2 hover:bg-slate-200 transition-colors cursor-pointer"
                            aria-label="Kurang kuantitas"
                          >
                            <Minus className="w-3.5 h-3.5 text-slate-600" />
                          </button>
                          <span className="px-3 text-xs font-bold text-slate-900 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(p.id, item.quantity + 1)}
                            className="p-2 hover:bg-slate-200 transition-colors cursor-pointer"
                            aria-label="Tambah kuantitas"
                          >
                            <Plus className="w-3.5 h-3.5 text-slate-600" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right min-w-[6.5rem]">
                          <div className="text-[10px] text-slate-400">Subtotal:</div>
                          <div className="text-sm font-black text-slate-900">
                            {formatRupiah(p.harga * item.quantity)}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeFromCart(p.id)}
                          className="text-slate-400 hover:text-red-600 p-2 transition-colors cursor-pointer"
                          title="Hapus dari Keranjang"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Clear Cart Button */}
              <div className="flex justify-between items-center text-xs">
                <button
                  onClick={clearCart}
                  className="text-slate-500 hover:text-red-600 font-semibold cursor-pointer"
                >
                  Kosongkan Keranjang
                </button>
                <Link to="/products" className="text-blue-600 hover:underline font-bold">
                  + Tambah Produk Lain
                </Link>
              </div>
            </div>

            {/* Right Column: Checkout Summary Box */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-3d-soft space-y-6 sticky top-24">
                <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
                  Ringkasan Belanja
                </h3>

                {/* Optional Buyer Info */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Pemesan (Opsional)</label>
                    <input
                      type="text"
                      placeholder="Nama Anda"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kota / Alamat Pengiriman</label>
                    <input
                      type="text"
                      placeholder="Contoh: Bandung, Jawa Barat"
                      value={customerAlamat}
                      onChange={(e) => setCustomerAlamat(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Catatan Tambahan</label>
                    <input
                      type="text"
                      placeholder="Catatan khusus packing atau pengiriman"
                      value={customerCatatan}
                      onChange={(e) => setCustomerCatatan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Total Calculations */}
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Item ({cartTotalItems} pcs)</span>
                    <span className="font-semibold text-slate-800">{formatRupiah(cartTotalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Ongkos Kirim Ekspedisi</span>
                    <span className="text-emerald-600 font-bold">Dihitung via WA</span>
                  </div>
                  <div className="flex justify-between text-slate-900 pt-3 border-t border-slate-100 text-base font-black">
                    <span>Total Akhir</span>
                    <span className="text-blue-600">{formatRupiah(cartTotalPrice)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleCheckoutWA}
                  className="w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Checkout via WhatsApp</span>
                </button>

                {/* Guarantees */}
                <div className="bg-slate-50 rounded-2xl p-3.5 text-[11px] text-slate-500 space-y-1.5 border border-slate-100">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Transaksi Aman Langsung ke Toko
                  </div>
                  <p className="leading-relaxed">
                    Pesanan akan diteruskan langsung ke admin resmi Nurseha Audio TM Harco Glodok untuk konfirmasi rekening dan packing.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
