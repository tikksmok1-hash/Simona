const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Categories and Subcategories data
const categoriesData = [
  {
    name: 'Rochii',
    slug: 'rochii',
    description: 'Colecția noastră de rochii elegante și casual pentru orice ocazie',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop&q=80',
    order: 1,
    subcategories: [
      { name: 'Rochii de Seară', slug: 'rochii-de-seara', order: 1 },
      { name: 'Rochii de Zi', slug: 'rochii-de-zi', order: 2 },
      { name: 'Rochii de Cocktail', slug: 'rochii-cocktail', order: 3 },
      { name: 'Rochii Midi', slug: 'rochii-midi', order: 4 },
      { name: 'Rochii Maxi', slug: 'rochii-maxi', order: 5 },
      { name: 'Rochii Mini', slug: 'rochii-mini', order: 6 },
    ],
  },
  {
    name: 'Bluze & Topuri',
    slug: 'bluze-topuri',
    description: 'Bluze și topuri pentru toate gusturile',
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&h=600&fit=crop&q=80',
    order: 2,
    subcategories: [
      { name: 'Bluze Elegante', slug: 'bluze-elegante', order: 1 },
      { name: 'Bluze Casual', slug: 'bluze-casual', order: 2 },
      { name: 'Topuri Crop', slug: 'topuri-crop', order: 3 },
      { name: 'Cămăși', slug: 'camasi', order: 4 },
      { name: 'Body-uri', slug: 'body-uri', order: 5 },
    ],
  },
  {
    name: 'Pantaloni',
    slug: 'pantaloni',
    description: 'Pantaloni de toate stilurile și mărimile',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=600&fit=crop&q=80',
    order: 3,
    subcategories: [
      { name: 'Pantaloni Eleganți', slug: 'pantaloni-eleganti', order: 1 },
      { name: 'Jeans', slug: 'jeans', order: 2 },
      { name: 'Pantaloni Wide Leg', slug: 'pantaloni-wide-leg', order: 3 },
      { name: 'Leggings', slug: 'leggings', order: 4 },
      { name: 'Pantaloni Scurți', slug: 'pantaloni-scurti', order: 5 },
    ],
  },
  {
    name: 'Fuste',
    slug: 'fuste',
    description: 'Fuste elegante și casual',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&h=600&fit=crop&q=80',
    order: 4,
    subcategories: [
      { name: 'Fuste Midi', slug: 'fuste-midi', order: 1 },
      { name: 'Fuste Mini', slug: 'fuste-mini', order: 2 },
      { name: 'Fuste Maxi', slug: 'fuste-maxi', order: 3 },
      { name: 'Fuste Plisate', slug: 'fuste-plisate', order: 4 },
      { name: 'Fuste Creion', slug: 'fuste-creion', order: 5 },
    ],
  },
  {
    name: 'Jachete & Paltoane',
    slug: 'jachete-paltoane',
    description: 'Îmbrăcăminte exterioară pentru toate anotimpurile',
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&h=600&fit=crop&q=80',
    order: 5,
    subcategories: [
      { name: 'Jachete din Piele', slug: 'jachete-piele', order: 1 },
      { name: 'Jachete Denim', slug: 'jachete-denim', order: 2 },
      { name: 'Blazere', slug: 'blazere', order: 3 },
      { name: 'Paltoane', slug: 'paltoane', order: 4 },
      { name: 'Trenciuri', slug: 'trenciuri', order: 5 },
    ],
  },
  {
    name: 'Accesorii',
    slug: 'accesorii',
    description: 'Accesorii pentru a completa ținuta',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=600&fit=crop&q=80',
    order: 6,
    subcategories: [
      { name: 'Genți', slug: 'genti', order: 1 },
      { name: 'Bijuterii', slug: 'bijuterii', order: 2 },
      { name: 'Eșarfe & Fulare', slug: 'esarfe-fulare', order: 3 },
      { name: 'Curele', slug: 'curele', order: 4 },
      { name: 'Ochelari de Soare', slug: 'ochelari-soare', order: 5 },
    ],
  },
];

