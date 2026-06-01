import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { TransitionProvider } from "@/components/providers/TransitionProvider";

const buildManifestFont = localFont({
  src: "../../../../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
  variable: "--font-build-manifest",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Ractysh Group",
  description:
    "A five-pillar private enterprise group across Architecture, Construction, Real Estate, Export & Import and OTC Exchange.",
  icons: {
    icon: [{ url: "/brand/ractysh-logo.png", type: "image/png" }],
    apple: [{ url: "/brand/ractysh-logo.png", type: "image/png" }]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={buildManifestFont.variable}>
      <body className="page-noise font-sans">
        <SmoothScrollProvider>
          <Suspense fallback={null}>
            <TransitionProvider>{children}</TransitionProvider>
          </Suspense>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
