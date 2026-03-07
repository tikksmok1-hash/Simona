import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="SIMONA Fashion" className="h-20 w-auto object-contain mb-5" />
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              Magazinul tău de modă feminină din Chișinău. Cele mai noi tendințe la prețuri accesibile.
            </p>
            <div className="flex gap-3">
              <a href="https://wa.me/37362000160" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-neutral-700 hover:border-white hover:text-white text-neutral-400 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a href="viber://chat?number=%2B37362000160"
                className="w-9 h-9 flex items-center justify-center border border-neutral-700 hover:border-white hover:text-white text-neutral-400 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.4 0C5.5.3.8 5.3.8 11.2c0 2.1.6 4.1 1.6 5.8L.8 21.5l4.7-1.5c1.6.9 3.4 1.4 5.4 1.4h.1C16.8 21.4 21.5 16.5 21.5 10.5 21.5 4.7 17 .1 11.4 0zm5.5 15.1c-.2.6-1.2 1.2-1.7 1.2-.4.1-.9.1-1.4-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.2-.2-1.3-1.7-1.3-3.3 0-1.5.8-2.3 1.1-2.6.3-.3.6-.4.8-.4h.6c.2 0 .4.1.6.4.2.4.7 1.7.8 1.8.1.1.1.3 0 .5-.1.2-.2.3-.3.4-.1.1-.2.3-.1.5.1.2.5.8 1.1 1.3.7.7 1.4 1 1.6 1.1.2.1.4.1.5-.1.1-.2.5-.6.7-.8.2-.2.4-.2.6-.1.2.1 1.3.6 1.5.7.2.1.4.2.4.3.1.2.1.7-.1 1.3z"/>
                </svg>
              </a>
              <a href="mailto:simona.md_info@mail.ru"
                className="w-9 h-9 flex items-center justify-center border border-neutral-700 hover:border-white hover:text-white text-neutral-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </a>
            </div>
          </div>

          {/* Categorii */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase mb-6">Categorii</h3>
            <ul className="space-y-3">
              <li><Link href="/categorie/rochii" className="text-neutral-400 hover:text-white transition-colors text-sm">Rochii</Link></li>
              <li><Link href="/categorie/bluze-topuri" className="text-neutral-400 hover:text-white transition-colors text-sm">Bluze & Topuri</Link></li>
              <li><Link href="/categorie/pantaloni" className="text-neutral-400 hover:text-white transition-colors text-sm">Pantaloni</Link></li>
              <li><Link href="/categorie/jachete-paltoane" className="text-neutral-400 hover:text-white transition-colors text-sm">Jachete & Paltoane</Link></li>
              <li><Link href="/categorie/fuste" className="text-neutral-400 hover:text-white transition-colors text-sm">Fuste</Link></li>
              <li><Link href="/reduceri" className="text-neutral-400 hover:text-white transition-colors text-sm">Reduceri</Link></li>
              <li><Link href="/bestsellers" className="text-neutral-400 hover:text-white transition-colors text-sm">Bestsellers</Link></li>
            </ul>
          </div>

          {/* Informații */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase mb-6">Informații</h3>
            <ul className="space-y-3">
              <li><Link href="/livrare" className="text-neutral-400 hover:text-white transition-colors text-sm">Livrare & Retur</Link></li>
              <li><Link href="/noutati" className="text-neutral-400 hover:text-white transition-colors text-sm">Noutăți</Link></li>
              <li><Link href="/favorite" className="text-neutral-400 hover:text-white transition-colors text-sm">Favorite</Link></li>
              <li><Link href="/cos" className="text-neutral-400 hover:text-white transition-colors text-sm">Coș</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase mb-6">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a href="https://www.google.com/maps/search/str.+Ion+Creangă+58,+Chișinău,+Moldova"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 text-neutral-400 hover:text-white transition-colors">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="text-sm">str. Ion Creangă 58, Chișinău</span>
                </a>
              </li>
              <li>
                <a href="tel:+37362000160" className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span className="text-sm">062 000 160</span>
                </a>
              </li>
              <li>
                <a href="mailto:simona.md_info@mail.ru" className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span className="text-sm">simona.md_info@mail.ru</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-neutral-400">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm leading-relaxed"><div>Luni – Vineri: 9:00 – 19:00</div><div>Sâmbătă – Duminică: 9:00 – 17:00</div></div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <p className="tracking-wide">© 2026 SIMONA Fashion. Toate drepturile rezervate.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/livrare" className="hover:text-white transition-colors tracking-wide">Livrare & Retur</Link>
              <Link href="/termeni" className="hover:text-white transition-colors tracking-wide">Termeni și Condiții</Link>
              <Link href="/confidentialitate" className="hover:text-white transition-colors tracking-wide">Confidențialitate</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}