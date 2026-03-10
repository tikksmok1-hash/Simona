import prisma from '@/lib/db';

// ==================== HELPERS ====================

// Standard product include for all product queries
const productInclude = {
  variants: {
    include: {
      images: { orderBy: { order: 'asc' } },
      sizes: true,
    },
  },
  category: true,
  subcategory: true,
};

// Normalize a Prisma product to match the shape ProductCard expects
// (adds flat categorySlug / subcategorySlug fields)
function normalizeProduct(p) {
  return {
    ...p,
    categorySlug: p.category?.slug || '',
    subcategorySlug: p.subcategory?.slug || '',
  };
}

// Normalize blog post dates from Date objects to "YYYY-MM-DD" strings
function normalizeBlogPost(post) {
  return {
    ...post,
    date:
      post.date instanceof Date
        ? post.date.toISOString().split('T')[0]
        : String(post.date).split('T')[0],
  };
}

// ==================== PRODUCTS ====================

export async function getAllActiveProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
  });
  return products.map(normalizeProduct);
}

export async function getFeaturedProducts(limit = 8) {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: productInclude,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
  return products.map(normalizeProduct);
}

export async function getBestsellerProducts(limit) {
  const query = {
    where: { isActive: true, isBestseller: true },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
  };
  if (limit) query.take = limit;
  const products = await prisma.product.findMany(query);
  return products.map(normalizeProduct);
}

export async function getSaleProducts(limit) {
  // Prisma MongoDB doesn't support field-to-field comparison in where,
  // so we fetch all products with compareAtPrice and filter in JS.
  const query = {
    where: { isActive: true, compareAtPrice: { not: null } },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
  };
  if (limit) query.take = limit * 3; // fetch extra to have enough after JS filter
  const products = await prisma.product.findMany(query);
  let result = products
    .filter((p) => p.compareAtPrice && p.compareAtPrice > p.price)
    .map(normalizeProduct);
  if (limit) result = result.slice(0, limit);
  return result;
}

export async function getProductBySlug(slug) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      ...productInclude,
      reviews: true,
    },
  });
  return product ? normalizeProduct(product) : null;
}

export async function getProductsByCategory(categorySlug) {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: { slug: categorySlug },
    },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
  });
  return products.map(normalizeProduct);
}

export async function getProductsByCategoryAndSubcategory(categorySlug, subcategorySlug) {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: { slug: categorySlug },
      subcategory: { slug: subcategorySlug },
    },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
  });
  return products.map(normalizeProduct);
}

export async function searchProducts(query, limit = 6) {
  if (!query || query.length < 2) return [];
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      name: { contains: query, mode: 'insensitive' },
    },
    include: productInclude,
    take: limit,
  });
  return products.map(normalizeProduct);
}

export async function getAllProductSlugs() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return products.map((p) => p.slug);
}

export async function getSimilarProducts(product, limit = 8) {
  const subcatId = product.subcategoryId;
  const catId = product.categoryId;

  // Try subcategory first, fallback to category
  const where = {
    id: { not: product.id },
    isActive: true,
    ...(subcatId ? { subcategoryId: subcatId } : { categoryId: catId }),
  };

  let similar = await prisma.product.findMany({
    where,
    take: limit,
    include: productInclude,
  });

  // If not enough from subcategory, fill from category
  if (similar.length < 4 && subcatId) {
    const ids = similar.map((p) => p.id);
    const extra = await prisma.product.findMany({
      where: {
        id: { notIn: [...ids, product.id] },
        isActive: true,
        categoryId: catId,
      },
      take: limit - similar.length,
      include: productInclude,
    });
    similar = [...similar, ...extra];
  }

  return similar.map(normalizeProduct);
}

// ==================== CATEGORIES ====================

export async function getAllCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      subcategories: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
          _count: {
            select: { products: { where: { isActive: true } } },
          },
        },
      },
      _count: {
        select: { products: { where: { isActive: true } } },
      },
    },
  });
}

export async function getCategoryBySlug(slug) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      subcategories: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
      },
    },
  });
}

// ==================== BLOG ====================

export async function getAllBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    where: { isActive: true },
    include: {
      sections: { orderBy: { order: 'asc' } },
    },
    orderBy: { date: 'desc' },
  });
  return posts.map(normalizeBlogPost);
}

export async function getBlogPostBySlug(slug) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      sections: { orderBy: { order: 'asc' } },
    },
  });
  return post ? normalizeBlogPost(post) : null;
}

export async function getLatestBlogPosts(limit = 3) {
  const posts = await prisma.blogPost.findMany({
    where: { isActive: true },
    include: {
      sections: { orderBy: { order: 'asc' } },
    },
    orderBy: { date: 'desc' },
    take: limit,
  });
  return posts.map(normalizeBlogPost);
}

export async function getAllBlogSlugs() {
  const posts = await prisma.blogPost.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return posts.map((p) => p.slug);
}

// ==================== SITE SETTINGS ====================

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findMany();
  const settingsObj = {};
  settings.forEach(s => {
    settingsObj[s.key] = s.value;
  });
  return settingsObj;
}

// ==================== STATIC PAGES ====================

export async function getStaticPage(slug) {
  const page = await prisma.staticPage.findUnique({
    where: { slug },
  });
  return page;
}
