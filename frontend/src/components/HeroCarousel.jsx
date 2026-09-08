import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  ShieldCheck, 
  Volume2, 
  Tv, 
  Radio, 
  Music, 
  CheckCircle2, 
  Flame, 
  Star,
  ArrowRight
} from 'lucide-react';

const SLIDES = [
  {
    id: 'baretone-pro',
    categorySlug: 'speaker-aktif-baretone',
    badge: 'PRO AUDIO • GARANSI RESMI 1 TAHUN',
    badgeIcon: Flame,
    titlePrefix: 'Dentuman Bass Dahsyat,',
    titleGradient: 'Kualitas Audio Profesional',
    subtitle: 'Speaker aktif BareTone 12" & 15" bertenaga hingga 1000W RMS. Pilihan utama panggung live, rental audio, aula, dan tempat ibadah dengan garansi resmi 1 tahun distributor.',
    image: 'https://speaker.gambarku.my.id/img-1788250544272-608283718.webp',
    imageAlt: 'BareTone MAX15DX Professional Active Speaker',
    glowColor: 'from-blue-600/30 via-indigo-600/20 to-transparent',
    accentColor: 'blue',
    label: '01. Baretone Pro',
    specs: [
      { label: '1000W Peak', sub: 'Daya Output Maksimal' },
      { label: '15" Pro Woofer', sub: 'Dentuman Bass Dalam' },
      { label: 'Titanium Driver', sub: 'Treble Jernih Bersih' },
      { label: 'Garansi 1 Tahun', sub: 'Resmi Distributor' }
    ],
    priceTag: 'Mulai Rp 2.450.000',
    highlightBadge: 'Terlaris untuk Panggung & Aula',
    waMessage: 'Halo Nurseha Audio, saya tertarik dengan Speaker Aktif BareTone 15 Inch. Boleh minta info stok dan harga terbaiknya?'
  },
  {
    id: 'sound-system-cafe',
    categorySlug: 'sound-system-cafe',
    badge: 'SOLUSI BISNIS • SIAP PAKAI PLUG & PLAY',
    badgeIcon: Tv,
    titlePrefix: 'Tata Suara Cafe & Karaoke,',
    titleGradient: 'Jernih Merata & Anti-Feedback',
    subtitle: 'Paket sound system lengkap 4 - 8 speaker passive SoundBest & amplifier mixer Bluetooth. Suara vokal jernih dan background music merata tanpa distorsi mendengung.',
    image: 'https://speaker.gambarku.my.id/img-1788170467043-476385281.webp',
    imageAlt: 'Paket Sound System Cafe Restoran SoundBest',
    glowColor: 'from-indigo-600/30 via-sky-600/20 to-transparent',
    accentColor: 'indigo',
    label: '02. Paket Cafe & Karaoke',
    specs: [
      { label: 'Paket 4-8 Unit', sub: 'Komplit Siap Colok' },
      { label: 'Mixer Bluetooth', sub: 'Putar Lagu dari HP' },
      { label: 'Anti-Feedback', sub: 'Vokal Jernih Bersih' },
      { label: 'Free Konsultasi', sub: 'Setting Akustik Ruang' }
    ],
    priceTag: 'Paket Lengkap Siap Pakai',
    highlightBadge: 'Pilihan 75+ Cafe & Restoran',
    waMessage: 'Halo Nurseha Audio, saya ingin konsultasi paket sound system untuk cafe/restoran. Boleh dibantu rekomendasinya?'
  },
  {
    id: 'portable-trolley',
    categorySlug: 'portable-bluetooth',
    badge: 'PORTABLE WIRELESS • DUAL MIC UHF',
    badgeIcon: Radio,
    titlePrefix: 'Bawa Pesta Musik Kemanapun,',
    titleGradient: 'Baterai Awet Tanpa Ribet Kabel',
    subtitle: 'Speaker trolley BareTone dengan baterai tahan hingga 8-12 jam, sepasang mic wireless UHF anti-interferensi, dan roda koper kokoh untuk arisan, pengajian, senam, maupun outdoor.',
    image: 'https://speaker.gambarku.my.id/img-1787560144373-300118574.webp',
    imageAlt: 'BareTone 12 BWR Portable Wireless Trolley Speaker',
    glowColor: 'from-cyan-600/30 via-blue-600/20 to-transparent',
    accentColor: 'cyan',
    label: '03. Portable Trolley',
    specs: [
      { label: 'Aki Kering 12V', sub: 'Baterai Hingga 12 Jam' },
      { label: '2 Mic Wireless', sub: 'UHF Frekuensi Stabil' },
      { label: 'Roda & Handle', sub: 'Trolley Praktis Dibawa' },
      { label: 'TWS Bluetooth 5.3', sub: 'Stereo Pairing' }
    ],
    priceTag: 'Mulai Rp 1.999.000',
    highlightBadge: 'Paling Praktis untuk Indoor & Outdoor',
    waMessage: 'Halo Nurseha Audio, saya tertarik dengan speaker portable trolley BareTone dengan 2 mic wireless. Apakah stoknya ready?'
  }
];

