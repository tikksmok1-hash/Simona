'use client';

import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { cart, cartTotal, cartCount, removeFromCart, updateQuantity, deliveryMethod, setDeliveryMethod } = useCart();

  const DELIVERY_STANDARD = 70;
  const DELIVERY_EXPRESS = 200;
  const deliveryCost =
    deliveryMethod === 'pickup' ? 0 :
    deliveryMethod === 'express' ? DELIVERY_EXPRESS :
    DELIVERY_STANDARD;
  const total = cartTotal + deliveryCost;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-[112px] flex flex-col items-center justify-center text-center px-4">
        <svg className="w-16 h-16 text-neutral-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h1 className="font-serif text-3xl font-light text-black mb-3">Coșul tău este gol</h1>
        <p className="text-neutral-500 text-sm mb-8 max-w-sm">Adaugă produse în coș pentru a continua cumpărăturile.</p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-10 py-3 text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors"
        >
          Continuă Cumpărăturile
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-[112px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 border-b border-neutral-100 pb-6">
          <h1 className="font-serif text-4xl font-light text-black">Coșul Meu</h1>
          <p className="text-neutral-500 text-sm mt-1">{cartCount} {cartCount === 1 ? 'produs' : 'produse'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={item.key} className="flex gap-5 border-b border-neutral-100 pb-6">
                {/* Image */}
                <div className="relative w-24 h-32 flex-shrink-0 bg-neutral-100 overflow-hidden">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.86H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.86l.58-3.57a2 2 0 00-1.34-2.23z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/produs/${item.slug}`} className="font-serif text-base text-black hover:underline line-clamp-2">
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className="w-3 h-3 rounded-full border border-neutral-200 inline-block"
                        style={{ backgroundColor: item.colorCode }}
                      />
                      <span className="text-xs text-neutral-500">{item.colorName}</span>
                      <span className="text-xs text-neutral-300">|</span>
                      <span className="text-xs text-neutral-500">Mărime: {item.size}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center border border-neutral-200">
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-black active:scale-90 transition-all duration-150 text-sm"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-black active:scale-90 transition-all duration-150 text-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm font-medium text-black">{item.price * item.quantity} MDL</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-neutral-400">{item.price} MDL / buc</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.key)}
                  className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 active:scale-90 transition-all duration-200 self-start flex-shrink-0"
                  title="Șterge"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-50 border border-neutral-100 p-6 sticky top-[120px]">
              <h2 className="font-serif text-xl font-light text-black mb-6">Sumar Comandă</h2>

              {/* Delivery method */}
              <div className="mb-5">
                <p className="text-xs text-neutral-500 tracking-widest uppercase mb-3">Metodă de livrare</p>
                <div className="space-y-2">

                  {/* Standard */}
                  <button
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
              </div>

              <div className="space-y-3 text-sm mb-6">
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
                  <span className={deliveryMethod === 'pickup' ? 'text-green-600 font-medium' : ''}>
                    {deliveryMethod === 'pickup' ? 'Gratuit' : `${deliveryCost} MDL`}
                  </span>
                </div>
                <div className="border-t border-neutral-200 pt-3 flex justify-between font-medium text-black text-base">
                  <span>Total</span>
                  <span>{total} MDL</span>
                </div>
              </div>

              <Link
                href="/comanda"
                className="group w-full bg-black text-white py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-none mb-3 flex items-center justify-center gap-3"
              >
                Finalizează Comanda
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/"
                className="block text-center text-xs text-neutral-500 hover:text-black tracking-wide underline transition-colors"
              >
                Continuă Cumpărăturile
              </Link>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-neutral-200 space-y-2 text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Plată 100% Securizată</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 2 1 2-1 2 1 2-1 4 2z" />
                  </svg>
                  <span>Returnare Gratuită 30 Zile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
