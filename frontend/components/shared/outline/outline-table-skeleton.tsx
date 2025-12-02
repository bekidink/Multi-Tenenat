
import { Skeleton } from "@/components/ui/skeleton";

export default function OutlineTableSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="rounded-lg border">
        <div className="p-4 border-b">
          <div className="grid grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-6" />
            ))}
          </div>
        </div>
        <div className="divide-y">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4">
              <div className="grid grid-cols-7 gap-4">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-7 w-28 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-md ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
