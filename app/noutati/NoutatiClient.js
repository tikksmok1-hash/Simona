'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/app/context/LanguageContext';
import { localize } from '@/lib/localize';

export default function NoutatiClient({ blogPosts, featured, rest, categories }) {
  const { lang, t } = useTranslation();

  return (
    <div className="min-h-screen bg-white pt-[112px] md:pt-[160px]">
      {/* Hero */}
      <div className="relative bg-black overflow-hidden py-20">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10"></div>
        <div className="absolute right-8 top-0 bottom-0 w-px bg-white/10"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden md:block"></div>
        <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
          <p className="text-white/30 text-[10px] tracking-[0.6em] uppercase mb-6 font-light">
            Blog
          </p>
          <h1 className="font-serif text-7xl md:text-9xl text-white font-light leading-none tracking-tight">
            {t('blog.title')}
          </h1>
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="h-px w-24 bg-white/20"></div>
            <p className="text-white/40 text-xs tracking-[0.4em] uppercase font-light">
              {blogPosts.length} {t('blog.articles')}
            </p>
            <div className="h-px w-24 bg-white/20"></div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-400 tracking-widest uppercase">
            <Link href="/" className="hover:text-black transition-colors">{t('common.home')}</Link>
            <span>/</span>
            <span className="text-black">{t('blog.title')}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-3 mb-14">
          <span className="border border-black bg-black text-white text-[10px] tracking-widest uppercase px-5 py-2 cursor-pointer">
            {t('filter.all')}
          </span>
          {categories.map((cat) => (
            <span key={cat} className="border border-gray-200 text-gray-500 text-[10px] tracking-widest uppercase px-5 py-2 hover:border-black hover:text-black transition-colors cursor-pointer">
              {cat}
            </span>
          ))}
        </div>

        {/* Featured post — large hero card */}
        {featured[0] && (
          <Link href={`/noutati/${featured[0].slug}`} className="group relative flex flex-col md:flex-row gap-0 mb-4 overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="relative md:w-1/2 aspect-[4/3] md:aspect-auto md:h-[480px] overflow-hidden bg-gray-100">
              <Image
                src={featured[0].image}
                alt={localize(featured[0], 'title', lang)}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 bg-black text-white text-[10px] tracking-[0.3em] uppercase px-3 py-1.5">
                {t('blog.featured')}
              </span>
            </div>
            <div className="md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-10">
              <span className="inline-block border border-black text-black text-[10px] tracking-widest uppercase px-4 py-1.5 mb-6 w-fit">
                {localize(featured[0], 'category', lang)}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-black font-light mb-4 leading-tight">
                {localize(featured[0], 'title', lang)}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
                {localize(featured[0], 'excerpt', lang)}
              </p>
              <div className="flex items-center gap-4 text-[10px] tracking-widest uppercase text-gray-400 mb-8">
                <span>{featured[0].date.split('-').reverse().join('.')}</span>
                <span>·</span>
                <span>{featured[0].readTime} {t('blog.readTime')}</span>
                <span>·</span>
                <span>{t('blog.by')} {featured[0].author}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-black text-white text-xs tracking-widest uppercase px-8 py-3 group-hover:bg-neutral-800 transition-colors">
                  {t('blog.readArticle')}
                </span>
                <svg className="w-5 h-5 text-black transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        )}

        {/* Remaining featured posts grid */}
        {featured.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {featured.slice(1).map((post) => (
              <Link key={post.id} href={`/noutati/${post.slug}`} className="group relative overflow-hidden flex flex-col">
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  <Image
                    src={post.image}
                    alt={localize(post, 'title', lang)}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[9px] tracking-widest uppercase px-3 py-1 mb-3">
                      {localize(post, 'category', lang)}
                    </span>
                    <h3 className="font-serif text-xl text-white font-light leading-snug mb-2">
                      {localize(post, 'title', lang)}
                    </h3>
                    <div className="flex items-center gap-3 text-[9px] tracking-widest uppercase text-white/60">
                      <span>{post.date.split('-').reverse().join('.')}</span>
                      <span>·</span>
                      <span>{post.readTime} {t('blog.readTime')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Remaining posts — card grid */}
        {rest.length > 0 && (
          <>
            <div className="flex items-center gap-6 my-12">
              <div className="h-px flex-1 bg-gray-100"></div>
              <span className="text-[10px] tracking-[0.5em] uppercase text-gray-400">{t('blog.moreArticles')}</span>
              <div className="h-px flex-1 bg-gray-100"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rest.map((post) => (
                <Link key={post.id} href={`/noutati/${post.slug}`} className="group flex flex-col overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={post.image}
                      alt={localize(post, 'title', lang)}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black text-white text-[9px] tracking-widest uppercase px-3 py-1.5">
                        {localize(post, 'category', lang)}
                      </span>
                    </div>
                  </div>
                  <div className="pt-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-[10px] tracking-widest uppercase text-gray-400 mb-3">
                      <span>{post.date.split('-').reverse().join('.')}</span>
                      <span>·</span>
                      <span>{post.readTime} {t('blog.readTime')}</span>
                    </div>
                    <h3 className="font-serif text-lg font-light text-black mb-3 leading-snug group-hover:text-neutral-600 transition-colors">
                      {localize(post, 'title', lang)}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">
                      {localize(post, 'excerpt', lang)}
                    </p>
                    <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-black mt-auto">
                      <span>{t('blog.read')}</span>
                      <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-gray-100 py-20 text-center">
        <p className="text-xs text-gray-400 tracking-[0.5em] uppercase mb-4">{t('blog.exploreMore')}</p>
        <h3 className="font-serif text-3xl text-black font-light mb-8">{t('blog.discoverCollections')}</h3>
        <Link href="/" className="border border-black text-black px-10 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors">
          {t('blog.backToShop')}
        </Link>
      </div>
    </div>
  );
}
