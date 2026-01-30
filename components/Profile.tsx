
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const Profile = ({ user, onLogout }) => {
  const [myMemberships, setMyMemberships] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;
    Promise.all([api.getMyMemberships().catch(() => []), api.getMyOrders().catch(() => [])]).then(([m, o]) => {
      setMyMemberships(m);
      setMyOrders(o);
    }).finally(() => setLoading(false));
  }, [user?.token]);

  if (!user) return null;

  const activePlan = myMemberships[0];
  const formatDate = (s) => s ? new Date(s).toLocaleDateString('tr-TR') : '—';

  return (
    <div className="min-h-screen bg-zinc-950 py-24">
      <div className="container mx-auto px-4">
        
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8 bg-zinc-900/30 p-10 rounded-[2.5rem] border border-zinc-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-8">
            <div className="relative group">
                <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-32 h-32 rounded-3xl border-4 border-yellow-500/20 object-cover shadow-2xl transition duration-500 group-hover:scale-105"
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-zinc-950 rounded-2xl flex items-center justify-center">
                    <i className="fa-solid fa-check text-white text-xs"></i>
                </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-display font-black text-white uppercase tracking-tighter italic">{user.name}</h1>
                <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-yellow-500/20">Elite Rank</span>
              </div>
              <p className="text-zinc-500 text-sm font-medium flex items-center gap-2">
                <i className="fa-solid fa-calendar-check text-yellow-500"></i>
                Üyelik Başlangıcı: {activePlan ? formatDate(activePlan.start_date) : user.startDate}
              </p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="group bg-zinc-950 hover:bg-red-500 text-zinc-500 hover:text-white border border-zinc-800 hover:border-red-500 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 flex items-center gap-3"
          >
            OTURUMU KAPAT <i className="fa-solid fa-power-off group-hover:rotate-90 transition duration-500"></i>
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Sidebar - Üyeliklerim (API) */}
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-[2rem] p-8 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-[80px] -translate-y-24 translate-x-24"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <p className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.3em] mb-2">Aktif Plan</p>
                        <h3 className="text-4xl font-display font-black text-yellow-500 italic tracking-tighter uppercase">
                          {loading ? '...' : (activePlan?.plan_name || user.membership || 'Üye')}
                        </h3>
                    </div>
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-yellow-500/50">
                        <i className="fa-solid fa-id-card text-2xl"></i>
                    </div>
                </div>

                <div className="space-y-6 relative z-10">
                    {activePlan && (
                      <>
                        <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-4">
                            <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Bitiş</span>
                            <span className="text-white font-bold tracking-widest">{formatDate(activePlan.end_date)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-4">
                            <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Fiyat</span>
                            <span className="text-yellow-500 font-black">{activePlan.price}₺</span>
                        </div>
                      </>
                    )}
                    {!loading && myMemberships.length > 1 && (
                      <p className="text-zinc-500 text-[10px] uppercase">Toplam {myMemberships.length} üyelik kaydı</p>
                    )}
                    <div className="pt-4">
                        <div className="bg-white p-4 rounded-2xl mb-4 group-hover:scale-105 transition duration-500">
                             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=IronCore-${user.name}`} alt="QR Access" className="w-full h-auto grayscale contrast-125" />
                        </div>
                        <p className="text-[9px] text-center text-zinc-600 font-black uppercase tracking-[0.5em]">Giriş İçin Terminale Okut</p>
                    </div>
                </div>
             </div>
          </div>

          {/* Main Dashboard - Stats & Siparişlerim */}
          <div className="lg:col-span-8 space-y-10">
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: 'Antrenman', val: user.stats?.workouts ?? 0, color: 'text-white', icon: 'fa-dumbbell' },
                    { label: 'Ağırlık', val: `${user.stats?.weight ?? 0}kg`, color: 'text-white', icon: 'fa-weight-scale' },
                    { label: 'Streak', val: user.stats?.streak ?? 0, color: 'text-yellow-500', icon: 'fa-fire' },
                    { label: 'Sipariş', val: myOrders.length, color: 'text-white', icon: 'fa-bag-shopping' }
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl group hover:border-zinc-600 transition duration-300">
                        <div className="text-zinc-600 mb-6 group-hover:scale-110 transition duration-300">
                            <i className={`fa-solid ${stat.icon} text-xl`}></i>
                        </div>
                        <div className={`text-3xl font-display font-black ${stat.color} mb-1 italic tracking-tighter`}>{stat.val}</div>
                        <div className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em]">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Siparişlerim (API) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-zinc-800">
                    <h3 className="font-display font-bold text-white uppercase tracking-widest italic">Siparişlerim</h3>
                    <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest mt-1">Mağazadan verdiğin siparişler</p>
                </div>
                <div className="divide-y divide-zinc-800/50">
                    {loading ? (
                        <div className="p-8 text-zinc-500 text-sm">Yükleniyor...</div>
                    ) : myOrders.length === 0 ? (
                        <div className="p-8 text-zinc-500 text-sm">Henüz sipariş yok. Mağazadan alışveriş yap.</div>
                    ) : (
                        myOrders.map((order) => (
                            <div key={order.id} className="p-8 hover:bg-white/5 transition duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-zinc-500 text-[10px] font-black uppercase">Sipariş #{order.id}</span>
                                    <span className="text-yellow-500 font-black">{order.total}₺</span>
                                </div>
                                <p className="text-zinc-600 text-[10px] mb-3">{formatDate(order.created_at)}</p>
                                <ul className="space-y-2">
                                    {order.items?.map((item, i) => (
                                        <li key={i} className="flex justify-between text-sm text-zinc-400">
                                            <span>{item.product_name} x {item.quantity}</span>
                                            <span>{Number(item.price) * item.quantity}₺</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
             {/* AI Coach Action */}
             <div className="group bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-[2rem] p-10 flex items-center justify-between shadow-[0_20px_40px_rgba(250,204,21,0.2)] cursor-pointer hover:scale-[1.02] transition-all duration-500">
                <div className="text-black">
                    <h3 className="font-display font-black text-3xl mb-1 tracking-tighter italic uppercase">YENİ PROGRAM MI LAZIM?</h3>
                    <p className="text-[11px] font-black uppercase tracking-widest opacity-80 border-t border-black/10 pt-2 mt-2">IronCoach Senin İçin Hazır. Sadece Sor.</p>
                </div>
                <div className="w-16 h-16 bg-black text-yellow-500 rounded-2xl flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition duration-500 shadow-2xl">
                    <i className="fa-solid fa-robot text-2xl"></i>
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
