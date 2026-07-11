import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Susan Lum — Projects",
    template: "%s",
  },
  description:
    "Live demos, case studies, and the tech behind projects Susan Lum has shipped.",
  openGraph: {
    siteName: "Susan Lum — Projects",
    title: "Susan Lum — Projects",
    description:
      "Live demos, case studies, and the tech behind projects Susan Lum has shipped.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 antialiased">{children}</body>
    </html>
  );
}
