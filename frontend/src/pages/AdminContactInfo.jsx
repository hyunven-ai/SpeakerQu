import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  MapPin, 
  MessageCircle, 
  Clock, 
  Mail, 
  Phone, 
  Globe, 
  Building2, 
  Headphones,
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  AlertCircle, 
  Check, 
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';

const ICON_MAP = {
  MapPin,
  MessageCircle,
  Clock,
  Mail,
  Phone,
  Globe,
  Building2,
  Headphones
};

const ICON_OPTIONS = [
  { value: 'MapPin', label: 'Pin Lokasi / Alamat', icon: MapPin },
  { value: 'MessageCircle', label: 'Chat WhatsApp', icon: MessageCircle },
  { value: 'Clock', label: 'Jam / Waktu', icon: Clock },
  { value: 'Mail', label: 'Email Surat', icon: Mail },
  { value: 'Phone', label: 'Telepon Suara', icon: Phone },
  { value: 'Building2', label: 'Gedung / Showroom', icon: Building2 },
  { value: 'Headphones', label: 'Customer Service', icon: Headphones },
  { value: 'Globe', label: 'Website / Link', icon: Globe },
];

const TYPE_CONFIGS = {
  address: {
    label: 'Alamat Toko Fisik',
    defaultIcon: 'MapPin',
    colorClass: 'bg-blue-50 text-blue-600 border-blue-100',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  whatsapp: {
    label: 'Nomor WhatsApp',
    defaultIcon: 'MessageCircle',
    colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  hours: {
    label: 'Jam Operasional',
    defaultIcon: 'Clock',
    colorClass: 'bg-amber-50 text-amber-500 border-amber-100',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  email: {
    label: 'Email Resmi',
    defaultIcon: 'Mail',
    colorClass: 'bg-purple-50 text-purple-600 border-purple-100',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  custom: {
    label: 'Kontak Tambahan',
    defaultIcon: 'Globe',
    colorClass: 'bg-slate-50 text-slate-600 border-slate-200',
    badgeClass: 'bg-slate-50 text-slate-700 border-slate-200'
  }
};

export default function AdminContactInfo() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [type, setType] = useState('address');
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [subtext, setSubtext] = useState('');
  const [icon, setIcon] = useState('MapPin');
  const [link, setLink] = useState('');
  const [urutan, setUrutan] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contacts/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      } else {
        throw new Error('Gagal mengambil data kontak.');
      }
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data kontak showroom.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [token]);

  const resetForm = () => {
    setEditingId(null);
    setType('address');
    setTitle('');
    setValue('');
    setSubtext('');
    setIcon('MapPin');
    setLink('');
    setUrutan(contacts.length);
    setIsActive(true);
    setError('');
  };

  const handleTypeChange = (selectedType) => {
    setType(selectedType);
    if (!editingId) {
      if (selectedType === 'address') {
        setTitle('Alamat Toko Fisik');
        setIcon('MapPin');
        setSubtext('TM Harco Glodok Lantai 6 Blok AOF No. 16');
      } else if (selectedType === 'whatsapp') {
        setTitle('Nomor WhatsApp Resmi');
        setIcon('MessageCircle');
        setSubtext('Respon cepat setiap hari');
      } else if (selectedType === 'hours') {
        setTitle('Jam Operasional');
        setIcon('Clock');
        setSubtext('Buka setiap hari termasuk hari libur nasional');
      } else if (selectedType === 'email') {
        setTitle('Email Resmi');
        setIcon('Mail');
        setSubtext('Untuk penawaran proyek & pengadaan instansi');
      } else {
        setTitle('Kontak Layanan');
        setIcon('Globe');
        setSubtext('');
      }
    }
  };

  const openAddModal = () => {
    resetForm();
    setTitle('Alamat Toko Fisik');
    setUrutan(contacts.length);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setType(item.type || 'custom');
    setTitle(item.title || '');
    setValue(item.value || '');
    setSubtext(item.subtext || '');
    setIcon(item.icon || 'MapPin');
    setLink(item.link || '');
    setUrutan(item.urutan !== undefined ? item.urutan : 0);
    setIsActive(item.isActive !== undefined ? item.isActive : true);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Judul / Label item kontak wajib diisi.');
      return;
    }
    if (!value.trim()) {
      setError('Isi / Nilai informasi kontak wajib diisi.');
      return;
    }

    setSaving(true);
    const payload = {
      type,
      title: title.trim(),
      value: value.trim(),
      subtext: subtext.trim(),
      icon,
      link: link.trim(),
      urutan: Number(urutan) || 0,
      isActive
    };

    const url = editingId ? `/api/contacts/${editingId}` : '/api/contacts';
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
        throw new Error(data.message || 'Gagal menyimpan data kontak.');
      }

      setSuccess(editingId ? 'Data kontak berhasil diperbarui!' : 'Item kontak baru berhasil ditambahkan!');
      setIsModalOpen(false);
      resetForm();
      fetchContacts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, itemTitle) => {
    if (!window.confirm(`Yakin ingin menghapus item "${itemTitle || 'ini'}"?`)) {
      return;
    }

    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal menghapus kontak.');
      }

      setSuccess('Item kontak berhasil dihapus.');
      fetchContacts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleActive = async (item) => {
    try {
      const res = await fetch(`/api/contacts/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          isActive: !item.isActive
        })
      });
      if (res.ok) {
        setContacts(contacts.map(c => c.id === item.id ? { ...c, isActive: !c.isActive } : c));
      } else {
        throw new Error('Gagal mengubah status kontak.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= contacts.length) return;

    const newContacts = [...contacts];
    const temp = newContacts[index];
    newContacts[index] = newContacts[targetIndex];
    newContacts[targetIndex] = temp;

    const orders = newContacts.map((c, idx) => ({
      id: c.id,
      urutan: idx
    }));

    setContacts(newContacts.map((c, idx) => ({ ...c, urutan: idx })));

    try {
      await fetch('/api/contacts/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orders })
      });
    } catch (err) {
      console.error('Failed to reorder:', err);
      fetchContacts();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
              <MapPin className="w-5 h-5" />
              <span>Section Showroom & Kontak</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Informasi Showroom & Kontak</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Kelola alamat toko fisik, nomor WhatsApp resmi, jam operasional, dan email resmi yang tampil di halaman kontak dan showroom.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-xs hover:shadow-md cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Tambah Item Kontak
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

        {/* Contacts List Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="text-sm font-bold text-slate-800">
              Daftar Kartu Informasi Showroom ({contacts.length})
            </div>
            <span className="text-xs text-slate-400">
              Gunakan tombol panah untuk memindahkan urutan tampil kartu.
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
              <span>Memuat item kontak...</span>
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <MapPin className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="font-semibold text-slate-600">Belum ada data kontak showroom.</p>
              <p className="text-xs mt-1">Klik tombol "Tambah Item Kontak" untuk mulai membuat.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {contacts.map((item, index) => {
                const IconComponent = ICON_MAP[item.icon] || MapPin;
                const typeConfig = TYPE_CONFIGS[item.type] || TYPE_CONFIGS.custom;

                return (
                  <div
                    key={item.id}
                    className={`p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 transition-colors ${
                      !item.isActive ? 'bg-slate-50/70 opacity-60' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Left Side: Order & Card Preview */}
                    <div className="flex items-start sm:items-center gap-4 w-full lg:w-auto">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-1 items-center">
                        <button
                          onClick={() => handleMoveOrder(index, -1)}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-20 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Geser ke Atas"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold text-slate-500 w-5 text-center">
                          {index + 1}
                        </span>
                        <button
                          onClick={() => handleMoveOrder(index, 1)}
                          disabled={index === contacts.length - 1}
                          className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-20 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Geser ke Bawah"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Icon Container (matches showroom card design) */}
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${typeConfig.colorClass}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>

                      {/* Content Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${typeConfig.badgeClass}`}>
                            {typeConfig.label}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">
                            {item.title}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 whitespace-pre-line font-medium mt-1 leading-relaxed max-w-xl">
                          {item.value}
                        </p>

                        {item.subtext && (
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {item.subtext}
                          </p>
                        )}

                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline mt-1 font-mono truncate max-w-md"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>{item.link}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Right Side: Actions */}
                    <div className="flex items-center gap-2 self-end lg:self-center">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          item.isActive
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-300'
                        }`}
                        title={item.isActive ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                      >
                        {item.isActive ? (
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
                        onClick={() => openEditModal(item)}
                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-slate-200 cursor-pointer"
                        title="Edit Informasi Kontak"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-slate-200 cursor-pointer"
                        title="Hapus Item Kontak"
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

      {/* MODAL TAMBAH / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? 'Edit Informasi Kontak' : 'Tambah Item Kontak Baru'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lengkapi data untuk section kontak showroom dan informasi operasional.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Tipe Kontak */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori / Tipe Informasi <span className="text-red-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white"
                >
                  <option value="address">Alamat Toko Fisik</option>
                  <option value="whatsapp">Nomor WhatsApp Resmi</option>
                  <option value="hours">Jam Operasional</option>
                  <option value="email">Email Resmi</option>
                  <option value="custom">Kontak Kustom / Saluran Tambahan</option>
                </select>
              </div>

              {/* Judul / Label */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Kartu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Alamat Toko Fisik / Jam Operasional"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              {/* Nilai / Isi Informasi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Isi / Detail Informasi <span className="text-red-500">*</span>
                </label>
                {type === 'address' ? (
                  <textarea
                    rows={3}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="TM HARCO GLODOK, lantai 6 blok AOF no 16&#10;Jln Hayam Wuruk, kel. mangga besar, jakarta barat"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={
                      type === 'whatsapp' 
                        ? '+6287777835864' 
                        : type === 'hours' 
                        ? 'Senin - Minggu: 09.00 - 21.00 WIB' 
                        : type === 'email' 
                        ? 'info@nursehaaudio.com' 
                        : 'Isi detail informasi kontak...'
                    }
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                  />
                )}
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Teks utama yang akan dibaca oleh pengunjung showroom.
                </span>
              </div>

              {/* Subtext / Keterangan Tambahan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keterangan Tambahan (Subtext)
                </label>
                <input
                  type="text"
                  value={subtext}
                  onChange={(e) => setSubtext(e.target.value)}
                  placeholder="Contoh: Respon cepat setiap hari / Buka setiap hari termasuk libur nasional"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              {/* Pilihan Ikon */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ikon Kartu
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {ICON_OPTIONS.map((opt) => {
                    const IconComp = opt.icon;
                    const isSelected = icon === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setIcon(opt.value)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                        <span className="text-[10px] font-medium truncate max-w-full">{opt.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Link Tindakan / URL (Opsional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tautan / Link Klik (Opsional)
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://wa.me/..., mailto:..., atau https://maps.google.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-mono text-xs"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Jika diisi, pengunjung dapat mengklik nomor atau alamat untuk membuka aplikasi terkait.
                </span>
              </div>

              {/* Urutan & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="contactActiveToggle"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="contactActiveToggle" className="text-xs font-semibold text-slate-800 cursor-pointer">
                    Aktifkan (Tampil di Website)
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urutan Tampil
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
                  <span>{editingId ? 'Simpan Perubahan' : 'Tambah Kontak'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
