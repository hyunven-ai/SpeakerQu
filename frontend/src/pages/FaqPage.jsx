import React, { useState } from 'react';
import SEO from '../components/SEO';
import { FAQ_DATA, FAQ_CATEGORIES } from '../data/faqData';
import { ChevronDown, Search, MessageCircle, Sparkles, HelpCircle } from 'lucide-react';

export default function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({});

  const toggleAccordion = (catIdx, qIdx) => {
    const key = `${catIdx}-${qIdx}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredCategories = FAQ_DATA.filter((cat) => {
    if (selectedCategory !== 'Semua' && cat.category !== selectedCategory) {
      return false;
    }
    return true;
  }).map((cat, catIdx) => {
    const filteredQuestions = cat.questions.filter((q) => {
      if (!searchQuery.trim()) return true;
      const term = searchQuery.toLowerCase();
      return q.q.toLowerCase().includes(term) || q.a.toLowerCase().includes(term);
    });
    return { ...cat, originalIdx: catIdx, questions: filteredQuestions };
  }).filter((cat) => cat.questions.length > 0);

  // FAQ Page Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_DATA.flatMap(c => c.questions).map(q => ({
      "@type": "Question",
      "name": q.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.a
      }
    }))
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50/60">
      <SEO 
        title="FAQ & Pusat Bantuan Nurseha Audio"
        description="Pertanyaan yang sering diajukan mengenai garansi speaker BareTone, pengiriman ke luar kota, metode pembayaran, dan konsultasi audio."
        schema={faqSchema}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-20 lg:py-24 rounded-b-[3rem] shadow-2xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 px-4 py-1.5 rounded-full text-blue-300 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            Pusat Bantuan & FAQ
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
            Temukan jawaban lengkap seputar produk, garansi resmi, prosedur pengiriman, dan panduan teknis operasional.
          </p>
        </div>
      </section>

      {/* Search & Categories */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Search Input */}
        <div className="max-w-lg mx-auto mb-8 relative">
          <input
            type="text"
            placeholder="Cari pertanyaan (misal: garansi, COD, pengiriman)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-slate-900 placeholder-slate-400 pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:outline-none text-xs shadow-xs transition-all"
          />
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Category Filter Pills */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 mb-10 justify-start sm:justify-center">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordions List */}
        <div className="space-y-8">
          {filteredCategories.map((group) => (
            <div key={group.category} className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                Kategori {group.category}
              </h2>

              <div className="space-y-3">
                {group.questions.map((item, qIdx) => {
                  const key = `${group.originalIdx}-${qIdx}`;
                  const isOpen = !!openItems[key];

                  return (
                    <div
                      key={qIdx}
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleAccordion(group.originalIdx, qIdx)}
                        className="w-full flex items-center justify-between p-5 text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <span className="pr-4">{item.q}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <div className="text-4xl mb-2">🤔</div>
              <h3 className="text-base font-bold text-slate-900">Pertanyaan Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">Belum ada jawaban yang cocok dengan kata kunci Anda.</p>
              <button
                onClick={() => {
                  setSelectedCategory('Semua');
                  setSearchQuery('');
                }}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </div>

        {/* WhatsApp Help Box */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-3d-soft text-center space-y-4">
          <h3 className="text-xl font-black text-slate-900">Masih Memiliki Pertanyaan Lain?</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Tim customer service dan teknisi Nurseha Audio siap membantu menjawab pertanyaan Anda secara langsung dan cepat.
          </p>
          <a
            href="https://wa.me/6287777835864?text=Halo%20Nurseha%20Audio,%20saya%20memiliki%20pertanyaan%20yang%20belum%20ada%20di%20FAQ."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Tanyakan Langsung via WhatsApp</span>
          </a>
        </div>

      </section>
    </div>
  );
}
