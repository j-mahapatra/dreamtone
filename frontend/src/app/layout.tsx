import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "Music Generation App",
  description: "Generate Music using AI",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body className="flex min-h-svh flex-col">
        <Providers>
          <AppSidebar />
          <SidebarInset className="flex h-screen flex-col">
            <Header />
            <main className="flex-1 overflow-auto">{children}</main>
          </SidebarInset>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
