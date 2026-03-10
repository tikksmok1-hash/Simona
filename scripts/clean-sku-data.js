// Script to clean stale sku fields from existing MongoDB documents
// Run with: node scripts/clean-sku-data.js

const { PrismaClient } = require('@prisma/client');

async function cleanSkuData() {
  const prisma = new PrismaClient();
  
  try {
    // Remove stale sku field from Product documents
    const prodResult = await prisma.$runCommandRaw({
      update: 'Product',
      updates: [{ q: { sku: { $exists: true } }, u: { $unset: { sku: '' } }, multi: true }]
    });
    console.log('Product cleanup:', JSON.stringify(prodResult));

    // Remove stale sku field from VariantSize documents
    const sizeResult = await prisma.$runCommandRaw({
      update: 'VariantSize',
      updates: [{ q: { sku: { $exists: true } }, u: { $unset: { sku: '' } }, multi: true }]
    });
    console.log('VariantSize cleanup:', JSON.stringify(sizeResult));

    console.log('✅ Done! Stale sku fields removed from all documents.');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

cleanSkuData();
