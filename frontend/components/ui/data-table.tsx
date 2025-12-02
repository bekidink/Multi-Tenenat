"use client";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PanelLeftIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { LoaderCircleIcon, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useState, useCallback } from "react";
import { VisibilityState } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;

  // selection
  enableRowSelection?: boolean;
  enableCellSelection?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  onCellSelectionChange?: (
    selectedCells: { rowId: string; columnId: string }[]
  ) => void;

  // pagination
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  pageSizeOptions?: number[];
  showPagination?: boolean;
  headerComponent?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  enableRowSelection = false,
  enableCellSelection = false,
  onRowSelectionChange,
  onCellSelectionChange,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50, 100],
  showPagination = true,
  headerComponent
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [cellSelection, setCellSelection] = useState<
    Record<string, Record<string, boolean>>
  >({});
const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // ROW SELECTION COLUMN
  const selectionColumn: ColumnDef<TData, TValue> = {
    id: "select",
    header: ({ table }) =>
      enableRowSelection ? (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
          onClick={(e) => e.stopPropagation()} // prevent row toggling
        />
      ) : null,

    cell: ({ row }) =>
      enableRowSelection ? (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()} // prevent row click selecting twice
        />
      ) : null,
    enableSorting: false,
    enableHiding: false,
  };

  const tableColumns = enableRowSelection
    ? [selectionColumn, ...columns]
    : columns;

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility, // Add this
    state: {
      rowSelection,
      columnVisibility, // Add this
    },
    
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
  });

  const totalPages = Math.ceil(totalCount / pageSize);
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;

  // CELL SELECTION HANDLER
  const handleCellClick = useCallback(
    (rowId: string, columnId: string) => {
      if (!enableCellSelection) return;

      setCellSelection((prev) => {
        const newSelection = { ...prev };

        if (!newSelection[rowId]) {
          newSelection[rowId] = {};
        }

        newSelection[rowId][columnId] = !newSelection[rowId][columnId];

        if (onCellSelectionChange) {
          const selectedCells = Object.entries(newSelection).flatMap(
            ([rowId, columns]) =>
              Object.entries(columns)
                .filter(([_, isSelected]) => isSelected)
                .map(([columnId]) => ({ rowId, columnId }))
          );
          onCellSelectionChange(selectedCells);
        }

        return newSelection;
      });
    },
    [enableCellSelection, onCellSelectionChange]
  );

  // Trigger row selection callback
  const handleRowSelectionChange = useCallback(() => {
    if (onRowSelectionChange) {
      const selectedRows = table
        .getSelectedRowModel()
        .flatRows.map((row) => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, [table, onRowSelectionChange]);

  useState(() => {
    if (enableRowSelection && onRowSelectionChange) {
      handleRowSelectionChange();
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-end gap-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <PanelLeftIcon className="h-4 w-4 mr-2" />
              Customize Columns
              <ChevronDown className="h-4 w-4 mr-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="max-h-96 overflow-y-auto"
          >
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                // Safely render header - getContext() only exists on Header type
                const header = column.columnDef.header;
                const headerText =
                  typeof header === "function"
                    ? (header as any)({ column }) // safe fallback
                    : header ?? column.id;

                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {headerText}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        {headerComponent}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-[#E6EAEE]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={tableColumns?.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <LoaderCircleIcon className="size-8 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${
                    row.getIsSelected() ? "bg-muted/50" : ""
                  } cursor-pointer`}
                  // ⭐ NEW: click row to select
                  onClick={() => {
                    if (enableRowSelection) {
                      row.toggleSelected();
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isCellSelected =
                      enableCellSelection &&
                      cellSelection[row.id]?.[cell.column.id];

                    return (
                      <TableCell
                        key={cell.id}
                        className={`
                          ${
                            enableCellSelection
                              ? "cursor-pointer select-none"
                              : ""
                          }
                          ${
                            isCellSelected
                              ? "bg-primary/10 ring-1 ring-primary"
                              : ""
                          }
                        `}
                        // ⭐ NEW: Click cell → select cell
                        onClick={(e) => {
                          e.stopPropagation(); // prevent row toggling
                          handleCellClick(row.id, cell.column.id);
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  No Results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
