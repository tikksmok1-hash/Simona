import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getAllBlogPosts, getAllBlogSlugs } from '@/lib/db/queries';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — SIMONA Fashion`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getAllBlogPosts(),
  ]);
  if (!post) notFound();

  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white pt-[112px] md:pt-[170px]">

      {/* Hero */}
      <div className="relative w-full h-[70vh] min-h-[480px] overflow-hidden bg-neutral-900">
        {/* Background image */}
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover opacity-60"
        />
        {/* Layered gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

        {/* Decorative vertical lines */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
        <div className="absolute right-8 top-0 bottom-0 w-px bg-white/10 hidden md:block" />

        {/* Content — vertically centred */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="inline-block border border-white/40 text-white/70 text-[10px] tracking-[0.45em] uppercase px-5 py-1.5 mb-6">
            {post.category}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white font-light leading-tight max-w-4xl mb-8">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-[10px] tracking-widest uppercase text-white/50">
            <span>{post.date.split('-').reverse().join('.')}</span>
            <span className="w-1 h-1 rounded-full bg-white/30 inline-block" />
            <span>{post.readTime} citire</span>
            <span className="w-1 h-1 rounded-full bg-white/30 inline-block" />
            <span>de {post.author}</span>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Breadcrumb + Meta */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <nav className="flex items-center gap-2 text-xs text-gray-400 tracking-widest uppercase">
            <Link href="/" className="hover:text-black transition-colors">Acasă</Link>
            <span>/</span>
            <Link href="/noutati" className="hover:text-black transition-colors">Noutăți</Link>
            <span>/</span>
            <span className="text-black truncate max-w-[180px]">{post.title}</span>
          </nav>
          <div className="flex items-center gap-4 text-[10px] tracking-widest uppercase text-gray-400">
            <span>{post.date.split('-').reverse().join('.')}</span>
            <span>·</span>
            <span>{post.readTime} citire</span>
            <span>·</span>
            <span>de {post.author}</span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Lead paragraph */}
        <p className="font-serif text-xl md:text-2xl text-neutral-700 font-light leading-relaxed mb-14 border-l-2 border-black pl-6">
          {post.excerpt}
        </p>

        {/* YouTube Video */}
        {post.videoUrl && (() => {
          const match = post.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
          const videoId = match?.[1];
          if (!videoId) return null;
          return (
            <div className="mb-14">
              <div className="relative w-full aspect-video overflow-hidden bg-neutral-100 rounded-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          );
        })()}

        {/* Sections */}
        <div className="space-y-14">
          {post.sections.map((section, i) => (
            <div key={i}>
              <h2 className="font-serif text-2xl md:text-3xl text-black font-light mb-5 leading-snug">
                {section.heading}
              </h2>
              <p className="text-neutral-600 leading-relaxed text-base md:text-lg mb-6">
                {section.body}
              </p>
              {section.image && (
                <div className="relative w-full aspect-[16/7] overflow-hidden bg-neutral-100 mt-8">
                  <img
                    src={section.image}
                    alt={section.heading}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-6 my-16">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-gray-300">SIMONA Fashion</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        {/* Share / Back row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link
            href="/noutati"
            className="group inline-flex items-center gap-2 text-xs tracking-widest uppercase text-black hover:text-neutral-500 transition-colors"
          >
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Înapoi la Noutăți
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-widest uppercase text-gray-400">Distribuie:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://simonafashion.md/noutati/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            <a
              href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(`https://simonafashion.md/noutati/${post.slug}`)}&media=${encodeURIComponent(post.image)}&description=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
              aria-label="Pinterest"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
              </svg>
            </a>
          </div>
        </div>
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="border-t border-gray-100 py-16 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-3">Continuă să citești</p>
              <h2 className="font-serif text-3xl text-black font-light">Articole Similare</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((rpost) => (
                <Link key={rpost.id} href={`/noutati/${rpost.slug}`} className="group flex flex-col overflow-hidden bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={rpost.image}
                      alt={rpost.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black text-white text-[9px] tracking-widest uppercase px-3 py-1.5">
                        {rpost.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-[10px] tracking-widest uppercase text-gray-400 mb-3">
                      <span>{rpost.date.split('-').reverse().join('.')}</span>
                      <span>·</span>
                      <span>{rpost.readTime} citire</span>
                    </div>
                    <h3 className="font-serif text-lg font-light text-black mb-3 leading-snug group-hover:text-neutral-600 transition-colors">
                      {rpost.title}
                    </h3>
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
          </div>
        </section>
      )}

    </div>
  );
}
