const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
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

  cats.forEach(cat => {
    console.log(`\n${cat.name} (${cat._count.products} products)`);
    cat.subcategories.forEach(sub => {
      console.log(`  - ${sub.name}: ${sub._count.products} products`);
    });
  });

  await p.$disconnect();
}

main();
