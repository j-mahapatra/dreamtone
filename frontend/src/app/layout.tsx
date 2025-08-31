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
          <main className="flex w-full flex-1">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
