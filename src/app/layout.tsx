import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tolerance | AI-Powered Product Intelligence",
  description: "Enriches and normalizes cryptic industrial product data to search-ready, structured specifications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg-base text-foreground font-grotesk">
        {children}
      </body>
    </html>
  );
}
