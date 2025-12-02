
"use client";

import * as React from "react";
import {  Plus, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Organization {
  id: string;
  name: string;
  memberCount?: number;
  active?: boolean;
}

interface OrganizationSwitcherProps {
  organizations: Organization[];
  activeOrg: Organization | null;
  onOrgChange: (orgId: string) => Promise<void> | void;
}

export function OrganizationSwitcher({
  organizations,
  activeOrg,
  onOrgChange,
}: OrganizationSwitcherProps) {
  const switchOrg = async (org: Organization) => {
    try {
      await onOrgChange(org.id);
    } catch (error) {
      console.error("Failed to switch organization:", error);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex  py-3">
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-black text-white flex aspect-square size-10 items-center justify-center rounded-lg font-bold">
                  {activeOrg?.name?.charAt(0) || "E"}
                </div>

             
                <div className="flex-1">
                  <div className="font-semibold text-base">
                    {activeOrg?.name || "Evil Corp."}
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    {activeOrg?.active}
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronsUpDown className="ml-auto" />
                </Button>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-72 p-0 mt-auto"
              align="end"
              side="right"
              alignOffset={-20}
              sideOffset={-20}
            >
              
              <div className="p-3">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Team
                </h4>
                <div className="space-y-1">
                  {organizations.map((org) => (
                    <DropdownMenuItem
                      key={org.id}
                      onSelect={() => switchOrg(org)}
                      className="py-2 px-3 rounded cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{org.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          #{org.memberCount || 0}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <Separator />
                 
                  <DropdownMenuItem className="py-2 px-3 rounded cursor-pointer text-gray-500">
                    <Link href="/dashboard/team">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-gray-300 flex items-center justify-center rounded p-2">
                          <Plus className="h-4 w-4" />
                        </div>
                        <span className="text-sm">Add team</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
