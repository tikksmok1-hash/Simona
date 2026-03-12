import { Playfair_Display, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "SIMONA Fashion - Magazin Online Haine Femei",
  description: "Descoperă cele mai noi tendințe în modă feminină. Rochii, bluze, pantaloni, fuste și accesorii la prețuri accesibile. Livrare rapidă în toată Moldova.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'SIMONA Fashion - Magazin Online Haine Femei',
    description: 'Descoperă cele mai noi tendințe în modă feminină. Rochii, bluze, pantaloni, fuste și accesorii la prețuri accesibile.',
    url: 'https://simona.md',
    siteName: 'SIMONA Fashion',
    locale: 'ro_MD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SIMONA Fashion - Magazin Online Haine Femei',
    description: 'Descoperă cele mai noi tendințe în modă feminină.',
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <head>
        {/* Inline script to mark homepage BEFORE React hydrates — prevents navbar flash */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(location.pathname==='/'){document.documentElement.dataset.home='1'}}catch(e){}` }} />
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '4183673128514778');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=4183673128514778&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased`}
      >
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
