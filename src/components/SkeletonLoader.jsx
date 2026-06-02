export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-gray-900 rounded-sm" />
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-800 w-3/4 rounded" />
        <div className="h-3 bg-gray-800 w-1/3 rounded" />
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="h-screen bg-gray-900 animate-pulse flex items-end pb-20 px-10">
      <div className="space-y-4">
        <div className="h-24 w-80 bg-gray-800 rounded" />
        <div className="h-6 w-48 bg-gray-800 rounded" />
        <div className="h-12 w-36 bg-gray-700 rounded" />
      </div>
    </div>
  )
}

export function TextSkeleton({ lines = 3 }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-gray-800 rounded"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  )
}