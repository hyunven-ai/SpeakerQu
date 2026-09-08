import React, { useState } from 'react';
import SEO from '../components/SEO';
import { PORTFOLIO_PROJECTS, PORTFOLIO_CATEGORIES } from '../data/portfolioData';
import { MapPin, Sparkles, X, CheckCircle2, MessageCircle, Calendar } from 'lucide-react';

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeModalProject, setActiveModalProject] = useState(null);

  const filteredProjects = selectedCategory === 'Semua'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen pb-20 bg-slate-50/60">
      <SEO 
        title="Portofolio Proyek Tata Suara & Instalasi Audio"
        description="Dokumentasi proyek audio yang telah dikerjakan oleh tim Nurseha Audio di cafe, rumah ibadah, karaoke keluarga, hingga event gathering."
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-20 lg:py-24 rounded-b-[3rem] shadow-2xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 px-4 py-1.5 rounded-full text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Galeri Proyek Audio
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Portofolio & Rekam Jejak
          </h1>
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
            Berbagai proyek instalasi tata suara, setup cafe, ruang ibadah, karaoke keluarga, dan panggung event yang telah berhasil kami selesaikan.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 mb-10 justify-start sm:justify-center">
          {PORTFOLIO_CATEGORIES.map((cat) => (
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveModalProject(project)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-3d-soft hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Image Thumbnail */}
              <div className="relative h-56 overflow-hidden bg-slate-900">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-blue-600/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase backdrop-blur-md">
                  {project.category}
                </span>
                <span className="absolute bottom-4 left-4 flex items-center gap-1.5 text-slate-200 text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  {project.location}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-bold">
                  <span>Lihat Rincian Instalasi &rarr;</span>
                  <span className="text-slate-400 font-normal text-[11px]">{project.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detail Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveModalProject(null)}
          />

          <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {activeModalProject.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
                  {activeModalProject.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-600" /> {activeModalProject.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {activeModalProject.date}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveModalProject(null)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden h-64 bg-slate-100">
              <img
                src={activeModalProject.image}
                alt={activeModalProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>{activeModalProject.description}</p>
            </div>

            {/* Equipment list */}
            {activeModalProject.equipment && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-900">Perangkat yang Diinstalasi:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModalProject.equipment.map((eq, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{eq}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Result */}
            {activeModalProject.result && (
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900">
                <strong>Hasil Akhir:</strong> {activeModalProject.result}
              </div>
            )}

            <div className="pt-2">
              <a
                href={`https://wa.me/6287777835864?text=${encodeURIComponent(`Halo Nurseha Audio, saya melihat proyek portofolio *${activeModalProject.title}*. Saya ingin konsultasi sistem serupa untuk tempat saya.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Konsultasi Proyek Serupa via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
