'use client';

import { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function FavoritePage() {
  const { favorites, removeFromFavorites, addToCart, openCart } = useCart();
  const [addedKey, setAddedKey] = useState(null);

  const handleQuickAdd = (item) => {
    addToCart(
      { id: item.productId, slug: item.slug, name: item.name, price: item.price, compareAtPrice: item.compareAtPrice },
      { id: item.key.split('-')[1] ?? 'v1', colorName: item.colorName, colorCode: item.colorCode, images: [{ url: item.image }] },
      'M',
      1
    );
    setAddedKey(item.key);
    setTimeout(() => setAddedKey(null), 2000);
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-[112px] md:pt-[165px]">
        <div className="relative bg-black overflow-hidden py-16">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10" />
          <div className="absolute right-8 top-0 bottom-0 w-px bg-white/10" />
          <div className="text-center relative z-10">
            <p className="text-white/30 text-[10px] tracking-[0.6em] uppercase mb-4">Colecția Ta</p>
            <h1 className="font-serif text-6xl md:text-8xl text-white font-light leading-none">Favorite</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <div className="w-20 h-20 border border-neutral-100 rounded-full flex items-center justify-center mb-8">
            <svg className="w-8 h-8 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-light text-black mb-3">Lista ta de favorite este goală</h2>
          <p className="text-neutral-400 text-sm max-w-xs mb-10 leading-relaxed">
            Salvează produsele preferate apăsând inimița de pe orice produs.
          </p>
          <Link
            href="/"
            className="group inline-flex items-center gap-3 bg-black text-white px-10 py-3.5 text-xs tracking-widest uppercase transition-all duration-300 hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          >
            Explorează Colecția
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-[112px] md:pt-[170px]">
      {/* Editorial Hero */}
      <div className="relative bg-black overflow-hidden py-16">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute right-8 top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden md:block" />
        <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
          <p className="text-white/30 text-[10px] tracking-[0.6em] uppercase mb-4 font-light">Colecția Ta</p>
          <h1 className="font-serif text-6xl md:text-8xl text-white font-light leading-none">Favorite</h1>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="h-px w-16 bg-white/20" />
            <p className="text-white/40 text-xs tracking-[0.4em] uppercase font-light">
              {favorites.length} {favorites.length === 1 ? 'produs salvat' : 'produse salvate'}
            </p>
            <div className="h-px w-16 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-neutral-400 tracking-widest uppercase">
            <Link href="/" className="hover:text-black transition-colors">Acasă</Link>
            <span>/</span>
            <span className="text-black">Favorite</span>
          </nav>
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {favorites.map((item) => (
            <div key={item.key} className="group">
              {/* Image wrapper */}
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-4">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.86H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.86l.58-3.57a2 2 0 00-1.34-2.23z" />
                    </svg>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />

                {/* Discount badge */}
                {item.compareAtPrice && (
                  <span className="absolute top-3 left-3 bg-black text-white text-[9px] tracking-widest uppercase px-2.5 py-1 z-10">
                    -{Math.round((1 - item.price / item.compareAtPrice) * 100)}%
                  </span>
                )}

                {/* Action bar — slides up on hover */}
                <div className="absolute bottom-0 left-0 right-0 flex translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                  <button
                    onClick={() => handleQuickAdd(item)}
                    className={`flex-1 py-3 text-[10px] tracking-widest uppercase font-medium transition-all duration-200 ${
                      addedKey === item.key
                        ? 'bg-green-600 text-white'
                        : 'bg-black text-white hover:bg-neutral-800 active:scale-[0.99]'
                    }`}
                  >
                    {addedKey === item.key ? '✓ Adăugat' : 'Adaugă în Coș'}
                  </button>
                  <button
                    onClick={() => removeFromFavorites(item.key)}
                    className="w-12 bg-white border-l border-neutral-100 flex items-center justify-center group/rm hover:bg-red-50 transition-colors duration-200 active:scale-90"
                    title="Șterge din favorite"
                  >
                    <svg className="w-4 h-4 text-neutral-400 group-hover/rm:text-red-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Info */}
              <div>
                <Link
                  href={`/produs/${item.slug}`}
                  className="font-serif text-sm text-black hover:underline line-clamp-2 leading-snug block mb-1.5"
                >
                  {item.name}
                </Link>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="w-3 h-3 rounded-full border border-neutral-200 flex-shrink-0"
                    style={{ backgroundColor: item.colorCode }}
                  />
                  <span className="text-[10px] text-neutral-400 tracking-wide">{item.colorName}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-black">{item.price} MDL</span>
                  {item.compareAtPrice && (
                    <span className="text-xs text-neutral-400 line-through">{item.compareAtPrice} MDL</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 pt-16 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-400 tracking-[0.5em] uppercase mb-3">Continuă să explorezi</p>
          <h3 className="font-serif text-3xl text-black font-light mb-8">Descoperă Mai Mult</h3>
          <Link
            href="/"
            className="group inline-flex items-center gap-3 border border-black text-black px-10 py-3.5 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            Toate Produsele
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
