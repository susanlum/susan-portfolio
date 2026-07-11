import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Susan Lum — Projects",
  description:
    "Live demos, case studies, and the tech behind projects Susan Lum has shipped.",
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
