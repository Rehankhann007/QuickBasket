const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="aspect-square bg-gray-100 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-2.5 w-16 bg-gray-100 rounded animate-pulse" />
        <div className="h-3.5 w-3/4 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 w-10 bg-gray-100 rounded animate-pulse" />
          <div className="h-8 w-16 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
