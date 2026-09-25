import "./globals.css";
import { Barlow, Bebas_Neue } from "next/font/google";
import { Toaster } from "sonner";
import SiteChrome from "@/components/site/SiteChrome";
import { AuthProvider } from "@/components/AuthProvider";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
});
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

export const metadata = {
  title: "FT Elite Coaching",
  description: "Elite football coaching and training programmes.",
  openGraph: { type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Bebas+Neue&display=swap"
        />
      </head>
      <body>
        <AuthProvider>
          <SiteChrome>{children}</SiteChrome>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}