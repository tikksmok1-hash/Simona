// Script to drop stale SKU unique indexes from MongoDB
// Run with: node scripts/drop-sku-indexes.js

const { PrismaClient } = require('@prisma/client');

async function dropSkuIndexes() {
  const prisma = new PrismaClient();
  
  try {
    // Get the underlying MongoDB client
    // Using $runCommandRaw to list and drop indexes
    
    console.log('🔍 Checking Product collection indexes...');
    const productIndexes = await prisma.$runCommandRaw({
      listIndexes: 'Product',
      cursor: {},
    });
    
    const productIdxList = productIndexes.cursor?.firstBatch || [];
    console.log('Product indexes:', JSON.stringify(productIdxList, null, 2));
    
    // Drop sku index from Product if exists
    const productSkuIdx = productIdxList.find(idx => idx.key && idx.key.sku !== undefined);
    if (productSkuIdx) {
      console.log(`🗑️  Dropping index "${productSkuIdx.name}" from Product...`);
      await prisma.$runCommandRaw({
        dropIndexes: 'Product',
        index: productSkuIdx.name,
      });
      console.log('✅ Dropped SKU index from Product');
    } else {
      console.log('ℹ️  No SKU index found on Product collection');
    }

    console.log('\n🔍 Checking VariantSize collection indexes...');
    const sizeIndexes = await prisma.$runCommandRaw({
      listIndexes: 'VariantSize',
      cursor: {},
    });
    
    const sizeIdxList = sizeIndexes.cursor?.firstBatch || [];
    console.log('VariantSize indexes:', JSON.stringify(sizeIdxList, null, 2));
    
    // Drop sku index from VariantSize if exists
    const sizeSkuIdx = sizeIdxList.find(idx => idx.key && idx.key.sku !== undefined);
    if (sizeSkuIdx) {
      console.log(`🗑️  Dropping index "${sizeSkuIdx.name}" from VariantSize...`);
      await prisma.$runCommandRaw({
        dropIndexes: 'VariantSize',
        index: sizeSkuIdx.name,
      });
      console.log('✅ Dropped SKU index from VariantSize');
    } else {
      console.log('ℹ️  No SKU index found on VariantSize collection');
    }

    // Also check ProductVariant just in case
    console.log('\n🔍 Checking ProductVariant collection indexes...');
    const variantIndexes = await prisma.$runCommandRaw({
      listIndexes: 'ProductVariant',
      cursor: {},
    });
    
    const variantIdxList = variantIndexes.cursor?.firstBatch || [];
    const variantSkuIdx = variantIdxList.find(idx => idx.key && idx.key.sku !== undefined);
    if (variantSkuIdx) {
      console.log(`🗑️  Dropping index "${variantSkuIdx.name}" from ProductVariant...`);
      await prisma.$runCommandRaw({
        dropIndexes: 'ProductVariant',
        index: variantSkuIdx.name,
      });
      console.log('✅ Dropped SKU index from ProductVariant');
    } else {
      console.log('ℹ️  No SKU index found on ProductVariant collection');
    }

    console.log('\n🎉 Done! SKU indexes have been cleaned up.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

dropSkuIndexes();
