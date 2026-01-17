import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import JsonLd, {
  organizationSchema,
  localBusinessSchema,
  createWebsiteSchema,
} from "@/components/atoms/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://grupodiapsa.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#002e46",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Grupo DIAPSA | Mantenimiento Predictivo Industrial",
    template: "%s | Grupo DIAPSA",
  },
  description:
    "Empresa líder en mantenimiento predictivo industrial con más de 22 años de experiencia. Servicios de termografía, análisis de vibraciones, ultrasonido y estudios eléctricos en México.",
  keywords: [
    "mantenimiento predictivo",
    "termografía infrarroja",
    "análisis de vibraciones",
    "ultrasonido industrial",
    "estudios eléctricos",
    "diagnóstico de maquinaria",
    "cámaras termográficas",
    "HIKMIKRO",
    "mantenimiento industrial México",
    "confiabilidad de equipos",
    "Grupo DIAPSA",
  ],
  authors: [{ name: "Grupo DIAPSA", url: BASE_URL }],
  creator: "Grupo DIAPSA",
  publisher: "Grupo DIAPSA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: BASE_URL,
    siteName: "Grupo DIAPSA",
    title: "Grupo DIAPSA | Mantenimiento Predictivo Industrial",
    description:
      "Más de 22 años liderando el mantenimiento predictivo industrial en México. Termografía, vibraciones, ultrasonido y estudios eléctricos.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Grupo DIAPSA - Mantenimiento Predictivo Industrial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grupo DIAPSA | Mantenimiento Predictivo Industrial",
    description:
      "Más de 22 años liderando el mantenimiento predictivo industrial en México.",
    images: ["/images/og-image.jpg"],
    creator: "@grupodiapsa",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/images/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
    ],
  },
  category: "Industrial Services",
  // Placeholder para verificación - reemplazar con código real cuando esté disponible
  // verification: {
  //   google: "tu-codigo-de-google-search-console",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={localBusinessSchema} />
        <JsonLd data={createWebsiteSchema()} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
