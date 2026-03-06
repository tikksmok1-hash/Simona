'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../AdminAuthContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-white tracking-wider">SIMONA</h1>
          <p className="text-[10px] tracking-[0.5em] text-white/30 uppercase mt-2">Admin Panel</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded px-4 py-3 text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
              placeholder="admin@simona.md"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">Parolă</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 text-xs tracking-widest uppercase hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Se autentifică...' : 'Autentificare'}
          </button>
        </form>

        <p className="text-center text-white/20 text-[10px] mt-8 tracking-wider">
          © 2026 SIMONA Fashion
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
