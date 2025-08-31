import { Header } from "@/components/header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="flex h-full w-full flex-1">
      <AppSidebar />
      <div className="flex h-full w-full">
        <SidebarInset className="flex h-screen flex-col">
          <Header />
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </div>
  );
}
