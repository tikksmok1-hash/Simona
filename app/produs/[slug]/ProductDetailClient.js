'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

export default function ProductDetailClient({ product }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('descriere');
  const { addToCart, toggleFavorite, isFavorite } = useCart();

  const variant = product.variants?.[selectedVariantIndex];
  const favorited = isFavorite(product.id, variant?.id);
  const images = variant?.images || [];
  const sizes = variant?.sizes || [];
  const mainImage = images[mainImageIndex] || images[0];
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : null;

  const handleVariantChange = (index) => {
    setSelectedVariantIndex(index);
    setMainImageIndex(0);
    setSelectedSize(null);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, variant, selectedSize, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const sizeInStock = (size) => {
    const s = sizes.find((s) => s.size === size);
    return s && s.stock > 0;
  };

  const accordions = [
    {
      id: 'descriere',
      label: 'Descriere',
      content: product.description,
    },
    {
      id: 'detalii',
      label: 'Detalii & Materiale',
      content: 'Material de înaltă calitate, produs în România. Spălare la 30°C, nu se usucă în uscător. Consultați eticheta pentru instrucțiuni complete de îngrijire.',
    },
    {
      id: 'livrare',
      label: 'Livrare & Returnare',
      content: 'Livrare standard: 70 MDL (3–5 zile lucrătoare). Livrare express: 200 MDL (1–2 zile). Ridicare gratuită din magazin. Returnare în 14 zile.',
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-400 tracking-widest uppercase">
            <Link href="/" className="hover:text-black transition-colors">Acasă</Link>
            <span>/</span>
            <Link href="/noutati" className="hover:text-black transition-colors">Noutăți</Link>
            <span>/</span>
            <span className="text-black truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* LEFT — Images */}
          <div className="flex gap-3">
            {/* Thumbnails column */}
            {images.length > 1 && (
              <div className="hidden md:flex flex-col gap-2 w-16 flex-shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImageIndex(i)}
                    className={`aspect-square overflow-hidden border-2 transition-all cursor-pointer ${
                      mainImageIndex === i ? 'border-black' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1 relative">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                {mainImage?.url ? (
                  <img
                    src={mainImage.url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-16 h-16 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.86H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.86l.58-3.57a2 2 0 00-1.34-2.23z" />
                    </svg>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-black text-white text-[10px] tracking-widest uppercase px-3 py-1.5">Nou</span>
                  )}
                  {discount && (
                    <span className="bg-white border border-black text-black text-[10px] tracking-widest uppercase px-3 py-1.5">
                      -{discount}%
                    </span>
                  )}
                </div>
              </div>

              {/* Mobile thumbnails */}
              {images.length > 1 && (
                <div className="md:hidden flex gap-2 mt-3 overflow-x-auto pb-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImageIndex(i)}
                      className={`flex-shrink-0 w-16 aspect-square overflow-hidden border-2 transition-all cursor-pointer ${
                        mainImageIndex === i ? 'border-black' : 'border-gray-200'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Product Info */}
          <div className="flex flex-col">
            {/* Category & Name */}
            {product.category && (
              <p className="text-[10px] text-gray-400 tracking-[0.5em] uppercase mb-3">
                {product.category.name}
              </p>
            )}
            <h1 className="font-serif text-3xl md:text-4xl text-black font-light leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <span className="text-2xl font-light text-black">{product.price} MDL</span>
              {product.compareAtPrice && (
                <>
                  <span className="text-base text-gray-400 line-through">{product.compareAtPrice} MDL</span>
                  <span className="bg-black text-white text-[10px] tracking-widest px-2 py-1 uppercase">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Color Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-gray-500 tracking-widest uppercase mb-3">
                  Culoare: <span className="text-black font-medium">{variant?.colorName}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => handleVariantChange(i)}
                      title={v.colorName}
                      className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                        selectedVariantIndex === i
                          ? 'border-black scale-110 ring-2 ring-black ring-offset-2'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: v.colorCode || '#000' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-500 tracking-widest uppercase">
                    Mărime: <span className="text-black font-medium">{selectedSize || '—'}</span>
                  </p>
                  <button className="text-[10px] text-gray-400 tracking-widest uppercase underline underline-offset-4 hover:text-black transition-colors cursor-pointer">
                    Ghid Mărimi
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((s) => {
                    const inStock = s.stock > 0;
                    return (
                      <button
                        key={s.size}
                        onClick={() => inStock && setSelectedSize(s.size)}
                        disabled={!inStock}
                        className={`w-12 h-12 border text-xs font-medium tracking-wide transition-all duration-200 ${
                          selectedSize === s.size
                            ? 'bg-black text-white border-black scale-105 shadow-md cursor-pointer'
                            : inStock
                            ? 'bg-white text-black border-gray-200 hover:border-black hover:scale-105 hover:shadow-sm active:scale-95 cursor-pointer'
                            : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through'
                        }`}
                      >
                        {s.size}
                      </button>
                    );
                  })}
                </div>
                {!selectedSize && (
                  <p className="text-[10px] text-red-400 mt-2 tracking-widest">Selectează o mărime</p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p className="text-xs text-gray-500 tracking-widest uppercase">Cantitate:</p>
              <div className="flex items-center border border-gray-200">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 hover:text-black active:scale-90 transition-all duration-150 text-lg cursor-pointer"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 hover:text-black active:scale-90 transition-all duration-150 text-lg cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`flex-1 py-4 text-sm tracking-widest uppercase font-medium transition-all duration-300 ${
                  addedToCart
                    ? 'bg-green-600 text-white scale-[0.99]'
                    : selectedSize
                    ? 'bg-black text-white hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-none'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {addedToCart ? '✓ Adăugat în Coș' : 'Adaugă în Coș'}
              </button>
              <button
                onClick={() => toggleFavorite(product, variant)}
                className={`w-14 h-14 border flex items-center justify-center transition-colors group ${
                  favorited ? 'border-red-500 bg-red-500 scale-110' : 'border-gray-200 hover:border-red-400'
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-colors ${
                    favorited ? 'text-white' : 'text-gray-400 group-hover:text-red-400'
                  }`}
                  fill={favorited ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mb-8 pb-8 border-b border-gray-100">
              {[
                { icon: '🚚', label: 'Livrare Rapidă', sub: '1–5 zile lucrătoare' },
                { icon: '↩', label: 'Returnare', sub: '30 de zile' },
                { icon: '🔒', label: 'Plată Securizată', sub: '100% sigur' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <p className="text-[10px] tracking-widest uppercase text-black font-medium">{item.label}</p>
                  <p className="text-[10px] text-gray-400">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="space-y-0">
              {accordions.map((acc) => (
                <div key={acc.id} className="border-b border-gray-100">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === acc.id ? null : acc.id)}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="text-xs tracking-widest uppercase font-medium text-black">{acc.label}</span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${openAccordion === acc.id ? 'rotate-45' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  {openAccordion === acc.id && (
                    <div className="pb-5">
                      <p className="text-sm text-gray-600 leading-relaxed">{acc.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
