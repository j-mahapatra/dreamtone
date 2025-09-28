import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Dreamtone",
  description: "Generate Music using AI",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`antialiased`}>
      <body className="flex min-h-svh flex-col">
        <Providers>
          <main className="flex w-full flex-1">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
