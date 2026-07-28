import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { Settings, AlertCircle, Check, HelpCircle, Globe, Code, MessageSquare } from 'lucide-react';

export default function AdminSettings() {
  const { token } = useAuth();
  
  // WhatsApp Settings
  const [nomorWhatsapp, setNomorWhatsapp] = useState('');
  const [templatePesan, setTemplatePesan] = useState('');
  const [enableWhatsapp, setEnableWhatsapp] = useState(true);

  // SEO & Scripts Settings
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [customScript, setCustomScript] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setNomorWhatsapp(data.nomorWhatsapp || '');
        setTemplatePesan(data.templatePesan || '');
        setEnableWhatsapp(data.enableWhatsapp !== undefined ? data.enableWhatsapp : true);
        setSeoTitle(data.seoTitle || '');
        setSeoDescription(data.seoDescription || '');
        setSeoKeywords(data.seoKeywords || '');
        setCustomScript(data.customScript || '');
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nomorWhatsapp.trim()) {
      setError('Nomor WhatsApp wajib diisi.');
      return;
    }
    if (!templatePesan.trim()) {
      setError('Template pesan WhatsApp wajib diisi.');
      return;
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nomorWhatsapp: nomorWhatsapp.trim(),
          templatePesan: templatePesan,
          enableWhatsapp,
          seoTitle: seoTitle.trim(),
          seoDescription: seoDescription.trim(),
          seoKeywords: seoKeywords.trim(),
          customScript: customScript.trim()
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal menyimpan pengaturan.');
      }

      setSuccess('Seluruh pengaturan toko berhasil diperbarui.');
      
      // Instantly inject/execute updated custom scripts in the current window for live preview testing
      if (customScript.trim()) {
        try {
          // Remove old dynamic scripts first to prevent duplicate injection
          const oldScripts = document.querySelectorAll('script[data-dynamic="true"]');
          oldScripts.forEach(el => el.remove());

          // A simplified script injector
          const parser = new DOMParser();
          const doc = parser.parseFromString(customScript, 'text/html');
          const scripts = doc.querySelectorAll('script');
          scripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.setAttribute('data-dynamic', 'true');
            if (script.src) {
              newScript.src = script.src;
            } else {
              newScript.textContent = script.textContent;
            }
            document.body.appendChild(newScript);
          });
        } catch (e) {
          console.error('Failed injecting script in admin preview:', e);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-8" />
          <div className="h-64 bg-slate-200 rounded-3xl" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pengaturan Toko</h1>
        <p className="text-slate-500 text-sm mt-1">Konfigurasi kontak WhatsApp, template pesan, SEO meta tag, dan integrasi livechat.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-2.5 text-sm mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-start gap-2.5 text-sm mb-6">
          <Check className="w-5 h-5 flex-shrink-0" />
          <div>{success}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card 1: WhatsApp Configuration */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-3d-soft">
            <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Konfigurasi WhatsApp Toko
            </h2>

            <div className="space-y-6">
              {/* WhatsApp Toggle Switch */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-sm font-bold text-slate-800 block">Aktifkan Tombol WhatsApp</span>
                  <span className="text-xs text-slate-400">Jika dinonaktifkan, tombol pesanan WhatsApp di detail produk tidak akan ditampilkan.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableWhatsapp}
                    onChange={(e) => setEnableWhatsapp(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase block mb-1">
                  Nomor WhatsApp Admin
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 6281234567890 (Gunakan kode negara, tanpa '+')"
                  value={nomorWhatsapp}
                  onChange={(e) => setNomorWhatsapp(e.target.value)}
                  className="w-full bg-slate-50/50 focus:bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                  disabled={!enableWhatsapp}
                />
                <span className="text-[10px] text-slate-400 font-medium mt-1.5 block">
                  PENTING: Gunakan format nomor internasional diawali dengan kode negara (Indonesia: 62). Contoh: 6281234567890.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase block mb-1">
                  Template Teks Pesan Otomatis
                </label>
                <textarea
                  placeholder="Tulis format teks..."
                  rows="5"
                  value={templatePesan}
                  onChange={(e) => setTemplatePesan(e.target.value)}
                  className="w-full bg-slate-50/50 focus:bg-white text-slate-850 text-slate-800 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 text-sm font-mono transition-all"
                  disabled={!enableWhatsapp}
                />
              </div>
            </div>
          </div>

          {/* Card 2: SEO Meta Tags */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-3d-soft">
            <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Pengaturan SEO & Meta Tag
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase block mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  placeholder="Judul halaman web untuk pencarian Google..."
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full bg-slate-50/50 focus:bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase block mb-1">
                  Meta Description
                </label>
                <textarea
                  placeholder="Deskripsi singkat website Anda yang akan tampil di hasil pencarian..."
                  rows="3"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full bg-slate-50/50 focus:bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase block mb-1">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  placeholder="kata kunci 1, kata kunci 2, kata kunci 3..."
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  className="w-full bg-slate-50/50 focus:bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Custom Scripts (Livechat/Analytics) */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-3d-soft">
            <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              Integrasi Custom Script & Livechat
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase block mb-1">
                  Script Integrasi (HTML / JS)
                </label>
                <textarea
                  placeholder="Paste kode script livechat (Tawk.to, WhatsApp widget) atau tracking analytics (Google Analytics, Meta Pixel) di sini..."
                  rows="6"
                  value={customScript}
                  onChange={(e) => setCustomScript(e.target.value)}
                  className="w-full bg-slate-50/50 focus:bg-white text-slate-800 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 text-sm font-mono transition-all"
                />
                <span className="text-[10px] text-slate-400 font-medium mt-1.5 block">
                  Catatan: Masukkan script lengkap termasuk tag &lt;script&gt; ... &lt;/script&gt;.
                </span>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-md transition-all text-sm cursor-pointer"
            >
              Simpan Semua Pengaturan
            </button>
          </div>

        </div>

        {/* Right Column: Documentation / Help Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-slate-400 p-6 rounded-3xl border border-slate-850 shadow-3d-soft h-fit">
            <h3 className="text-white text-sm font-bold tracking-wider uppercase mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-400" />
              Panduan Format WA
            </h3>
            <div className="space-y-4 text-xs leading-relaxed">
              <p>
                Gunakan variabel placeholder berikut di dalam template pesan Anda agar sistem mengisinya secara dinamis berdasarkan produk yang diklik oleh pembeli:
              </p>
              <ul className="space-y-2">
                <li className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                  <code className="text-blue-400 font-bold">{`{nama}`}</code>
                  <span className="block mt-1 text-[10px]">Akan diganti dengan Nama Produk Speaker.</span>
                </li>
                <li className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                  <code className="text-blue-400 font-bold">{`{harga}`}</code>
                  <span className="block mt-1 text-[10px]">Akan diganti dengan harga produk yang sudah diformat rupiah (misal Rp 4.500.000).</span>
                </li>
              </ul>
              <p className="bg-slate-800/30 p-3 rounded-xl border border-slate-800/50 text-[10px] text-slate-500">
                Tips: Anda bisa menggunakan format tebal di WhatsApp dengan membungkus teks menggunakan karakter asterisk (*), contoh: *JBL Partybox*
              </p>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
