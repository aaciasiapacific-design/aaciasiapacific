import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";

export const metadata: Metadata = {
  title: "AACI Asia Pacific | Advancing healthcare standards",
  description: "AACI Asia Pacific supports healthcare organisations with accreditation, certification and quality improvement.",
  openGraph: { title: "AACI Asia Pacific", description: "Advancing healthcare standards in Asia Pacific.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
