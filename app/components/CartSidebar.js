'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';
import { useTranslation } from '@/app/context/LanguageContext';
import { localize } from '@/lib/localize';

export default function CartSidebar() {
  const { cart, cartCount, cartTotal, isCartOpen, closeCart, removeFromCart, updateQuantity, deliveryMethod, setDeliveryMethod } = useCart();
  const { lang, t } = useTranslation();

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeCart]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  const isPickup = deliveryMethod === 'pickup';
  const DELIVERY_STANDARD = 70;
  const deliveryCost = deliveryMethod === 'pickup' ? 0 : DELIVERY_STANDARD;
  const total = cartTotal + deliveryCost;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-[100] flex flex-col shadow-2xl transition-transform duration-400 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-xl font-light text-black tracking-wide">{t('cart.myCart')}</h2>
            {cartCount > 0 && (
              <span className="bg-black text-white text-[10px] tracking-widest px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 transition-all duration-200 active:scale-90 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Delivery method */}
        {cartTotal > 0 && (
          <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-100 space-y-2">
            <p className="text-[10px] tracking-widest uppercase text-neutral-400 mb-1">{t('cart.delivery')}</p>

            {/* Standard */}
            <button
              onClick={() => setDeliveryMethod('standard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 border text-left transition-all duration-200 cursor-pointer ${
                deliveryMethod === 'standard' ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <div>
                  <p className="text-[10px] tracking-widest uppercase font-medium">{t('cart.standard')}</p>
                  <p className={`text-[9px] ${deliveryMethod === 'standard' ? 'text-white/60' : 'text-neutral-400'}`}>{t('cart.standardDays')}</p>
                </div>
              </div>
              <span className="text-[10px] font-medium">{DELIVERY_STANDARD} MDL</span>
            </button>

            {/* Pick-up */}
            <button
              onClick={() => setDeliveryMethod('pickup')}
              className={`w-full flex items-center justify-between px-3 py-2.5 border text-left transition-all duration-200 cursor-pointer ${
                deliveryMethod === 'pickup' ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-[10px] tracking-widest uppercase font-medium">{t('cart.pickup')}</p>
                  <p className={`text-[9px] ${deliveryMethod === 'pickup' ? 'text-white/60' : 'text-neutral-400'}`}>Ion Creangă 58</p>
                </div>
              </div>
              <span className={`text-[10px] font-medium ${deliveryMethod === 'pickup' ? 'text-green-400' : 'text-green-600'}`}>{t('cart.free')}</span>
            </button>

          </div>
        )}

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto py-4 px-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <svg className="w-14 h-14 text-neutral-200 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="font-serif text-lg font-light text-black mb-2">{t('cart.empty')}</p>
              <p className="text-neutral-400 text-xs tracking-wide mb-6">{t('cart.emptyDesc')}</p>
              <button
                onClick={closeCart}
                className="border border-black text-black text-xs tracking-widest uppercase px-8 py-2.5 hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
              >
                {t('cart.continueShopping')}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => (
                <div key={item.key} className="flex gap-4 group">
                  {/* Image */}
                  <div className="relative w-20 h-28 flex-shrink-0 bg-neutral-100 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={localize(item, 'name', lang)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.86H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.86l.58-3.57a2 2 0 00-1.34-2.23z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <Link
                        href={`/produs/${item.slug}`}
                        onClick={closeCart}
                        className="font-serif text-base text-black hover:underline line-clamp-2 leading-snug"
                      >
                        {localize(item, 'name', lang)}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="w-3 h-3 rounded-full border border-neutral-200 flex-shrink-0"
                          style={{ backgroundColor: item.colorCode }}
                        />
                        <span className="text-xs text-neutral-500 tracking-wide">
                          {localize(item, 'colorName', lang)} · {item.size}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity */}
                      <div className="flex items-center border border-neutral-200">
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-black active:scale-90 transition-all text-base cursor-pointer"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-black active:scale-90 transition-all text-base cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-black">{item.price * item.quantity} MDL</span>
                        <button
                          onClick={() => removeFromCart(item.key)}
                          className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 active:scale-90 transition-all duration-200 cursor-pointer"
                          title={t('cart.delete')}
                        >
                          <svg className="w-4.5 h-4.5" style={{width:'18px',height:'18px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — summary + CTA */}
        {cart.length > 0 && (
          <div className="border-t border-neutral-100 px-6 py-5 space-y-3">
            <div className="flex justify-between text-xs text-neutral-500 tracking-wide">
              <span>{t('cart.subtotal')}</span>
              <span>{cartTotal} MDL</span>
            </div>
            <div className="flex justify-between text-xs text-neutral-500 tracking-wide">
              <span>
                {deliveryMethod === 'pickup' ? t('cart.pickup') : t('cart.standard')}
              </span>
              <span className={isPickup ? 'text-green-600 font-medium' : ''}>
                {isPickup ? t('cart.free') : `${deliveryCost} MDL`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-medium text-black border-t border-neutral-100 pt-3">
              <span>{t('cart.total')}</span>
              <span>{total} MDL</span>
            </div>

            <Link
              href="/comanda"
              onClick={closeCart}
              className="group flex items-center justify-center gap-3 w-full bg-black text-white py-4 text-xs tracking-widest uppercase hover:bg-neutral-800 active:scale-[0.99] transition-all duration-300 mt-1"
            >
              {t('cart.checkout')}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center text-xs text-neutral-400 hover:text-black tracking-wide link-underline transition-colors duration-200 cursor-pointer"
            >
              {t('cart.continueShopping')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
