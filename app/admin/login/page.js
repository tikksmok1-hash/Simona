'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../AdminAuthContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // 2FA state
  const [step, setStep] = useState(1); // 1 = credentials, 2 = TOTP code
  const [tempToken, setTempToken] = useState(null);
  const [code, setCode] = useState('');
  const codeRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const { login, setAuthData } = useAdmin();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.requiresTwoFactor) {
        setTempToken(result.tempToken);
        setStep(2);
        setTimeout(() => codeRefs[0].current?.focus(), 100);
      } else {
        router.push('/admin');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const digits = code.split('');
    digits[i] = val.slice(-1);
    const newCode = digits.join('').padEnd(6, '').slice(0, 6);
    setCode(newCode.trimEnd());
    if (val && i < 5) codeRefs[i + 1].current?.focus();
  };

  const handleCodeKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      codeRefs[i - 1].current?.focus();
    }
  };

  const handleCodePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    setCode(pasted);
    if (pasted.length === 6) {
      codeRefs[5].current?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length < 6) { setError('Introdu toate cele 6 cifre'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, tempToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Cod invalid');
      setAuthData(data.token, data.user);
      router.push('/admin');
    } catch (err) {
      setError(err.message);
      setCode('');
      codeRefs[0].current?.focus();
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

        {step === 1 ? (
          /* ── Step 1: Email + Parolă ── */
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
        ) : (
          /* ── Step 2: Cod 2FA ── */
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3.75h3m-3 3.75h3" />
                </svg>
              </div>
              <p className="text-white/60 text-xs tracking-widest uppercase mb-1">Verificare în doi pași</p>
              <p className="text-white/40 text-[11px] mt-1">Introdu codul din aplicația Authenticator</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded px-4 py-3 text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            {/* 6-digit boxes */}
            <div className="flex gap-2 justify-center" onPaste={handleCodePaste}>
              {[0,1,2,3,4,5].map((i) => (
                <input
                  key={i}
                  ref={codeRefs[i]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={code[i] || ''}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(i, e)}
                  className="w-9 h-11 text-center text-lg text-white bg-white/5 border border-white/10 rounded focus:outline-none focus:border-white/40 transition-colors"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full bg-white text-black py-3 text-xs tracking-widest uppercase hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Se verifică...' : 'Verifică Codul'}
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setError(''); setCode(''); }}
              className="w-full text-white/30 text-[10px] tracking-widest uppercase hover:text-white/60 transition-colors"
            >
              ← Înapoi
            </button>
          </form>
        )}

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

