
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamTableSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>

      {/* Table Card */}
      <div className="rounded-lg border bg-card">
        {/* Table Header */}
        <div className="border-b p-6">
          <div className="grid grid-cols-12 gap-4">
            <Skeleton className="col-span-4 h-5" />
            <Skeleton className="col-span-3 h-5" />
            <Skeleton className="col-span-2 h-5" />
            <Skeleton className="col-span-2 h-5" />
            <Skeleton className="col-span-1 h-5 justify-end flex" />
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Name + Avatar */}
                <div className="col-span-4 flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>

                {/* Email */}
                <div className="col-span-3 flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-48" />
                </div>

                {/* Role Badge */}
                <div className="col-span-2">
                  <Skeleton className="h-7 w-20 rounded-full" />
                </div>

                {/* Joined Date */}
                <div className="col-span-2">
                  <Skeleton className="h-4 w-28" />
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end">
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
