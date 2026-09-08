import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  SlidersHorizontal, 
  AlertCircle, 
  Check, 
  Upload, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  X, 
  Sparkles,
  ExternalLink,
  MessageCircle,
  Tag
} from 'lucide-react';

const ACCENT_OPTIONS = [
  { value: 'blue', label: 'Biru (Default)', colorClass: 'bg-blue-500' },
  { value: 'indigo', label: 'Indigo', colorClass: 'bg-indigo-500' },
  { value: 'cyan', label: 'Cyan / Biru Muda', colorClass: 'bg-cyan-500' },
  { value: 'emerald', label: 'Emerald / Hijau', colorClass: 'bg-emerald-500' },
  { value: 'purple', label: 'Ungu', colorClass: 'bg-purple-500' },
  { value: 'rose', label: 'Rose / Merah Muda', colorClass: 'bg-rose-500' }
];

export default function AdminHeroSlides() {
  const { token } = useAuth();
  const [slides, setSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [label, setLabel] = useState('');
  const [badge, setBadge] = useState('');
  const [titlePrefix, setTitlePrefix] = useState('');
  const [titleGradient, setTitleGradient] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [priceTag, setPriceTag] = useState('');
  const [highlightBadge, setHighlightBadge] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [accentColor, setAccentColor] = useState('blue');
  const [urutan, setUrutan] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [specs, setSpecs] = useState([
    { label: '', sub: '' }
  ]);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/slides/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      } else {
        throw new Error('Gagal mengambil data slide.');
      }
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data slide.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchSlides();
    fetchCategories();
  }, [token]);

  const resetForm = () => {
    setEditingId(null);
    setLabel('');
    setBadge('');
    setTitlePrefix('');
    setTitleGradient('');
    setSubtitle('');
    setImageUrl('');
    setImageAlt('');
    setPriceTag('');
    setHighlightBadge('');
    setCategorySlug('');
    setWaMessage('');
    setAccentColor('blue');
    setUrutan(slides.length);
    setIsActive(true);
    setSpecs([
      { label: '', sub: '' },
      { label: '', sub: '' }
    ]);
    setError('');
  };

  const openAddModal = () => {
    resetForm();
    setUrutan(slides.length);
    setIsModalOpen(true);
  };

  const openEditModal = (slide) => {
    setEditingId(slide.id);
    setLabel(slide.label || '');
    setBadge(slide.badge || '');
    setTitlePrefix(slide.titlePrefix || '');
    setTitleGradient(slide.titleGradient || '');
    setSubtitle(slide.subtitle || '');
    setImageUrl(slide.imageUrl || '');
    setImageAlt(slide.imageAlt || '');
    setPriceTag(slide.priceTag || '');
    setHighlightBadge(slide.highlightBadge || '');
    setCategorySlug(slide.categorySlug || '');
    setWaMessage(slide.waMessage || '');
    setAccentColor(slide.accentColor || 'blue');
    setUrutan(slide.urutan !== undefined ? slide.urutan : 0);
    setIsActive(slide.isActive !== undefined ? slide.isActive : true);

    let parsedSpecs = [];
    if (Array.isArray(slide.specs)) {
      parsedSpecs = slide.specs;
    } else if (typeof slide.specs === 'string') {
      try {
        parsedSpecs = JSON.parse(slide.specs);
      } catch {
        parsedSpecs = [];
      }
    }
    if (parsedSpecs.length === 0) {
      parsedSpecs = [{ label: '', sub: '' }];
    }
    setSpecs(parsedSpecs);
    setError('');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('images', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengunggah foto.');
      }

      if (data.images && data.images.length > 0) {
        setImageUrl(data.images[0].url);
        if (!imageAlt) {
          setImageAlt(file.name.replace(/\.[^/.]+$/, ''));
        }
        setSuccess('Foto berhasil diunggah dan dioptimasi.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddSpec = () => {
    if (specs.length >= 6) {
      alert('Maksimal 6 poin spesifikasi per slide.');
      return;
    }
    setSpecs([...specs, { label: '', sub: '' }]);
  };

  const handleRemoveSpec = (index) => {
    const updated = specs.filter((_, idx) => idx !== index);
    setSpecs(updated.length > 0 ? updated : [{ label: '', sub: '' }]);
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!titlePrefix.trim() && !titleGradient.trim()) {
      setError('Judul slide tidak boleh kosong.');
      return;
    }
    if (!imageUrl.trim()) {
      setError('URL atau foto slide wajib disediakan.');
      return;
    }

    // Filter out empty specs
    const cleanedSpecs = specs.filter(s => s.label.trim() || s.sub.trim());

    const payload = {
      label: label.trim() || `Slide ${slides.length + 1}`,
      badge: badge.trim(),
      titlePrefix: titlePrefix.trim(),
      titleGradient: titleGradient.trim(),
      subtitle: subtitle.trim(),
      imageUrl: imageUrl.trim(),
      imageAlt: imageAlt.trim() || titlePrefix.trim() || 'Slide Showcase',
      priceTag: priceTag.trim(),
      highlightBadge: highlightBadge.trim(),
      categorySlug: categorySlug.trim(),
      waMessage: waMessage.trim(),
      accentColor,
      urutan: Number(urutan) || 0,
      isActive,
      specs: cleanedSpecs
    };

    setSaving(true);
    const url = editingId ? `/api/slides/${editingId}` : '/api/slides';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal menyimpan data slide.');
      }

      setSuccess(editingId ? 'Slide berhasil diperbarui!' : 'Slide baru berhasil ditambahkan!');
      setIsModalOpen(false);
      resetForm();
      fetchSlides();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus slide "${title || 'ini'}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/slides/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal menghapus slide.');
      }

      setSuccess('Slide berhasil dihapus.');
      fetchSlides();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleActive = async (slide) => {
    try {
      const res = await fetch(`/api/slides/${slide.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          isActive: !slide.isActive
        })
      });
      if (res.ok) {
        setSlides(slides.map(s => s.id === slide.id ? { ...s, isActive: !s.isActive } : s));
      } else {
        throw new Error('Gagal mengubah status slide.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    const orders = newSlides.map((s, idx) => ({
      id: s.id,
      urutan: idx
    }));

    setSlides(newSlides.map((s, idx) => ({ ...s, urutan: idx })));

    try {
      await fetch('/api/slides/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orders })
      });
    } catch (err) {
      console.error('Failed to save order:', err);
      fetchSlides();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
              <SlidersHorizontal className="w-5 h-5" />
              <span>Kelola Hero Carousel</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Slider Homepage</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Atur banner slide yang tampil di bagian atas halaman utama (Hero Section).
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-xs hover:shadow-md cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Tambah Slide Baru
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex items-center gap-2">
            <Check className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Slides List Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="text-sm font-bold text-slate-800">
              Daftar Slide Aktif ({slides.length})
            </div>
            <span className="text-xs text-slate-400">
              Gunakan tombol panah untuk mengatur urutan tayang slide.
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
              <span>Memuat slide...</span>
            </div>
          ) : slides.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <SlidersHorizontal className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="font-semibold text-slate-600">Belum ada slide hero.</p>
              <p className="text-xs mt-1">Klik tombol "Tambah Slide Baru" untuk membuat slide pertama.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {slides.map((slide, index) => {
                const specList = Array.isArray(slide.specs) 
                  ? slide.specs 
                  : (typeof slide.specs === 'string' ? JSON.parse(slide.specs || '[]') : []);

                return (
                  <div 
                    key={slide.id} 
                    className={`p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 transition-colors ${
                      !slide.isActive ? 'bg-slate-50/70 opacity-60' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Left: Reorder & Thumbnail */}
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                      {/* Order Controls */}
                      <div className="flex flex-col gap-1 items-center">
                        <button
                          onClick={() => handleMoveOrder(index, -1)}
                          disabled={index === 0}
                          className="p-1.5 text-slate-400 hover:text-blue-600 disabled:opacity-20 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Geser ke Atas"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold text-slate-500 w-5 text-center">
                          {index + 1}
                        </span>
                        <button
                          onClick={() => handleMoveOrder(index, 1)}
                          disabled={index === slides.length - 1}
                          className="p-1.5 text-slate-400 hover:text-blue-600 disabled:opacity-20 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Geser ke Bawah"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Image Thumbnail */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 flex items-center justify-center p-2">
                        <img
                          src={slide.imageUrl}
                          alt={slide.imageAlt || 'Slide image'}
                          className="max-h-full max-w-full object-contain drop-shadow-md"
                        />
                        <div className="absolute top-1 left-1 bg-slate-950/80 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                          {slide.accentColor || 'blue'}
                        </div>
                      </div>

                      {/* Title & Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200/60">
                            {slide.label || `Slide ${index + 1}`}
                          </span>
                          {slide.badge && (
                            <span className="text-[11px] text-slate-500 font-medium truncate max-w-xs">
                              • {slide.badge}
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-slate-900 text-base mt-1 truncate">
                          <span>{slide.titlePrefix} </span>
                          <span className="text-blue-600">{slide.titleGradient}</span>
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 max-w-xl">
                          {slide.subtitle}
                        </p>

                        <div className="flex items-center gap-3 mt-2 flex-wrap text-xs">
                          {slide.priceTag && (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <Tag className="w-3 h-3" />
                              {slide.priceTag}
                            </span>
                          )}
                          {slide.categorySlug && (
                            <span className="text-slate-500">
                              Kategori: <strong className="text-slate-700">{slide.categorySlug}</strong>
                            </span>
                          )}
                          <span className="text-slate-400">
                            Spek: {specList.length} poin
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end lg:self-center">
                      <button
                        onClick={() => handleToggleActive(slide)}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          slide.isActive
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-300'
                        }`}
                        title={slide.isActive ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                      >
                        {slide.isActive ? (
                          <>
                            <Eye className="w-4 h-4 text-emerald-600" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 text-slate-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => openEditModal(slide)}
                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-slate-200 cursor-pointer"
                        title="Edit Slide"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(slide.id, slide.titlePrefix)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-slate-200 cursor-pointer"
                        title="Hapus Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? 'Edit Slide Hero' : 'Tambah Slide Hero Baru'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lengkapi informasi slide untuk dipajang di Hero Carousel Homepage.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* SECTION 1: Nav Label & Badge */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  1. Label & Badge Slide
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Label Tab Carousel <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder="Contoh: 01. Baretone Pro"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                    />
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Teks tombol tab di bagian bawah carousel.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Badge Atas (Equalizer Bar)
                    </label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="Contoh: PRO AUDIO • GARANSI RESMI 1 TAHUN"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                    />
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Pill kecil di atas headline judul.
                    </span>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* SECTION 2: Headline & Subtitle */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  2. Judul & Deskripsi Slide
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Judul Baris 1 (Teks Putih) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={titlePrefix}
                      onChange={(e) => setTitlePrefix(e.target.value)}
                      placeholder="Contoh: Dentuman Bass Dahsyat,"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Judul Baris 2 (Teks Gradient Biru) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={titleGradient}
                      onChange={(e) => setTitleGradient(e.target.value)}
                      placeholder="Contoh: Kualitas Audio Profesional"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deskripsi Singkat / Subtitle
                  </label>
                  <textarea
                    rows={3}
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Contoh: Speaker aktif BareTone 12 & 15 bertenaga hingga 1000W RMS. Pilihan utama panggung live, rental audio, aula..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden resize-none"
                  />
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* SECTION 3: Gambar & Media */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  3. Foto / Gambar Produk
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  {/* Upload & URL Input */}
                  <div className="md:col-span-8 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        URL Gambar <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://... atau gunakan tombol upload di bawah"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-mono text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors border border-slate-300">
                        <Upload className="w-4 h-4" />
                        <span>{uploading ? 'Mengunggah & Mengonversi...' : 'Upload Gambar dari Komputer'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-400">
                        Otomatis dikonversi ke WebP untuk kecepatan tinggi.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Alt Text Gambar
                      </label>
                      <input
                        type="text"
                        value={imageAlt}
                        onChange={(e) => setImageAlt(e.target.value)}
                        placeholder="Contoh: BareTone MAX15DX Professional Active Speaker"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Preview Box */}
                  <div className="md:col-span-4 flex flex-col items-center">
                    <span className="text-xs font-semibold text-slate-700 mb-1.5 self-start">
                      Preview Gambar
                    </span>
                    <div className="w-full h-44 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-3 relative overflow-hidden group">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="max-h-full max-w-full object-contain drop-shadow-xl animate-float-slow"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-xs text-slate-500">Belum ada gambar</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* SECTION 4: Harga, Highlight & WhatsApp */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  4. Harga, Tag & Link Tombol
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Label Harga / Promo
                    </label>
                    <input
                      type="text"
                      value={priceTag}
                      onChange={(e) => setPriceTag(e.target.value)}
                      placeholder="Contoh: Mulai Rp 2.450.000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Highlight Tag di Kartu Foto
                    </label>
                    <input
                      type="text"
                      value={highlightBadge}
                      onChange={(e) => setHighlightBadge(e.target.value)}
                      placeholder="Contoh: Terlaris untuk Panggung & Aula"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Warna Aksen Visual
                    </label>
                    <select
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white"
                    >
                      {ACCENT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kategori Produk Terkait (Filter Katalog)
                    </label>
                    <input
                      type="text"
                      list="category-suggestions"
                      value={categorySlug}
                      onChange={(e) => setCategorySlug(e.target.value)}
                      placeholder="Pilih atau ketik slug kategori"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                    />
                    <datalist id="category-suggestions">
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug || c.nama.toLowerCase().replace(/\s+/g, '-')}>
                          {c.nama}
                        </option>
                      ))}
                    </datalist>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Saat tombol "Lihat Produk" diklik, otomatis filter ke kategori ini.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Template Pesan WhatsApp (Tombol Konsultasi)
                    </label>
                    <input
                      type="text"
                      value={waMessage}
                      onChange={(e) => setWaMessage(e.target.value)}
                      placeholder="Halo Nurseha Audio, saya tertarik dengan..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* SECTION 5: Dynamic Key Specs Chips */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      5. 4 Poin Spesifikasi Utama (Cards Kotak)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Tampil sebagai kotak-kotak ringkasan spek (misal: 1000W Peak / Daya Output Maksimal).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Spek
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {specs.map((spec, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2"
                    >
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          placeholder="Judul Spek (e.g. 1000W Peak)"
                          value={spec.label}
                          onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg outline-hidden"
                        />
                        <input
                          type="text"
                          placeholder="Keterangan (e.g. Daya Output Maksimal)"
                          value={spec.sub}
                          onChange={(e) => handleSpecChange(idx, 'sub', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-[11px] bg-white border border-slate-300 rounded-lg outline-hidden text-slate-600"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white cursor-pointer"
                        title="Hapus spek ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* SECTION 6: Status & Urutan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="isActiveToggle"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="isActiveToggle" className="text-xs font-semibold text-slate-800 cursor-pointer">
                    Aktifkan Slide (Tampilkan di Beranda)
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urutan Posisi (Angka)
                  </label>
                  <input
                    type="number"
                    value={urutan}
                    onChange={(e) => setUrutan(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                  />
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>{editingId ? 'Simpan Perubahan' : 'Terbitkan Slide'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
