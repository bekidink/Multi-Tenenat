
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
  member: { id: string; user: { name: string | null; email: string } };
  onSuccess: () => void;
}

export default function RemoveMemberDialog({
  open,
  onOpenChange,
  member,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    setLoading(true);
    try {
      await authClient.organization.removeMember({
        memberIdOrEmail: member.id,
      });
      toast.success(`${member.user.name || member.user.email} removed`);
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{" "}
            <strong>{member.user.name || member.user.email}</strong>?
            <br />
            <br />
            <span className="text-red-600 font-medium">
              This action cannot be undone.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleRemove}
            variant="destructive"
            disabled={loading}
          >
            {loading ? "Removing..." : "Remove Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
