
import React, { useState } from 'react';

const Navbar = ({ currentView, setView, cartCount, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Ana Sayfa', icon: 'fa-house' },
    { id: 'memberships', label: 'Üyelik', icon: 'fa-id-card' },
    { id: 'store', label: 'Mağaza', icon: 'fa-shop' },
    { id: 'wiki', label: 'Muscle Wiki', icon: 'fa-dna' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-zinc-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setView('home')}
          >
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition duration-500 shadow-[0_0_20px_rgba(250,204,21,0.2)]">
              <i className="fa-solid fa-dumbbell text-black text-2xl"></i>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-display font-black leading-none text-white tracking-tighter italic">IRON<span className="text-yellow-500">CORE</span></span>
              <span className="text-[0.6rem] tracking-[0.4em] text-zinc-600 uppercase font-black">Performance HQ</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`relative group flex items-center gap-2 text-[11px] font-black tracking-[0.2em] transition-all duration-300 uppercase ${
                  currentView === item.id ? 'text-yellow-500' : 'text-zinc-500 hover:text-white'
                }`}
              >
                <i className={`fa-solid ${item.icon} text-[10px] opacity-50`}></i>
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-yellow-500 transition-all duration-300 ${currentView === item.id ? 'w-full' : 'w-0'}`}></span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setView('store')}
              className="relative text-white hover:text-yellow-500 transition-all transform hover:scale-110"
            >
              <i className="fa-solid fa-cart-shopping text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-black animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
                <div className="hidden sm:flex items-center gap-4 pl-6 border-l border-zinc-800">
                    <button 
                        onClick={() => setView('profile')}
                        className="flex items-center gap-3 group"
                    >
                        <div className="text-right">
                            <span className="block text-white text-[11px] font-black tracking-wider uppercase group-hover:text-yellow-500 transition">{user.name}</span>
                            <span className="block text-zinc-600 text-[9px] font-bold uppercase">{user.membership}</span>
                        </div>
                        <img 
                            src={user.avatar} 
                            alt="Profile" 
                            className={`w-11 h-11 rounded-xl border-2 border-zinc-800 group-hover:border-yellow-500 transition duration-500 object-cover ${currentView === 'profile' ? 'border-yellow-500 ring-4 ring-yellow-500/10' : ''}`}
                        />
                    </button>
                </div>
            ) : (
                <div className="hidden sm:flex items-center gap-3">
                    <button onClick={() => setView('register')} className="text-zinc-400 hover:text-yellow-500 text-[10px] font-black uppercase tracking-widest transition">
                        Kayıt Ol
                    </button>
                    <button 
                        onClick={() => setView('login')}
                        className="bg-yellow-500 hover:bg-white text-black px-6 py-2.5 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95"
                    >
                        GİRİŞ YAP
                    </button>
                </div>
            )}
            
            {/* Mobile Menu Toggle */}
             <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-zinc-400 hover:text-white transition"
             >
                <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-24 left-0 w-full bg-black border-b border-zinc-900 p-8 flex flex-col gap-6 animate-fade-in-up shadow-2xl">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => {
                        setView(item.id);
                        setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-4 text-sm font-black tracking-widest uppercase ${
                        currentView === item.id ? 'text-yellow-500' : 'text-zinc-500'
                    }`}
                >
                    <i className={`fa-solid ${item.icon} w-6`}></i>
                    {item.label}
                </button>
            ))}
            <div className="pt-6 border-t border-zinc-900 flex gap-3">
                {!user && (
                    <>
                        <button 
                            onClick={() => { setView('register'); setIsMenuOpen(false); }}
                            className="flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-xs border border-zinc-700 text-zinc-400 hover:text-yellow-500 hover:border-yellow-500"
                        >
                            Kayıt Ol
                        </button>
                        <button 
                            onClick={() => { setView('login'); setIsMenuOpen(false); }}
                            className="flex-1 bg-yellow-500 text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs"
                        >
                            Giriş Yap
                        </button>
                    </>
                )}
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
