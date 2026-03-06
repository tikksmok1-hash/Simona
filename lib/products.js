// Helper functions for products
import { products } from './data/products';
import { categories } from './data/categories';

// Get all products
export function getAllProducts() {
  return products;
}

// Get product by slug
export function getProductBySlug(slug) {
  return products.find(p => p.slug === slug);
}

// Get products by category
export function getProductsByCategory(categorySlug) {
  return products.filter(p => p.categorySlug === categorySlug);
}

// Get products by subcategory
export function getProductsBySubcategory(subcategorySlug) {
  return products.filter(p => p.subcategorySlug === subcategorySlug);
}

// Get featured products
export function getFeaturedProducts() {
  return products.filter(p => p.isFeatured);
}

// Get new products
export function getNewProducts() {
  return products.filter(p => p.isNew);
}

// Get products on sale
export function getProductsOnSale() {
  return products.filter(p => p.compareAtPrice && p.compareAtPrice > p.price);
}

// Get all categories
export function getAllCategories() {
  return categories;
}

// Get category by slug
export function getCategoryBySlug(slug) {
  return categories.find(c => c.slug === slug);
}

// Get subcategory by slug
export function getSubcategoryBySlug(subcategorySlug) {
  for (const category of categories) {
    const subcategory = category.subcategories.find(s => s.slug === subcategorySlug);
    if (subcategory) {
      return { ...subcategory, category };
    }
  }
  return null;
}

// Search products
export function searchProducts(query) {
  const searchTerm = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm) ||
    p.categorySlug.toLowerCase().includes(searchTerm)
  );
}

// Filter products
export function filterProducts({ 
  categorySlug, 
  subcategorySlug, 
  minPrice, 
  maxPrice, 
  colors, 
  sizes,
  sortBy 
}) {
  let filtered = [...products];

  // Filter by category
  if (categorySlug) {
    filtered = filtered.filter(p => p.categorySlug === categorySlug);
  }

  // Filter by subcategory
  if (subcategorySlug) {
    filtered = filtered.filter(p => p.subcategorySlug === subcategorySlug);
  }

  // Filter by price
  if (minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= maxPrice);
  }

  // Filter by colors
  if (colors && colors.length > 0) {
    filtered = filtered.filter(p => 
      p.variants.some(v => colors.includes(v.colorName))
    );
  }

  // Filter by sizes
  if (sizes && sizes.length > 0) {
    filtered = filtered.filter(p => 
      p.variants.some(v => 
        v.sizes.some(s => sizes.includes(s.size) && s.stock > 0)
      )
    );
  }

  // Sort
  if (sortBy) {
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        filtered = filtered.filter(p => p.isNew).concat(filtered.filter(p => !p.isNew));
        break;
      case 'discount':
        filtered.sort((a, b) => {
          const discountA = a.compareAtPrice ? (a.compareAtPrice - a.price) / a.compareAtPrice : 0;
          const discountB = b.compareAtPrice ? (b.compareAtPrice - b.price) / b.compareAtPrice : 0;
          return discountB - discountA;
        });
        break;
    }
  }

  return filtered;
}

// Get unique colors from all products
export function getAllColors() {
  const colorsMap = new Map();
  products.forEach(p => {
    p.variants.forEach(v => {
      colorsMap.set(v.colorName, v.colorCode);
    });
  });
  return Array.from(colorsMap, ([name, code]) => ({ name, code }));
}

// Get all available sizes
export function getAllSizes() {
  const sizesSet = new Set();
  products.forEach(p => {
    p.variants.forEach(v => {
      v.sizes.forEach(s => {
        sizesSet.add(s.size);
      });
    });
  });
  // Sort sizes in order
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '34', '36', '38', '40', '42', '44', '46'];
  return Array.from(sizesSet).sort((a, b) => {
    const indexA = sizeOrder.indexOf(a);
    const indexB = sizeOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

// Get price range
export function getPriceRange() {
  const prices = products.map(p => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}
