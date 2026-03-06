import Link from 'next/link';
import { products } from '@/lib/data/products';
import BestsellersFilters from '../bestsellers/BestsellersFilters';

// ISR — regenerate at most every 60s; admin can trigger /api/revalidate instantly
export const revalidate = 60;

export const metadata = {
  title: 'Reduceri — SIMONA Fashion',
  description: 'Toate produsele cu reducere din colecția SIMONA Fashion. Oferte speciale și prețuri reduse la rochii, bluze, pantaloni și accesorii.',
};

export default function ReduceriPage() {
  const saleProducts = products.filter(
    (p) => p.isActive && p.compareAtPrice && p.compareAtPrice > p.price
  );

  const maxDiscount = saleProducts.reduce((max, p) => {
    const d = Math.round((1 - p.price / p.compareAtPrice) * 100);
    return d > max ? d : max;
  }, 0);

  const totalSavings = saleProducts.reduce(
    (sum, p) => sum + (p.compareAtPrice - p.price),
    0
  );

  const availableCategories = [...new Set(saleProducts.map((p) => p.categorySlug))];

  return (
    <div className="min-h-screen bg-white pt-[112px]">

      {/* Hero — rendered on server */}
      <div className="relative bg-black overflow-hidden py-24">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute right-8 top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden md:block" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-serif text-[18vw] font-light text-white/[0.03] leading-none tracking-tighter whitespace-nowrap">
            SALE
          </span>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <p className="text-white/30 text-[10px] tracking-[0.6em] uppercase mb-5 font-light">
              Oferte Speciale
            </p>
            <h1 className="font-serif text-6xl md:text-8xl text-white font-light leading-none tracking-tight mb-6">
              Reduceri
              <span className="block italic text-white/50">până la -{maxDiscount}%</span>
            </h1>
            <p className="text-white/40 text-sm max-w-sm leading-relaxed">
              Profită de cele mai bune oferte din colecție. Prețuri reduse, stocuri limitate.
            </p>
          </div>
          <div className="flex gap-10 md:gap-16 text-center shrink-0">
            <div>
              <p className="font-serif text-5xl md:text-6xl text-white font-light leading-none mb-2">
                -{maxDiscount}%
              </p>
              <p className="text-white/40 text-[10px] tracking-widest uppercase">Reducere maximă</p>
            </div>
            <div className="w-px bg-white/10 hidden md:block" />
            <div>
              <p className="font-serif text-5xl md:text-6xl text-white font-light leading-none mb-2">
                {saleProducts.length}
              </p>
              <p className="text-white/40 text-[10px] tracking-widest uppercase">Produse în ofertă</p>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb — rendered on server */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-400 tracking-widest uppercase">
            <Link href="/" className="hover:text-black transition-colors">Acasă</Link>
            <span>/</span>
            <span className="text-black">Reduceri</span>
          </nav>
        </div>
      </div>

      {/* Interactive filters + grid + pagination — Client Component */}
      <BestsellersFilters
        products={saleProducts}
        totalSavings={totalSavings}
        availableCategories={availableCategories}
        mode="sale"
      />

    </div>
  );
}
