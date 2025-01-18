import { Skeleton } from "@/components/ui/skeleton";

export function HabitsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton variant="text" size="lg" className="w-1/3" />
        <Skeleton variant="text" size="sm" className="w-1/4" />
      </div>

      {/* Stats Card Skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <Skeleton variant="text" className="w-1/4 mb-4" />
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton variant="text" size="lg" className="mx-auto w-12" />
              <Skeleton variant="text" size="sm" className="w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Habits List Skeleton */}
      <div className="space-y-2">
        <Skeleton variant="text" className="w-1/4 mb-4" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-lg border bg-card"
          >
            <Skeleton variant="text" className="w-1/3" />
            <Skeleton variant="avatar" size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
} 