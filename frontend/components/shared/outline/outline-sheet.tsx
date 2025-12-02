
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { toast } from "sonner";
import OutlineForm from "./outline-form";
import { Outline } from "./outline-table";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outline?: Outline | null;
  onSuccess: () => void;
}

export default function OutlineFormSheet({
  open,
  onOpenChange,
  outline,
  onSuccess,
}: Props) {
  const isEdit = !!outline;

  const handleSuccess = () => {
    toast.success(isEdit ? "Outline updated" : "Outline created");
    onSuccess();
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">
            {isEdit ? "Edit Outline" : "Add New Outline"}
          </SheetTitle>
        </SheetHeader>

        <OutlineForm
          outline={outline || undefined}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </SheetContent>
    </Sheet>
  );
}
