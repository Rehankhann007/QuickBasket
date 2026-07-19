// Skeleton for a horizontal card row (used in Cart items, Order cards, User cards)
export const RowSkeleton = ({ height = "h-20" }) => (
  <div className={`bg-white rounded-2xl ${height} shadow-sm animate-pulse flex items-center gap-4 px-4`}>
    <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-1/3 bg-gray-100 rounded" />
      <div className="h-2.5 w-1/2 bg-gray-100 rounded" />
    </div>
    <div className="h-6 w-16 bg-gray-100 rounded-full" />
  </div>
);

// Skeleton for a stat card (Admin Dashboard)
export const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 animate-pulse">
    <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" />
    <div className="space-y-2">
      <div className="h-2.5 w-20 bg-gray-100 rounded" />
      <div className="h-5 w-14 bg-gray-100 rounded" />
    </div>
  </div>
);

// Reusable list of row skeletons
export const SkeletonList = ({ count = 4, height = "h-20" }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <RowSkeleton key={i} height={height} />
    ))}
  </div>
);
