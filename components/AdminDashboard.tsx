import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.is_staff) return;
    
    api.getAdminStats()
      .then(data => {
        setStats(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message || "Veriler alınırken hata oluştu.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  if (!user || !user.is_staff) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-triangle-exclamation text-red-500 text-6xl mb-4"></i>
          <h2 className="text-3xl font-display font-black text-white uppercase tracking-widest">YETKİSİZ ERİŞİM</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-24">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-12 bg-zinc-900/40 p-10 rounded-[2.5rem] border border-yellow-500/20 shadow-[0_0_30px_rgba(250,204,21,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tighter italic">ADMIN <span className="text-yellow-500">KONTROL</span> MERKEZİ</h1>
              </div>
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-satellite-dish text-yellow-500 animate-pulse"></i>
                Sistem İzleme Aktif
              </p>
            </div>
            <div className="flex items-center gap-4 bg-black/50 p-4 rounded-2xl border border-zinc-800">
               <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-black font-black text-xl">
                 <i className="fa-solid fa-crown"></i>
               </div>
               <div>
                  <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Yönetici</div>
                  <div className="text-white font-bold tracking-widest">{user.username}</div>
               </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <i className="fa-solid fa-circle-notch fa-spin text-4xl text-yellow-500"></i>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-8 rounded-3xl text-center">
            {error}
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'TOPLAM ÜYE', val: stats.total_users, icon: 'fa-users', color: 'text-white' },
                { label: 'AKTİF ÜYELİKLER', val: stats.active_memberships, icon: 'fa-id-card', color: 'text-yellow-500' },
                { label: 'TOPLAM SİPARİŞ', val: stats.total_orders, icon: 'fa-box-open', color: 'text-white' },
                { label: 'CİRO', val: `${stats.total_revenue}₺`, icon: 'fa-wallet', color: 'text-green-500' },
                { label: 'OKUNMAMIŞ MESAJ', val: stats.unread_messages, icon: 'fa-envelope', color: 'text-red-500' },
                { label: 'AKTİF ÜRÜN', val: stats.total_products, icon: 'fa-store', color: 'text-purple-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-8 rounded-[2rem] group hover:border-yellow-500/30 transition-all duration-500 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-125">
                       <i className={`fa-solid ${stat.icon} text-8xl`}></i>
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                           <i className={`fa-solid ${stat.icon} text-xl text-zinc-400 group-hover:text-yellow-500 transition-colors`}></i>
                        </div>
                        <div className={`text-4xl font-display font-black mb-1 italic tracking-tighter ${stat.color}`}>{stat.val}</div>
                        <div className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</div>
                    </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Recent Orders List */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
                  <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
                      <div>
                          <h3 className="font-display font-bold text-white uppercase tracking-widest italic text-2xl">SON SİPARİŞLER</h3>
                          <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest mt-1">Sisteme Düşen En Güncel Siparişler</p>
                      </div>
                      <a href="https://keremkuru.pythonanywhere.com/admin" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 bg-zinc-800 hover:bg-yellow-500 text-white hover:text-black transition-colors px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                          <i className="fa-solid fa-database"></i> Django Admin
                      </a>
                  </div>
                  
                  <div className="divide-y divide-zinc-800/50 flex-1 overflow-y-auto max-h-[500px]">
                      {stats.recent_orders && stats.recent_orders.length > 0 ? (
                          stats.recent_orders.map((order) => (
                              <div key={order.id} className="p-6 md:p-8 hover:bg-white/5 transition duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                  <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500">
                                          <i className="fa-solid fa-receipt"></i>
                                      </div>
                                      <div>
                                          <div className="text-white font-black tracking-widest uppercase text-sm mb-1">{order.username}</div>
                                          <div className="text-zinc-600 text-[10px] uppercase tracking-wider font-bold">SİPARİŞ #{order.id} • {order.date}</div>
                                      </div>
                                  </div>
                                  <div className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-6 py-3 rounded-2xl font-black text-xl italic tracking-tighter">
                                      {order.total}₺
                                  </div>
                              </div>
                          ))
                      ) : (
                          <div className="p-10 text-center text-zinc-500 italic">Henüz bir sipariş bulunmuyor.</div>
                      )}
                  </div>
              </div>

              {/* Recent Memberships List */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
                  <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
                      <div>
                          <h3 className="font-display font-bold text-white uppercase tracking-widest italic text-2xl">YENİ ÜYELİKLER</h3>
                          <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest mt-1">Son Satın Alınan Planlar</p>
                      </div>
                  </div>
                  <div className="divide-y divide-zinc-800/50 flex-1 overflow-y-auto max-h-[500px]">
                      {stats.recent_memberships && stats.recent_memberships.length > 0 ? (
                          stats.recent_memberships.map((membership) => (
                              <div key={membership.id} className="p-6 md:p-8 hover:bg-white/5 transition duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                  <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-yellow-500">
                                          <i className="fa-solid fa-medal"></i>
                                      </div>
                                      <div>
                                          <div className="text-white font-black tracking-widest uppercase text-sm mb-1">{membership.username}</div>
                                          <div className="text-zinc-600 text-[10px] uppercase tracking-wider font-bold">{membership.start_date} - {membership.end_date}</div>
                                      </div>
                                  </div>
                                  <div className="bg-zinc-800/50 text-white border border-zinc-700 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest text-center">
                                      {membership.plan_name}
                                  </div>
                              </div>
                          ))
                      ) : (
                          <div className="p-10 text-center text-zinc-500 italic">Henüz bir üyelik bulunmuyor.</div>
                      )}
                  </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
                {/* Top Selling Products */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
                    <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
                        <div>
                            <h3 className="font-display font-bold text-white uppercase tracking-widest italic text-2xl">ÇOK SATAN ÜRÜNLER</h3>
                            <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest mt-1">En Fazla Sipariş Edilen Mağaza Ürünleri</p>
                        </div>
                    </div>
                    <div className="divide-y divide-zinc-800/50 flex-1 overflow-y-auto max-h-[500px]">
                        {stats.top_products && stats.top_products.length > 0 ? (
                            stats.top_products.map((product) => (
                                <div key={product.id} className="p-6 md:p-8 hover:bg-white/5 transition duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-purple-500">
                                            <i className="fa-solid fa-box"></i>
                                        </div>
                                        <div>
                                            <div className="text-white font-black tracking-widest uppercase text-sm mb-1">{product.name}</div>
                                            <div className="text-zinc-600 text-[10px] uppercase tracking-wider font-bold">{product.category} • {product.price}₺</div>
                                        </div>
                                    </div>
                                    <div className="bg-purple-500/10 text-purple-500 border border-purple-500/20 px-6 py-3 rounded-2xl font-black text-xl italic tracking-tighter">
                                        {product.total_sold} ADET
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center text-zinc-500 italic">Henüz ürün satışı bulunmuyor.</div>
                        )}
                    </div>
                </div>

                {/* Recent Messages */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
                    <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
                        <div>
                            <h3 className="font-display font-bold text-white uppercase tracking-widest italic text-2xl">SON MESAJLAR</h3>
                            <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest mt-1">İletişim Formundan Gelen Son Mesajlar</p>
                        </div>
                    </div>
                    <div className="divide-y divide-zinc-800/50 flex-1 overflow-y-auto max-h-[500px]">
                        {stats.recent_messages && stats.recent_messages.length > 0 ? (
                            stats.recent_messages.map((msg) => (
                                <div key={msg.id} className="p-6 md:p-8 hover:bg-white/5 transition duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={`w-12 h-12 rounded-xl bg-zinc-950 border ${msg.is_read ? 'border-zinc-800 text-zinc-500' : 'border-red-500/30 text-red-500'} flex items-center justify-center shrink-0`}>
                                            <i className={`fa-solid ${msg.is_read ? 'fa-envelope-open' : 'fa-envelope'}`}></i>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="text-white font-black tracking-widest uppercase text-sm">{msg.name}</div>
                                                {!msg.is_read && <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">YENİ</span>}
                                            </div>
                                            <div className="text-zinc-400 text-sm mb-2 font-medium">{msg.message}</div>
                                            <div className="text-zinc-600 text-[10px] uppercase tracking-wider font-bold">{msg.email} • {msg.date}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center text-zinc-500 italic">Henüz bir mesaj bulunmuyor.</div>
                        )}
                    </div>
                </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
