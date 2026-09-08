import React, { useRef, useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  Volume2, 
  Tv, 
  Mic2, 
  Radio, 
  Coffee, 
  Music, 
  Sparkles,
  ChevronLeft, 
  ChevronRight,
  Speaker
} from 'lucide-react';

// Format category title properly (fixes ALL-CAPS issues gracefully)
export function formatCategoryName(name) {
  if (!name) return '';
  // If entirely uppercase or mixed weirdly, convert to Title Case
  if (name === name.toUpperCase()) {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => {
        if (word.toLowerCase() === 'baretone') return 'BareTone';
        if (word.toLowerCase() === 'soundbest') return 'SoundBest';
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }
  return name;
}

// Map category slug or name to appropriate high-end audio icon
export function getCategoryIcon(name = '', slug = '') {
  const lower = `${name} ${slug}`.toLowerCase();
  if (lower.includes('all') || lower.includes('semua')) return LayoutGrid;
  if (lower.includes('cafe') || lower.includes('restoran')) return Coffee;
  if (lower.includes('partybox') || lower.includes('karaoke') || lower.includes('mic')) return Mic2;
  if (lower.includes('home theater') || lower.includes('soundbar') || lower.includes('tv')) return Tv;
  if (lower.includes('portable') || lower.includes('trolley') || lower.includes('bluetooth')) return Radio;
  if (lower.includes('pasif')) return Speaker;
  if (lower.includes('aktif') || lower.includes('speaker') || lower.includes('baretone')) return Volume2;
  return Music;
}

export default function CategoryTabBar({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  products = [],
  className = ''
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Calculate product counts per category
  const categoryCounts = React.useMemo(() => {
    const counts = {};
    if (!products || products.length === 0) return counts;

    categories.forEach(cat => {
      counts[cat.slug] = products.filter(p => 
        p.categoryId === cat.id || 
        p.category?.slug === cat.slug || 
        (p.category?.nama && p.category.nama.toLowerCase() === cat.nama.toLowerCase())
      ).length;
    });
    return counts;
  }, [categories, products]);

  // Check scroll position to display gradient fades and arrow buttons
  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const scroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -260 : 260;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className={`relative mb-8 ${className}`}>
      {/* Outer Segmented Container */}
      <div className="relative bg-slate-100/80 backdrop-blur-md p-1.5 rounded-2xl sm:rounded-full border border-slate-200/80 shadow-xs flex items-center">
        
        {/* Left Scroll Button (Desktop) */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute left-2 z-20 w-8 h-8 rounded-full bg-white/95 border border-slate-200 shadow-md items-center justify-center text-slate-700 hover:text-blue-600 hover:scale-105 transition-all cursor-pointer"
            aria-label="Scroll Kategori ke Kiri"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Left Fade Gradient (Mobile Cue) */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-100 to-transparent pointer-events-none rounded-l-2xl sm:rounded-l-full transition-opacity duration-300 z-10 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`} 
        />

        {/* Scrollable Tabs List */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth w-full px-1 py-0.5"
        >
          {/* "Semua Produk" Tab */}
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`group relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-full text-xs font-bold transition-all duration-300 shrink-0 cursor-pointer select-none ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <LayoutGrid className={`w-3.5 h-3.5 transition-transform duration-300 ${
              selectedCategory === 'all' ? 'text-blue-200 scale-110' : 'text-slate-400 group-hover:text-blue-600'
            }`} />
            
            <span>Semua Produk</span>
            
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
              selectedCategory === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200/80 text-slate-600 group-hover:bg-slate-300/80'
            }`}>
              {products.length}
            </span>
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            const IconComponent = getCategoryIcon(cat.nama, cat.slug);
            const count = categoryCounts[cat.slug] !== undefined ? categoryCounts[cat.slug] : 0;
            const displayName = formatCategoryName(cat.nama);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`group relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-full text-xs font-bold transition-all duration-300 shrink-0 cursor-pointer select-none ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isSelected ? 'text-blue-200 scale-110' : 'text-slate-400 group-hover:text-blue-600'
                }`} />

                <span>{displayName}</span>

                {count > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200/80 text-slate-600 group-hover:bg-slate-300/80'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Fade Gradient (Mobile Cue) */}
        <div 
          className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-100 to-transparent pointer-events-none rounded-r-2xl sm:rounded-r-full transition-opacity duration-300 z-10 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`} 
        />

        {/* Right Scroll Button (Desktop) */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute right-2 z-20 w-8 h-8 rounded-full bg-white/95 border border-slate-200 shadow-md items-center justify-center text-slate-700 hover:text-blue-600 hover:scale-105 transition-all cursor-pointer"
            aria-label="Scroll Kategori ke Kanan"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

      </div>
    </div>
  );
}
