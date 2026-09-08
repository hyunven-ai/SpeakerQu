import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  const [alamat, setAlamat] = useState('TM HARCO GLODOK, lantai 6 blok AOF no 16\nJln Hayam Wuruk, kel. mangga besar, kec taman sari, jakarta barat - 11180');
  const [whatsappNumber, setWhatsappNumber] = useState('6287777835864');
  const [email, setEmail] = useState('info@nursehaaudio.com');
  const [jamOperasional, setJamOperasional] = useState('Setiap Hari (09.00 - 21.00 WIB)');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.alamat) setAlamat(data.alamat);
          if (data.nomorWhatsapp) setWhatsappNumber(data.nomorWhatsapp);
        }
      })
      .catch(err => console.error('Failed fetching settings in Footer:', err));

    fetch('/api/contacts')
      .then(res => res.json())
      .then(items => {
        if (Array.isArray(items)) {
          const addrItem = items.find(i => i.type === 'address' && i.isActive);
          const waItem = items.find(i => i.type === 'whatsapp' && i.isActive);
          const emailItem = items.find(i => i.type === 'email' && i.isActive);
          const hoursItem = items.find(i => i.type === 'hours' && i.isActive);

          if (addrItem?.value) setAlamat(addrItem.value);
          if (waItem?.value) setWhatsappNumber(waItem.value.replace(/[^0-9]/g, ''));
          if (emailItem?.value) setEmail(emailItem.value);
          if (hoursItem?.value) setJamOperasional(hoursItem.value);
        }
      })
      .catch(err => console.error('Failed fetching contacts in Footer:', err));
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 mt-auto relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          
          {/* Column 1: Nurseha Audio */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-xl font-black bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent tracking-tight">
                Nurseha Audio
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pusat penjualan sound system, speaker aktif, portable trolley, dan paket audio profesional bergaransi resmi distributor. Melayani pemesanan ke seluruh nusantara.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href={`https://wa.me/${whatsappNumber}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-blue-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-pink-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-blue-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-red-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Kategori Produk
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/products?category=portable-bluetooth" className="hover:text-blue-400 transition-colors">
                  Portable Speaker
                </Link>
              </li>
              <li>
                <Link to="/products?category=speaker-aktif-baretone" className="hover:text-blue-400 transition-colors">
                  Speaker Aktif Profesional
                </Link>
              </li>
              <li>
                <Link to="/products?search=mic" className="hover:text-blue-400 transition-colors">
                  Wireless Microphone UHF
                </Link>
              </li>
              <li>
                <Link to="/products?category=partybox-karaoke" className="hover:text-blue-400 transition-colors">
                  Karaoke System & Partybox
                </Link>
              </li>
              <li>
                <Link to="/products?category=sound-system-cafe" className="hover:text-blue-400 transition-colors">
                  Paket Sound System Cafe
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Perusahaan
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">
                  About Us (Profil Toko)
                </Link>
              </li>
              <li>
                <Link to="/why-choose-us" className="hover:text-blue-400 transition-colors">
                  Why Choose Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-blue-400 transition-colors">
                  Layanan Tata Suara
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-blue-400 transition-colors">
                  Portofolio Proyek
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Information */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Informasi & Panduan
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/blog" className="hover:text-blue-400 transition-colors">
                  Blog & Tips Audio
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-400 transition-colors">
                  FAQ & Tanya Jawab
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-blue-400 transition-colors">
                  Keranjang Belanja
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Info */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Kontak Toko Fisik
            </h4>
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="whitespace-pre-line text-slate-400">{alamat}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-white text-slate-300 font-semibold">
                  +{whatsappNumber}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <a href={`mailto:${email}`} className="text-slate-400 hover:text-white transition-colors">{email}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-slate-400">{jamOperasional}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 Nurseha Audio. All rights reserved. Harco Glodok Jakarta Barat.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/faq" className="hover:text-slate-400 transition-colors">Bantuan</Link>
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Lokasi Toko</Link>
            <Link to="/why-choose-us" className="hover:text-slate-400 transition-colors">Garansi Resmi</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
