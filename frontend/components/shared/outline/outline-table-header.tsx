// components/outline/outline-table-header.tsx
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  onAdd: () => void;
}

export default function OutlineTableHeader({ onAdd }: Props) {
  return (
    <div className="flex items-center justify-between">
      
      <Button onClick={onAdd} className="gap-2 bg-white text-black">
        <Plus className="h-4 w-4 " color="black" />
        Add Section
      </Button>
    </div>
  );
}
