
"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import RemoveMemberDialog from "./remove-member-dialog";
import ChangeRoleDialog from "./change-role-dialog";

interface Member {
  id: string;
  role: "owner" | "member";
  user: { name: string | null; email: string; isCurrentUser: boolean };
}

interface Props {
  member: Member;
  onSuccess: () => void;
}

export default function MemberActionsDropdown({ member, onSuccess }: Props) {
  const [removeOpen, setRemoveOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setRoleOpen(true)}>
            {member.role === "owner" ? <>Make Member</> : <>Make Owner</>}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setRemoveOpen(true)}
            className="text-red-600"
          >
            Remove Member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RemoveMemberDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        member={member}
        onSuccess={onSuccess}
      />
      <ChangeRoleDialog
        open={roleOpen}
        onOpenChange={setRoleOpen}
        member={member}
        onSuccess={onSuccess}
      />
    </>
  );
}
