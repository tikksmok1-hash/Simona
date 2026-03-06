'use client';

import { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function ComandaPage() {
  const { cart, cartTotal, clearCart, deliveryMethod, setDeliveryMethod } = useCart();
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    nume: '',
    prenume: '',
    telefon: '',
    email: '',
    adresa: '',
    oras: '',
    observatii: '',
  });

  const isPickup = deliveryMethod === 'pickup';
  const DELIVERY_STANDARD = 70;
  const DELIVERY_EXPRESS = 200;
  const deliveryCost =
    deliveryMethod === 'pickup' ? 0 :
    deliveryMethod === 'express' ? DELIVERY_EXPRESS :
    DELIVERY_STANDARD;
  const total = cartTotal + deliveryCost;

  const handle = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.nume.trim()) errs.nume = 'Câmp obligatoriu';
    if (!form.prenume.trim()) errs.prenume = 'Câmp obligatoriu';
    if (!form.telefon.trim()) errs.telefon = 'Câmp obligatoriu';
    else if (!/^[\d\s\+\-\(\)]{7,}$/.test(form.telefon)) errs.telefon = 'Număr invalid';
    if (!isPickup) {
      if (!form.adresa.trim()) errs.adresa = 'Câmp obligatoriu';
      if (!form.oras.trim()) errs.oras = 'Câmp obligatoriu';
    }
    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    // Simulate order processing
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStep('success');
    clearCart();
  };

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-white pt-[112px] flex flex-col items-center justify-center text-center px-4">
        <svg className="w-16 h-16 text-neutral-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h1 className="font-serif text-3xl font-light text-black mb-3">Coșul tău este gol</h1>
        <p className="text-neutral-500 text-sm mb-8">Adaugă produse înainte de a plasa comanda.</p>
        <Link href="/" className="inline-block bg-black text-white px-10 py-3 text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors">
          Continuă Cumpărăturile
        </Link>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white pt-[112px] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 border border-black flex items-center justify-center mb-8">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-3">Confirmat</p>
        <h1 className="font-serif text-4xl font-light text-black mb-4">Comanda a fost plasată!</h1>
        <p className="text-neutral-500 text-sm max-w-sm mx-auto mb-3 leading-relaxed">
          Te vom contacta în curând la numărul <span className="text-black font-medium">{form.telefon || 'furnizat'}</span> pentru a confirma detaliile comenzii.
        </p>
        <p className="text-neutral-400 text-xs mb-10">
          Ai întrebări? Sunați la{' '}
          <a href="tel:+37362000160" className="text-black underline underline-offset-2">062 000 160</a>
        </p>
        <Link href="/" className="inline-block bg-black text-white px-10 py-3 text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors">
          Înapoi Acasă
        </Link>
      </div>
    );
  }

  const inputCls = (field) =>
    `w-full px-4 py-3 border text-sm focus:outline-none focus:border-black transition-colors ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-neutral-200'
    }`;

  return (
    <div className="min-h-screen bg-white pt-[112px] md:pt-[170px] pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12 border-b border-neutral-100 pb-8">
          <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-3">Ultimul pas</p>
          <h1 className="font-serif text-4xl font-light text-black">Finalizare Comandă</h1>
        </div>

        <form onSubmit={submit}>
          <div className="flex flex-col lg:flex-row gap-12 lg:items-start">

            {/* Left — Form */}
            <div className="flex-1 min-w-0 space-y-12">

              {/* Delivery method */}
              <div>
                <h2 className="text-xs tracking-widest uppercase font-medium text-black mb-5">Metoda de livrare</h2>
                <div className="space-y-2">

                  {/* Standard */}
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('standard')}
                    className={`w-full flex items-center justify-between px-4 py-3 border text-left transition-all duration-200 ${
                      deliveryMethod === 'standard' ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      <div>
                        <p className="text-xs tracking-widest uppercase font-medium">Standard</p>
                        <p className={`text-[10px] mt-0.5 ${deliveryMethod === 'standard' ? 'text-white/60' : 'text-neutral-400'}`}>2–4 zile lucrătoare</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium">{DELIVERY_STANDARD} MDL</span>
                  </button>

                  {/* Express */}
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('express')}
                    className={`w-full flex items-center justify-between px-4 py-3 border text-left transition-all duration-200 ${
                      deliveryMethod === 'express' ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <p className="text-xs tracking-widest uppercase font-medium">Express</p>
                        <p className={`text-[10px] mt-0.5 ${deliveryMethod === 'express' ? 'text-white/60' : 'text-neutral-400'}`}>Zi lucrătoare următoare</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium">{DELIVERY_EXPRESS} MDL</span>
                  </button>

                  {/* Pick-up */}
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`w-full flex items-center justify-between px-4 py-3 border text-left transition-all duration-200 ${
                      deliveryMethod === 'pickup' ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-xs tracking-widest uppercase font-medium">Pick-up</p>
                        <p className={`text-[10px] mt-0.5 ${deliveryMethod === 'pickup' ? 'text-white/60' : 'text-neutral-400'}`}>str. Ion Creangă 58, Chișinău</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${deliveryMethod === 'pickup' ? 'text-green-400' : 'text-green-600'}`}>Gratuit</span>
                  </button>

                </div>
                {isPickup && (
                  <p className="text-xs text-neutral-500 mt-3 flex items-start gap-1.5">
                    <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Luni–Sâmbătă 10:00–19:00
                  </p>
                )}
              </div>

              {/* Personal info */}
              <div>
                <h2 className="text-xs tracking-widest uppercase font-medium text-black mb-5">Date personale</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5 tracking-wide">Nume *</label>
                    <input name="nume" value={form.nume} onChange={handle} className={inputCls('nume')} placeholder="Ionescu" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5 tracking-wide">Prenume *</label>
                    <input name="prenume" value={form.prenume} onChange={handle} className={inputCls('prenume')} placeholder="Maria" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5 tracking-wide">Telefon *</label>
                    <input name="telefon" value={form.telefon} onChange={handle} className={inputCls('telefon')} placeholder="+373 60 000 000" type="tel" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5 tracking-wide">Email (opțional)</label>
                    <input name="email" value={form.email} onChange={handle} className={inputCls('email')} placeholder="email@exemplu.com" type="email" />
                  </div>
                </div>
              </div>

              {/* Delivery address */}
              {!isPickup && (
                <div>
                  <div className="grid grid-cols-1 mt-6 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-neutral-500 mb-1.5 tracking-wide">Adresă *</label>
                      <input name="adresa" value={form.adresa} onChange={handle} className={inputCls('adresa')} placeholder="Str. Exemplu 10, ap. 5" />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1.5 tracking-wide">Oraș / Localitate *</label>
                      <input name="oras" value={form.oras} onChange={handle} className={inputCls('oras')} placeholder="Chișinău" />
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <h2 className="text-xs tracking-widest mt-6 uppercase font-medium text-black mb-2">Observații (opțional)</h2>
                <textarea
                  name="observatii"
                  value={form.observatii}
                  onChange={handle}
                  rows={4}
                  className="w-full px-4 py-4 border border-neutral-200 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                  placeholder="Instrucțiuni speciale pentru livrare, talie preferată etc."
                />
              </div>

              {/* Payment info */}
              <div className="bg-neutral-50 border border-neutral-100 p-6 flex items-start gap-4">
                <svg className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-black mb-1">Plată la livrare (ramburs)</p>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Achitați comanda în numerar sau prin card bancar la primirea coletului. Te contactăm noi pentru confirmare.
                  </p>
                </div>
              </div>

            </div>

            {/* Right — Order summary */}
            <div className="w-full lg:w-[360px] lg:flex-shrink-0 lg:sticky lg:top-[140px]">
              <div className="bg-neutral-50 border border-neutral-100 p-6">
                <h2 className="font-serif text-xl font-light text-black mb-6">Sumar Comandă</h2>

                {/* Products */}
                <div className="space-y-5 mb-6 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.key} className="flex gap-3">
                      <div className="relative w-14 h-20 flex-shrink-0 bg-neutral-200 overflow-hidden">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                              <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.86H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.86l.58-3.57a2 2 0 00-1.34-2.23z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-black font-light line-clamp-2 leading-snug">{item.name}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">{item.colorName} · {item.size} · ×{item.quantity}</p>
                        <p className="text-sm font-medium text-black mt-1">{item.price * item.quantity} MDL</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm border-t border-neutral-200 pt-4 mb-6">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>{cartTotal} MDL</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>
                      {deliveryMethod === 'express' ? 'Livrare Express' :
                       deliveryMethod === 'pickup' ? 'Pick-up' :
                       'Livrare Standard'}
                    </span>
                    <span className={isPickup ? 'text-green-600 font-medium' : ''}>
                      {isPickup ? 'Gratuit' : `${deliveryCost} MDL`}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium text-black text-base border-t border-neutral-200 pt-3">
                    <span>Total</span>
                    <span>{total} MDL</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 text-xs tracking-widest uppercase hover:bg-neutral-800 active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Se procesează...
                    </>
                  ) : (
                    <>
                      Plasează Comanda
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>

                <Link href="/cos" className="block text-center text-xs text-neutral-400 hover:text-black tracking-wide mt-3 transition-colors">
                  ← Înapoi la coș
                </Link>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
