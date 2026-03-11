import Link from 'next/link';

export const metadata = {
  title: 'Pagina nu a fost găsită – SIMONA Fashion',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-4">Eroare 404</p>
      <h1 className="font-serif text-5xl md:text-7xl text-black mb-4">Oops!</h1>
      <p className="text-sm text-gray-500 font-light mb-10 text-center max-w-xs">
        Pagina pe care o cauți nu există sau a fost mutată.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-8 py-3 bg-black text-white text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors"
        >
          Înapoi acasă
        </Link>
        <Link
          href="/categorie/rochii"
          className="px-8 py-3 border border-black text-black text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
        >
          Vezi produse
        </Link>
      </div>
    </div>
  );
}
