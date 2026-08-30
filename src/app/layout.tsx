import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GramConnect — Smart Farming Assistant",
  description:
    "Crop disease guides, live weather advisory and farm expense tracking for Indian farmers.",
};

export const viewport: Viewport = {
  themeColor: "#0a0d0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-bg-black text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
