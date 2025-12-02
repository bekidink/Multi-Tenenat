
import { DataTable } from "@/components/ui/data-table";
import InviteMemberDialog from "./invite-member-dialog";
import MemberActionsDropdown from "./member-actions-dropdown";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Mail, Shield } from "lucide-react";
import TeamTableSkeleton from "./team-table-skeleton";

interface Member {
  id: string;
  role: "owner" | "member";
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    isCurrentUser: boolean;
  };
}

interface Props {
  members: Member[];
  isOwner: boolean;
  currentUserId: string;
  loading: boolean;
  onRefresh: () => void;
}

const columns = (
  isOwner: boolean,
  currentUserId: string,
  onRefresh: () => void
): ColumnDef<Member>[] => [
  {
    accessorKey: "user.name",
    header: "Name",
    enableHiding: false, // ← ADD THIS
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
          {row.original.user.name?.[0]?.toUpperCase() ||
            row.original.user.email[0].toUpperCase()}
        </div>
        <div>
          <p className="font-medium">{row.original.user.name || "No name"}</p>
          {row.original.user.isCurrentUser && (
            <span className="text-xs text-muted-foreground">You</span>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "user.email",
    header: "Email",
    enableHiding: false, // ← ADD THIS
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-3 w-3 text-muted-foreground" />
        {row.original.user.email}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    enableHiding: false, // ← ADD THIS
    cell: ({ row }) => (
      <Badge
        variant={row.original.role === "owner" ? "default" : "secondary"}
        className={
          row.original.role === "owner" ? "bg-purple-100 text-purple-800" : ""
        }
      >
        <Shield className="h-3 w-3 mr-1" />
        {row.original.role === "owner" ? "Owner" : "Member"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    enableHiding: false, // ← ADD THIS
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
  },
  {
    id: "actions",
    header: "", // optional: hide header
    enableHiding: false, // ← THIS IS CRITICAL
    cell: ({ row }) => {
      const member = row.original;
      const canManage = isOwner && !member.user.isCurrentUser;
      if (!canManage) return null;

      return <MemberActionsDropdown member={member} onSuccess={onRefresh} />;
    },
  },
];

export default function TeamTable({
  members,
  isOwner,
  currentUserId,
  loading,
  onRefresh,
}: Props) {
    if (loading) {
      return <TeamTableSkeleton />;
    }
  return (
    <div className="rounded-lg border bg-card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b gap-4">
        <div>
          <h2 className="text-xl font-semibold">Team Members</h2>
          <p className="text-sm text-muted-foreground">
            Manage roles and permissions
          </p>
        </div>
       
      </div>

      <div className="p-6">
        <DataTable
          columns={columns(isOwner, currentUserId, onRefresh)}
          data={members}
          loading={loading}
          enableRowSelection
          enableCellSelection
          currentPage={1}
          pageSize={10}
          totalCount={members.length}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          showPagination={members.length > 10}
          headerComponent={
            isOwner && <InviteMemberDialog onSuccess={onRefresh} />
          }
        />
      </div>
    </div>
  );
}
