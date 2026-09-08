import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, ShoppingCart, MessageCircle, ChevronRight, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cartTotalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('6287777835864');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.nomorWhatsapp) {
          setWhatsappNumber(data.nomorWhatsapp);
        }
      })
      .catch(err => console.error('Failed fetching settings in Navbar:', err));

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'PRODUCTS', path: '/products' },
    { name: 'WHY CHOOSE US', path: '/why-choose-us' },
    { name: 'CONTACT', path: '/contact' }
  ];

  const mobileNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Why Choose Us', path: '/why-choose-us' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-md border-b border-slate-200/80 py-0.5' 
        : 'bg-white/80 backdrop-blur-md border-b border-slate-200/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl sm:text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent tracking-tight group-hover:opacity-90 transition-opacity">
                Nurseha Audio
              </span>
            </Link>
          </div>

          {/* Search bar (Desktop & Tablet) */}
          <div className="hidden lg:flex flex-1 max-w-xs mx-6">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Cari speaker, mic, paket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2 rounded-full border border-transparent focus:border-blue-500 focus:outline-none transition-all text-xs shadow-inner"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs font-bold tracking-wider uppercase transition-colors relative py-1 ${
                    isActive
                      ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full'
                      : 'text-slate-600 hover:text-blue-600'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons (Cart & WhatsApp CTA) */}
          <div className="hidden md:flex items-center gap-4 ml-6">
            {/* Shopping Cart Icon linking to /cart */}
            <Link
              to="/cart"
              className="relative p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              title="Keranjang Belanja"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-xs">
                  {cartTotalItems}
                </span>
              )}
            </Link>

            {/* Primary WhatsApp CTA Button */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Halo Nurseha Audio, saya ingin konsultasi seputar produk audio.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat WhatsApp</span>
            </a>
          </div>

          {/* Mobile Right Controls */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:text-blue-600"
              aria-label="Keranjang Belanja"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center border border-white">
                  {cartTotalItems}
                </span>
              )}
            </Link>

            {/* Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-blue-600 p-1.5 focus:outline-none rounded-lg"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer / Overlay Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 sm:top-18 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xl z-50 max-h-[calc(100vh-4.5rem)] overflow-y-auto px-5 py-6 space-y-4">
          
          {/* Mobile Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Cari speaker, mic, paket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-full border border-slate-200 focus:border-blue-500 focus:outline-none text-sm"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
          </form>

          {/* Navigation Links Grid */}
          <div className="space-y-1 pt-2">
            {mobileNavLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </NavLink>
            ))}
          </div>

          {/* Action CTAs in Drawer */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <Link
              to="/cart"
              className="w-full flex items-center justify-between bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-2xl text-sm transition-all"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-blue-600" />
                Lihat Keranjang Belanja
              </span>
              {cartTotalItems > 0 && (
                <span className="bg-blue-600 text-white text-xs font-black px-2 py-0.5 rounded-full">
                  {cartTotalItems} item
                </span>
              )}
            </Link>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Halo Nurseha Audio, saya ingin bertanya seputar produk audio.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-2xl shadow-md transition-all text-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              Chat WhatsApp
            </a>
          </div>

        </div>
      )}
    </header>
  );
}
