const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Check products with subcategoryId
  const products = await p.product.findMany({
    where: { isActive: true },
    select: { name: true, categoryId: true, subcategoryId: true }
  });

  console.log(`Total active products: ${products.length}`);
  console.log(`With subcategoryId: ${products.filter(p => p.subcategoryId).length}`);
  console.log(`Without subcategoryId: ${products.filter(p => !p.subcategoryId).length}`);
  
  console.log('\n--- Products detail ---');
  for (const prod of products) {
    console.log(`  ${prod.name} | catId: ${prod.categoryId} | subId: ${prod.subcategoryId || 'NULL'}`);
  }

  // Check what the API would return
  console.log('\n--- Categories API response ---');
  const cats = await p.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      subcategories: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
          _count: {
            select: { products: { where: { isActive: true } } }
          }
        }
      },
      _count: {
        select: { products: { where: { isActive: true } } }
      }
    }
  });

  for (const cat of cats) {
    console.log(`\n${cat.name} (${cat._count.products} products total)`);
    for (const sub of cat.subcategories) {
      console.log(`  ${sub.name}: ${sub._count.products} products | isActive: ${sub.isActive}`);
    }
    const subsWithProducts = cat.subcategories.filter(s => s._count.products > 0);
    console.log(`  >> subsWithProducts.length = ${subsWithProducts.length}`);
  }

  await p.$disconnect();
}

main();
