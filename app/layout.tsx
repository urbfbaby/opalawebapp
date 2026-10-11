import type { Metadata } from "next";
import { fraunces, dmSans } from "@/lib/fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Furnished Apartments Melbourne CBD | Opala Property",
    template: "%s | Opala Property",
  },
  description:
    "Fully furnished one and two bedroom apartments at La Trobe Tower, Melbourne CBD. Rent with or without bills. Enquire with Opala Property.",
  robots: allowIndexing
    ? {
        index: true,
        follow: true,
      }
    : {
        index: false,
        follow: false,
        nocache: true,
      },
  openGraph: {
    title: "Furnished Apartments Melbourne CBD | Opala Property",
    description:
      "Fully furnished one and two bedroom apartments at La Trobe Tower, Melbourne CBD. Rent with or without bills. Enquire with Opala Property.",
    locale: "en_AU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={`${fraunces.variable} ${dmSans.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-opala-bg text-opala-charcoal antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
