'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../AdminAuthContext';
import TranslatableField from '../components/TranslatableField';
import Image from 'next/image';

// ── 2FA Section Component ─────────────────────────────────────────────────────
function TwoFactorSection({ apiFetch }) {
  const [status, setStatus] = useState(null); // null = loading, true = enabled, false = disabled
  const [setupData, setSetupData] = useState(null); // { secret, qrUrl }
  const [setupStep, setSetupStep] = useState(0); // 0=idle, 1=qr shown, 2=verified
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
      setMsg({ type: 'success', text: '2FA activat cu succes!' });
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

  if (status === null) return <div className="h-10 flex items-center"><div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      {msg && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {msg.text}
        </div>
      )}

      {/* Status badge */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-2.5 h-2.5 rounded-full ${status ? 'bg-green-500' : 'bg-gray-300'}`} />
        <span className="text-sm text-gray-700">{status ? '2FA Activ — contul tău este protejat' : '2FA Inactiv — activează pentru securitate sporită'}</span>
      </div>

      {!status && setupStep === 0 && (
        <button onClick={startSetup} disabled={loading2fa}
          className="px-5 py-2.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
          {loading2fa ? 'Se pregătește...' : 'Activează 2FA'}
        </button>
      )}

      {!status && setupStep === 1 && setupData && (
        <div className="space-y-5">
          <p className="text-sm text-gray-600">Scanează cu <strong>Google Authenticator</strong>, <strong>Authy</strong> sau orice aplicație TOTP:</p>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* QR Code */}
            <div className="border border-gray-200 rounded-lg p-3 bg-white inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={setupData.qrUrl} alt="QR Code 2FA" width={160} height={160} />
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-xs text-gray-500">Sau introdu manual secretul în aplicație:</p>
              <code className="block bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs font-mono tracking-widest break-all select-all">
                {setupData.secret}
              </code>
              <p className="text-xs text-gray-400">Apoi introdu codul de 6 cifre generat de aplicație pentru confirmare:</p>
              <div className="flex gap-2">
                <input
                  type="text" inputMode="numeric" maxLength={6}
                  value={verifyCode}
                  onChange={e => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-36 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center tracking-widest focus:outline-none focus:border-black"
                />
                <button onClick={enableTwoFactor} disabled={loading2fa || verifyCode.length < 6}
                  className="px-5 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
                  {loading2fa ? '...' : 'Confirmă'}
                </button>
                <button onClick={() => { setSetupStep(0); setSetupData(null); setVerifyCode(''); }}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors">
                  Anulează
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {status && !showDisable && (
        <button onClick={() => setShowDisable(true)}
          className="px-5 py-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg hover:bg-red-100 transition-colors">
          Dezactivează 2FA
        </button>
      )}

      {status && showDisable && (
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <input
            type="password"
            value={disablePassword}
            onChange={e => setDisablePassword(e.target.value)}
            placeholder="Confirmă cu parola actuală"
            className="w-64 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
          />
          <button onClick={disableTwoFactor} disabled={loading2fa}
            className="px-5 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
            {loading2fa ? '...' : 'Dezactivează'}
          </button>
          <button onClick={() => { setShowDisable(false); setDisablePassword(''); }}
            className="px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors">
            Anulează
          </button>
        </div>
      )}
    </div>
  );
}

export default function SetariPage() {
  const { apiFetch } = useAdmin();
  const [settings, setSettings] = useState({
    heroImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop&q=90',
    heroTitle: 'Descoperă',
    heroTitleRu: '',
    heroTitleEn: '',
    heroSubtitle: 'Stilul Tău',
    heroSubtitleRu: '',
    heroSubtitleEn: '',
    heroLabel: 'Colecția Primăvară 2026',
    heroLabelRu: '',
    heroLabelEn: '',
    phone1: '062 000 160',
    phone2: '',
    email: 'simona.md_info@mail.ru',
    address: 'str. Ion Creangă 58, Chișinău',
    addressRu: '',
    addressEn: '',
    schedule1: 'Luni – Vineri: 9:00 – 19:00',
    schedule1Ru: '',
    schedule1En: '',
    schedule2: 'Sâmbătă – Duminică: 9:00 – 17:00',
    schedule2Ru: '',
    schedule2En: '',
    footerDescription: 'Magazinul tău de modă feminină din Chișinău. Cele mai noi tendințe la prețuri accesibile.',
    footerDescriptionRu: '',
    footerDescriptionEn: '',
    // Trust badges (product page)
    badge1Label: 'Livrare Rapidă',
    badge1LabelRu: '',
    badge1LabelEn: '',
    badge1Sub: '1–5 zile lucrătoare',
    badge1SubRu: '',
    badge1SubEn: '',
    badge2Label: 'Returnare',
    badge2LabelRu: '',
    badge2LabelEn: '',
    badge2Sub: '30 de zile',
    badge2SubRu: '',
    badge2SubEn: '',
    badge3Label: 'Plată Securizată',
    badge3LabelRu: '',
    badge3LabelEn: '',
    badge3Sub: '100% sigur',
    badge3SubRu: '',
    badge3SubEn: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await apiFetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const res = await apiFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiFetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        setSettings(prev => ({ ...prev, heroImage: url }));
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const updateField = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-light text-black">Setări Site</h1>
        <p className="text-sm text-gray-500 mt-1">Personalizează pagina principală</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          ✓ Setările au fost salvate cu succes!
        </div>
      )}

      {/* Hero Section Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-medium text-black mb-6">Secțiunea Hero (Prima Pagină)</h2>
        
        {/* Hero Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagine de Fundal
          </label>
          <div className="flex gap-4 items-start">
            <div className="relative w-64 h-36 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {settings.heroImage ? (
                <Image
                  src={settings.heroImage}
                  alt="Hero preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="cursor-pointer">
                <div className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm transition-colors ${uploading ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}>
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      Se încarcă...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Încarcă imagine nouă
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Recomandat: 1920x1080px sau mai mare. Format: JPG, PNG, WebP
              </p>
            </div>
          </div>
        </div>

        {/* Hero URL input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            sau URL Imagine Externă
          </label>
          <input
            type="text"
            value={settings.heroImage}
            onChange={(e) => setSettings(prev => ({ ...prev, heroImage: e.target.value }))}
            placeholder="https://..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
          />
        </div>

        {/* Hero Label */}
        <div className="mb-6">
          <TranslatableField
            label="Label (Text Mic de Sus)"
            value={settings.heroLabel}
            valueRu={settings.heroLabelRu}
            valueEn={settings.heroLabelEn}
            onChange={updateField}
            fieldKey="heroLabel"
            apiFetch={apiFetch}
            placeholder="Colecția Primăvară 2026"
          />
        </div>

        {/* Hero Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TranslatableField
            label="Titlu Principal"
            value={settings.heroTitle}
            valueRu={settings.heroTitleRu}
            valueEn={settings.heroTitleEn}
            onChange={updateField}
            fieldKey="heroTitle"
            apiFetch={apiFetch}
            placeholder="Descoperă"
          />
          <TranslatableField
            label="Subtitlu (Italic)"
            value={settings.heroSubtitle}
            valueRu={settings.heroSubtitleRu}
            valueEn={settings.heroSubtitleEn}
            onChange={updateField}
            fieldKey="heroSubtitle"
            apiFetch={apiFetch}
            placeholder="Stilul Tău"
          />
        </div>
      </div>

      {/* Contact Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-medium text-black mb-6">Date de Contact</h2>

        {/* Phone Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefon Principal
            </label>
            <input
              type="text"
              value={settings.phone1}
              onChange={(e) => setSettings(prev => ({ ...prev, phone1: e.target.value }))}
              placeholder="062 000 160"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefon Secundar (opțional)
            </label>
            <input
              type="text"
              value={settings.phone2}
              onChange={(e) => setSettings(prev => ({ ...prev, phone2: e.target.value }))}
              placeholder="069 123 456"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
            placeholder="simona.md_info@mail.ru"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
          />
        </div>

        {/* Address */}
        <div className="mb-6">
          <TranslatableField
            label="Adresă"
            value={settings.address}
            valueRu={settings.addressRu}
            valueEn={settings.addressEn}
            onChange={updateField}
            fieldKey="address"
            apiFetch={apiFetch}
            placeholder="str. Ion Creangă 58, Chișinău"
          />
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TranslatableField
            label="Program Luni – Vineri"
            value={settings.schedule1}
            valueRu={settings.schedule1Ru}
            valueEn={settings.schedule1En}
            onChange={updateField}
            fieldKey="schedule1"
            apiFetch={apiFetch}
            placeholder="Luni – Vineri: 9:00 – 19:00"
          />
          <TranslatableField
            label="Program Sâmbătă – Duminică"
            value={settings.schedule2}
            valueRu={settings.schedule2Ru}
            valueEn={settings.schedule2En}
            onChange={updateField}
            fieldKey="schedule2"
            apiFetch={apiFetch}
            placeholder="Sâmbătă – Duminică: 9:00 – 17:00"
          />
        </div>

        {/* Footer Description */}
        <div>
          <TranslatableField
            label="Descriere Footer"
            value={settings.footerDescription}
            valueRu={settings.footerDescriptionRu}
            valueEn={settings.footerDescriptionEn}
            onChange={updateField}
            fieldKey="footerDescription"
            apiFetch={apiFetch}
            multiline
            rows={2}
            placeholder="Magazinul tău de modă feminină din Chișinău..."
          />
        </div>
      </div>

      {/* Trust Badges (Product Page) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-medium text-black mb-2">Insigne de Încredere (Pagina Produsului)</h2>
        <p className="text-sm text-gray-500 mb-6">Cele 3 insigne afișate sub butonul „Adaugă în coș" pe fiecare produs.</p>

        {/* Badge 1 — Delivery */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
            <span className="text-sm font-medium text-gray-700">Insigna 1 — Livrare</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TranslatableField label="Titlu" value={settings.badge1Label} valueRu={settings.badge1LabelRu} valueEn={settings.badge1LabelEn} onChange={updateField} fieldKey="badge1Label" apiFetch={apiFetch} placeholder="Livrare Rapidă" />
            <TranslatableField label="Subtitlu" value={settings.badge1Sub} valueRu={settings.badge1SubRu} valueEn={settings.badge1SubEn} onChange={updateField} fieldKey="badge1Sub" apiFetch={apiFetch} placeholder="1–5 zile lucrătoare" />
          </div>
        </div>

        {/* Badge 2 — Returns */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
            <span className="text-sm font-medium text-gray-700">Insigna 2 — Returnare</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TranslatableField label="Titlu" value={settings.badge2Label} valueRu={settings.badge2LabelRu} valueEn={settings.badge2LabelEn} onChange={updateField} fieldKey="badge2Label" apiFetch={apiFetch} placeholder="Returnare" />
            <TranslatableField label="Subtitlu" value={settings.badge2Sub} valueRu={settings.badge2SubRu} valueEn={settings.badge2SubEn} onChange={updateField} fieldKey="badge2Sub" apiFetch={apiFetch} placeholder="30 de zile" />
          </div>
        </div>

        {/* Badge 3 — Secure Payment */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            <span className="text-sm font-medium text-gray-700">Insigna 3 — Plată Securizată</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TranslatableField label="Titlu" value={settings.badge3Label} valueRu={settings.badge3LabelRu} valueEn={settings.badge3LabelEn} onChange={updateField} fieldKey="badge3Label" apiFetch={apiFetch} placeholder="Plată Securizată" />
            <TranslatableField label="Subtitlu" value={settings.badge3Sub} valueRu={settings.badge3SubRu} valueEn={settings.badge3SubEn} onChange={updateField} fieldKey="badge3Sub" apiFetch={apiFetch} placeholder="100% sigur" />
          </div>
        </div>
      </div>

      {/* 2FA Security */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-medium text-black">Autentificare în Doi Pași (2FA)</h2>
            <p className="text-sm text-gray-500 mt-0.5">Protejează contul cu Google Authenticator sau Authy</p>
          </div>
        </div>
        <TwoFactorSection apiFetch={apiFetch} />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Se salvează...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Salvează Setările
            </>
          )}
        </button>
      </div>
    </div>
  );
}
