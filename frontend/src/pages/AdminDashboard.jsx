import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { Box, Layers, MousePointerClick, MessageSquare, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/dashboard-stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setTopProducts(data.topProducts || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed fetching dashboard stats:', err);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-slate-200 rounded-3xl" />
            <div className="h-32 bg-slate-200 rounded-3xl" />
            <div className="h-32 bg-slate-200 rounded-3xl" />
          </div>
          <div className="h-64 bg-slate-200 rounded-3xl" />
        </div>
      </AdminLayout>
    );
  }

  // Format Price
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Admin</h1>
        <p className="text-slate-500 text-sm mt-1">Ringkasan performa penjualan dan statistik katalog Anda.</p>
      </div>

      {/* Cards Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-3d-soft flex items-center gap-5">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Speaker</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{stats?.totalProducts}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-3d-soft flex items-center gap-5">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Speaker Aktif</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{stats?.activeProducts}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-3d-soft flex items-center gap-5">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Kategori</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{stats?.totalCategories}</div>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-3d-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <MousePointerClick className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">Speaker Paling Diminati (Klik WA Terbanyak)</h2>
        </div>
        
        {topProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Belum ada data klik WhatsApp yang terekam.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-55 bg-slate-50 text-slate-500 font-semibold text-left">
                <tr>
                  <th className="px-6 py-4">Speaker</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Harga</th>
                  <th className="px-6 py-4 text-center">Jumlah Minat (Klik WA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProducts.map((item) => (
                  <tr key={item.product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                      {item.product.images && item.product.images.length > 0 && (
                        <img
                          src={item.product.images[0].url.startsWith('http') ? item.product.images[0].url : `http://localhost:5000${item.product.images[0].url}`}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      {item.product.nama}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.product.category?.nama || 'Portable'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {formatRupiah(item.product.harga)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {item.clickCount} Klik
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
