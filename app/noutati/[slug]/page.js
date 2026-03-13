import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getAllBlogPosts, getAllBlogSlugs } from '@/lib/db/queries';
import BlogPostClient from './BlogPostClient';

export const revalidate = 300;

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

  return <BlogPostClient post={post} related={related} />;
}
