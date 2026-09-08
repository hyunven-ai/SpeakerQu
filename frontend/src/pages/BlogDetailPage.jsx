import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BLOG_POSTS } from '../data/blogData';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  MessageCircle, 
  Tag, 
  CheckCircle2, 
  ArrowRight,
  List
} from 'lucide-react';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug || p.id === slug);

  if (!post) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">📰</div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Artikel Tidak Ditemukan</h2>
        <p className="text-slate-500 text-sm mb-6">Artikel yang Anda cari tidak tersedia atau tautan telah dipindahkan.</p>
        <Link to="/blog" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Blog
        </Link>
      </div>
    );
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 2);

  // Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.image,
    "datePublished": "2026-08-15",
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "description": post.excerpt
  };

  return (
    <div className="min-h-screen py-10 pb-24 bg-slate-50/60">
      <SEO 
        title={post.title}
        description={post.excerpt}
        ogImage={post.image}
        schema={articleSchema}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Article Header */}
        <div className="space-y-4 mb-8">
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {post.category}
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <User className="w-4 h-4 text-blue-600" />
              <span>{post.author}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{post.date}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 mb-10 h-72 sm:h-[420px] bg-slate-900">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Table of Contents Box */}
        <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 mb-10 text-xs text-slate-700 space-y-2">
          <div className="font-bold text-blue-900 flex items-center gap-2">
            <List className="w-4 h-4 text-blue-600" />
            Daftar Pembahasan Penting:
          </div>
          <ul className="space-y-1.5 pl-6 list-disc text-slate-600">
            <li>Kriteria penting memilih perangkat audio yang tepat</li>
            <li>Perhitungan daya watt RMS dan tipe speaker</li>
            <li>Tips setup dan instalasi bebas gangguan suara</li>
            <li>Rekomendasi teknisi Nurseha Audio Harco Glodok</li>
          </ul>
        </div>

        {/* Main Article Body */}
        <div 
          className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 space-y-6 [&>h2]:text-xl sm:[&>h2]:text-2xl [&>h2]:font-black [&>h2]:text-slate-900 [&>h2]:tracking-tight [&>h2]:mt-8 [&>h3]:text-base sm:[&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:mt-6 [&>p]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && (
          <div className="flex items-center gap-2 flex-wrap pt-8 mt-10 border-t border-slate-200">
            <Tag className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500">Topik:</span>
            {post.tags.map((t, idx) => (
              <span key={idx} className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* WhatsApp Consultation Banner inside Article */}
        <div className="my-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold">Punya Pertanyaan Mengenai Artikel Ini?</h3>
            <p className="text-xs text-blue-100 max-w-md">
              Diskusikan langsung rencana pembelian atau setup audio Anda dengan tim teknisi kami.
            </p>
          </div>
          <a
            href={`https://wa.me/6287777835864?text=${encodeURIComponent(`Halo Nurseha Audio, saya membaca artikel "${post.title}". Boleh dibantu konsultasi lebih lanjut?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-slate-50 text-blue-600 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 fill-blue-600" />
            <span>Tanya via WhatsApp</span>
          </a>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="pt-8 border-t border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Artikel Terkait Lainnya</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <div key={rel.id} className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase">{rel.category}</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2">
                      <Link to={`/blog/${rel.slug}`} className="hover:text-blue-600">
                        {rel.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{rel.excerpt}</p>
                  </div>
                  <Link to={`/blog/${rel.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 mt-4">
                    <span>Baca Artikel</span> <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
