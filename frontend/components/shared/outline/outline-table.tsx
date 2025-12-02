
"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import OutlineTableHeader from "./outline-table-header";
import OutlineTableSkeleton from "./outline-table-skeleton";
import OutlineActionsDropdown from "./outline-actions-dropdown";
import OutlineDeleteDialog from "./outline-delete-dialog";
import { toast } from "sonner";
import api from "@/lib/api";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { SectionType, StatusType, ReviewerType } from "@/types/enums";
import { useMemo } from "react";
import OutlineFormSheet from "./outline-sheet";

export interface Outline {
  id: string;
  header: string;
  sectionType: SectionType;
  status: StatusType;
  target: number;
  limit: number;
  reviewer: ReviewerType;
  createdAt?: string;
}

interface Props {
  organizationId?: string;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function OutlineTable({ organizationId }: Props) {
  const [outlines, setOutlines] = useState<Outline[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingOutline, setEditingOutline] = useState<Outline | null>(null);
  const [outlineToDelete, setOutlineToDelete] = useState<Outline | null>(null);

  const fetchOutlines = useCallback(async () => {
    setLoading(true);
    try {
      const url = organizationId
        ? `/organizations/${organizationId}/outlines`
        : "/outlines";
      const res = await api.get<Outline[]>(url);
      setOutlines(res.data || []);
    } catch {
      toast.error("Failed to load outlines");
      setOutlines([]);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchOutlines();
  }, [fetchOutlines]);

  const handleSuccess = () => {
    setSheetOpen(false);
    setEditingOutline(null);
    fetchOutlines();
    toast.success(editingOutline ? "Updated" : "Created");
  };

  const columns: ColumnDef<Outline>[] = useMemo(
    () => [
      {
        accessorKey: "header",
        header: "Header",
        enableHiding: false,
        cell: ({ row }) => (
          <div className="font-medium">{row.original.header}</div>
        ),
      },
      {
        accessorKey: "sectionType",
        header: "Section Type",
        enableHiding: true,
        cell: ({ row }) => {
          const value = row.original.sectionType;
          const formatted = value
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          return <span className="text-muted-foreground">{formatted}</span>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        enableHiding: true,
        cell: ({ row }) => {
          const status = row.original.status;
          const colors: Record<StatusType, string> = {
            [StatusType.Completed]: "bg-green-100 text-green-800",
            [StatusType.In_Progress]: "bg-yellow-100 text-yellow-800",
            [StatusType.Pending]: "bg-gray-100 text-gray-800",
          };
          return (
            <Badge
              className={`font-medium ${
                colors[status] || colors[StatusType.Pending]
              }`}
            >
              {status.replace("_", " ")}
            </Badge>
          );
        },
      },
      { accessorKey: "target", header: "Target", enableHiding: true },
      { accessorKey: "limit", header: "Limit", enableHiding: true },
      {
        accessorKey: "reviewer",
        header: "Reviewer",
        enableHiding: true,
        cell: ({ row }) => (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {row.original.reviewer}
          </Badge>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        header: "Action",
        cell: ({ row }) => (
          <OutlineActionsDropdown
            outline={row.original}
            onEdit={() => {
              setEditingOutline(row.original);
              setSheetOpen(true);
            }}
            onDelete={() => setOutlineToDelete(row.original)}
          />
        ),
      },
    ],
    []
  );

  if (loading && outlines.length === 0) return <OutlineTableSkeleton />;

  return (
    <div className="space-y-6">
      <OutlineTableHeader onAdd={() => setSheetOpen(true)} />

      <DataTable
        columns={columns}
        data={outlines}
        loading={loading}
        currentPage={page}
        pageSize={pageSize}
        totalCount={outlines.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />

      <OutlineFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        outline={editingOutline}
        onSuccess={handleSuccess}
      />
      <OutlineDeleteDialog
        outline={outlineToDelete}
        open={!!outlineToDelete}
        onOpenChange={(open) => !open && setOutlineToDelete(null)}
        onSuccess={() => {
          setOutlineToDelete(null);
          fetchOutlines();
        }}
      />
    </div>
  );
}