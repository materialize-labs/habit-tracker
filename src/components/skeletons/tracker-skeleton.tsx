import { Skeleton } from "@/components/ui/skeleton";

export function TrackerSkeleton() {
  return (
    <div className="space-y-6">
      {/* Date Navigation Skeleton */}
      <div className="flex items-center justify-between bg-card rounded-lg border p-4">
        <Skeleton variant="button" size="sm" className="w-10" />
        <Skeleton variant="text" size="lg" className="w-32" />
        <Skeleton variant="button" size="sm" className="w-10" />
      </div>

      {/* Habits List Skeleton */}
      <div className="space-y-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="w-full flex items-center justify-between p-4 rounded-lg border bg-card"
          >
            <Skeleton variant="text" className="w-1/3" />
            <Skeleton variant="avatar" size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
} 