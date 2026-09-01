import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "GramConnect — Official Farming Platform",
  description:
    "Official GramConnect website for crop disease guides, weather advisory, mandi prices and farm expense tracking. Companion to the iOS and Android apps.",
};

export const viewport: Viewport = {
  themeColor: "#1f7a45",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" className={`${display.variable} ${body.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=JSON.parse(localStorage.getItem('gramconnect-state')||'{}');var t=s&&s.state&&s.state.theme;if(t)document.documentElement.dataset.theme=t;}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-dvh bg-[var(--page-bg)] font-sans text-text-primary antialiased">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
