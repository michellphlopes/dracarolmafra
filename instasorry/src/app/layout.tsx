import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "InstaSorry — Descubra quem deixou de te seguir no Instagram",
    template: "%s | InstaSorry",
  },
  description:
    "Acompanhe seus seguidores do Instagram. Veja quem não te segue de volta, quem deixou de te seguir e receba alertas.",
  keywords: ["instagram", "seguidores", "followers", "unfollow", "quem me deixou de seguir"],
  authors: [{ name: "InstaSorry" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "InstaSorry",
    title: "InstaSorry — Descubra quem deixou de te seguir no Instagram",
    description: "Acompanhe seus seguidores do Instagram. Veja quem não te segue de volta e receba alertas.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "InstaSorry",
  },
  applicationName: "InstaSorry",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#e1306c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white antialiased min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
