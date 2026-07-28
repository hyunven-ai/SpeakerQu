import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, FolderKanban, AlertCircle, Check } from 'lucide-react';

export default function AdminCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCategories = () => {
    setLoading(true);
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setNama('');
    setDeskripsi('');
    setError('');
  };

  const handleEditInit = (cat) => {
    setEditingId(cat.id);
    setNama(cat.nama);
    setDeskripsi(cat.deskripsi || '');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nama.trim()) {
      setError('Nama kategori wajib diisi.');
      return;
    }

    const payload = { nama: nama.trim(), deskripsi: deskripsi.trim() };
    const url = editingId 
      ? `/api/categories/${editingId}`
      : '/api/categories';
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
        throw new Error(data.message || 'Gagal menyimpan kategori.');
      }

      setSuccess(editingId ? 'Kategori berhasil diperbarui.' : 'Kategori baru berhasil ditambahkan.');
      resetForm();
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kategori ini? Semua produk di kategori ini akan kehilangan kaitannya.')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal menghapus kategori.');
      }

      setSuccess('Kategori berhasil dihapus.');
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kelola Kategori</h1>
        <p className="text-slate-500 text-sm mt-1">Tambahkan atau ubah kategori speaker toko Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-3d-soft h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-blue-600" />
            {editingId ? 'Edit Kategori' : 'Kategori Baru'}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl flex items-start gap-2 text-xs mb-4">
              <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-xl flex items-start gap-2 text-xs mb-4">
              <Check className="w-4.5 h-4.5 flex-shrink-0" />
              <div>{success}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 tracking-wide uppercase block mb-1">
                Nama Kategori
              </label>
              <input
                type="text"
                placeholder="Contoh: Portable Bluetooth"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full bg-slate-50/50 focus:bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 tracking-wide uppercase block mb-1">
                Deskripsi
              </label>
              <textarea
                placeholder="Penjelasan singkat kategori..."
                rows="4"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full bg-slate-50/50 focus:bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm cursor-pointer"
              >
                {editingId ? 'Simpan' : 'Tambah'}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all text-sm cursor-pointer"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-3d-soft overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Daftar Kategori ({categories.length})</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 animate-pulse">
              Memuat data kategori...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              Belum ada kategori yang ditambahkan.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <div key={cat.id} className="p-6 hover:bg-slate-50/50 transition-colors flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900">{cat.nama}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Slug: <code className="bg-slate-100 px-1 py-0.5 rounded">{cat.slug}</code></p>
                    {cat.deskripsi && (
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed">{cat.deskripsi}</p>
                    )}
                    <span className="inline-block mt-3 text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                      {cat._count?.products || 0} Produk
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleEditInit(cat)}
                      className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg hover:text-blue-600 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg hover:text-red-600 transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
