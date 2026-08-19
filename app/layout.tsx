import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";

export const metadata: Metadata = {
  title: "AACI Asia Pacific | Advancing healthcare standards",
  description: "AACI Asia Pacific supports healthcare organisations with accreditation, certification and quality improvement.",
  icons: { icon: "/aaci-favicon.webp" },
  openGraph: { title: "AACI Asia Pacific", description: "Advancing healthcare standards in Asia Pacific.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1" /></head><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
