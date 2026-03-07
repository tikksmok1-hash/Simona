import Link from 'next/link';

export const revalidate = false;
export const dynamic = 'force-static';

export const metadata = {
  title: 'Politica de Confidențialitate — SIMONA Fashion',
  description: 'Politica de confidențialitate și protecția datelor personale SIMONA Fashion.',
};

export default function ConfidentialitatePage() {
  return (
    <div className="min-h-screen bg-white pt-[112px] md:pt-[170px] pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-400 tracking-widest uppercase">
            <Link href="/" className="hover:text-black transition-colors">Acasă</Link>
            <span>/</span>
            <span className="text-black">Politica de Confidențialitate</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-3">Legal</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-black">Politica de Confidențialitate</h1>
        </div>

        {/* Content */}
        <div className="prose prose-neutral max-w-none">
          
          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-light text-black mb-4 pb-2 border-b border-neutral-100">
              1. Colectarea datelor
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-3">
              Pentru a procesa comenzile, putem colecta următoarele informații:
            </p>
            <ul className="list-disc list-inside text-neutral-600 space-y-2 mb-4 ml-4">
              <li>nume și prenume</li>
              <li>adresă de livrare</li>
              <li>număr de telefon</li>
              <li>adresă email</li>
            </ul>
            <p className="text-neutral-600 leading-relaxed">
              Aceste date sunt folosite <strong className="text-black">doar pentru procesarea comenzilor</strong>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-light text-black mb-4 pb-2 border-b border-neutral-100">
              2. Utilizarea datelor
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-3">
              Datele personale sunt utilizate pentru:
            </p>
            <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4">
              <li>procesarea comenzilor</li>
              <li>livrarea produselor</li>
              <li>contactarea clientului</li>
              <li>îmbunătățirea serviciilor</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-light text-black mb-4 pb-2 border-b border-neutral-100">
              3. Protecția datelor
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              Magazinul se angajează să protejeze datele personale ale clienților și să <strong className="text-black">nu le transmită către terți</strong>, cu excepția firmelor de curierat implicate în livrare.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-light text-black mb-4 pb-2 border-b border-neutral-100">
              4. Cookie-uri
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Site-ul poate utiliza cookie-uri pentru a îmbunătăți experiența utilizatorului și pentru analiza traficului.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Utilizatorul poate dezactiva cookie-urile din setările browserului.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-light text-black mb-4 pb-2 border-b border-neutral-100">
              5. Drepturile utilizatorului
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-3">
              Utilizatorul are dreptul:
            </p>
            <ul className="list-disc list-inside text-neutral-600 space-y-2 mb-4 ml-4">
              <li>să solicite acces la datele sale</li>
              <li>să solicite corectarea datelor</li>
              <li>să solicite ștergerea datelor</li>
            </ul>
            <p className="text-neutral-600 leading-relaxed">
              Solicitările pot fi trimise la adresa de email:{' '}
              <a href="mailto:simona.md_info@mail.ru" className="text-black underline underline-offset-2 hover:no-underline">
                simona.md_info@mail.ru
              </a>
            </p>
          </section>

          {/* Section 6 - Contact */}
          <section className="bg-neutral-50 border border-neutral-100 p-8">
            <h2 className="font-serif text-2xl font-light text-black mb-4 text-center">
              6. Contact
            </h2>
            <p className="text-neutral-600 leading-relaxed text-center mb-6">
              Pentru întrebări legate de politica de confidențialitate ne puteți contacta la:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:simona.md_info@mail.ru" 
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                simona.md_info@mail.ru
              </a>
              <a 
                href="tel:+37362000160" 
                className="inline-flex items-center gap-2 border border-neutral-200 text-neutral-600 px-6 py-3 text-xs tracking-widest uppercase hover:border-black hover:text-black transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                062 000 160
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
