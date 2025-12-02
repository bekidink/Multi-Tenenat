"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth";
import { toast } from "sonner";

export default function JoinOrg() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

 useEffect(() => {
   const joinOrganization = async () => {
     if (!token) {
       router.push("/sign-in");
       return;
     }

     try {
       await authClient.organization.acceptInvitation({ invitationId: token });
        toast.success( "Successfully  Join organization");
       
       router.push("/dashboard");
     } catch (err: any) {
      toast.error(err.message || "Failed to Join organization");
       
     } 
   };

   joinOrganization();
 }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-xl">Joining organization...</p>
      </div>
    </div>
  );
}
