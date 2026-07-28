import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Box, Eye, EyeOff, Upload, X, ArrowUp, ArrowDown, AlertCircle, Check, Sparkles } from 'lucide-react';

export default function AdminProducts() {
  const { token } = useAuth();
  
  // Lists
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // View state: 'list' or 'form'
  const [viewMode, setViewMode] = useState('list');
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [nama, setNama] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [harga, setHarga] = useState('');
  const [stok, setStok] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [deskripsi, setDeskripsi] = useState('');
  
  // Specifications JSON editor (Array of {key, value})
  const [specList, setSpecList] = useState([{ key: '', value: '' }]);

  // Uploaded Images (Array of {url, urutan})
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Feedback Messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/products?admin=true')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
    // Fetch categories for select input
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setNama('');
    setCategoryId('');
    setHarga('');
    setStok('1');
    setIsActive(true);
    setDeskripsi('');
    setSpecList([{ key: '', value: '' }]);
    setImages([]);
    setError('');
    setSuccess('');
    setViewMode('form');
  };

  const handleOpenEdit = (p) => {
    setEditingId(p.id);
    setNama(p.nama);
    setCategoryId(p.categoryId || '');
    setHarga(p.harga.toString());
    setStok(p.stok.toString());
    setIsActive(p.isActive);
    setDeskripsi(p.deskripsi || '');
    
    // Parse specs JSON to list
    let parsedSpecs = [];
    if (p.spesifikasi) {
      try {
        const obj = JSON.parse(p.spesifikasi);
        parsedSpecs = Object.entries(obj).map(([key, value]) => ({ key, value }));
      } catch (e) {
        console.error(e);
      }
    }
    setSpecList(parsedSpecs.length > 0 ? parsedSpecs : [{ key: '', value: '' }]);
    setImages(p.images || []);
    setError('');
    setSuccess('');
    setViewMode('form');
  };

  // Specs Editor helpers
  const handleAddSpecRow = () => {
    setSpecList([...specList, { key: '', value: '' }]);
  };

  const handleRemoveSpecRow = (index) => {
    const list = [...specList];
    list.splice(index, 1);
    setSpecList(list.length > 0 ? list : [{ key: '', value: '' }]);
  };

  const handleSpecChange = (index, field, val) => {
    const list = [...specList];
    list[index][field] = val;
    setSpecList(list);
  };

  // Image Upload handler
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

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
        throw new Error(data.message || 'Gagal meng-upload gambar.');
      }

      // Add uploaded images to current images list
      const currentCount = images.length;
      const newImages = data.images.map((img, index) => ({
        url: img.url,
        urutan: currentCount + index
      }));

      setImages([...images, ...newImages]);
      setSuccess('Gambar berhasil di-upload dan di-optimalkan ke WebP.');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    const list = [...images];
    list.splice(index, 1);
    // Recalculate order index
    const updated = list.map((img, i) => ({ ...img, urutan: i }));
    setImages(updated);
  };

  const handleMoveImage = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const list = [...images];
    
    // Swap
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Re-assign order index
    const updated = list.map((img, i) => ({ ...img, urutan: i }));
    setImages(updated);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nama.trim()) return setError('Nama produk wajib diisi.');
    if (!harga) return setError('Harga produk wajib diisi.');

    // Build specs JSON object
    const specsObj = {};
    specList.forEach(spec => {
      if (spec.key.trim() && spec.value.trim()) {
        specsObj[spec.key.trim()] = spec.value.trim();
      }
    });

    const payload = {
      nama: nama.trim(),
      categoryId: categoryId || null,
      harga: parseInt(harga),
      stok: parseInt(stok || 0),
      isActive,
      deskripsi: deskripsi.trim(),
      spesifikasi: Object.keys(specsObj).length > 0 ? JSON.stringify(specsObj) : null,
      images: images.map((img, i) => ({ url: img.url, urutan: i }))
    };

    const url = editingId 
      ? `/api/products/${editingId}`
      : '/api/products';
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
        throw new Error(data.message || 'Gagal menyimpan produk.');
      }

      setSuccess(editingId ? 'Produk berhasil diperbarui.' : 'Produk baru berhasil ditambahkan.');
      setViewMode('list');
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini secara permanen beserta file gambarnya?')) {
      return;
    }

    setError('');

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal menghapus produk.');
      }

      setSuccess('Produk berhasil dihapus.');
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Format rupiah helper
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kelola Produk</h1>
          <p className="text-slate-500 text-sm mt-1">Urus katalog speaker, spesifikasi teknis, dan foto-foto produk Anda.</p>
        </div>
        {viewMode === 'list' && (
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Speaker
          </button>
        )}
      </div>

      {success && viewMode === 'list' && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-start gap-2.5 text-sm mb-6">
          <Check className="w-5 h-5 flex-shrink-0" />
          <div>{success}</div>
        </div>
      )}

      {viewMode === 'list' ? (
        /* Products List View */
        <div className="bg-white border border-slate-100 rounded-3xl shadow-3d-soft overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 animate-pulse">
              Memuat katalog speaker...
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              Belum ada produk speaker yang ditambahkan. Klik tombol "Tambah Speaker" di atas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold text-left">
                  <tr>
                    <th className="px-6 py-4">Foto & Nama</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Harga</th>
                    <th className="px-6 py-4">Stok</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => {
                    const hasImage = p.images && p.images.length > 0;
                    const imgUrl = hasImage 
                      ? (p.images[0].url.startsWith('http') ? p.images[0].url : `http://localhost:5000${p.images[0].url}`)
                      : 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=100&q=80';
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                          <img src={imgUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-100 bg-slate-50" />
                          <div className="flex flex-col">
                            <span className="line-clamp-1">{p.nama}</span>
                            <span className="text-[10px] text-slate-400 font-medium">Slug: {p.slug}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">
                          {p.category?.nama || '-'}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {formatRupiah(p.harga)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold text-xs ${p.stok <= 0 ? 'text-red-600' : 'text-slate-600'}`}>
                            {p.stok <= 0 ? 'Habis' : `${p.stok} unit`}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            p.isActive 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : 'bg-slate-50 text-slate-400 border-slate-100'
                          }`}>
                            {p.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            {p.isActive ? 'Aktif' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg hover:text-blue-600 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg hover:text-red-600 transition-colors cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Create/Edit Form View */
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-3d-soft">
          <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
            {editingId ? 'Edit Detail Speaker' : 'Tambah Speaker Baru'}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-2.5 text-sm mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-8">
            {/* General Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase block mb-1">
                  Nama Speaker
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: JBL Partybox 310"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full bg-slate-50/50 focus:bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase block mb-1">
                  Kategori
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-slate-50/50 focus:bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                >
                  <option value="">Pilih Kategori...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase block mb-1">
                  Harga (Rupiah)
                </label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 4500000"
                  value={harga}
                  onChange={(e) => setHarga(e.target.value)}
                  className="w-full bg-slate-50/50 focus:bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase block mb-1">
                  Stok Unit
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 5"
                  value={stok}
                  onChange={(e) => setStok(e.target.value)}
                  className="w-full bg-slate-50/50 focus:bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase block mb-1">
                  Deskripsi Produk
                </label>
                <textarea
                  placeholder="Penjelasan lengkap mengenai produk..."
                  rows="4"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full bg-slate-50/50 focus:bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase block mb-2">
                  Status Publikasi
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="isActive"
                      checked={isActive === true}
                      onChange={() => setIsActive(true)}
                      className="accent-blue-600"
                    />
                    Aktif (Tampil di Katalog)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="isActive"
                      checked={isActive === false}
                      onChange={() => setIsActive(false)}
                      className="accent-blue-600"
                    />
                    Draft (Sembunyikan)
                  </label>
                </div>
              </div>
            </div>

            {/* Photo Gallery Manager */}
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">Galeri Foto Speaker (Multi-Image WebP)</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-4">
                {images.map((img, index) => {
                  const resolvedUrl = img.url.startsWith('http') ? img.url : `http://localhost:5000${img.url}`;
                  return (
                    <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group shadow-sm">
                      <img src={resolvedUrl} alt="" className="w-full h-full object-cover" />
                      
                      {/* Image position controller / delete */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleMoveImage(index, 'up')}
                          disabled={index === 0}
                          className="bg-white hover:bg-slate-100 disabled:opacity-40 p-1.5 rounded-lg text-slate-800 cursor-pointer"
                          title="Geser Kiri"
                        >
                          <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveImage(index, 'down')}
                          disabled={index === images.length - 1}
                          className="bg-white hover:bg-slate-100 disabled:opacity-40 p-1.5 rounded-lg text-slate-800 cursor-pointer"
                          title="Geser Kanan"
                        >
                          <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="bg-red-600 hover:bg-red-700 p-1.5 rounded-lg text-white cursor-pointer"
                          title="Hapus"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      {/* Order indicator */}
                      <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        Ke-{index + 1}
                      </span>
                    </div>
                  );
                })}

                {/* Upload Trigger Button */}
                <label className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center aspect-square cursor-pointer bg-slate-50/50 hover:bg-blue-50/10 transition-all">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {uploading ? 'Mengupload...' : 'Upload Foto'}
                  </span>
                </label>
              </div>
              <p className="text-xs text-slate-400">File foto yang di-upload akan otomatis dikompresi dan dikonversi ke format WebP demi kecepatan akses web.</p>
            </div>

            {/* Specifications JSON Editor */}
            <div className="border-t border-slate-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Spesifikasi Teknis Terstruktur
                </h3>
                <button
                  type="button"
                  onClick={handleAddSpecRow}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Baris
                </button>
              </div>

              <div className="space-y-3">
                {specList.map((spec, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Nama Spesifikasi (e.g. Daya Output)"
                      value={spec.key}
                      onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                      className="flex-1 bg-slate-50/50 focus:bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Nilai/Value (e.g. 240W RMS)"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      className="flex-1 bg-slate-50/50 focus:bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecRow(index)}
                      className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg hover:text-red-600 transition-all cursor-pointer"
                      title="Hapus baris"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-slate-100 pt-6 flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all text-sm cursor-pointer"
              >
                {editingId ? 'Perbarui Produk' : 'Tambahkan Produk'}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-xl transition-all text-sm cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
