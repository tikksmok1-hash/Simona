// Seed script for default static pages
// Run: node prisma/seed-pages.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultPages = [
  {
    slug: 'confidentialitate',
    title: 'Politica de Confidențialitate',
    content: `<h2>1. Colectarea datelor</h2>
<p>Pentru a procesa comenzile, putem colecta următoarele informații:</p>
<ul>
<li>nume și prenume</li>
<li>adresă de livrare</li>
<li>număr de telefon</li>
<li>adresă email</li>
</ul>
<p>Aceste date sunt folosite <strong>doar pentru procesarea comenzilor</strong>.</p>

<h2>2. Utilizarea datelor</h2>
<p>Datele personale sunt utilizate pentru:</p>
<ul>
<li>procesarea comenzilor</li>
<li>livrarea produselor</li>
<li>contactarea clientului</li>
<li>îmbunătățirea serviciilor</li>
</ul>

<h2>3. Protecția datelor</h2>
<p>Magazinul se angajează să protejeze datele personale ale clienților și să <strong>nu le transmită către terți</strong>, cu excepția firmelor de curierat implicate în livrare.</p>

<h2>4. Cookie-uri</h2>
<p>Site-ul poate utiliza cookie-uri pentru a îmbunătăți experiența utilizatorului și pentru analiza traficului.</p>
<p>Utilizatorul poate dezactiva cookie-urile din setările browserului.</p>

<h2>5. Drepturile utilizatorului</h2>
<p>Utilizatorul are dreptul:</p>
<ul>
<li>să solicite acces la datele sale</li>
<li>să solicite corectarea datelor</li>
<li>să solicite ștergerea datelor</li>
</ul>
<p>Solicitările pot fi trimise la adresa de email: <a href="mailto:simona.md_info@mail.ru">simona.md_info@mail.ru</a></p>

<h2>6. Contact</h2>
<p>Pentru întrebări legate de politica de confidențialitate ne puteți contacta la:</p>
<p><a href="mailto:simona.md_info@mail.ru">simona.md_info@mail.ru</a> · <a href="tel:+37362000160">062 000 160</a></p>`,
  },
  {
    slug: 'termeni',
    title: 'Termeni și Condiții',
    content: `<h2>1. Informații generale</h2>
<p>Acest site este administrat de <strong>SIMONA Fashion</strong>, cu sediul în Chișinău, Republica Moldova, denumit în continuare „Vânzătorul".</p>
<p>Prin utilizarea acestui site și plasarea unei comenzi, utilizatorul acceptă termenii și condițiile prezentate mai jos.</p>

<h2>2. Produse</h2>
<p>Magazinul online comercializează articole de îmbrăcăminte pentru femei.</p>
<p>Ne străduim să prezentăm produsele cât mai exact posibil. Totuși, pot exista mici diferențe de culoare sau aspect din cauza setărilor ecranului sau a fotografiilor de prezentare.</p>

<h2>3. Plasarea comenzilor</h2>
<p>Clientul poate plasa o comandă direct pe site.</p>
<p>După plasarea comenzii:</p>
<ul>
<li>clientul va primi o confirmare prin email sau telefon</li>
<li>comanda va fi procesată în termen de 1–3 zile lucrătoare</li>
</ul>
<p>Vânzătorul își rezervă dreptul de a anula comenzile în cazul:</p>
<ul>
<li>informațiilor incorecte</li>
<li>lipsei produsului din stoc</li>
<li>imposibilității contactării clientului</li>
</ul>

<h2>4. Prețuri</h2>
<p>Toate prețurile sunt afișate în <strong>lei moldovenești (MDL)</strong> și pot include sau nu costul livrării.</p>
<p>Vânzătorul își rezervă dreptul de a modifica prețurile fără notificare prealabilă.</p>

<h2>5. Livrare</h2>
<p>Produsele sunt livrate prin servicii de curierat.</p>
<p>Termenul estimat de livrare:</p>
<ul>
<li><strong>1–3 zile lucrătoare</strong> în Republica Moldova</li>
</ul>
<p>Costul livrării este afișat în momentul plasării comenzii. Pentru detalii complete, consultați pagina <a href="/livrare">Livrare &amp; Retur</a>.</p>

<h2>6. Retur și schimb</h2>
<p>Clientul are dreptul să returneze sau să schimbe produsele în termen de <strong>14 zile</strong> de la primirea coletului.</p>
<p>Condiții pentru retur:</p>
<ul>
<li>produsul să fie nepurtat</li>
<li>să aibă etichetele intacte</li>
<li>să fie în ambalajul original</li>
</ul>
<p>Costul transportului pentru retur poate fi suportat de client.</p>

<h2>7. Limitarea responsabilității</h2>
<p>Vânzătorul nu este responsabil pentru:</p>
<ul>
<li>întârzieri cauzate de firmele de curierat</li>
<li>erori tehnice ale site-ului</li>
<li>utilizarea incorectă a produselor</li>
</ul>

<h2>8. Drepturi de autor</h2>
<p>Toate imaginile, textele și materialele de pe site sunt proprietatea <strong>SIMONA Fashion</strong> și nu pot fi utilizate fără permisiune.</p>

<h2>9. Modificarea termenilor</h2>
<p>Vânzătorul își rezervă dreptul de a modifica acești termeni în orice moment. Versiunea actualizată va fi publicată pe site.</p>

<p><em>Ai întrebări despre termenii și condițiile noastre?</em> Contactează-ne la <a href="mailto:simona.md_info@mail.ru">simona.md_info@mail.ru</a></p>`,
  },
  {
    slug: 'livrare',
    title: 'Livrare & Retur',
    content: `<h2>Metode de Livrare</h2>

<h3>Livrare Standard — 70 MDL</h3>
<p><strong>3–5 zile lucrătoare</strong></p>
<p>Disponibilă în toată Moldova. Produsul ajunge ambalat elegant, gata de oferit cadou.</p>

<h3>Ridicare din Magazin — Gratuit</h3>
<p><strong>Disponibil imediat</strong></p>
<p>Ridici comanda din showroom-ul nostru de pe str. Ion Creanță 58, Chișinău. Program: Luni–Vineri 9:00–19:00, Sâmbătă–Duminică 9:00–17:00.</p>

<h2>Cum Funcționează</h2>

<h3>01. Plasezi Comanda</h3>
<p>Adaugi produsele în coș și finalizezi comanda cu datele de livrare.</p>

<h3>02. Confirmare</h3>
<p>Primești un email de confirmare în câteva minute cu detaliile comenzii.</p>

<h3>03. Pregătire &amp; Ambalare</h3>
<p>Comanda este pregătită cu grijă și ambalată elegant în 24h de la confirmare.</p>

<h3>04. Livrare</h3>
<p>Curierul îți aduce comanda la adresă. Vei fi contactat înainte de sosire.</p>

<h2>Retur în 14 Zile</h2>
<p>Nu ești mulțumită de achiziție? Îți returnam banii integral. Ai la dispoziție 14 zile calendaristice de la primirea coletului pentru a iniția un retur.</p>
<ul>
<li>Produsul trebuie să fie în starea originală</li>
<li>Etichetele trebuie să fie intacte</li>
<li>Nu se acceptă returnarea lenjeriei intime</li>
<li>Costul returului: 70 MDL (suportat de client)</li>
<li>Rambursare în 3–5 zile lucrătoare</li>
</ul>

<h3>Cum inițiezi un retur</h3>
<p>Contactează-ne la <a href="mailto:simona.md_info@mail.ru">simona.md_info@mail.ru</a> sau la <a href="tel:+37362000160">062 000 160</a> cu numărul comenzii.</p>
<p>Ambalează produsul și trimite-l la adresa noastră. Vei primi confirmarea prin email când coletul ajunge la noi.</p>
<p>Rambursarea se face în decurs de 3–5 zile lucrătoare după verificarea produsului.</p>

<h2>Întrebări Frecvente</h2>

<h3>Cât costă livrarea?</h3>
<p>Livrarea standard costă 70 MDL (3–5 zile lucrătoare). Ridicarea din magazin este gratuită.</p>

<h3>Pot schimba adresa de livrare după plasarea comenzii?</h3>
<p>Poți modifica adresa în primele 2 ore de la plasarea comenzii contactând echipa noastră la simona.md_info@mail.ru sau apelând 062 000 160.</p>

<h3>Ce se întâmplă dacă nu sunt acasă?</h3>
<p>Curierul va încerca livrarea de 2 ori. Dacă nu ești disponibil, comanda va fi păstrată 5 zile la depozit.</p>

<h3>Livrați în afara Moldovei?</h3>
<p>Momentan livrăm doar pe teritoriul Republicii Moldova. Livrarea internațională este în pregătire.</p>

<h3>Cum funcționează returul?</h3>
<p>Ai 14 zile de la primirea comenzii pentru a returna produsele nevutilizate, cu etichetele intacte. Costul returului este de 70 MDL.</p>

<h3>Când primesc banii înapoi pentru retur?</h3>
<p>Rambursarea se procesează în 3–5 zile lucrătoare după ce produsul ajunge la noi și este verificat.</p>

<h2>Contact</h2>
<p>Echipa noastră îți răspunde în maxim 2 ore în zilele lucrătoare.</p>
<p><a href="mailto:simona.md_info@mail.ru">simona.md_info@mail.ru</a> · <a href="tel:+37362000160">062 000 160</a></p>`,
  },
];

async function main() {
  console.log('Seeding static pages...');

  for (const page of defaultPages) {
    const result = await prisma.staticPage.upsert({
      where: { slug: page.slug },
      update: {}, // Don't overwrite existing content
      create: page,
    });
    console.log(`  ✓ ${result.title} (${result.slug})`);
  }

  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
