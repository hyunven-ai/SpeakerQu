import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ShoppingCart, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cartTotalItems, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('6281234567890');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.nomorWhatsapp) {
          setWhatsappNumber(data.nomorWhatsapp);
        }
      })
      .catch(err => console.error('Failed fetching settings in Navbar:', err));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cari?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (window.location.pathname === '/') {
      if (targetId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(`/?scroll=${targetId}`);
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="glass bg-white/80 sticky top-0 z-50 border-b border-slate-200/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                SpeakerQu
              </span>
            </Link>
          </div>

          {/* Search bar Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xs mx-6">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Cari speaker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 pl-10 pr-4 py-1.5 rounded-full border border-transparent focus:border-blue-500 focus:outline-none transition-all duration-200 text-xs shadow-inner"
              />
              <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </form>
          </div>

          {/* Menu Items Desktop */}
          <div className="hidden md:flex items-center gap-5">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, 'home')}
              className="text-slate-600 hover:text-blue-600 font-semibold text-xs tracking-wide uppercase transition-colors"
            >
              Home
            </a>
            <a
              href="#about-us"
              onClick={(e) => handleNavClick(e, 'about-us')}
              className="text-slate-600 hover:text-blue-600 font-semibold text-xs tracking-wide uppercase transition-colors"
            >
              About Us
            </a>
            <a
              href="#katalog"
              onClick={(e) => handleNavClick(e, 'katalog')}
              className="text-slate-600 hover:text-blue-600 font-semibold text-xs tracking-wide uppercase transition-colors"
            >
              Products
            </a>
            <a
              href="#why-choose-us"
              onClick={(e) => handleNavClick(e, 'why-choose-us')}
              className="text-slate-600 hover:text-blue-600 font-semibold text-xs tracking-wide uppercase transition-colors"
            >
              Why Choose Us
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="text-slate-600 hover:text-blue-600 font-semibold text-xs tracking-wide uppercase transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Cart & WhatsApp CTA Trigger */}
          <div className="hidden md:flex items-center gap-4 ml-4">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              title="Keranjang"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center border border-white">
                  {cartTotalItems}
                </span>
              )}
            </button>

            {/* Chat WhatsApp CTA */}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              Chat WhatsApp
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {/* Cart Icon trigger for mobile header */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 text-slate-600 hover:text-blue-600 cursor-pointer"
            >
              <ShoppingCart className="w-5.5 h-5.5" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center border border-white">
                  {cartTotalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-blue-600 focus:outline-none p-1"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass bg-white/95 border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
            <input
              type="text"
              placeholder="Cari speaker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2 rounded-full border border-transparent focus:border-blue-500 focus:outline-none text-sm"
            />
            <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-slate-400" />
          </form>

          <a
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
            className="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors"
          >
            Home
          </a>
          <a
            href="#about-us"
            onClick={(e) => handleNavClick(e, 'about-us')}
            className="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors"
          >
            About Us
          </a>
          <a
            href="#katalog"
            onClick={(e) => handleNavClick(e, 'katalog')}
            className="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors"
          >
            Products
          </a>
          <a
            href="#why-choose-us"
            onClick={(e) => handleNavClick(e, 'why-choose-us')}
            className="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors"
          >
            Why Choose Us
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors"
          >
            Contact
          </a>
          
          <button
            onClick={() => {
              setIsCartOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Keranjang Belanja
            </span>
            {cartTotalItems > 0 && (
              <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                {cartTotalItems}
              </span>
            )}
          </button>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all"
          >
            Chat WhatsApp
          </a>
        </div>
      )}
    </nav>
  );
}
