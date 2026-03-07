import Link from 'next/link';
import FaqAccordion from './FaqAccordion';

export const revalidate = false;
export const dynamic = 'force-static';

export const metadata = {
  title: 'Livrare & Retur — SIMONA Fashion',
  description: 'Informații despre livrare, costuri, termene și politica de retur SIMONA Fashion.',
};

const deliveryOptions = [
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: 'Livrare Standard',
    subtitle: '3–5 zile lucrătoare',
    price: '70 MDL',
    description: 'Disponibilă în toată Moldova. Produsul ajunge ambalat elegant, gata de oferit cadou.',
    highlight: false,
  },
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: 'Ridicare din Magazin',
    subtitle: 'Disponibil imediat',
    price: 'Gratuit',
    description: 'Ridici comanda din showroom-ul nostru de pe str. Ion Creanță 58, Chișinău. Program: Luni–Vineri 9:00–19:00, Sâmbătă–Duminică 9:00–17:00.',
    highlight: false,
  },
];

const steps = [
  {
    number: '01',
    title: 'Plasezi Comanda',
    description: 'Adaugi produsele în coș și finalizezi comanda cu datele de livrare.',
  },
  {
    number: '02',
    title: 'Confirmare',
    description: 'Primești un email de confirmare în câteva minute cu detaliile comenzii.',
  },
  {
    number: '03',
    title: 'Pregătire & Ambalare',
    description: 'Comanda este pregătită cu grijă și ambalată elegant în 24h de la confirmare.',
  },
  {
    number: '04',
    title: 'Livrare',
    description: 'Curierul îți aduce comanda la adresă. Vei fi contactat înainte de sosire.',
  },
];

const faqs = [
  {
    q: 'Cât costă livrarea?',
    a: 'Livrarea standard costă 70 MDL (3–5 zile lucrătoare). Ridicarea din magazin este gratuită.',
  },
  {
    q: 'Pot schimba adresa de livrare după plasarea comenzii?',
    a: 'Poți modifica adresa în primele 2 ore de la plasarea comenzii contactând echipa noastră la simona.md_info@mail.ru sau apelând 062 000 160.',,
  },
  {
    q: 'Ce se întâmplă dacă nu sunt acasă?',
    a: 'Curierul va încerca livrarea de 2 ori. Dacă nu ești disponibil, comanda va fi păstrată 5 zile la depozit.',
  },
  {
    q: 'Livrați în afara Moldovei?',
    a: 'Momentan livrăm doar pe teritoriul Republicii Moldova. Livrarea internațională este în pregătire.',
  },
  {
    q: 'Cum funcționează returul?',
    a: 'Ai 14 zile de la primirea comenzii pentru a returna produsele nevutilizate, cu etichetele intacte. Costul returului este de 70 MDL.',
  },
  {
    q: 'Când primesc banii înapoi pentru retur?',
    a: 'Rambursarea se procesează în 3–5 zile lucrătoare după ce produsul ajunge la noi și este verificat.',
  },
];

