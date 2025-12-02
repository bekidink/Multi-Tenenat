"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { authClient } from "@/lib/auth";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: {
    id: string;
    role: "owner" | "member";
    user: { name: string | null };
  };
  onSuccess: () => void;
}

export default function ChangeRoleDialog({
  open,
  onOpenChange,
  member,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const newRole = member.role === "owner" ? "member" : "owner";

  const handleChange = async () => {
    setLoading(true);
    try {
      await authClient.organization.updateMemberRole({
        memberId: member.id,
        role: newRole,
      });
      toast.success(`Role updated to ${newRole}`);
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {newRole === "owner" ? "Make Owner" : "Change to Member"}
          </DialogTitle>
          <DialogDescription>
            Change <strong>{member.user.name || "this member"}</strong>'s role
            to <strong>{newRole}</strong>?
            <br />
            <br />
            <div className="text-sm space-y-1">
              <div>
                <strong>Owners:</strong> Full access
              </div>
              <div>
                <strong>Members:</strong> Limited access
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleChange} disabled={loading}>
            {loading ? "Updating..." : "Change Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
