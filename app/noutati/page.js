import Link from 'next/link';
import { blogPosts } from '@/lib/data/blog';

export const revalidate = false;
export const dynamic = 'force-static';

export const metadata = {
  title: 'Noutăți — SIMONA Fashion',
  description: 'Tendințe, sfaturi de stil și inspirație din lumea modei feminine.',
};

export default function NoutatiPage() {
  const featured = blogPosts.filter((p) => p.isFeatured);
  const rest = blogPosts.filter((p) => !p.isFeatured);
  const categories = [...new Set(blogPosts.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-white pt-[112px] md:pt-[170px]">
      {/* Hero */}
      <div className="relative bg-black overflow-hidden py-20">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10"></div>
        <div className="absolute right-8 top-0 bottom-0 w-px bg-white/10"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden md:block"></div>
        <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
          <p className="text-white/30 text-[10px] tracking-[0.6em] uppercase mb-6 font-light">
            Blog — Primăvară 2026
          </p>
          <h1 className="font-serif text-7xl md:text-9xl text-white font-light leading-none tracking-tight">
            Noutăți
          </h1>
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="h-px w-24 bg-white/20"></div>
            <p className="text-white/40 text-xs tracking-[0.4em] uppercase font-light">
              {blogPosts.length} articole
            </p>
            <div className="h-px w-24 bg-white/20"></div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-400 tracking-widest uppercase">
            <Link href="/" className="hover:text-black transition-colors">Acasă</Link>
            <span>/</span>
            <span className="text-black">Noutăți</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-3 mb-14">
          <span className="border border-black bg-black text-white text-[10px] tracking-widest uppercase px-5 py-2 cursor-pointer">
            Toate
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
            <div className="relative md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden bg-gray-100">
              <img
                src={featured[0].image}
                alt={featured[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[480px]"
              />
              <span className="absolute top-4 left-4 bg-black text-white text-[10px] tracking-[0.3em] uppercase px-3 py-1.5">
                ★ Featured
              </span>
            </div>
            <div className="md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-10">
              <span className="inline-block border border-black text-black text-[10px] tracking-widest uppercase px-4 py-1.5 mb-6 w-fit">
                {featured[0].category}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-black font-light mb-4 leading-tight">
                {featured[0].title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
                {featured[0].excerpt}
              </p>
              <div className="flex items-center gap-4 text-[10px] tracking-widest uppercase text-gray-400 mb-8">
                <span>{featured[0].date.split('-').reverse().join('.')}</span>
                <span>·</span>
                <span>{featured[0].readTime} citire</span>
                <span>·</span>
                <span>de {featured[0].author}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-black text-white text-xs tracking-widest uppercase px-8 py-3 group-hover:bg-neutral-800 transition-colors">
                  Citește Articolul
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
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[9px] tracking-widest uppercase px-3 py-1 mb-3">
                      {post.category}
                    </span>
                    <h3 className="font-serif text-xl text-white font-light leading-snug mb-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[9px] tracking-widest uppercase text-white/60">
                      <span>{post.date.split('-').reverse().join('.')}</span>
                      <span>·</span>
                      <span>{post.readTime} citire</span>
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
              <span className="text-[10px] tracking-[0.5em] uppercase text-gray-400">Mai multe articole</span>
              <div className="h-px flex-1 bg-gray-100"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rest.map((post) => (
                <Link key={post.id} href={`/noutati/${post.slug}`} className="group flex flex-col overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black text-white text-[9px] tracking-widest uppercase px-3 py-1.5">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="pt-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-[10px] tracking-widest uppercase text-gray-400 mb-3">
                      <span>{post.date.split('-').reverse().join('.')}</span>
                      <span>·</span>
                      <span>{post.readTime} citire</span>
                    </div>
                    <h3 className="font-serif text-lg font-light text-black mb-3 leading-snug group-hover:text-neutral-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-black mt-auto">
                      <span>Citește</span>
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
        <p className="text-xs text-gray-400 tracking-[0.5em] uppercase mb-4">Explorează mai mult</p>
        <h3 className="font-serif text-3xl text-black font-light mb-8">Descoperă Colecțiile Noastre</h3>
        <Link href="/" className="border border-black text-black px-10 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors">
          Înapoi la Magazin
        </Link>
      </div>
    </div>
  );
}