import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

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
    <html lang="en" data-theme="dark">
      <head>
        {/* Applies the saved theme before first paint so there is no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=JSON.parse(localStorage.getItem('gramconnect-state')||'{}');var t=s&&s.state&&s.state.theme;if(t)document.documentElement.dataset.theme=t;}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-dvh text-text-primary antialiased">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