export default function LivrارePage() {
  return (
    <div className="min-h-screen bg-white pt-[112px] md:pt-[170px]">

      {/* Hero */}
      <div className="relative bg-black overflow-hidden py-24">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute right-8 top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden md:block" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-serif text-[15vw] font-light text-white/[0.03] leading-none tracking-tighter whitespace-nowrap">
            LIVRARE
          </span>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 text-center">
          <p className="text-white/30 text-[10px] tracking-[0.6em] uppercase mb-5 font-light">
            Informații
          </p>
          <h1 className="font-serif text-6xl md:text-8xl text-white font-light leading-none tracking-tight mb-6">
            Livrare & Retur
          </h1>
          <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
            Livrăm comenzile cu grijă, rapid și în siguranță în toată Moldova.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-400 tracking-widest uppercase">
            <Link href="/" className="hover:text-black transition-colors">Acasă</Link>
            <span>/</span>
            <span className="text-black">Livrare & Retur</span>
          </nav>
        </div>
      </div>



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Delivery options */}
        <div className="mb-24">
          <div className="text-center mb-14">
            <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-3">Opțiuni</p>
            <h2 className="font-serif text-4xl font-light text-black">Metode de Livrare</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {deliveryOptions.map((opt) => (
              <div
                key={opt.title}
                className={`relative p-8 border ${opt.highlight ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-100 hover:border-gray-300'} transition-colors`}
              >
                {opt.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-white text-black text-[9px] tracking-widest uppercase px-3 py-1 border border-gray-200">
                      Popular
                    </span>
                  </div>
                )}
                <div className={`mb-5 ${opt.highlight ? 'text-white/70' : 'text-gray-400'}`}>
                  {opt.icon}
                </div>
                <h3 className="font-serif text-xl font-light mb-1">{opt.title}</h3>
                <p className={`text-[10px] tracking-widest uppercase mb-4 ${opt.highlight ? 'text-white/50' : 'text-gray-400'}`}>
                  {opt.subtitle}
                </p>
                <p className={`text-sm leading-relaxed mb-6 ${opt.highlight ? 'text-white/70' : 'text-gray-500'}`}>
                  {opt.description}
                </p>
                <div className={`pt-6 border-t ${opt.highlight ? 'border-white/10' : 'border-gray-100'} flex items-center justify-between`}>
                  <span className={`text-[9px] tracking-widest uppercase ${opt.highlight ? 'text-white/40' : 'text-gray-400'}`}>Cost</span>
                  <span className="font-serif text-2xl font-light">{opt.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="mb-24">
          <div className="text-center mb-14">
            <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-3">Proces</p>
            <h2 className="font-serif text-4xl font-light text-black">Cum Funcționează</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-5 left-[calc(50%+2rem)] right-0 h-px bg-gray-100" />
                )}
                <div className="font-serif text-5xl font-light text-gray-100 mb-4 leading-none">
                  {step.number}
                </div>
                <h3 className="font-serif text-lg font-light text-black mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Return policy */}
        <div className="mb-24 bg-neutral-50 p-10 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-3">Politica</p>
              <h2 className="font-serif text-4xl font-light text-black mb-6">Retur în 14 Zile</h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Nu ești mulțumită de achiziție? Îți returnam banii integral. Ai la dispoziție 14 zile calendaristice de la primirea coletului pentru a iniția un retur.
              </p>
              <ul className="space-y-3">
                {[
                  'Produsul trebuie să fie în starea originală',
                  'Etichetele trebuie să fie intacte',
                  'Nu se acceptă returnarea lenjeriei intime',
                  'Costul returului: 70 MDL (suportat de client)',
                  'Rambursare în 3–5 zile lucrătoare',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-black shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-white p-6 border border-gray-100">
                <div className="flex items-center gap-4 mb-3">
                  <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.0 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
                  </svg>
                  <span className="text-sm font-light text-black tracking-wide">Inițiezi returul</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Contactează-ne la{' '}
                  <a href="mailto:simona.md_info@mail.ru" className="text-black underline underline-offset-2 hover:no-underline">simona.md_info@mail.ru</a>
                  {' '}sau la{' '}
                  <a href="tel:+37362000160" className="text-black underline underline-offset-2 hover:no-underline">062 000 160</a>
                  {' '}cu numărul comenzii.
                </p>
              </div>
              <div className="bg-white p-6 border border-gray-100">
                <div className="flex items-center gap-4 mb-3">
                  <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="1" />
                    <path d="M16 8h4l3 5v3h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <span className="text-sm font-light text-black tracking-wide">Trimiți coletul</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Ambalează produsul și trimite-l la adresa noastră. Vei primi confirmarea prin email când coletul ajunge la noi.
                </p>
              </div>
              <div className="bg-white p-6 border border-gray-100">
                <div className="flex items-center gap-4 mb-3">
                  <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  <span className="text-sm font-light text-black tracking-wide">Primești banii înapoi</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Rambursarea se face pe același card/cont în 3–5 zile lucrătoare după verificarea produsului.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-24">
          <div className="text-center mb-14">
            <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-3">Întrebări</p>
            <h2 className="font-serif text-4xl font-light text-black">Frecvent Întrebate</h2>
          </div>
          <FaqAccordion faqs={faqs} />
        </div>

        {/* Contact CTA */}
        <div className="bg-black text-white p-12 md:p-16 text-center">
          <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase mb-4">Ai o întrebare?</p>
          <h2 className="font-serif text-4xl font-light mb-4">Suntem Aici Pentru Tine</h2>
          <p className="text-white/50 text-sm mb-8 max-w-sm mx-auto">
            Echipa noastră îți răspunde în maxim 2 ore în zilele lucrătoare.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:simona.md_info@mail.ru"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 text-xs tracking-widest uppercase hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              simona.md_info@mail.ru
            </a>
            <a
              href="tel:+37362000160"
              className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-8 py-3 text-xs tracking-widest uppercase hover:border-white hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
              </svg>
              062 000 160
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