const AUTO_PLAY_DURATION = 6000; // 6 seconds per slide

export default function HeroCarousel({ whatsappNumber = '6287777835864', onSelectCategory }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Touch coordinates for swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const progressIntervalRef = useRef(null);

  const currentSlide = SLIDES[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    setProgress(0);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  // Timer & Progress bar
  useEffect(() => {
    if (isPaused) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / AUTO_PLAY_DURATION) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPaused, handleNext]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (touchEndX.current !== 0) {
      if (distance > minSwipeDistance) {
        handleNext();
      } else if (distance < -minSwipeDistance) {
        handlePrev();
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const scrollToCatalog = (slug) => {
    if (onSelectCategory && slug) {
      onSelectCategory(slug);
    }
    const elem = document.getElementById('katalog');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const BadgeIcon = currentSlide.badgeIcon || Sparkles;

  return (
    <section 
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white rounded-b-[2.5rem] sm:rounded-b-[3.5rem] shadow-2xl border-b border-white/5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Koleksi Speaker Audio Unggulan Nurseha Audio"
    >
      {/* Dynamic Ambient Background Glows */}
      <div 
        className={`absolute top-0 right-1/4 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-gradient-to-br ${currentSlide.glowColor} rounded-full blur-[110px] pointer-events-none transition-all duration-1000 -translate-y-1/3`} 
      />
      <div 
        className="absolute bottom-0 left-10 w-[350px] h-[350px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none transition-all duration-1000" 
      />

      {/* Grid Pattern Overlay for High-Tech Studio Feel */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40"
      />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 pb-12 sm:pt-14 sm:pb-16 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5 sm:space-y-6">
            
            {/* Top Badge with Live Equalizer */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-blue-300 text-xs font-bold tracking-wide backdrop-blur-md shadow-xs transition-all duration-300">
                <BadgeIcon className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>{currentSlide.badge}</span>
                
                {/* Live Soundwave Audio Visualizer */}
                <div className="flex items-end gap-[2.5px] h-3 w-4.5 ml-1" title="Audio Equalizer Active">
                  <div className="w-[2px] h-full bg-blue-400 rounded-full animate-wave-1" />
                  <div className="w-[2px] h-full bg-blue-400 rounded-full animate-wave-2" />
                  <div className="w-[2px] h-full bg-blue-400 rounded-full animate-wave-3" />
                  <div className="w-[2px] h-full bg-blue-400 rounded-full animate-wave-4" />
                </div>
              </div>

              {/* Price Tag Pill */}
              <div className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 rounded-full text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentSlide.priceTag}</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.15] text-white">
              <span className="block">{currentSlide.titlePrefix}</span>
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent block mt-1 drop-shadow-sm">
                {currentSlide.titleGradient}
              </span>
            </h1>

            {/* Mobile Visual Showcase (Positioned between title and description for high mobile impact) */}
            <div className="lg:hidden relative w-full h-[260px] sm:h-[320px] my-1 flex items-center justify-center">
              <div className="absolute inset-0 bg-radial from-blue-600/25 via-indigo-950/40 to-transparent rounded-3xl" />
              <img 
                src={currentSlide.image} 
                alt={currentSlide.imageAlt}
                key={currentSlide.id}
                className="max-h-[240px] sm:max-h-[290px] w-auto object-contain z-10 drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] animate-float-slow transition-all duration-500"
                loading="eager"
              />
              {/* Highlight Tag on Mobile */}
              <div className="absolute bottom-2 left-3 right-3 bg-slate-950/80 border border-white/10 backdrop-blur-md p-2.5 rounded-xl text-center z-20">
                <p className="text-[11px] font-bold text-blue-300 flex items-center justify-center gap-1.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {currentSlide.highlightBadge}
                </p>
              </div>
            </div>

            {/* Description Paragraph */}
            <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-xl line-clamp-3 sm:line-clamp-none">
              {currentSlide.subtitle}
            </p>

            {/* Feature / Spec Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {currentSlide.specs.map((sp, idx) => (
                <div 
                  key={idx}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/30 rounded-xl p-2.5 transition-all duration-200 backdrop-blur-xs flex flex-col justify-center"
                >
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wide">{sp.label}</span>
                  <span className="text-[10px] text-slate-400 truncate">{sp.sub}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => scrollToCatalog(currentSlide.categorySlug)}
                className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-6 sm:px-8 py-3.5 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-600/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Lihat Produk</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(currentSlide.waMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 font-bold text-xs sm:text-sm px-6 sm:px-8 py-3.5 rounded-xl sm:rounded-2xl backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                <span>Konsultasi WA</span>
              </a>
            </div>

          </div>

          {/* RIGHT COLUMN (Desktop Showcase Card) */}
          <div className="hidden lg:flex lg:col-span-5 relative w-full h-[520px] items-center justify-center">
            
            {/* Visual Frame Container */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/80 to-indigo-950/90 shadow-2xl backdrop-blur-md flex items-center justify-center group p-8">
              
              {/* Radial Backdrop Glow */}
              <div className="absolute inset-0 bg-radial from-blue-600/20 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Floating Speaker Image */}
              <img
                src={currentSlide.image}
                alt={currentSlide.imageAlt}
                key={currentSlide.id}
                className="relative z-10 max-h-[380px] w-auto object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.85)] animate-float-slow transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />

              {/* Top Glass Badge */}
              <div className="absolute top-5 left-5 z-20 bg-slate-950/70 border border-white/15 px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>100% Produk Original</span>
              </div>

              {/* Bottom Glass Spec Overlay Card */}
              <div className="absolute bottom-5 inset-x-5 z-20 bg-slate-950/80 border border-white/15 p-4 rounded-2xl backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-extrabold text-blue-400 tracking-wider">
                      {currentSlide.highlightBadge}
                    </div>
                    <div className="text-sm font-black text-white mt-0.5">
                      {currentSlide.priceTag}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-white">4.9 / 5.0</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* CAROUSEL CONTROLS BAR (Progress Bar + Slide Thumbnails) */}
        <div className="mt-8 sm:mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Slide Indicators / Tabs */}
          <div className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
            {SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'bg-white/15 text-white border border-white/20 shadow-md' 
                      : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                  aria-label={`Pindah ke slide ${slide.label}`}
                >
                  {/* Dot / Progress bar for active slide */}
                  <div className="relative w-8 sm:w-12 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    {isActive ? (
                      <div 
                        className="h-full bg-blue-400 rounded-full transition-all duration-75"
                        style={{ width: `${progress}%` }}
                      />
                    ) : null}
                  </div>
                  <span className="hidden md:inline-block">{slide.label}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Slide Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Slide Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
