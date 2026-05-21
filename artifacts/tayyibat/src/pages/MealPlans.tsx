import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

export default function MealPlans() {
  return (
    <ProtectedRoute>
      <div className="container px-4 max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-serif font-bold mb-8">خطط الوجبات</h1>
        <div className="bg-card rounded-2xl border shadow-sm p-12 text-center text-muted-foreground">
          قريباً...
        </div>
      </div>
    </ProtectedRoute>
  );
}