// Sample products — all 8 from lib/data/products.js
const productsData = [
  {
    name: 'Rochie Elegantă Satin',
    slug: 'rochie-eleganta-satin',
    description: 'O rochie de seară elegantă din satin de înaltă calitate, perfectă pentru evenimente speciale. Croiala midi evidențiază silueta, iar materialul satinat oferă un aspect luxos.',
    shortDescription: 'Rochie midi din satin, perfectă pentru seară',
    price: 299,
    compareAtPrice: 399,
    sku: 'ROC-SAT-001',
    categorySlug: 'rochii',
    subcategorySlug: 'rochii-de-seara',
    isFeatured: true,
    isNew: false,
    variants: [
      {
        colorName: 'Negru',
        colorCode: '#000000',
        images: [
          { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 5 },
          { size: 'S', stock: 8 },
          { size: 'M', stock: 10 },
          { size: 'L', stock: 6 },
          { size: 'XL', stock: 3 },
        ],
      },
      {
        colorName: 'Roșu',
        colorCode: '#DC2626',
        images: [
          { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 3 },
          { size: 'S', stock: 7 },
          { size: 'M', stock: 9 },
          { size: 'L', stock: 5 },
          { size: 'XL', stock: 2 },
        ],
      },
      {
        colorName: 'Emerald',
        colorCode: '#059669',
        images: [
          { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 4 },
          { size: 'S', stock: 6 },
          { size: 'M', stock: 8 },
          { size: 'L', stock: 4 },
          { size: 'XL', stock: 2 },
        ],
      },
    ],
  },
  {
    name: 'Bluză Casual Bumbac',
    slug: 'bluza-casual-bumbac',
    description: 'Bluză casual din bumbac organic de înaltă calitate, perfectă pentru zilele relaxate. Croială confortabilă și material respirabil.',
    shortDescription: 'Bluză confortabilă din bumbac organic',
    price: 149,
    compareAtPrice: null,
    sku: 'BLU-CAS-001',
    categorySlug: 'bluze-topuri',
    subcategorySlug: 'bluze-casual',
    isFeatured: true,
    isNew: true,
    variants: [
      {
        colorName: 'Alb',
        colorCode: '#FFFFFF',
        images: [
          { url: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 10 },
          { size: 'S', stock: 15 },
          { size: 'M', stock: 20 },
          { size: 'L', stock: 12 },
          { size: 'XL', stock: 8 },
        ],
      },
      {
        colorName: 'Bej',
        colorCode: '#D4B896',
        images: [
          { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1583846783214-0e20d2d2fe36?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 8 },
          { size: 'S', stock: 12 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 10 },
          { size: 'XL', stock: 5 },
        ],
      },
      {
        colorName: 'Roz Pudră',
        colorCode: '#F9A8D4',
        images: [
          { url: 'https://images.unsplash.com/photo-1525171254930-643fc658b64e?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 6 },
          { size: 'S', stock: 10 },
          { size: 'M', stock: 12 },
          { size: 'L', stock: 8 },
          { size: 'XL', stock: 4 },
        ],
      },
    ],
  },
  {
    name: 'Pantaloni Wide Leg',
    slug: 'pantaloni-wide-leg',
    description: 'Pantaloni cu croială largă din material fluid, perfecti pentru un look elegant și confortabil. Talie înaltă și cădere impecabilă.',
    shortDescription: 'Pantaloni eleganți cu croială largă',
    price: 199,
    compareAtPrice: 249,
    sku: 'PAN-WID-001',
    categorySlug: 'pantaloni',
    subcategorySlug: 'pantaloni-wide-leg',
    isFeatured: true,
    isNew: false,
    variants: [
      {
        colorName: 'Negru',
        colorCode: '#000000',
        images: [
          { url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 7 },
          { size: 'S', stock: 12 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 10 },
          { size: 'XL', stock: 5 },
        ],
      },
      {
        colorName: 'Crem',
        colorCode: '#FEF3C7',
        images: [
          { url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 5 },
          { size: 'S', stock: 9 },
          { size: 'M', stock: 12 },
          { size: 'L', stock: 8 },
          { size: 'XL', stock: 4 },
        ],
      },
      {
        colorName: 'Maro',
        colorCode: '#78350F',
        images: [
          { url: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1559582798-678dfc68cec9?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 4 },
          { size: 'S', stock: 8 },
          { size: 'M', stock: 10 },
          { size: 'L', stock: 6 },
          { size: 'XL', stock: 3 },
        ],
      },
    ],
  },
  {
    name: 'Jachetă Denim Oversized',
    slug: 'jacheta-denim-oversized',
    description: 'Jachetă din denim de calitate premium cu croială oversized. Perfectă pentru stratificare și un look casual-chic.',
    shortDescription: 'Jachetă denim oversized, clasică și versatilă',
    price: 279,
    compareAtPrice: null,
    sku: 'JAC-DEN-001',
    categorySlug: 'jachete-paltoane',
    subcategorySlug: 'jachete-denim',
    isFeatured: true,
    isNew: true,
    variants: [
      {
        colorName: 'Albastru Deschis',
        colorCode: '#93C5FD',
        images: [
          { url: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'S', stock: 8 },
          { size: 'M', stock: 12 },
          { size: 'L', stock: 10 },
          { size: 'XL', stock: 6 },
        ],
      },
      {
        colorName: 'Albastru Închis',
        colorCode: '#1E3A8A',
        images: [
          { url: 'https://images.unsplash.com/photo-1527016021513-b09758b777bc?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'S', stock: 6 },
          { size: 'M', stock: 10 },
          { size: 'L', stock: 8 },
          { size: 'XL', stock: 5 },
        ],
      },
      {
        colorName: 'Negru',
        colorCode: '#171717',
        images: [
          { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'S', stock: 5 },
          { size: 'M', stock: 9 },
          { size: 'L', stock: 7 },
          { size: 'XL', stock: 4 },
        ],
      },
    ],
  },
  {
    name: 'Fustă Midi Plisată',
    slug: 'fusta-midi-plisata',
    description: 'Fustă midi plisată din material fluid care creează un efect de mișcare elegant. Perfect pentru birou sau ieșiri casual.',
    shortDescription: 'Fustă plisată elegantă, lungime midi',
    price: 189,
    compareAtPrice: 229,
    sku: 'FUS-PLI-001',
    categorySlug: 'fuste',
    subcategorySlug: 'fuste-plisate',
    isFeatured: true,
    isNew: false,
    variants: [
      {
        colorName: 'Negru',
        colorCode: '#000000',
        images: [
          { url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj1n?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 8 },
          { size: 'S', stock: 12 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 10 },
          { size: 'XL', stock: 5 },
        ],
      },
      {
        colorName: 'Verde Smarald',
        colorCode: '#047857',
        images: [
          { url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 5 },
          { size: 'S', stock: 9 },
          { size: 'M', stock: 11 },
          { size: 'L', stock: 7 },
          { size: 'XL', stock: 3 },
        ],
      },
      {
        colorName: 'Burgundy',
        colorCode: '#7C2D12',
        images: [
          { url: 'https://images.unsplash.com/photo-1559582798-678dfc68cec9?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 4 },
          { size: 'S', stock: 8 },
          { size: 'M', stock: 10 },
          { size: 'L', stock: 6 },
          { size: 'XL', stock: 3 },
        ],
      },
      {
        colorName: 'Bej',
        colorCode: '#D4B896',
        images: [
          { url: 'https://images.unsplash.com/photo-1583846717393-dc2412c95ed7?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 6 },
          { size: 'S', stock: 10 },
          { size: 'M', stock: 13 },
          { size: 'L', stock: 8 },
          { size: 'XL', stock: 4 },
        ],
      },
    ],
  },
  {
    name: 'Top Crop Tricot',
    slug: 'top-crop-tricot',
    description: 'Top crop din tricot moale și confortabil. Perfect pentru combinații casual cu jeans cu talie înaltă sau fuste.',
    shortDescription: 'Top crop din tricot, confortabil și stilat',
    price: 99,
    compareAtPrice: null,
    sku: 'TOP-CRP-001',
    categorySlug: 'bluze-topuri',
    subcategorySlug: 'topuri-crop',
    isFeatured: true,
    isNew: true,
    variants: [
      {
        colorName: 'Alb',
        colorCode: '#FFFFFF',
        images: [
          { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 12 },
          { size: 'S', stock: 18 },
          { size: 'M', stock: 20 },
          { size: 'L', stock: 15 },
        ],
      },
      {
        colorName: 'Negru',
        colorCode: '#000000',
        images: [
          { url: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 10 },
          { size: 'S', stock: 15 },
          { size: 'M', stock: 18 },
          { size: 'L', stock: 12 },
        ],
      },
      {
        colorName: 'Roz',
        colorCode: '#EC4899',
        images: [
          { url: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 8 },
          { size: 'S', stock: 12 },
          { size: 'M', stock: 14 },
          { size: 'L', stock: 10 },
        ],
      },
      {
        colorName: 'Lavandă',
        colorCode: '#A78BFA',
        images: [
          { url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 6 },
          { size: 'S', stock: 10 },
          { size: 'M', stock: 12 },
          { size: 'L', stock: 8 },
        ],
      },
    ],
  },
  {
    name: 'Rochie Florală Vară',
    slug: 'rochie-florala-vara',
    description: 'Rochie de vară cu imprimeu floral romantic. Material ușor și respirabil, perfect pentru zilele călduroase de vară.',
    shortDescription: 'Rochie de vară cu print floral',
    price: 259,
    compareAtPrice: 319,
    sku: 'ROC-FLO-001',
    categorySlug: 'rochii',
    subcategorySlug: 'rochii-de-zi',
    isFeatured: true,
    isNew: false,
    variants: [
      {
        colorName: 'Floral Albastru',
        colorCode: '#3B82F6',
        images: [
          { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 5 },
          { size: 'S', stock: 8 },
          { size: 'M', stock: 10 },
          { size: 'L', stock: 6 },
          { size: 'XL', stock: 3 },
        ],
      },
      {
        colorName: 'Floral Roz',
        colorCode: '#F472B6',
        images: [
          { url: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1614251055880-ee96e4803393?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 6 },
          { size: 'S', stock: 10 },
          { size: 'M', stock: 12 },
          { size: 'L', stock: 7 },
          { size: 'XL', stock: 4 },
        ],
      },
      {
        colorName: 'Floral Galben',
        colorCode: '#FBBF24',
        images: [
          { url: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1599662875272-64de8fd3e514?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'XS', stock: 4 },
          { size: 'S', stock: 7 },
          { size: 'M', stock: 9 },
          { size: 'L', stock: 5 },
          { size: 'XL', stock: 2 },
        ],
      },
    ],
  },
  {
    name: 'Palton Lung Elegant',
    slug: 'palton-lung-elegant',
    description: 'Palton lung din lână de calitate superioară, perfect pentru iernile reci. Croială clasică cu nasturi dubli și revere largi.',
    shortDescription: 'Palton elegant din lână, croială clasică',
    price: 499,
    compareAtPrice: 649,
    sku: 'PAL-LUN-001',
    categorySlug: 'jachete-paltoane',
    subcategorySlug: 'paltoane',
    isFeatured: true,
    isNew: false,
    variants: [
      {
        colorName: 'Negru',
        colorCode: '#000000',
        images: [
          { url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'S', stock: 5 },
          { size: 'M', stock: 8 },
          { size: 'L', stock: 6 },
          { size: 'XL', stock: 3 },
        ],
      },
      {
        colorName: 'Camel',
        colorCode: '#C2883A',
        images: [
          { url: 'https://images.unsplash.com/photo-1544923246-77307dd628b5?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'S', stock: 4 },
          { size: 'M', stock: 7 },
          { size: 'L', stock: 5 },
          { size: 'XL', stock: 2 },
        ],
      },
      {
        colorName: 'Gri',
        colorCode: '#6B7280',
        images: [
          { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop', type: 'FRONT' },
          { url: 'https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?w=600&h=800&fit=crop', type: 'BACK' },
        ],
        sizes: [
          { size: 'S', stock: 3 },
          { size: 'M', stock: 6 },
          { size: 'L', stock: 4 },
          { size: 'XL', stock: 2 },
        ],
      },
    ],
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.blogSection.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.variantImage.deleteMany();
  await prisma.variantSize.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();

  // Create categories and subcategories
  console.log('Creating categories and subcategories...');
  for (const categoryData of categoriesData) {
    const { subcategories, ...categoryInfo } = categoryData;
    
    const category = await prisma.category.create({
      data: {
        ...categoryInfo,
        subcategories: {
          create: subcategories,
        },
      },
    });
    
    console.log(`✅ Created category: ${category.name}`);
  }

  // Create products
  console.log('Creating products...');
  for (const productData of productsData) {
    const { variants, categorySlug, subcategorySlug, ...productInfo } = productData;

    // Find category and subcategory
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    
    const subcategory = subcategorySlug
      ? await prisma.subcategory.findUnique({
          where: { slug: subcategorySlug },
        })
      : null;

    if (!category) {
      console.log(`❌ Category not found: ${categorySlug}`);
      continue;
    }

    // Create product with variants
    const product = await prisma.product.create({
      data: {
        ...productInfo,
        categoryId: category.id,
        subcategoryId: subcategory?.id,
        variants: {
          create: variants.map((variant) => ({
            colorName: variant.colorName,
            colorCode: variant.colorCode,
            images: {
              create: variant.images.map((image, index) => ({
                url: image.url,
                type: image.type,
                order: index,
              })),
            },
            sizes: {
              create: variant.sizes.map((size) => ({
                size: size.size,
                stock: size.stock,
                sku: `${productInfo.sku}-${variant.colorName.substring(0, 3).toUpperCase()}-${size.size}`,
              })),
            },
          })),
        },
      },
    });

    console.log(`✅ Created product: ${product.name}`);
  }

  // Create blog posts
  console.log('Creating blog posts...');
  const blogPostsData = [
    {
      title: 'Tendințele Primăverii 2026: Ce să Porți în Acest Sezon',
      slug: 'tendinte-primavara-2026',
      excerpt: 'Descoperă cele mai hot tendințe ale sezonului primăvară-vară 2026: culori pastelate, materiale fluide și siluete romantice care domină podiumurile internaționale.',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=700&fit=crop&q=85',
      category: 'Tendințe',
      date: new Date('2026-02-28'),
      readTime: '5 min',
      author: 'Simona',
      isFeatured: true,
      sections: [
        { heading: 'Culori care domină sezonul', body: 'Primăvara 2026 aduce pe podiumurile internaționale o paletă cromatică delicată și optimistă. Nuanțele de lavandă, verde mint, pudră și piersică sunt omniprezente — fie în combinații monocromatice, fie în contraste îndrăznețe. Designeri precum Valentino și Dior au mizat pe aceste tonuri pastelate pentru colecțiile lor de primăvară, stabilind astfel tendința pentru întreg sezonul.', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=500&fit=crop&q=80', order: 0 },
        { heading: 'Materiale fluide și ușoare', body: 'Mătasea, chifon-ul și voalul revin în forță. Siluetele curg liber, rochiile midi cu volane și bluzele transparente sunt piesele must-have. Croiala relaxată, departe de rigiditate, transmite feminitate și libertate în același timp. Combinarea unui top fluid cu o pereche de pantaloni tailored este formula perfectă pentru un look echilibrat.', image: null, order: 1 },
        { heading: 'Siluete romantice și detalii florale', body: 'Printurile florale revin cu o nouă energie — mai mari, mai abstracte, uneori trompe-l\'oeil. Bluze cu mâneci-clopot, fuste evazate și rochii cu decolteu în V subtil completează imaginea unei primăveri romantice. Nu uita că un singur accent floral este suficient — combină o piesă cu print cu restul ținutei în tonuri uni.', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=500&fit=crop&q=80', order: 2 },
        { heading: 'Sfatul nostru de stil', body: 'Nu trebuie să adopți toate tendințele simultan. Alege una sau două care rezonează cu personalitatea ta și construiește outfit-ul în jurul lor. Primăvara 2026 celebrează autenticitatea — poartă ceea ce te face să te simți bine și vei fi mereu în tendințe.', image: null, order: 3 },
      ],
    },
    {
      title: 'Cum să Combini Culorile Pastelate ca un Profesionist',
      slug: 'cum-sa-combini-culorile-pastelate',
      excerpt: 'Culorile pastelate sunt vedetele acestui sezon. Îți arătăm cum să le combini armonios pentru un look elegant și feminin, de zi sau de seară.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=700&fit=crop&q=85',
      category: 'Sfaturi de Stil',
      date: new Date('2026-02-20'),
      readTime: '4 min',
      author: 'Simona',
      isFeatured: true,
      sections: [
        { heading: 'Regula de bază: ton pe ton', body: 'Cea mai sigură metodă de a combina pastelurile este să alegi nuanțe din aceeași familie cromatică. Un outfit complet în nuanțe de roz — de la pudră la dusty rose — creează un look coerent și sofisticat. Secretul este să variezi texturile: combină un top din satin cu o fustă din bumbac sau pantaloni din in.', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=500&fit=crop&q=80', order: 0 },
        { heading: 'Contrastele îndrăznețe', body: 'Dacă vrei un look mai dinamic, combină culori pastelate complementare: lavandă cu mint, galben lămâie cu bleu, roz cu verde salvie. Trucul este să menții același nivel de saturație — pastel cu pastel, nu pastel cu culori vii. Adaugă o geantă sau pantofi în nuanță neutră (bej, alb, nude) pentru a echilibra combinația.', image: null, order: 1 },
        { heading: 'Accesoriile fac diferența', body: 'Bijuteriile aurii se potrivesc de minune cu pastelurile calde (roz, piersică, lavandă), în timp ce argintul completează perfect nuanțele reci (mint, bleu, lila). O geantă împletită sau o pălărie de paie adaugă naturalețe și eleganță cazonată oricărui outfit pastel de primăvară.', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=500&fit=crop&q=80', order: 2 },
      ],
    },
    {
      title: '5 Piese Esențiale pentru Garderoba de Primăvară',
      slug: '5-piese-esentiale-primavara',
      excerpt: 'De la rochia midi florală la jacheta ușoară de denim — iată cele 5 piese pe care orice femeie ar trebui să le aibă în garderobă în această primăvară.',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=700&fit=crop&q=85',
      category: 'Ghid de Stil',
      date: new Date('2026-02-14'),
      readTime: '6 min',
      author: 'Simona',
      isFeatured: true,
      sections: [
        { heading: '1. Rochia midi florală', body: 'Rochia midi cu print floral este piesa emblematică a primăverii. Versatilă și feminină, poate fi purtată cu sandale plate pentru o plimbare în parc sau cu mule cu toc pentru o cină. Optează pentru versiuni cu talie marcată pentru a evidenția silueta. Culorile dominante: fond alb sau crem cu motive florale în nuanțe pastelate.', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=500&fit=crop&q=80', order: 0 },
        { heading: '2. Jacheta de denim oversized', body: 'O jachetă de denim în croială oversized este cel mai bun prieten al garderobei de tranziție. O poți arunca peste orice — rochie, bluză și fustă, chiar și un trening elegant. Denim-ul albastru deschis sau cel alb sunt alegerile clasice, dar pentru o notă modernă încearcă versiunile în nuanțe de liliac sau verde.', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=500&fit=crop&q=80', order: 1 },
        { heading: '3. Pantalonii wide-leg din in', body: 'Inul este materialul primăverii — respirabil, natural și elegant. Pantalonii wide-leg din in în nuanțe neutrale (alb, bej, nisipiu) se potrivesc cu aproape orice bluzică. Sunt confortabili pentru birou, terase sau weekenduri leneșe. Combină-i cu un top crop strâns pentru a echilibra volumul.', image: null, order: 2 },
        { heading: '4. Bluza transparentă cu mâneci voluminoase', body: 'Mânecile voluminoase — fie că sunt clopotele, bufante sau cu volane — domină sezonul. O bluză transparentă sau din chiffon cu acest detaliu transformă instant orice look simplu. Poart-o peste un bralette coordonat sau un top basic pentru un efect stratificat la modă.', image: null, order: 3 },
        { heading: '5. Sandalele cu barete subțiri', body: 'Ultima piesă esențială nu este o haină, ci o pereche de sandale. Sandalele cu barete subțiri, fie plate fie cu mic toc kitten, sunt definitorii pentru estetica primăverii 2026. În nuanțe de nude, alb sau auriu, completează elegant orice outfit și alungesc vizual piciorul.', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=500&fit=crop&q=80', order: 4 },
      ],
    },
    {
      title: 'Cum să Construiești un Outfit Complet cu un Buget Redus',
      slug: 'outfit-complet-buget-redus',
      excerpt: 'Stilul nu trebuie să fie scump. Îți prezentăm strategiile noastre preferate pentru a arăta impecabil fără să cheltuiești o avere.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=700&fit=crop&q=85',
      category: 'Sfaturi de Stil',
      date: new Date('2026-02-07'),
      readTime: '7 min',
      author: 'Simona',
      isFeatured: false,
      sections: [
        { heading: 'Investește în piese de bază', body: 'Garderoba capsulă începe cu piese neutre și versatile: o cămașă albă, pantaloni negri bine croiți, un tricou alb simplu, o pereche de jeanși bleumarin. Aceste piese se combină între ele în zeci de moduri, multiplicând numărul de outfit-uri posibile fără a adăuga costul mai multor haine speciale.', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&h=500&fit=crop&q=80', order: 0 },
        { heading: 'Cumpără inteligent în timpul reducerilor', body: 'Reducerile de sezon sunt momentul ideal să achiziționezi piesele mai costisitoare pe care le-ai avut în vizor. Planifică dinainte ce îți lipsește din garderobă și fă o listă clară înainte de a intra la cumpărături. Astfel eviți achizițiile impulsive și îți completezi garderoba strategic.', image: null, order: 1 },
        { heading: 'Reînnoiește cu accesorii', body: 'Un outfit simplu și basic poate arăta complet diferit cu accesoriile potrivite. O eșarfă colorată, o pălărie, o geantă statement sau bijuterii voluminoase transformă instant o ținută obișnuită. Accesoriile sunt adesea mai accesibile decât hainele și au un impact vizual enorm.', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=500&fit=crop&q=80', order: 2 },
        { heading: 'Layering — arta stratificării', body: 'Poartă aceleași piese în moduri diferite prin stratificare. O rochie de vară devine o fustă midi când o combini cu un tricot pe dedesubt. Un blazer transformat în rochie scurtă cu o curea. Un trench coat purtat ca rochie. Creativitatea în stratificare îți dublează numărul de outfit-uri din aceeași garderobă.', image: null, order: 3 },
      ],
    },
    {
      title: 'Accesoriile Sezonului: Ce Poșete și Bijuterii Sunt în Trend',
      slug: 'accesorii-sezon-2026',
      excerpt: 'Accesoriile potrivite pot transforma orice ținută. Descoperă ce bijuterii, poșete și eșarfe domină tendințele acestui sezon.',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&h=700&fit=crop&q=85',
      category: 'Accesorii',
      date: new Date('2026-01-30'),
      readTime: '4 min',
      author: 'Simona',
      isFeatured: false,
      sections: [
        { heading: 'Poșetele micro și bucket bags', body: 'Geanta micro — atât de mică încât abia încape telefonul — continuă să fie în vogă, dar alături de ea apare cu forță bucket bag-ul (geanta clopot) în versiuni din piele sau materiale împletite. Nuanțele neutre (cappuccino, ivory, cognac) sunt cele mai versatile, în timp ce nuanțele statement (verde smarald, roșu rubin) transformă orice outfit simplu.', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=500&fit=crop&q=80', order: 0 },
        { heading: 'Bijuterii statement și layering', body: 'Bijuteriile voluminoase sunt în trend: coliere groase, cercei pendanți exagerați, brățări stivuite. Tendința de layering se aplică și bijuteriilor — poartă mai multe coliere de lungimi diferite sau stivuiește inele pe mai multe degete. Metalul auriu domină, dar argintul face un comeback puternic pentru 2026.', image: null, order: 1 },
        { heading: 'Eșarfele ca accesorii versatile', body: 'Eșarfa din mătase sau satin poate fi purtată în zeci de moduri: la gât, în păr (ca bentiță sau legată la coadă), la mâner de geantă sau chiar ca top. Printurile cu motive florale, geometrice sau vintage domină. O eșarfă de calitate este una dintre cele mai bune investiții în accesorii — nu trece niciodată din modă.', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=500&fit=crop&q=80', order: 2 },
      ],
    },
    {
      title: 'Îngrijirea Hainelor: Cum să Păstrezi Piesele Preferate ca Noi',
      slug: 'ingrijirea-hainelor-ghid-complet',
      excerpt: 'Cu puțină atenție, hainele tale preferate pot arăta impecabil ani la rând. Iată ghidul nostru complet de îngrijire a textilelor delicate.',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1200&h=700&fit=crop&q=85',
      category: 'Îngrijire',
      date: new Date('2026-01-22'),
      readTime: '5 min',
      author: 'Simona',
      isFeatured: false,
      sections: [
        { heading: 'Citește întotdeauna eticheta', body: 'Eticheta de îngrijire de pe haine conține toate informațiile necesare pentru a nu deteriora materialul. Simbolurile de pe etichetă indică temperatura maximă de spălare, dacă piesa poate fi pusă la uscător, cum trebuie călcată și dacă necesită curățare chimică. Ignorarea acestor indicații este principala cauză a deteriorării hainelor.', image: null, order: 0 },
        { heading: 'Spălarea textilelor delicate', body: 'Mătasea, voalul, dantelă și angora necesită îngrijire specială. Spală-le întotdeauna la mână cu apă rece și detergent delicat sau folosește programul special al mașinii de spălat. Nu stoarce niciodată mătasea — înfășoar-o într-un prosop și apasă ușor pentru a absorbi apa, apoi lasă la uscat pe orizontală.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop&q=80', order: 1 },
        { heading: 'Depozitarea corectă', body: 'Hainele din materiale naturale (lână, cachemere, bumbac) se pliază și se depozitează în sertare, nu pe umerașe — greutatea le poate deforma. Hainele formale și jachetele se atârnă pe umerașe late, de lemn sau catifea. Adaugă săculețe cu lavandă printre haine pentru a ține moliile la distanță în mod natural.', image: null, order: 2 },
        { heading: 'Curățarea petelor — acționează rapid', body: 'Cel mai important principiu: acționează cât mai repede după ce s-a produs pata. Tamponează (nu freca!) cu o cârpă curată pentru a absorbi lichidele. Apa rece funcționează pentru majoritatea petelor proaspete. Bicarbonatul de sodiu absoarbe petele de grăsime. Evită uscătorul până când ești sigur că pata a dispărut complet — căldura fixează petele permanent.', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=500&fit=crop&q=80', order: 3 },
      ],
    },
  ];

  for (const postData of blogPostsData) {
    const { sections, ...postInfo } = postData;
    const post = await prisma.blogPost.create({
      data: {
        ...postInfo,
        sections: {
          create: sections,
        },
      },
    });
    console.log(`✅ Created blog post: ${post.title}`);
  }

  console.log('✨ Database seed completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
