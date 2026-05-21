import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useListRecipes } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Recipes() {
  const { data: recipesData, isLoading } = useListRecipes();

  return (
    <ProtectedRoute>
      <div className="container px-4 max-w-6xl mx-auto py-8">
        <div className="max-w-2xl mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">وصفات الطيبات</h1>
          <p className="text-muted-foreground">مجموعة من الوصفات الصحية المتوافقة مع نظام الطيبات.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : recipesData?.items?.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-2xl border shadow-sm text-muted-foreground">
            لا توجد وصفات حالياً
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipesData?.items?.map((recipe, i) => (
              <motion.div 
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all"
              >
                <div className="h-48 bg-muted relative overflow-hidden">
                  {recipe.imageUrl ? (
                    <img src={recipe.imageUrl} alt={recipe.titleAr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/40 font-serif text-xl">الطيبات</div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge className="bg-background/80 backdrop-blur text-foreground border-0">{recipe.category}</Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">{recipe.titleAr || recipe.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1"><Clock className="h-4 w-4" /> {recipe.prepTimeMinutes || 30} دقيقة</div>
                    <div className="flex items-center gap-1"><Users className="h-4 w-4" /> {recipe.servings || 2} أشخاص</div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {recipe.ingredients}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
