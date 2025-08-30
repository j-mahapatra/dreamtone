import { User } from "lucide-react";
import { UserButton } from "@daveyplate/better-auth-ui";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarMenuItems } from "./sidebar-menu-item";
import { CreditLimit } from "./credit-limit";
import { UpgradeUser } from "./upgrade-user";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="my-[2px] text-2xl font-semibold">
            Music Generator
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
