
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import AnatomySelector from './components/AnatomySelector';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import { api } from './services/api';
import { MEMBERSHIP_PLANS, PRODUCTS, EXERCISES } from './constants';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [cart, setCart] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [user, setUser] = useState(null);
  const [storeCategory, setStoreCategory] = useState('Hepsi');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [membershipPlans, setMembershipPlans] = useState(MEMBERSHIP_PLANS);
  const [products, setProducts] = useState(PRODUCTS);
  const [exercises, setExercises] = useState(EXERCISES);

  useEffect(() => {
    const savedUser = localStorage.getItem('ironcore_user');
    if (savedUser) {
        setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    api.getMembershipPlans().then(setMembershipPlans);
    api.getProducts().then(setProducts);
    api.getExercises().then(setExercises);
  }, []);

  const handleLogin = (userData) => {
      setUser(userData);
      localStorage.setItem('ironcore_user', JSON.stringify(userData));
      setCurrentView('profile');
  };

  const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('ironcore_user');
      setCurrentView('home');
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getMembershipEndDate = (period) => {
    const d = new Date();
    if (period === 'Yıllık') d.setFullYear(d.getFullYear() + 1);
    else if (period === '3 Aylık') d.setMonth(d.getMonth() + 3);
    else d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  };

  const handleStartMembership = async (plan) => {
    if (!user) {
      setCurrentView('login');
      return;
    }
    try {
      const startDate = new Date().toISOString().slice(0, 10);
      const endDate = getMembershipEndDate(plan.period);
      await api.createMembership(plan.id, startDate, endDate);
      alert('Üyeliğiniz oluşturuldu! Profilden görüntüleyebilirsiniz.');
      setCurrentView('profile');
    } catch (err) {
      alert(err?.message || 'Üyelik oluşturulamadı.');
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      setCurrentView('login');
      alert('Sipariş vermek için giriş yapın.');
      return;
    }
    if (cart.length === 0) {
      alert('Sepetiniz boş.');
      return;
    }
    try {
      await api.createOrder(cart.map((item) => ({ product_id: item.id, quantity: item.quantity })));
      setCart([]);
      alert('Siparişiniz alındı! Profilden takip edebilirsiniz.');
      setCurrentView('profile');
    } catch (err) {
      alert(err?.message || 'Sipariş oluşturulamadı.');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitContact(contactForm);
      alert("Mesajınız IronCore komutanlığına ulaştı! En kısa sürede döneceğiz.");
      setContactForm({ name: '', email: '', message: '' });
    } catch (err) {
      alert(err?.message || "Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const Hero = () => (
    <div className="relative h-screen min-h-[800px] w-full flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10"></div>
        <img 
            src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=2070&auto=format&fit=crop" 
            alt="Motivational Bodybuilder" 
            className="w-full h-full object-cover object-right-top transform scale-105"
        />
      </div>

      <div className="relative z-20 container mx-auto px-4">
        <div className="max-w-4xl space-y-8 animate-fade-in-up">
             <div className="inline-flex items-center gap-2 bg-yellow-500 text-black font-black px-4 py-1.5 text-xs tracking-[0.3em] uppercase transform -skew-x-12">
                <i className="fa-solid fa-fire-flame-curved"></i> GÜNÜN MOTİVASYONU
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-white leading-[0.85] tracking-tighter">
                ACININ <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-shadow-glow">ÖTESİNDE</span>
            </h1>
            <div className="max-w-xl border-l-4 border-yellow-500 pl-8 space-y-4">
                <p className="text-white text-2xl md:text-3xl font-display font-bold italic uppercase tracking-wide leading-tight">
                   "Bugün vazgeçmezsen, yarın kimsenin yapamadığını yaparsın."
                </p>
                <p className="text-zinc-500 text-lg uppercase font-black tracking-widest">— IRONCORE LEGION</p>
            </div>
            <div className="flex flex-wrap gap-4 pt-8">
                <button onClick={() => setCurrentView('memberships')} className="group relative bg-yellow-500 hover:bg-white text-black font-black py-5 px-12 rounded-sm uppercase tracking-widest text-sm transition-all overflow-hidden shadow-[0_0_30px_rgba(250,204,21,0.4)]">
                    <span className="relative z-10">KADROYA KATIL</span>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
                </button>
            </div>
        </div>
      </div>
    </div>
  );

  const MembershipSection = () => (
    <div className="py-32 bg-zinc-950 border-t border-zinc-900">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="max-w-2xl">
                    <h2 className="text-5xl md:text-6xl font-display font-black text-white mb-4 italic tracking-tighter">ÜYELİK <span className="text-yellow-500">PLANLARI</span></h2>
                    <p className="text-zinc-500 text-lg">Sana en uygun disiplini seç ve bugün başla. Beklemek, sadece hedeflerini ertelemektir.</p>
                </div>
                <button onClick={() => setCurrentView('memberships')} className="text-yellow-500 font-black text-sm uppercase tracking-[0.3em] hover:text-white transition-all flex items-center gap-2">
                    Tüm Detayları Gör <i className="fa-solid fa-arrow-right"></i>
                </button>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {membershipPlans.map(plan => (
                    <div key={plan.id} className={`group bg-zinc-900/40 p-10 rounded-3xl border transition-all duration-500 ${plan.recommended ? 'border-yellow-500/50 scale-105 bg-zinc-900/60' : 'border-zinc-800 hover:border-zinc-600'}`}>
                        <div className="flex justify-between items-start mb-8">
                            <h3 className="text-2xl font-display font-black text-white">{plan.name}</h3>
                            {plan.recommended && <span className="text-[9px] bg-yellow-500 text-black px-3 py-1 rounded-full font-black uppercase">Popüler</span>}
                        </div>
                        <div className="text-4xl font-black text-white mb-8 italic tracking-tighter">{plan.price}₺ <span className="text-sm text-zinc-500 font-bold uppercase">/ {plan.period}</span></div>
                        <ul className="space-y-4 mb-10">
                            {plan.features.slice(0, 3).map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-zinc-400 text-sm">
                                    <i className="fa-solid fa-bolt text-yellow-500 text-[10px]"></i> {f}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setCurrentView('memberships')} className="w-full py-4 border border-zinc-700 group-hover:border-yellow-500 group-hover:bg-yellow-500 group-hover:text-black text-zinc-400 font-black uppercase text-[10px] tracking-widest transition-all rounded-xl">
                            SEÇİMİ YAP
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const ContactSection = () => (
    <div className="py-32 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div>
                    <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-6 italic tracking-tighter leading-none">BİZE <br/><span className="text-yellow-500">ULAŞIN</span></h2>
                    <p className="text-zinc-500 text-lg mb-10 max-w-md">Özel isteklerin, kurumsal işbirlikleri veya sadece selam vermek için aşağıdaki formu doldur. IronCore ekibi her zaman hazır.</p>
                    
                    <div className="space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 text-yellow-500">
                                <i className="fa-solid fa-map-location-dot text-xl"></i>
                            </div>
                            <div>
                                <h4 className="text-white font-black uppercase tracking-widest text-xs mb-1">Merkez Üs</h4>
                                <p className="text-zinc-500 text-sm">Levent, Kanyon İş Merkezi No:145, İstanbul</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 text-yellow-500">
                                <i className="fa-solid fa-headset text-xl"></i>
                            </div>
                            <div>
                                <h4 className="text-white font-black uppercase tracking-widest text-xs mb-1">Destek Hattı</h4>
                                <p className="text-zinc-500 text-sm">destek@ironcoregym.com • 0212 900 00 00</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl p-10 md:p-14 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Ad Soyad</label>
                                <input 
                                    type="text" 
                                    required
                                    value={contactForm.name}
                                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-yellow-500 transition" 
                                    placeholder="Demir Bilek"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">E-Posta</label>
                                <input 
                                    type="email" 
                                    required
                                    value={contactForm.email}
                                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-yellow-500 transition" 
                                    placeholder="demir@ironcore.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Mesajınız</label>
                            <textarea 
                                rows={4}
                                required
                                value={contactForm.message}
                                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-yellow-500 transition resize-none" 
                                placeholder="Nasıl yardımcı olabiliriz?"
                            ></textarea>
                        </div>
                        <button 
                            disabled={isSubmitting}
                            className="w-full bg-yellow-500 hover:bg-white text-black font-black py-5 rounded-xl uppercase tracking-[0.2em] text-xs transition-all shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                            {isSubmitting ? 'GÖNDERİLİYOR...' : 'MESAJI GÖNDER'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );

  const StoreView = () => {
    const categories = ['Hepsi', 'Protein', 'Performans', 'Enerji', 'Amino Asit', 'Vitamin', 'Yağ Yakıcı'];
    const filteredProducts = storeCategory === 'Hepsi' 
        ? products 
        : products.filter(p => p.category === storeCategory);

    return (
      <div className="py-20 bg-zinc-950 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-3/4">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h2 className="text-5xl font-display font-black text-white mb-2 italic">IRON SHOP</h2>
                    <p className="text-zinc-500">Antrenmanını zirveye taşıyacak premium destekler.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setStoreCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                                storeCategory === cat 
                                ? 'bg-yellow-500 border-yellow-500 text-black' 
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-2xl overflow-hidden group hover:border-yellow-500/40 transition-all duration-500 hover:-translate-y-2">
                    <div className="h-64 overflow-hidden relative">
                       <img src={product.image} alt={product.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                       <div className="absolute top-4 right-4 bg-yellow-500 text-black text-[10px] px-3 py-1 rounded-full font-black uppercase shadow-lg">{product.category}</div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 truncate">{product.name}</h3>
                      <p className="text-zinc-500 text-sm mb-6 line-clamp-2 h-10">{product.description}</p>
                      <div className="flex justify-between items-center border-t border-zinc-800 pt-6">
                        <span className="text-white font-black text-2xl">{product.price}₺</span>
                        <button onClick={() => addToCart(product)} className="bg-yellow-500 hover:bg-white text-black w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90">
                          <i className="fa-solid fa-cart-plus text-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-28 shadow-2xl">
                <h3 className="text-2xl font-display font-bold text-white mb-8 flex items-center justify-between">
                  <span>SEPETİM</span>
                  <i className="fa-solid fa-bag-shopping text-yellow-500"></i>
                </h3>
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600">
                        <i className="fa-solid fa-basket-shopping text-2xl"></i>
                    </div>
                    <p className="text-zinc-500 text-sm italic">Sepetiniz şu an boş.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-hide space-y-4">
                        {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 border-b border-zinc-800 pb-4 group">
                            <img src={item.image} className="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition" alt="" />
                            <div className="flex-1 min-w-0">
                                <div className="text-white text-sm font-bold truncate">{item.name}</div>
                                <div className="text-zinc-500 text-xs flex justify-between mt-1">
                                    <span>{item.quantity}x {item.price}₺</span>
                                    <span className="text-yellow-500 font-bold">{item.price * item.quantity}₺</span>
                                </div>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-zinc-700 hover:text-red-500 transition self-start">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        ))}
                    </div>
                    <div className="pt-6 border-t border-zinc-800">
                      <div className="flex justify-between text-zinc-400 text-sm mb-1">
                        <span>Ara Toplam</span>
                        <span>{cartTotal}₺</span>
                      </div>
                      <div className="flex justify-between text-white font-black mb-6 text-xl uppercase tracking-tighter">
                        <span>Toplam</span>
                        <span className="text-yellow-500">{cartTotal}₺</span>
                      </div>
                      <button onClick={handleCheckout} className="w-full bg-yellow-500 hover:bg-white text-black font-black py-4 rounded-xl uppercase text-xs tracking-[0.2em] transition-all shadow-lg shadow-yellow-500/10">
                        Ödemeye Geç
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-100 font-sans selection:bg-yellow-500 selection:text-black">
      <Navbar currentView={currentView} setView={setCurrentView} cartCount={cart.length} user={user} />
      
      <main className="relative z-10">
        {currentView === 'home' && (
          <div className="animate-fade-in">
            <Hero />
            
            {/* Real Stats Ticker */}
            <div className="bg-yellow-500 py-6 overflow-hidden flex whitespace-nowrap border-y-4 border-black z-30 relative">
                 <div className="flex gap-20 animate-marquee text-black font-display font-black text-2xl italic tracking-tighter">
                    {Array(10).fill(null).map((_, i) => (
                        <span key={i}>FORGE YOUR LEGACY • NO EXCUSES • IRONCORE PERFORMANCE • TRUST THE PROCESS • EAT CLEAN TRAIN DIRTY</span>
                    ))}
                 </div>
            </div>

            {/* Features Section */}
            <div className="py-32 bg-zinc-950">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: 'fa-bolt-lightning', title: 'Hızlı Değişim', desc: 'Bilimsel temelli antrenman programları ile genetik sınırlarını zorla.' },
                            { icon: 'fa-user-ninja', title: 'Elit Kadro', desc: 'Sertifikalı ve yarışmacı tecrübesine sahip koçlarla birebir çalışma.' },
                            { icon: 'fa-dumbbell', title: 'Hardcore Ekipman', desc: 'Hammer Strength ve Eleiko kalitesinde profesyonel istasyonlar.' }
                        ].map((feat, i) => (
                            <div key={i} className="group p-10 bg-zinc-900/30 border border-zinc-800 rounded-3xl hover:border-yellow-500/30 transition-all duration-500">
                                <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-yellow-500 transition-colors duration-500">
                                    <i className={`fa-solid ${feat.icon} text-3xl text-yellow-500 group-hover:text-black transition-colors duration-500`}></i>
                                </div>
                                <h3 className="text-2xl font-display font-bold mb-4 tracking-tight uppercase italic">{feat.title}</h3>
                                <p className="text-zinc-500 leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <MembershipSection />

            {/* Visual Break / Quote Section */}
            <div className="h-[400px] relative flex items-center justify-center bg-fixed bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop")' }}>
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                <div className="relative z-10 text-center px-4">
                    <h3 className="text-4xl md:text-6xl font-display font-black text-white italic uppercase tracking-tighter mb-4">"ZORLUKLAR SENİ KIRMAZ, <span className="text-yellow-500">YAPAR.</span>"</h3>
                    <div className="w-24 h-1 bg-yellow-500 mx-auto"></div>
                </div>
            </div>

            <ContactSection />
          </div>
        )}

        {currentView === 'memberships' && (
            <div className="py-24 bg-zinc-950 min-h-screen animate-fade-in-up">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-5xl md:text-6xl font-display font-black mb-6 italic tracking-tighter">GÜCÜNÜ <span className="text-yellow-500">SEÇ</span></h2>
                        <p className="text-zinc-500 text-lg italic font-light">"Disiplin, neyi istediğinle neyi en çok istediğin arasındaki farktır."</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto items-center">
                        {membershipPlans.map(plan => (
                            <div key={plan.id} className={`relative bg-zinc-900/50 backdrop-blur-md p-10 rounded-3xl border-2 transition-all duration-500 ${plan.recommended ? 'border-yellow-500 scale-110 shadow-[0_0_50px_rgba(250,204,21,0.1)] z-10' : 'border-zinc-800 hover:border-zinc-700'}`}>
                                {plan.recommended && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                        En Çok Tercih Edilen
                                    </div>
                                )}
                                <h3 className="text-3xl font-display font-black text-white mb-2 italic tracking-tighter">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-5xl font-black text-yellow-500">{plan.price}₺</span>
                                    <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">/ {plan.period}</span>
                                </div>
                                <ul className="space-y-4 mb-10">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                                            <i className="fa-solid fa-circle-check text-yellow-500/50 text-xs"></i> 
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handleStartMembership(plan)} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${plan.recommended ? 'bg-yellow-500 text-black hover:bg-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>
                                    Hemen Başla
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {currentView === 'store' && <StoreView />}

        {currentView === 'wiki' && (
            <div className="py-24 bg-zinc-950 min-h-screen animate-fade-in">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-6xl font-display font-black mb-4 uppercase italic tracking-tighter">MUSCLE <span className="text-yellow-500">WIKI</span></h2>
                        <p className="text-zinc-500 max-w-xl mx-auto">Hedeflediğin kas grubunu seç ve profesyonellerin formunda egzersiz yapmaya başla.</p>
                    </div>
                    <div className="mb-16">
                        <AnatomySelector selectedMuscle={selectedMuscle} onSelect={setSelectedMuscle} />
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {exercises.filter(ex => !selectedMuscle || ex.muscleGroup === selectedMuscle).map(ex => (
                            <div key={ex.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden group hover:border-yellow-500/50 transition-all duration-500 shadow-2xl">
                                <div className="h-56 overflow-hidden relative">
                                    <img src={ex.image} alt={ex.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                                        <span className="text-[10px] bg-yellow-500 text-black px-3 py-1 rounded-full font-black uppercase tracking-tighter">
                                            {ex.difficulty}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-display font-bold italic tracking-tighter">{ex.name}</h3>
                                        <span className="text-zinc-600 text-xs font-bold uppercase">{ex.muscleGroup}</span>
                                    </div>
                                    <p className="text-zinc-500 text-sm leading-relaxed mb-6">{ex.description}</p>
                                    <button className="w-full py-3 bg-zinc-800 hover:bg-yellow-500 text-zinc-400 hover:text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all">
                                        Formu İzle <i className="fa-solid fa-play ml-2"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {currentView === 'login' && <Login onLogin={handleLogin} setView={setCurrentView} />}
        {currentView === 'register' && <Register onLogin={handleLogin} setView={setCurrentView} />}
        {currentView === 'profile' && <Profile user={user} onLogout={handleLogout} />}
      </main>

      <footer className="bg-black border-t border-zinc-900 py-20 relative z-10 overflow-hidden">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-12 text-center md:text-left relative z-10">
            <div className="col-span-2">
                <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
                    <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center font-black text-black">I</div>
                    <span className="text-2xl font-display font-black text-white italic tracking-tighter">IRON<span className="text-yellow-500">CORE</span></span>
                </div>
                <p className="text-zinc-500 max-w-sm mb-8">Türkiye'nin en sert ve en disiplinli spor salonu zinciri. Biz sadece vücut değil, karakter inşa ediyoruz.</p>
                <div className="flex gap-4 justify-center md:justify-start">
                    {['instagram', 'youtube', 'x-twitter', 'tiktok'].map(sm => (
                        <a key={sm} href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-yellow-500 hover:border-yellow-500 transition-all">
                            <i className={`fa-brands fa-${sm}`}></i>
                        </a>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="font-display font-bold text-white mb-6 uppercase tracking-widest">Hızlı Linkler</h4>
                <ul className="space-y-3 text-zinc-500 text-sm">
                    <li><button onClick={() => setCurrentView('home')} className="hover:text-yellow-500 transition">Ana Sayfa</button></li>
                    <li><button onClick={() => setCurrentView('memberships')} className="hover:text-yellow-500 transition">Üyelikler</button></li>
                    <li><button onClick={() => setCurrentView('store')} className="hover:text-yellow-500 transition">Mağaza</button></li>
                    <li><button onClick={() => setCurrentView('wiki')} className="hover:text-yellow-500 transition">Muscle Wiki</button></li>
                </ul>
            </div>
            <div>
                <h4 className="font-display font-bold text-white mb-6 uppercase tracking-widest">İletişim</h4>
                <ul className="space-y-3 text-zinc-500 text-sm italic">
                    <li>Kanyon AVM, Levent / IST</li>
                    <li>info@ironcoregym.com</li>
                    <li>0212 900 00 00</li>
                </ul>
            </div>
        </div>
        <div className="container mx-auto px-4 mt-20 pt-8 border-t border-zinc-900/50 text-center text-zinc-700 text-[10px] tracking-[0.5em] uppercase">
            © 2024 IRONCORE LEGION. DESIGNED BY STRONGER MINDS.
        </div>
      </footer>

      <Chatbot />
    </div>
  );
};

export default App;
