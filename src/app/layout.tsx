import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ishk. • Slow living closer to what really matters",
  description: "A unified platform combining news, events, sustainable shopping, charity, and creativity. Embrace slow living with ishk.",
  keywords: ["slow living", "sustainable", "mindful", "conscious", "lifestyle", "news", "events", "boutique"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${cormorant.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
