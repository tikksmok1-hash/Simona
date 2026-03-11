'use client';

import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import ProductCard from '@/app/components/ProductCard';

export default function ProductDetailClient({ product, similarProducts = [], initialVariantId }) {
  const initialIndex = initialVariantId
    ? Math.max(0, (product.variants?.findIndex(v => v.id === initialVariantId) ?? -1) === -1 ? 0 : product.variants.findIndex(v => v.id === initialVariantId))
    : 0;
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(initialIndex);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('descriere');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [hoveredVariant, setHoveredVariant] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, px: 0, py: 0 });
  const mainImgRef = useRef(null);
  const colorRefs = useRef({});
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
      content: product.materialsInfo || 'Material de înaltă calitate, produs în România. Spălare la 30°C, nu se usucă în uscător. Consultați eticheta pentru instrucțiuni complete de îngrijire.',
    },
    {
      id: 'livrare',
      label: 'Livrare & Returnare',
      content: product.shippingInfo || 'Livrare standard: 70 MDL (3–5 zile lucrătoare). Ridicare gratuită din magazin. Returnare în 14 zile.',
    },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: '170px' }}>
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <nav className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-400 tracking-wider md:tracking-widest uppercase flex-wrap">
            <Link href="/" className="hover:text-black transition-colors whitespace-nowrap">Acasă</Link>
            {product.category && (
              <>
                <span className="text-gray-300">/</span>
                <Link href={`/categorie/${product.category.slug}`} className="hover:text-black transition-colors whitespace-nowrap">
                  {product.category.name}
                </Link>
              </>
            )}
            {product.subcategory && (
              <>
                <span className="text-gray-300">/</span>
                <Link href={`/categorie/${product.category?.slug}/${product.subcategory.slug}`} className="hover:text-black transition-colors whitespace-nowrap">
                  {product.subcategory.name}
                </Link>
              </>
            )}
            <span className="text-gray-300">/</span>
            <span className="text-black truncate max-w-[120px] md:max-w-[250px]">{product.name}</span>
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
              <div
                ref={mainImgRef}
                className="relative aspect-[3/4] overflow-hidden bg-gray-50 cursor-crosshair"
                onMouseEnter={() => mainImage?.url && setZoomActive(true)}
                onMouseLeave={() => setZoomActive(false)}
                onMouseMove={(e) => {
                  if (!mainImgRef.current || !mainImage?.url) return;
                  const rect = mainImgRef.current.getBoundingClientRect();
                  const px = e.clientX - rect.left;
                  const py = e.clientY - rect.top;
                  const x = (px / rect.width) * 100;
                  const y = (py / rect.height) * 100;
                  setZoomPos({ x, y, px, py });
                }}
              >
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

                {/* Zoom Lens */}
                {zoomActive && mainImage?.url && (() => {
                  const lensSize = 200;
                  const zoom = 3;
                  const rect = mainImgRef.current?.getBoundingClientRect();
                  if (!rect) return null;
                  const bgW = rect.width * zoom;
                  const bgH = rect.height * zoom;
                  const bgX = -(zoomPos.px * zoom - lensSize / 2);
                  const bgY = -(zoomPos.py * zoom - lensSize / 2);
                  return (
                    <div
                      className="absolute pointer-events-none border-2 border-black/30 shadow-lg z-30 hidden md:block"
                      style={{
                        width: `${lensSize}px`,
                        height: `${lensSize}px`,
                        left: `${zoomPos.px - lensSize / 2}px`,
                        top: `${zoomPos.py - lensSize / 2}px`,
                        backgroundImage: `url(${mainImage.url})`,
                        backgroundSize: `${bgW}px ${bgH}px`,
                        backgroundPosition: `${bgX}px ${bgY}px`,
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                  );
                })()}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
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
                    <div key={v.id} className="relative">
                      <button
                        ref={(el) => { colorRefs.current[v.id] = el; }}
                        onClick={() => handleVariantChange(i)}
                        onMouseEnter={() => {
                          setHoveredVariant(v.id);
                          const el = colorRefs.current[v.id];
                          if (el) {
                            const rect = el.getBoundingClientRect();
                            setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                          }
                        }}
                        onMouseLeave={() => { setHoveredVariant(null); setTooltipPos(null); }}
                        title={v.colorName}
                        className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                          selectedVariantIndex === i
                            ? 'border-black scale-110 ring-2 ring-black ring-offset-2'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: v.colorCode || '#000' }}
                      />
                    </div>
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
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-[10px] text-gray-400 tracking-widest uppercase underline underline-offset-4 hover:text-black transition-colors cursor-pointer"
                  >
                    Ghid Mărimi
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((s) => {
                    const inStock = s.stock > 0;
                    return (
                      <button
                        key={s.id || s.size}
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
                { icon: <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>, label: 'Livrare Rapidă', sub: '1–5 zile lucrătoare' },
                { icon: <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>, label: 'Returnare', sub: '30 de zile' },
                { icon: <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>, label: 'Plată Securizată', sub: '100% sigur' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="mb-1 text-black">{item.icon}</div>
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
                      className={`w-4 h-4 text-gray-400 transition-transform duration-500 ease-in-out ${openAccordion === acc.id ? 'rotate-45' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-500 ease-in-out"
                    style={{
                      display: 'grid',
                      gridTemplateRows: openAccordion === acc.id ? '1fr' : '0fr',
                      opacity: openAccordion === acc.id ? 1 : 0,
                    }}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="pb-5">
                        <p className="text-sm text-gray-600 leading-relaxed">{acc.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setSizeGuideOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-black px-6 py-5 flex items-center justify-between z-10">
              <div>
                <h3 className="font-serif text-xl text-white">Ghid Mărimi</h3>
                <p className="text-[10px] text-white/60 tracking-widest uppercase mt-1">Măsurători în centimetri (cm)</p>
              </div>
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="w-9 h-9 flex items-center justify-center border border-white/20 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Table */}
              <div className="overflow-x-auto border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left tracking-widest uppercase text-[10px] font-semibold text-black border-b border-gray-200">Mărime</th>
                      <th className="py-3 px-4 text-center tracking-widest uppercase text-[10px] font-semibold text-black border-b border-gray-200">
                        <div className="flex flex-col items-center gap-0.5">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><circle cx="12" cy="8" r="4" /><path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" /></svg>
                          Bust
                        </div>
                      </th>
                      <th className="py-3 px-4 text-center tracking-widest uppercase text-[10px] font-semibold text-black border-b border-gray-200">
                        <div className="flex flex-col items-center gap-0.5">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4" /></svg>
                          Talie
                        </div>
                      </th>
                      <th className="py-3 px-4 text-center tracking-widest uppercase text-[10px] font-semibold text-black border-b border-gray-200">
                        <div className="flex flex-col items-center gap-0.5">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M8 20h8M6 12c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>
                          Șold
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: 'XS', bust: '80–84', waist: '60–64', hip: '86–90', eu: '34' },
                      { size: 'S', bust: '84–88', waist: '64–68', hip: '90–94', eu: '36' },
                      { size: 'M', bust: '88–92', waist: '68–72', hip: '94–98', eu: '38' },
                      { size: 'L', bust: '92–96', waist: '72–76', hip: '98–102', eu: '40' },
                      { size: 'XL', bust: '96–100', waist: '76–80', hip: '102–106', eu: '42' },
                      { size: 'XXL', bust: '100–104', waist: '80–84', hip: '106–110', eu: '44' },
                      { size: '3XL', bust: '104–108', waist: '84–88', hip: '110–114', eu: '46' },
                      { size: '4XL', bust: '108–112', waist: '88–92', hip: '114–118', eu: '48' },
                      { size: '5XL', bust: '112–116', waist: '92–96', hip: '118–122', eu: '50' },
                    ].map((row, i) => {
                      const available = sizes.some(s => s.size === row.size);
                      const isSelected = selectedSize === row.size;
                      return (
                        <tr
                          key={row.size}
                          className={`border-b border-gray-100 transition-colors ${
                            isSelected
                              ? 'bg-black text-white'
                              : available
                              ? 'bg-white hover:bg-gray-50'
                              : 'bg-gray-50/50 opacity-40'
                          }`}
                        >
                          <td className={`py-3 px-4 font-semibold ${isSelected ? 'text-white' : 'text-black'}`}>
                            <div className="flex items-center gap-2">
                              {row.size}
                              <span className={`text-[9px] font-normal ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>EU {row.eu}</span>
                              {isSelected && <span className="ml-auto text-[9px] bg-white/20 px-1.5 py-0.5 tracking-wider">SELECTAT</span>}
                            </div>
                          </td>
                          <td className={`py-3 px-4 text-center ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>{row.bust} <span className={`text-[9px] ${isSelected ? 'text-white/40' : 'text-gray-300'}`}>cm</span></td>
                          <td className={`py-3 px-4 text-center ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>{row.waist} <span className={`text-[9px] ${isSelected ? 'text-white/40' : 'text-gray-300'}`}>cm</span></td>
                          <td className={`py-3 px-4 text-center ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>{row.hip} <span className={`text-[9px] ${isSelected ? 'text-white/40' : 'text-gray-300'}`}>cm</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* How to measure */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { label: 'Bust', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><circle cx="12" cy="8" r="4" /><path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" /></svg>, desc: 'În jurul celei mai largi părți a bustului' },
                  { label: 'Talie', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4" /></svg>, desc: 'În jurul celei mai înguste părți a taliei' },
                  { label: 'Șold', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M8 20h8M6 12c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>, desc: 'În jurul celei mai largi părți a șoldurilor' },
                ].map((item) => (
                  <div key={item.label} className="text-center p-3 border border-gray-100 bg-gray-50/50">
                    <div className="text-gray-400 flex justify-center mb-2">{item.icon}</div>
                    <p className="text-[10px] tracking-widest uppercase font-semibold text-black mb-1">{item.label}</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Tip */}
              <div className="mt-5 bg-gray-50 border border-gray-100 px-4 py-3 flex items-start gap-3">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-[11px] text-gray-500 leading-relaxed">Dacă ești între două mărimi, recomandăm <span className="font-medium text-black">mărimea mai mare</span> pentru un fit confortabil.</p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-10">
              <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-2">Descoperă mai multe</p>
              <h2 className="font-serif text-2xl md:text-3xl text-black font-light">Produse Similare</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Color hover tooltip — rendered via portal */}
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
