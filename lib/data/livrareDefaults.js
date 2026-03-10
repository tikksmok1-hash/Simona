// Default structured data for the Livrare & Retur page
// Stored as JSON string in StaticPage.content

export const livrareDefaults = {
  heroSubtitle: 'Livrăm comenzile cu grijă, rapid și în siguranță în toată Moldova.',
  deliveryOptions: [
    {
      title: 'Livrare Standard',
      subtitle: '3–5 zile lucrătoare',
      price: '70 MDL',
      description: 'Disponibilă în toată Moldova. Produsul ajunge ambalat elegant, gata de oferit cadou.',
    },
    {
      title: 'Ridicare din Magazin',
      subtitle: 'Disponibil imediat',
      price: 'Gratuit',
      description: 'Ridici comanda din showroom-ul nostru de pe str. Ion Creanță 58, Chișinău. Program: Luni–Vineri 9:00–19:00, Sâmbătă–Duminică 9:00–17:00.',
    },
  ],
  steps: [
    { number: '01', title: 'Plasezi Comanda', description: 'Adaugi produsele în coș și finalizezi comanda cu datele de livrare.' },
    { number: '02', title: 'Confirmare', description: 'Primești un email de confirmare în câteva minute cu detaliile comenzii.' },
    { number: '03', title: 'Pregătire & Ambalare', description: 'Comanda este pregătită cu grijă și ambalată elegant în 24h de la confirmare.' },
    { number: '04', title: 'Livrare', description: 'Curierul îți aduce comanda la adresă. Vei fi contactat înainte de sosire.' },
  ],
  returnDescription: 'Nu ești mulțumită de achiziție? Îți returnam banii integral. Ai la dispoziție 14 zile calendaristice de la primirea coletului pentru a iniția un retur.',
  returnItems: [
    'Produsul trebuie să fie în starea originală',
    'Etichetele trebuie să fie intacte',
    'Nu se acceptă returnarea lenjeriei intime',
    'Costul returului: 70 MDL (suportat de client)',
    'Rambursare în 3–5 zile lucrătoare',
  ],
  returnCards: [
    { title: 'Inițiezi returul', description: 'Contactează-ne la simona.md_info@mail.ru sau la 062 000 160 cu numărul comenzii.' },
    { title: 'Trimiți coletul', description: 'Ambalează produsul și trimite-l la adresa noastră. Vei primi confirmarea prin email când coletul ajunge la noi.' },
    { title: 'Primești banii înapoi', description: 'Rambursarea se face în decurs de 3–5 zile lucrătoare după verificarea produsului.' },
  ],
  faqs: [
    { q: 'Cât costă livrarea?', a: 'Livrarea standard costă 70 MDL (3–5 zile lucrătoare). Ridicarea din magazin este gratuită.' },
    { q: 'Pot schimba adresa de livrare după plasarea comenzii?', a: 'Poți modifica adresa în primele 2 ore de la plasarea comenzii contactând echipa noastră la simona.md_info@mail.ru sau apelând 062 000 160.' },
    { q: 'Ce se întâmplă dacă nu sunt acasă?', a: 'Curierul va încerca livrarea de 2 ori. Dacă nu ești disponibil, comanda va fi păstrată 5 zile la depozit.' },
    { q: 'Livrați în afara Moldovei?', a: 'Momentan livrăm doar pe teritoriul Republicii Moldova. Livrarea internațională este în pregătire.' },
    { q: 'Cum funcționează returul?', a: 'Ai 14 zile de la primirea comenzii pentru a returna produsele nevutilizate, cu etichetele intacte. Costul returului este de 70 MDL.' },
    { q: 'Când primesc banii înapoi pentru retur?', a: 'Rambursarea se procesează în 3–5 zile lucrătoare după ce produsul ajunge la noi și este verificat.' },
  ],
  contactSubtitle: 'Echipa noastră îți răspunde în maxim 2 ore în zilele lucrătoare.',
};
