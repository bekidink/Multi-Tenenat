// app/dashboard/layout.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/shared/layout/header";
import { authClient } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { AppSidebar } from "@/components/shared/layout/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Organization, User } from "@/types";
import { toast } from "sonner";



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);

  // Debug counters
  const renderCount = useRef(0);
  const loadCount = useRef(0);

  useEffect(() => {
    renderCount.current++;

    if (loadCount.current === 0) {
      loadCount.current++;
      loadSessionData();
    }
  }, []);

  const loadSessionData = async () => {
   
    try {
      const sessionResult = await authClient.getSession();
      const sessionUser = sessionResult.data?.user;
      const sessionActiveOrgId =
        sessionResult.data?.session?.activeOrganizationId;

     

      if (!sessionUser) {
        router.push("/sign-in");
        return;
      }

      setUser(sessionUser);

      // Get organizations
      const orgsResult = await authClient.organization.list();
      const orgs = orgsResult.data || [];
      setOrganizations(orgs);

     
      let currentActiveOrg = null;
      if (sessionActiveOrgId) {
        currentActiveOrg = orgs.find(
          (org: any) => org.id === sessionActiveOrgId
        );
      }

      // Set active org
      setActiveOrg(currentActiveOrg || null);

    } catch (error) {
      router.push("/sign-in");
    } finally {
      setLoading(false);
    }
  };

  const handleOrgChange = async (orgId: string) => {

    try {
      await authClient.organization.setActive({ organizationId: orgId });

      // Update local state
      const newActiveOrg = organizations.find((org) => org.id === orgId);
      setActiveOrg(newActiveOrg || null);

    } catch (error) {
      toast.error("Error switching org");
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/sign-in");
    } catch (error) {
      toast.error("Sign out error:");
    }
  };

 
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="flex flex-col items-center space-y-8">
          {/* Smooth animated gradient orb */}
          <div className="relative">
            <div className="h-20 w-20 animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-2xl" />
            <div className="absolute inset-0 h-20 w-20 animate-ping rounded-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-60" />
            <div className="absolute inset-2 h-16 w-16 rounded-full bg-white" />
            <div className="absolute inset-4 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-purple-500" />
          </div>

          {/* Subtle text */}
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 tracking-wide">
              Preparing your dashboard
            </p>
            <p className="mt-2 text-sm text-gray-500">Just a moment...</p>
          </div>

          {/* Minimal progress bar */}
          <div className="w-64 overflow-hidden rounded-full bg-gray-200/80">
            <div className="h-1.5 w-full origin-left animate-[scaleX_2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      
      <AppSidebar
        organizations={organizations}
        activeOrg={activeOrg}
        onOrgChange={handleOrgChange}
        onSignOut={handleSignOut}
        userName={user.name || user.email.split("@")[0]}
        userEmail={user.email}
      />

    
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        
        <header className="sticky top-0 z-40 border-b bg-white">
          <div className="flex h-16 items-center gap-4 px-4">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1" />
            <Header
              userName={user.name || user.email.split("@")[0]}
              orgName={activeOrg?.name}
              userEmail={user.email}
              onSignOut={handleSignOut}
            />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
