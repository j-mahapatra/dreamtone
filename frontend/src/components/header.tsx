"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { capitalizeFirstLetter } from "@/lib/helpers";
import { usePathname } from "next/navigation";

export function Header() {
  const isMobile = useIsMobile();
  const path = usePathname();

  const items = path.split("/").filter(Boolean);

  return (
    <header className="bg-background sticky top-0 z-10 border-b px-4 py-4">
      <div className="flex shrink-0 grow items-center gap-2">
        {isMobile && <SidebarTrigger className="-ml-1" />}
        {isMobile && (
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        )}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild={false} href={"/"}>
                {"Home"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {items.map((item) =>
              item === "home" ? null : (
                <div key={item} className="flex items-center space-x-2">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild={false} href={`/${item}`}>
                      {capitalizeFirstLetter(item)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </div>
              ),
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
