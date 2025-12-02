
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
import { CheckCircle2, Circle, Clock, Loader } from "lucide-react";

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
          return (
            <Badge variant="outline" className=" text-gray-400">
              {formatted}
            </Badge>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        enableHiding: true,
        cell: ({ row }) => {
          const status = row.original.status;
        
          
          // Get status icon and color
          let Icon;
          let color;
          let text;
          
          switch (status) {
            case StatusType.Completed:
              Icon = CheckCircle2;
              color = "text-green-600";
              text = "Done";
              break;
            case StatusType.In_Progress:
              Icon = Loader ;
              color = "text-gray-400";
              text = "In Process";
              break;
            case StatusType.Pending:
            default:
              Icon = Circle;
              color = "text-gray-400";
              text = "Pending";
              break;
          }
          
          return (
            <div
              className={`flex w-fit items-center gap-2 font-medium border rounded-lg py-0.5 px-1`}
            >
              <Icon className={`h-4 w-4 ${color}`} />
              <span className={`font-medium text-gray-400`}>{text}</span>
            </div>
          );
        },
      },
      { accessorKey: "target", header: "Target", enableHiding: true },
      { accessorKey: "limit", header: "Limit", enableHiding: true },
      {
        accessorKey: "reviewer",
        header: "Reviewer",
        enableHiding: true,
        
      },
      {
        id: "actions",
        enableHiding: false,
        
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
      <DataTable
        columns={columns}
        data={outlines}
        loading={loading}
        enableRowSelection
        enableCellSelection
        currentPage={page}
        pageSize={pageSize}
        totalCount={outlines.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        headerComponent={
          <OutlineTableHeader onAdd={() => setSheetOpen(true)} />
        }
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