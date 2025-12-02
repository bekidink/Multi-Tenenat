
"use client";

import { LayoutDashboard, Users, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { OrganizationSwitcher } from "@/components/shared/layout/organization-switcher";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Organization {
  id: string;
  name: string;
  memberCount?: number;
  active?: boolean;
}

interface AppSidebarProps {
  organizations: Organization[];
  activeOrg: Organization | null;
  onOrgChange: (orgId: string) => Promise<void> | void;
  onSignOut?: () => Promise<void> | void;
  userName?: string;
  userEmail?: string;
}

const navItems = [
  { title: "Outline", href: "/dashboard", icon: LayoutDashboard },
  { title: "Team Info / Setup", href: "/dashboard/team", icon: Users },
];

export function AppSidebar({
  organizations,
  activeOrg,
  onOrgChange,
  onSignOut,
  userName = "User",
  userEmail = "",
}: AppSidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    if (onSignOut) await onSignOut();
  };

  const isActive = (href: string) => pathname === href;

  return (
    <Sidebar collapsible="icon">
     
      <SidebarHeader className="border-b p-4">
        <OrganizationSwitcher
          organizations={organizations}
          activeOrg={activeOrg}
          onOrgChange={onOrgChange}
        />
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3"
                      >
                        <div
                          className={`p-1.5 rounded ${
                            active
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {userEmail}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
      
    </Sidebar>
  );
}
