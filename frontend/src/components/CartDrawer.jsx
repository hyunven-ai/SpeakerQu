import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, MessageSquare, ShoppingCart, User, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotalItems,
    cartTotalPrice
  } = useCart();

  const [settings, setSettings] = useState(null);
  const [namaPenerima, setNamaPenerima] = useState('');
  const [alamatKirim, setAlamatKirim] = useState('');

  useEffect(() => {
    if (isCartOpen) {
      // Fetch WhatsApp settings
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => setSettings(data))
        .catch(err => console.error('Error fetching settings:', err));
    }
  }, [isCartOpen]);

  // Format currency helper
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Handle Checkout via WhatsApp
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0 || !settings) return;

    // 1. Track WhatsApp Clicks for all items in Cart
    const productIds = cartItems.map(item => item.product.id);
    try {
      await fetch('/api/analytics/whatsapp-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds,
          deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop',
          referrer: document.referrer || null
        })
      });
    } catch (err) {
      console.error('Failed to log WhatsApp click analytics:', err);
    }

    // 2. Format WhatsApp Message
    let messageText = `Halo Admin SpeakerQu, saya ingin memesan produk berikut:\n\n`;
    
    cartItems.forEach((item, index) => {
      const lineTotal = item.product.harga * item.quantity;
      messageText += `${index + 1}. *${item.product.nama}* - ${item.quantity} unit x ${formatRupiah(item.product.harga)} = ${formatRupiah(lineTotal)}\n`;
    });

    messageText += `\n*Total Belanja:* ${formatRupiah(cartTotalPrice)}`;

    if (namaPenerima.trim() || alamatKirim.trim()) {
      messageText += `\n\n*Detail Pengiriman:*`;
      if (namaPenerima.trim()) messageText += `\nNama: ${namaPenerima.trim()}`;
      if (alamatKirim.trim()) messageText += `\nAlamat: ${alamatKirim.trim()}`;
    }

    messageText += `\n\nApakah barang-barang di atas masih tersedia? Terima kasih!`;

    const encodedMessage = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/${settings.nomorWhatsapp}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(waUrl, '_blank');

    // Reset cart and fields
    clearCart();
    setNamaPenerima('');
    setAlamatKirim('');
    setIsCartOpen(false);
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-slate-950 z-50 cursor-pointer"
          />

          {/* Cart Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-white z-50 shadow-2xl flex flex-col border-l border-slate-100"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-150 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Keranjang Belanja</h2>
                <span className="bg-blue-50 text-blue-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-blue-100/50">
                  {cartTotalItems}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center py-10">
                  <ShoppingCart className="w-16 h-16 mb-4 opacity-25" />
                  <h3 className="font-bold text-slate-700 mb-1">Keranjang Kosong</h3>
                  <p className="text-xs max-w-[250px] leading-relaxed">Silakan jelajahi katalog kami untuk menambahkan speaker premium impian Anda.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const mainImg = item.product.images && item.product.images.length > 0
                      ? getImageUrl(item.product.images[0].url)
                      : 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=100&q=80';
                    return (
                      <div key={item.product.id} className="flex gap-4 p-4 rounded-2xl border border-slate-100 hover:shadow-xs transition-shadow">
                        <img src={mainImg} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-50 flex-shrink-0" />
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1">{item.product.nama}</h4>
                            <div className="text-xs text-slate-400 mt-0.5">{formatRupiah(item.product.harga)}</div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1.5 hover:bg-slate-100 text-slate-600 cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-slate-100 text-slate-600 cursor-pointer"
                                disabled={item.quantity >= item.product.stok}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                            {/* Remove button */}
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-slate-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-slate-150 bg-slate-50">
                {/* Shipping Details form */}
                <form onSubmit={handleCheckout} className="mb-6 space-y-3.5">
                  <h3 className="text-xs font-bold text-slate-700 tracking-wide uppercase block">Detail Pengiriman (Opsional)</h3>
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Nama Lengkap Penerima"
                        value={namaPenerima}
                        onChange={(e) => setNamaPenerima(e.target.value)}
                        className="w-full bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl pl-9 pr-4 py-2.5 text-xs transition-all shadow-2xs"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <textarea
                        placeholder="Alamat Pengiriman Lengkap"
                        rows="2"
                        value={alamatKirim}
                        onChange={(e) => setAlamatKirim(e.target.value)}
                        className="w-full bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl pl-9 pr-4 py-2.5 text-xs transition-all shadow-2xs"
                      />
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="border-t border-slate-200/60 pt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-500">Subtotal Belanja</span>
                    <span className="text-lg font-black text-slate-900 tracking-tight">{formatRupiah(cartTotalPrice)}</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm animate-glow-pulse mt-4"
                  >
                    <MessageSquare className="w-4.5 h-4.5" /> Checkout via WhatsApp
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
