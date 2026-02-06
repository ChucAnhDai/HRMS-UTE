export default function DashboardLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f6f8]">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#f0f1f5]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Skeleton */}
      <div className="flex flex-1 pt-6 px-4 sm:px-6 pb-10 max-w-[1920px] mx-auto w-full gap-6">
        {/* Sidebar Skeleton (hidden on mobile) */}
        <div className="hidden lg:block w-64 shrink-0 space-y-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl border border-gray-200 h-32 animate-pulse"
              ></div>
            ))}
          </div>

          {/* Table Area */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[400px] animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
