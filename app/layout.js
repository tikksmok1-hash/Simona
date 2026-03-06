import { Playfair_Display, Montserrat } from "next/font/google";
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
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
