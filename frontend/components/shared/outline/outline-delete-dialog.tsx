
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export interface Outline {
  id: string;
  header: string;
  sectionType: string;
  status: string;
  createdAt?: string;
}

interface Props {
  outline: Outline | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function OutlineDeleteDialog({
  outline,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [deleting, setDeleting] = useState(false);

  if (!outline) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/outlines/${outline.id}`);
      toast.success("Outline deleted successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete outline");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Delete Outline</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Header:</span>
              <span className="font-semibold">{outline.header}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">
                Section Type:
              </span>
              <span>{outline.sectionType.replace(/_/g, " ")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-muted-foreground">Status:</span>
              <Badge variant="outline" className="font-medium">
                {outline.status.replace("_", " ")}
              </Badge>
            </div>
            {outline.createdAt && (
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">
                  Created:
                </span>
                <span className="text-sm">
                  {new Date(outline.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            This outline section and all associated data will be permanently
            removed.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            className="gap-2"
          >
            {deleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Outline
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
