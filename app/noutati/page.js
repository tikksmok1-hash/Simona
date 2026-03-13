import { getAllBlogPosts } from '@/lib/db/queries';
import NoutatiClient from './NoutatiClient';

export const revalidate = 300;

export const metadata = {
  title: 'Noutăți — SIMONA Fashion',
  description: 'Tendințe, sfaturi de stil și inspirație din lumea modei feminine.',
};

export default async function NoutatiPage() {
  const blogPosts = await getAllBlogPosts();
  const featured = blogPosts.filter((p) => p.isFeatured);
  const rest = blogPosts.filter((p) => !p.isFeatured);
  const categories = [...new Set(blogPosts.map((p) => p.category))];

  return (
    <NoutatiClient
      blogPosts={blogPosts}
      featured={featured}
      rest={rest}
      categories={categories}
    />
  );
}