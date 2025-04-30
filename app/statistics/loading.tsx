import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-10 mx-auto px-7">
      <Skeleton className="h-10 w-64 mb-6" />
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
      </div>
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </div>
  );
}
