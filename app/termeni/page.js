import Link from 'next/link';

export const revalidate = false;
export const dynamic = 'force-static';

export const metadata = {
  title: 'Termeni și Condiții — SIMONA Fashion',
  description: 'Termenii și condițiile de utilizare a site-ului SIMONA Fashion.',
};

export default function TermeniPage() {
  return (
    <div className="min-h-screen bg-white pt-[112px] md:pt-[170px] pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-400 tracking-widest uppercase">
            <Link href="/" className="hover:text-black transition-colors">Acasă</Link>
            <span>/</span>
            <span className="text-black">Termeni și Condiții</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-3">Legal</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-black">Termeni și Condiții</h1>
        </div>

        {/* Content */}
        <div className="prose prose-neutral max-w-none">
          
          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-light text-black mb-4 pb-2 border-b border-neutral-100">
              1. Informații generale
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Acest site este administrat de <strong className="text-black">SIMONA Fashion</strong>, cu sediul în Chișinău, Republica Moldova, denumit în continuare „Vânzătorul".
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Prin utilizarea acestui site și plasarea unei comenzi, utilizatorul acceptă termenii și condițiile prezentate mai jos.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-light text-black mb-4 pb-2 border-b border-neutral-100">
              2. Produse
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Magazinul online comercializează articole de îmbrăcăminte pentru femei.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Ne străduim să prezentăm produsele cât mai exact posibil. Totuși, pot exista mici diferențe de culoare sau aspect din cauza setărilor ecranului sau a fotografiilor de prezentare.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-light text-black mb-4 pb-2 border-b border-neutral-100">
              3. Plasarea comenzilor
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Clientul poate plasa o comandă direct pe site.
            </p>
            <p className="text-neutral-600 leading-relaxed mb-3">
              După plasarea comenzii:
            </p>
            <ul className="list-disc list-inside text-neutral-600 space-y-2 mb-4 ml-4">
              <li>clientul va primi o confirmare prin email sau telefon</li>
              <li>comanda va fi procesată în termen de 1–3 zile lucrătoare</li>
            </ul>
            <p className="text-neutral-600 leading-relaxed mb-3">
              Vânzătorul își rezervă dreptul de a anula comenzile în cazul:
            </p>
            <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4">
              <li>informațiilor incorecte</li>
              <li>lipsei produsului din stoc</li>
              <li>imposibilității contactării clientului</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-light text-black mb-4 pb-2 border-b border-neutral-100">
              4. Prețuri
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Toate prețurile sunt afișate în <strong className="text-black">lei moldovenești (MDL)</strong> și pot include sau nu costul livrării.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Vânzătorul își rezervă dreptul de a modifica prețurile fără notificare prealabilă.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-light text-black mb-4 pb-2 border-b border-neutral-100">
              5. Livrare
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Produsele sunt livrate prin servicii de curierat.
            </p>
            <p className="text-neutral-600 leading-relaxed mb-3">
              Termenul estimat de livrare:
            </p>
            <ul className="list-disc list-inside text-neutral-600 space-y-2 mb-4 ml-4">
              <li><strong className="text-black">1–3 zile lucrătoare</strong> în Republica Moldova</li>
            </ul>
            <p className="text-neutral-600 leading-relaxed">
              Costul livrării este afișat în momentul plasării comenzii. Pentru detalii complete, consultați pagina{' '}
              <Link href="/livrare" className="text-black underline underline-offset-2 hover:no-underline">
                Livrare & Retur
              </Link>.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-light text-black mb-4 pb-2 border-b border-neutral-100">
              6. Retur și schimb
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Clientul are dreptul să returneze sau să schimbe produsele în termen de <strong className="text-black">14 zile</strong> de la primirea coletului.
            </p>
            <p className="text-neutral-600 leading-relaxed mb-3">
              Condiții pentru retur:
            </p>
            <ul className="list-disc list-inside text-neutral-600 space-y-2 mb-4 ml-4">
              <li>produsul să fie nepurtat</li>
              <li>să aibă etichetele intacte</li>
              <li>să fie în ambalajul original</li>
            </ul>
            <p className="text-neutral-600 leading-relaxed">
              Costul transportului pentru retur poate fi suportat de client.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-light text-black mb-4 pb-2 border-b border-neutral-100">
              7. Limitarea responsabilității
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-3">
              Vânzătorul nu este responsabil pentru:
            </p>
            <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4">
              <li>întârzieri cauzate de firmele de curierat</li>
              <li>erori tehnice ale site-ului</li>
              <li>utilizarea incorectă a produselor</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-light text-black mb-4 pb-2 border-b border-neutral-100">
              8. Drepturi de autor
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              Toate imaginile, textele și materialele de pe site sunt proprietatea <strong className="text-black">SIMONA Fashion</strong> și nu pot fi utilizate fără permisiune.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-light text-black mb-4 pb-2 border-b border-neutral-100">
              9. Modificarea termenilor
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              Vânzătorul își rezervă dreptul de a modifica acești termeni în orice moment. Versiunea actualizată va fi publicată pe site.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-neutral-50 border border-neutral-100 p-8 text-center">
            <p className="text-neutral-500 text-sm mb-3">Ai întrebări despre termenii și condițiile noastre?</p>
            <a 
              href="mailto:simona.md_info@mail.ru" 
              className="inline-flex items-center gap-2 text-black font-medium hover:underline underline-offset-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              simona.md_info@mail.ru
            </a>
          </section>

        </div>
      </div>
    </div>
  );
}
