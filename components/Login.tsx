import React, { useState } from 'react';
import { api } from '../services/api';

const Login = ({ onLogin, setView }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await api.login(usernameOrEmail.trim(), password);
      const user = {
        id: data.user_id,
        name: data.username,
        email: data.email || usernameOrEmail.trim(),
        token: data.token,
        membership: 'Üye',
        startDate: new Date().toISOString().slice(0, 10),
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
        stats: { workouts: 0, streak: 0, weight: 0 },
      };
      onLogin(user);
    } catch (err) {
      setError(err?.message || 'Hatalı kullanıcı adı veya şifre.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
             <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[100px]"></div>
             <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]"></div>
        </div>

      <div className="bg-zinc-900/80 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-zinc-800 shadow-2xl w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-500 rounded mx-auto flex items-center justify-center mb-4 transform rotate-3">
                 <i className="fa-solid fa-dumbbell text-3xl text-black"></i>
            </div>
          <h2 className="text-3xl font-display font-bold text-white">MEMBER LOGIN</h2>
          <p className="text-zinc-400 text-sm mt-2">Welcome back to the Iron Legion.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Kullanıcı adı veya E-posta</label>
            <div className="relative">
                <i className="fa-solid fa-user absolute left-4 top-3.5 text-zinc-500"></i>
                <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded focus:outline-none focus:border-yellow-500 transition-colors"
                placeholder="kullanici_adi veya email@example.com"
                required
                />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-3.5 text-zinc-500"></i>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded focus:outline-none focus:border-yellow-500 transition-colors"
                placeholder="••••••••"
                required
                />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded uppercase tracking-wider transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
                <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i> Checking Credentials...
                </>
            ) : (
                'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-zinc-500 text-xs">
          Hesabın yok mu?{' '}
          <span onClick={() => setView('register')} className="text-yellow-500 cursor-pointer hover:underline font-bold">
            Yeni kayıt oluştur
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
