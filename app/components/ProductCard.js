'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useCart } from '@/app/context/CartContext';

export default function ProductCard({ product, priority = false }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [addedSize, setAddedSize] = useState(null);
  const [hoveredVariant, setHoveredVariant] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);
  const colorRefs = useRef({});
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const favorited = isFavorite(product.id, selectedVariant.id);

  // Get front and back images for current variant
  const frontImage = selectedVariant.images.find(img => img.type === 'FRONT') || selectedVariant.images[0];
  const backImage = selectedVariant.images.find(img => img.type === 'BACK') || selectedVariant.images[1];

  // Calculate discount percentage
  const discountPercentage = product.compareAtPrice 
    ? Math.round((1 - product.price / product.compareAtPrice) * 100) 
    : 0;

  // Check if product has stock
  const totalStock = selectedVariant.sizes.reduce((acc, size) => acc + size.stock, 0);
  const isOutOfStock = totalStock === 0;

  return (
    <div className="group bg-white overflow-hidden border border-neutral-200 hover:border-black transition-all duration-500 flex flex-col relative">
      {/* Image Container */}
      <Link href={`/produs/${product.slug}`}>
        <div 
          className="relative bg-neutral-100 aspect-[3/4] md:aspect-[2/3] overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Front Image */}
          <div 
            className={`absolute inset-0 transition-opacity duration-500 ${
              isHovered && backImage ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {frontImage?.url ? (
              <Image
                src={frontImage.url}
                alt={`${product.name} - ${selectedVariant.colorName} - Față`}
                fill
                priority={priority}
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100">
                <svg className="w-14 h-14 text-neutral-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.86H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.86l.58-3.57a2 2 0 00-1.34-2.23z" />
                </svg>
                <span className="text-xs text-neutral-400 tracking-widest uppercase">Imagine Față</span>
              </div>
            )}
          </div>

          {/* Back Image (shown on hover) */}
          {backImage && (
            <div 
              className={`absolute inset-0 transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {backImage?.url ? (
                <Image
                  src={backImage.url}
                  alt={`${product.name} - ${selectedVariant.colorName} - Spate`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-50">
                  <svg className="w-14 h-14 text-neutral-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.86H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.86l.58-3.57a2 2 0 00-1.34-2.23z" />
                  </svg>
                  <span className="text-xs text-neutral-400 tracking-widest uppercase">Imagine Spate</span>
                </div>
              )}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {discountPercentage > 0 && (
              <span className="bg-black text-white text-xs font-medium px-3 py-1 tracking-wider">
                -{discountPercentage}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-white text-black text-xs font-medium px-3 py-1 tracking-wider border border-black">
                NOU
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-neutral-500 text-white text-xs font-medium px-3 py-1 tracking-wider">
                STOC EPUIZAT
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-3 right-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20">
            <button 
              className={`p-2.5 border transition-all duration-200 cursor-pointer ${favorited ? 'bg-red-500 border-red-500 scale-110' : 'bg-white border-neutral-200 hover:border-red-400'}`}
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(product, selectedVariant);
              }}
            >
              <svg className={`w-4 h-4 ${favorited ? 'text-white' : 'text-neutral-500'}`} fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Quick Add - Size Selector */}
          <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-full group-hover:translate-y-0">
            {isOutOfStock ? (
              <div className="w-full bg-neutral-500 text-white py-3.5 text-center text-xs tracking-widest uppercase">
                Indisponibil
              </div>
            ) : (
              <div className="bg-black px-3 pt-2 pb-3">
                <p className="text-[9px] text-neutral-400 tracking-widest uppercase mb-2 text-center">Selectează Mărimea</p>
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  {selectedVariant.sizes.map((size) => (
                    <button
                      key={size.size}
                      disabled={size.stock === 0}
                      onClick={(e) => {
                        e.preventDefault();
                        if (size.stock > 0) {
                          addToCart(product, selectedVariant, size.size, 1);
                          setAddedSize(size.size);
                          setTimeout(() => setAddedSize(null), 1500);
                        }
                      }}
                      className={`min-w-[34px] h-8 px-1 text-xs font-medium border transition-all duration-200 ${
                        size.stock === 0
                          ? 'border-neutral-700 text-neutral-600 line-through cursor-not-allowed'
                          : addedSize === size.size
                          ? 'border-green-400 bg-green-400 text-black scale-110 cursor-pointer'
                          : 'border-white/60 text-white hover:border-white hover:bg-white hover:text-black cursor-pointer'
                      }`}
                    >
                      {addedSize === size.size ? '✓' : size.size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category */}
        <p className="text-[10px] text-neutral-400 mb-1 uppercase tracking-widest">
          {product.categorySlug?.replace('-', ' & ')}
        </p>

        {/* Product Name */}
        <Link href={`/produs/${product.slug}`}>
          <h3 className="font-serif text-sm text-black mb-3 group-hover:underline transition-all line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Color Selector */}
        <div className="flex items-center gap-2 mb-3">
          {product.variants.map((variant) => {
            const frontImg = variant.images.find(img => img.type === 'FRONT') || variant.images[0];
            return (
              <div key={variant.id} className="relative">
                <button
                  ref={(el) => { colorRefs.current[variant.id] = el; }}
                  onClick={() => setSelectedVariant(variant)}
                  onMouseEnter={() => {
                    setHoveredVariant(variant.id);
                    const el = colorRefs.current[variant.id];
                    if (el) {
                      const rect = el.getBoundingClientRect();
                      setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                    }
                  }}
                  onMouseLeave={() => { setHoveredVariant(null); setTooltipPos(null); }}
                  className={`w-5 h-5 rounded-full transition-all cursor-pointer ${
                    selectedVariant.id === variant.id
                      ? 'ring-1 ring-black ring-offset-2'
                      : 'ring-1 ring-neutral-300 hover:ring-neutral-400'
                  }`}
                  style={{ backgroundColor: variant.colorCode }}
                  title={variant.colorName}
                >
                  {variant.colorCode === '#FFFFFF' && (
                    <span className="block w-full h-full rounded-full border border-neutral-300"></span>
                  )}
                </button>
              </div>
            );
          })}
          {product.variants.length > 4 && (
            <span className="text-[10px] text-neutral-400 ml-1 tracking-wide">
              +{product.variants.length - 4}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mt-auto">
          <span className="text-sm font-medium text-black tracking-wide">
            {product.price} MDL
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-neutral-400 line-through">
              {product.compareAtPrice} MDL
            </span>
          )}
        </div>
      </div>

      {/* Mobile Size Buttons — pinned to bottom, hidden on desktop */}
      <div className="md:hidden border-t border-neutral-100 px-3 py-2.5">
        {isOutOfStock ? (
          <p className="text-[10px] text-neutral-400 tracking-widest uppercase text-center py-1">Stoc epuizat</p>
        ) : (
          <>
            <p className="text-[9px] text-neutral-400 tracking-widest uppercase mb-1.5 text-center">Adaugă în Coș</p>
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {selectedVariant.sizes.map((size) => (
                <button
                  key={size.size}
                  disabled={size.stock === 0}
                  onClick={(e) => {
                    e.preventDefault();
                    if (size.stock > 0) {
                      addToCart(product, selectedVariant, size.size, 1);
                      setAddedSize(size.size);
                      setTimeout(() => setAddedSize(null), 1500);
                    }
                  }}
                  className={`min-w-[36px] h-9 px-1.5 text-xs font-medium border transition-all duration-200 ${
                    size.stock === 0
                      ? 'border-neutral-200 text-neutral-300 line-through cursor-not-allowed'
                      : addedSize === size.size
                      ? 'border-green-500 bg-green-500 text-white scale-105'
                      : 'border-neutral-300 text-neutral-700 active:scale-95 active:bg-black active:text-white active:border-black'
                  }`}
                >
                  {addedSize === size.size ? '✓' : size.size}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Color hover tooltip — rendered via portal to escape overflow:hidden */}
      {hoveredVariant && tooltipPos && typeof document !== 'undefined' && (() => {
        const hv = product.variants.find(v => v.id === hoveredVariant);
        const frontImg = hv?.images?.find(img => img.type === 'FRONT') || hv?.images?.[0];
        if (!hv || !frontImg?.url) return null;
        return createPortal(
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{ left: tooltipPos.x, top: tooltipPos.y, transform: 'translate(-50%, -100%)' }}
          >
            <div className="mb-2">
              <div className="bg-white border border-black shadow-xl overflow-hidden" style={{ width: '115px' }}>
                <div className="w-full aspect-[3/4] overflow-hidden">
                  <img
                    src={frontImg.url}
                    alt={hv.colorName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-1 py-1 bg-black">
                  <p className="text-[7px] tracking-[0.15em] uppercase text-center text-white truncate">
                    {hv.colorName}
                  </p>
                </div>
              </div>
              <div className="w-2 h-2 bg-black rotate-45 mx-auto -mt-1" />
            </div>
          </div>,
          document.body
        );
      })()}
    </div>
  );
}
