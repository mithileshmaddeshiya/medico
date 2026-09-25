import { SURFACE, Skeleton, cx } from "@/components/crm/ui";

/**
 * Analytics-shaped skeleton for all three views (child routes inherit it):
 * header, range row, hero + KPI tiles, then a grid of chart cards.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading analytics">
      <Skeleton className="mb-2 h-7 w-56" />
      <Skeleton className="mb-5 h-4 w-80 max-w-full" />
      <Skeleton className="mb-5 h-10 w-full max-w-md rounded-xl" />
      <div className="mb-5 grid gap-3 lg:grid-cols-3">
        <Skeleton className="h-44 rounded-2xl" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={cx(SURFACE, "space-y-3 p-4", i === 0 && "lg:col-span-2")}>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3.5 w-64 max-w-full" />
            <Skeleton className="h-52 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
