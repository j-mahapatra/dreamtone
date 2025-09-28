import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { UserButton } from "@daveyplate/better-auth-ui";
import { Music, User } from "lucide-react";
import Link from "next/link";
import { CreditLimit } from "./credit-limit";
import { SidebarMenuItems } from "./sidebar-menu-item";
import { UpgradeUser } from "./upgrade-user";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link className="flex items-center justify-center" href="/home">
              <Music className="text-primary h-6 w-6" />
              <span className="ml-2 text-lg font-bold">Dreamtone</span>
            </Link>
          </SidebarGroupLabel>
          <Separator orientation="horizontal" className="my-2" />
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="mb-2 flex w-full items-center justify-center gap-1 text-xs">
          <CreditLimit />
          <UpgradeUser />
        </div>
        <UserButton
          variant={"outline"}
          additionalLinks={[
            {
              label: "Customer Portal",
              href: "/customer-portal",
              icon: <User />,
            },
          ]}
          className="cursor-pointer"
        />
      </SidebarFooter>
    </Sidebar>
  );
}
