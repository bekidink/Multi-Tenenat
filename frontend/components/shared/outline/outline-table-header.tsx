// components/outline/outline-table-header.tsx
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  onAdd: () => void;
}

export default function OutlineTableHeader({ onAdd }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Outline</h2>
        <p className="text-muted-foreground">Manage your project sections</p>
      </div>
      <Button onClick={onAdd} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Section
      </Button>
    </div>
  );
}
