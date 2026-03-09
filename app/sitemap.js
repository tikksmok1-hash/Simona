import {
  getAllActiveProducts,
  getAllActiveBlogPosts,
  getAllActiveCategories,
  getAllBlogSlugs,
} from '@/lib/db/queries';
import prisma from '@/lib/db';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://simona.md';

export default async function sitemap() {
  // Static pages
  const staticPages = [
    '',
    '/bestsellers',
    '/reduceri',
    '/noutati',
    '/livrare',
    '/termeni',
    '/confidentialitate',
    '/cos',
    '/favorite',
    '/comanda',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Product pages
  let productPages = [];
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    productPages = products.map((product) => ({
      url: `${BASE_URL}/produs/${product.slug}`,
      lastModified: product.updatedAt.toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));
  } catch (e) {
    console.error('Sitemap: Error fetching products', e);
  }

  // Category pages
  let categoryPages = [];
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      include: {
        subcategories: {
          where: { isActive: true },
          select: { slug: true, updatedAt: true },
        },
      },
    });
    
    categories.forEach((cat) => {
      categoryPages.push({
        url: `${BASE_URL}/categorie/${cat.slug}`,
        lastModified: cat.updatedAt.toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
      
      cat.subcategories?.forEach((sub) => {
        categoryPages.push({
          url: `${BASE_URL}/categorie/${cat.slug}/${sub.slug}`,
          lastModified: sub.updatedAt.toISOString(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    });
  } catch (e) {
    console.error('Sitemap: Error fetching categories', e);
  }

  // Blog pages
  let blogPages = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    blogPages = posts.map((post) => ({
      url: `${BASE_URL}/noutati/${post.slug}`,
      lastModified: post.updatedAt.toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch (e) {
    console.error('Sitemap: Error fetching blog posts', e);
  }

  return [...staticPages, ...productPages, ...categoryPages, ...blogPages];
}
