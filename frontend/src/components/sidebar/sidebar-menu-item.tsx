"use client";

import { Home, Music } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function SidebarMenuItems() {
  const pathname = usePathname();

  let items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: false,
    },
    {
      title: "Create Music",
      url: "/create",
      icon: Music,
      isActive: false,
    },
  ];

  items = items.map((item) => ({
    ...item,
    isActive: item.url === pathname,
  }));

  return (
    <>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.isActive}>
            <a href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
