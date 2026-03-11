'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../AdminAuthContext';

function TwoFactorSection({ apiFetch }) {
  const [status, setStatus] = useState(null);
  const [setupData, setSetupData] = useState(null);
  const [setupStep, setSetupStep] = useState(0);
  const [verifyCode, setVerifyCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [showDisable, setShowDisable] = useState(false);
  const [msg, setMsg] = useState(null);
  const [loading2fa, setLoading2fa] = useState(false);

  useEffect(() => {
    apiFetch('/api/admin/me')
      .then(r => r.json())
      .then(d => setStatus(d.user?.twoFactorEnabled ?? false))
      .catch(() => setStatus(false));
  }, [apiFetch]);

  const startSetup = async () => {
    setLoading2fa(true); setMsg(null);
    const res = await apiFetch('/api/admin/2fa/setup');
    const data = await res.json();
    setSetupData(data);
    setSetupStep(1);
    setLoading2fa(false);
  };

  const enableTwoFactor = async () => {
    if (verifyCode.length !== 6) { setMsg({ type: 'error', text: 'Introdu 6 cifre' }); return; }
    setLoading2fa(true); setMsg(null);
    const res = await apiFetch('/api/admin/2fa/enable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: verifyCode, secret: setupData.secret }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus(true); setSetupStep(0); setSetupData(null); setVerifyCode('');
      setMsg({ type: 'success', text: '2FA activat cu succes! Contul tău este acum protejat.' });
    } else {
      setMsg({ type: 'error', text: data.error });
    }
    setLoading2fa(false);
  };

  const disableTwoFactor = async () => {
    if (!disablePassword) { setMsg({ type: 'error', text: 'Introduceți parola' }); return; }
    setLoading2fa(true); setMsg(null);
    const res = await apiFetch('/api/admin/2fa/disable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: disablePassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus(false); setShowDisable(false); setDisablePassword('');
      setMsg({ type: 'success', text: '2FA dezactivat.' });
    } else {
      setMsg({ type: 'error', text: data.error });
    }
    setLoading2fa(false);
  };

  if (status === null) {
    return (
      <div className="flex items-center gap-3 py-4">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-400">Se verifică...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {msg && (
        <div className={`px-4 py-3 rounded-lg text-sm flex items-start gap-2 ${msg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          <span>{msg.type === 'success' ? '✓' : '✕'}</span>
          <span>{msg.text}</span>
        </div>
      )}

      {/* Status card */}
      <div className={`rounded-xl border-2 p-5 flex items-center gap-4 ${status ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${status ? 'bg-green-500' : 'bg-gray-300'}`}>
          {status ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.764c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
            </svg>
          )}
        </div>
        <div>
          <p className={`font-semibold ${status ? 'text-green-800' : 'text-gray-700'}`}>
            {status ? '2FA Activ' : '2FA Inactiv'}
          </p>
          <p className={`text-sm mt-0.5 ${status ? 'text-green-600' : 'text-gray-500'}`}>
            {status
              ? 'Contul tău este protejat cu autentificare în doi pași.'
              : 'Activează 2FA pentru un nivel suplimentar de securitate.'}
          </p>
        </div>
      </div>

      {/* Setup flow */}
      {!status && setupStep === 0 && (
        <button
          onClick={startSetup}
          disabled={loading2fa}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {loading2fa ? 'Se generează...' : 'Activează 2FA'}
        </button>
      )}

      {!status && setupStep === 1 && setupData && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          <div>
            <p className="font-medium text-black mb-1">Pasul 1 — Scanează QR Code</p>
            <p className="text-sm text-gray-500 mb-4">
              Deschide <strong>Google Authenticator</strong>, <strong>Authy</strong> sau orice aplicație TOTP și scanează:
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="border-2 border-gray-100 rounded-xl p-3 bg-white inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={setupData.qrUrl} alt="QR Code 2FA" width={180} height={180} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">Nu poți scana? Introdu manual secretul:</p>
                <code className="block bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-xs font-mono tracking-widest break-all select-all text-gray-800">
                  {setupData.secret}
                </code>
              </div>
            </div>
          </div>

          <div>
            <p className="font-medium text-black mb-1">Pasul 2 — Confirmă codul</p>
            <p className="text-sm text-gray-500 mb-3">
              Introdu codul de 6 cifre generat de aplicație:
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={verifyCode}
                onChange={e => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000 000"
                className="w-40 px-4 py-3 border-2 border-gray-200 rounded-lg text-lg text-center tracking-[0.4em] font-mono focus:outline-none focus:border-black transition-colors"
              />
              <button
                onClick={enableTwoFactor}
                disabled={loading2fa || verifyCode.length < 6}
                className="px-6 py-3 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading2fa ? 'Se verifică...' : 'Activează'}
              </button>
              <button
                onClick={() => { setSetupStep(0); setSetupData(null); setVerifyCode(''); setMsg(null); }}
                className="px-4 py-3 text-sm text-gray-500 hover:text-black transition-colors"
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disable flow */}
      {status && !showDisable && (
        <button
          onClick={() => setShowDisable(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg hover:bg-red-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          Dezactivează 2FA
        </button>
      )}

      {status && showDisable && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-4">
          <p className="text-sm text-red-700 font-medium">Confirmă dezactivarea 2FA cu parola actuală:</p>
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="password"
              value={disablePassword}
              onChange={e => setDisablePassword(e.target.value)}
              placeholder="Parola ta"
              className="w-56 px-4 py-2.5 border border-red-200 rounded-lg text-sm focus:outline-none focus:border-red-400 bg-white"
            />
            <button
              onClick={disableTwoFactor}
              disabled={loading2fa}
              className="px-5 py-2.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading2fa ? '...' : 'Dezactivează'}
            </button>
            <button
              onClick={() => { setShowDisable(false); setDisablePassword(''); }}
              className="px-4 py-2.5 text-sm text-gray-500 hover:text-black transition-colors"
            >
              Anulează
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SecuritatePage() {
  const { apiFetch } = useAdmin();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-light text-black">Securitate</h1>
        <p className="text-sm text-gray-500 mt-1">Gestionează securitatea contului tău de administrator</p>
      </div>

      {/* 2FA Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3.75h3m-3 3.75h3" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-black">Autentificare în Doi Pași (2FA)</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Adaugă un strat extra de protecție cu Google Authenticator sau Authy
            </p>
          </div>
        </div>

        <TwoFactorSection apiFetch={apiFetch} />
      </div>

      {/* Info box */}
      <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <div>
          <p className="text-sm text-blue-800 font-medium">Ce este 2FA?</p>
          <p className="text-xs text-blue-600 mt-1 leading-relaxed">
            La fiecare autentificare vei introduce parola <strong>și</strong> un cod de 6 cifre generat de aplicația din telefon. 
            Chiar dacă cineva îți cunoaște parola, nu poate accesa panoul fără telefonul tău.
          </p>
        </div>
      </div>
    </div>
  );
}
