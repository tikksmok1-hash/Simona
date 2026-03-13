'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from './components/ProductCard';
import { useTranslation } from '@/app/context/LanguageContext';
import { localize, localizeSettings } from '@/lib/localize';

/* Lazy Google Maps — only mounts the iframe when the section scrolls into view */
const LazyMap = memo(function LazyMap() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full h-80 lg:h-full min-h-[320px] bg-neutral-100 overflow-hidden">
      {visible && (
        <iframe
          src="https://maps.google.com/maps?q=str.+Ion+Creang%C4%83+58,+Chi%C8%99in%C4%83u,+Moldova&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: '320px' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </div>
  );
});

export default function HomeClient({
  featuredProducts,
  saleProducts,
  bestsellerProducts,
  latestPosts,
  categories,
  siteSettings = {},
  heroImage,
  heroTitle,
  heroSubtitle,
  heroLabel,
  phone1,
  siteEmail,
  siteAddress,
  phone1Intl,
  maxDiscount,
}) {
  const { lang, t } = useTranslation();

  // Localize hero text from settings (with fallback to server-rendered props)
  const localHeroTitle = localizeSettings(siteSettings, 'heroTitle', lang) || heroTitle;
  const localHeroSubtitle = localizeSettings(siteSettings, 'heroSubtitle', lang) || heroSubtitle;
  const localHeroLabel = localizeSettings(siteSettings, 'heroLabel', lang) || heroLabel;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Fullscreen with Fashion Image */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image with Ken Burns animation */}
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="SIMONA Fashion"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover"
            style={{ animation: 'kenBurns 12s ease-in-out infinite alternate' }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-4">
            <span className="inline-block border border-white/60 text-white/80 px-4 sm:px-6 py-1.5 text-[10px] sm:text-xs font-light tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-6 sm:mb-10">
              {localHeroLabel}
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-white leading-none mb-6 sm:mb-10">
              {localHeroTitle}
              <span className="block font-normal italic">{localHeroSubtitle}</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/bestsellers" className="group inline-flex items-center justify-center gap-3 bg-white text-black px-8 sm:px-12 py-3.5 sm:py-4 font-medium text-xs sm:text-sm tracking-widest uppercase transition-[color,background-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:shadow-none">
                {t('home.seeCollection')}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/reduceri" className="inline-flex items-center justify-center gap-3 bg-transparent hover:bg-white hover:text-black text-white px-8 sm:px-12 py-3.5 sm:py-4 font-medium text-xs sm:text-sm tracking-widest uppercase transition-[color,background-color,border-color,transform,box-shadow] duration-300 border-2 border-white backdrop-blur-sm hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:shadow-none">
                {t('home.salePercent')} {maxDiscount}%
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center text-white/70 animate-bounce">
            <span className="text-xs tracking-widest uppercase mb-2">{t('home.scroll')}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-3">{t('home.collection')}</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-black mb-4">{t('home.categories')}</h2>
            <div className="w-12 h-px bg-black mx-auto"></div>
          </div>

          {/* Categories grid - dynamic from DB */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {categories.slice(0, 6).map((cat) => (
              <Link key={cat.slug} href={`/categorie/${cat.slug}`} className="group relative overflow-hidden block aspect-[3/4]">
                <Image
                  src={cat.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1000&fit=crop&q=80'}
                  alt={localize(cat, 'name', lang)}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 flex items-end justify-between">
                  <div className="min-w-0">
                    <p className="text-white/60 text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-0.5 sm:mb-1">
                      {cat._count?.products || 0} {t('home.products')}
                    </p>
                    <h3 className="font-serif text-base sm:text-xl lg:text-2xl text-white font-light truncate">{localize(cat, 'name', lang)}</h3>
                  </div>
                  <span className="hidden sm:inline-block border border-white/60 text-white text-[10px] tracking-widest uppercase px-4 py-2 group-hover:bg-white group-hover:text-black transition-[color,background-color,border-color] duration-300 flex-shrink-0 ml-2">
                    {t('home.see')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-black mb-1 sm:mb-2">{t('home.featured')}</h2>
              <p className="text-sm text-neutral-500 tracking-wide">{t('home.featuredSub')}</p>
            </div>
            <Link href="/bestsellers" className="group hidden md:flex items-center gap-2 text-black text-sm tracking-widest uppercase transition-colors link-underline flex-shrink-0 ml-4">
              {t('home.seeAll')}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
          <div className="text-center mt-10 md:hidden">
            <Link href="/bestsellers" className="group inline-flex items-center gap-2 text-black text-sm tracking-widest uppercase link-underline transition-colors">
              {t('home.seeAllProducts')}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-14 sm:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-white text-center md:text-left">
              <span className="inline-block border border-white/30 px-4 sm:px-5 py-1.5 text-[10px] sm:text-xs font-medium tracking-widest uppercase mb-4 sm:mb-6">
                {t('home.specialOffer')}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-light mb-4 sm:mb-6">{t('home.springSale')}</h2>
              <p className="text-base sm:text-lg text-neutral-400 mb-6 sm:mb-8 leading-relaxed">
                {`${maxDiscount}% ${t('home.springSaleDesc')}`}
              </p>
              <Link href="/reduceri" className="group inline-flex items-center gap-3 bg-white text-black hover:bg-neutral-100 px-8 sm:px-10 py-3.5 sm:py-4 font-medium text-xs sm:text-sm tracking-widest uppercase transition-[color,background-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:shadow-none">
                {t('home.buyNow')}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="border border-white/20 p-12">
                <div className="text-center text-white">
                  <svg className="w-16 h-16 mx-auto mb-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                  </svg>
                  <p className="font-serif text-6xl font-light mb-2">-{maxDiscount}%</p>
                  <p className="text-sm tracking-widest uppercase text-neutral-400">{t('home.selectedItems')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block border border-black text-black px-4 sm:px-5 py-1.5 text-[10px] sm:text-xs font-medium tracking-widest uppercase mb-4 sm:mb-6">
              {t('home.bestSelling')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-black mb-3 sm:mb-4">{t('home.bestsellers')}</h2>
            <p className="text-sm text-neutral-500 tracking-wide">{t('home.bestsellersSub')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {bestsellerProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/bestsellers" className="inline-flex items-center gap-3 border border-black text-black px-10 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-[color,background-color,border-color] duration-300">
              {t('home.seeAllBestsellers')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Reduceri Section */}
      <section className="py-16 sm:py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block border border-black text-black px-4 sm:px-5 py-1.5 text-[10px] sm:text-xs font-medium tracking-widest uppercase mb-4 sm:mb-6">
              {t('home.reducedPrices')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-black mb-3 sm:mb-4">{t('home.reduceri')}</h2>
            <p className="text-sm text-neutral-500 tracking-wide">{t('home.reduceriSub')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {saleProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/reduceri" className="inline-flex items-center gap-3 border border-black text-black px-10 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-[color,background-color,border-color] duration-300">
              {t('home.seeAllSale')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Noutăți / Blog Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block border border-black text-black px-4 sm:px-5 py-1.5 text-[10px] sm:text-xs font-medium tracking-widest uppercase mb-4 sm:mb-6">
              {t('home.blogInspiration')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-black mb-3 sm:mb-4">{t('home.latestNews')}</h2>
            <p className="text-sm text-neutral-500 tracking-wide">{t('home.latestNewsSub')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <Link key={post.id} href={`/noutati/${post.slug}`} className="group flex flex-col overflow-hidden">
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3] bg-neutral-100">
                  <Image
                    src={post.image}
                    alt={localize(post, 'title', lang)}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black text-white text-[10px] tracking-widest uppercase px-3 py-1.5">
                      {localize(post, 'category', lang)}
                    </span>
                  </div>
                </div>
                {/* Content */}
                <div className="pt-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-[10px] tracking-widest uppercase text-neutral-400 mb-3">
                    <span>{(typeof post.date === 'string' ? post.date : post.date?.toISOString?.()?.split('T')[0] || '').split('-').reverse().join('.')}</span>
                    <span>·</span>
                    <span>{post.readTime} {t('home.readTime')}</span>
                  </div>
                  <h3 className="font-serif text-xl font-light text-black mb-3 leading-snug group-hover:text-neutral-600 transition-colors">
                    {localize(post, 'title', lang)}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-5 flex-1">
                    {localize(post, 'excerpt', lang)}
                  </p>
                  <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-black mt-auto">
                    <span>{t('home.read')}</span>
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/noutati" className="inline-flex items-center gap-3 border border-black text-black px-10 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-[color,background-color,border-color] duration-300">
              {t('home.allNews')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-black mb-3 sm:mb-4">{t('home.testimonials')}</h2>
            <p className="text-sm text-neutral-500 tracking-wide">{t('home.testimonialsSub')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {[
              { name: 'Maria P.', text: t('home.testimonial1'), rating: 5 },
              { name: 'Alexandra D.', text: t('home.testimonial2'), rating: 5 },
              { name: 'Elena M.', text: t('home.testimonial3'), rating: 5 },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white border border-neutral-200 p-8 flex flex-col">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-neutral-600 italic leading-relaxed flex-1">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="border-t border-neutral-100 mt-6 pt-4">
                  <p className="text-xs tracking-widest uppercase text-black">{testimonial.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cum ne găsești */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block border border-black text-black px-4 sm:px-5 py-1.5 text-[10px] sm:text-xs font-medium tracking-widest uppercase mb-4 sm:mb-6">
              {t('home.contact')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-black mb-3 sm:mb-4">{t('home.findUs')}</h2>
            <p className="text-sm text-neutral-500 tracking-wide">{t('home.findUsSub')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Google Maps embed — lazy loaded */}
            <LazyMap />

            {/* Contact info */}
            <div className="flex flex-col justify-center gap-6">
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(siteAddress + ', Moldova')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-5 p-6 border border-gray-100 hover:border-black transition-colors group"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-neutral-100 group-hover:bg-black group-hover:text-white transition-colors shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">{t('home.address')}</p>
                  <p className="text-sm text-black font-light">{siteAddress}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t('home.moldova')}</p>
                </div>
              </a>

              <a
                href={`https://wa.me/${phone1Intl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-5 p-6 border border-gray-100 hover:border-black transition-colors group"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-neutral-100 group-hover:bg-black group-hover:text-white transition-colors shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">{t('home.phoneWhatsapp')}</p>
                  <p className="text-sm text-black font-light">{phone1}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t('home.schedule')}</p>
                </div>
              </a>

              <a
                href={`mailto:${siteEmail}`}
                className="flex items-start gap-5 p-6 border border-gray-100 hover:border-black transition-colors group"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-neutral-100 group-hover:bg-black group-hover:text-white transition-colors shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">{t('home.email')}</p>
                  <p className="text-sm text-black font-light">{siteEmail}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t('home.emailResponse')}</p>
                </div>
              </a>

              <div className="flex gap-3 pt-2">
                <a href={`https://wa.me/${phone1Intl}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 text-xs tracking-widest uppercase hover:opacity-90 transition-opacity">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
                <a href={`viber://chat?number=%2B${phone1Intl}`}
                  className="flex items-center gap-2 bg-[#7360F2] text-white px-5 py-2.5 text-xs tracking-widest uppercase hover:opacity-90 transition-opacity">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.4 0C5.5.3.8 5.3.8 11.2c0 2.1.6 4.1 1.6 5.8L.8 21.5l4.7-1.5c1.6.9 3.4 1.4 5.4 1.4h.1C16.8 21.4 21.5 16.5 21.5 10.5 21.5 4.7 17 .1 11.4 0zm5.5 15.1c-.2.6-1.2 1.2-1.7 1.2-.4.1-.9.1-1.4-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.2-.2-1.3-1.7-1.3-3.3 0-1.5.8-2.3 1.1-2.6.3-.3.6-.4.8-.4h.6c.2 0 .4.1.6.4.2.4.7 1.7.8 1.8.1.1.1.3 0 .5-.1.2-.2.3-.3.4-.1.1-.2.3-.1.5.1.2.5.8 1.1 1.3.7.7 1.4 1 1.6 1.1.2.1.4.1.5-.1.1-.2.5-.6.7-.8.2-.2.4-.2.6-.1.2.1 1.3.6 1.5.7.2.1.4.2.4.3.1.2.1.7-.1 1.3z"/>
                  </svg>
                  Viber
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
