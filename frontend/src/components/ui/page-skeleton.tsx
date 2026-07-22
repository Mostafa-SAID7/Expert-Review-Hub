import { Skeleton } from "./skeleton";

/**
 * Full-page skeleton that mirrors the real page structure.
 * Used by ProtectedRoute while auth resolves — shows content immediately
 * instead of a blank spinner, dramatically reducing perceived load time.
 */

// ─── Navbar skeleton ───────────────────────────────────────────────────────
function NavbarSkeleton() {
  return (
    <div className="h-16 border-b bg-background/95 backdrop-blur flex items-center px-6 gap-4">
      <Skeleton className="h-7 w-28 rounded-md" />
      <div className="flex-1" />
      <Skeleton className="h-8 w-20 rounded-md" />
      <Skeleton className="h-8 w-20 rounded-md" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}

// ─── Generic content skeleton ──────────────────────────────────────────────
function ContentSkeleton() {
  return (
    <div className="container px-4 max-w-6xl mx-auto py-8 space-y-8">
      {/* Page title */}
      <Skeleton className="h-9 w-56 rounded-lg" />

      {/* Stat cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card border rounded-2xl p-6 space-y-3 shadow-sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        ))}
      </div>

      {/* Content block */}
      <div className="bg-card border rounded-2xl p-6 space-y-4 shadow-sm">
        <Skeleton className="h-5 w-40" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-card border rounded-2xl p-6 space-y-4 shadow-sm">
            <Skeleton className="h-5 w-36" />
            <div className="flex items-end gap-2 h-40">
              {Array.from({ length: 10 }).map((_, j) => (
                <Skeleton
                  key={j}
                  className="flex-1 rounded-sm"
                  style={{ height: `${40 + Math.random() * 60}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background">
      <NavbarSkeleton />
      <main className="flex-1">
        <ContentSkeleton />
      </main>
    </div>
  );
}

// ─── Specialised skeletons per page ────────────────────────────────────────

export function TrackerSkeleton() {
  return (
    <div className="container px-4 max-w-4xl mx-auto py-8 space-y-8">
      <div className="space-y-1">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-4 w-56" />
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card border rounded-xl p-4 flex flex-col items-center gap-3 shadow-sm">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-12" />
          </div>
        ))}
      </div>
      {/* Form */}
      <div className="bg-card border rounded-2xl p-6 space-y-4 shadow-sm">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-4">
          <Skeleton className="flex-1 h-10 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
      </div>
      {/* Entry list */}
      <div className="space-y-3">
        <Skeleton className="h-7 w-32" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card border rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="container px-4 max-w-6xl mx-auto py-8 space-y-8">
      <Skeleton className="h-9 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card border rounded-2xl p-6 space-y-3 shadow-sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-20" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-card border rounded-2xl p-6 space-y-4 shadow-sm">
            <Skeleton className="h-6 w-44" />
            <div className="flex items-end gap-1.5 h-64 pt-2">
              {Array.from({ length: 14 }).map((_, j) => (
                <Skeleton
                  key={j}
                  className="flex-1 rounded-sm"
                  style={{ height: `${30 + (j * 17 + 20) % 70}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="container px-4 max-w-2xl mx-auto py-8 space-y-6">
      <Skeleton className="h-9 w-44" />
      <div className="bg-card border rounded-2xl p-6 md:p-8 space-y-8 shadow-sm">
        {/* Avatar + name row */}
        <div className="flex items-center gap-4 pb-8 border-b">
          <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        {/* Fields */}
        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full rounded-md" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
          <Skeleton className="h-10 w-full rounded-md mt-4" />
        </div>
      </div>
    </div>
  );
}

export function RecipesSkeleton() {
  return (
    <div className="container px-4 max-w-6xl mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MealPlansSkeleton() {
  return (
    <div className="container px-4 max-w-5xl mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card border rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
