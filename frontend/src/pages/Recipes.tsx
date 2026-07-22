import { useState } from "react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useListRecipes } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, Search, ChefHat, X, BookOpen, Leaf, Heart, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RecipesSkeleton } from "@/components/ui/page-skeleton";

const CATEGORY_LABELS: Record<string, string> = {
  breakfast: "الإفطار",
  main: "الطبق الرئيسي",
  soup: "الشوربة",
  salad: "السلطة",
  snack: "وجبة خفيفة",
  dessert: "الحلويات",
};

const GOAL_LABELS: Record<string, { ar: string; icon: React.FC<{className?: string}>; color: string }> = {
  weight_loss: { ar: "تخسيس", icon: Heart, color: "bg-rose-100 text-rose-700 border-rose-200" },
  diabetes:    { ar: "سكري", icon: Leaf, color: "bg-blue-100 text-blue-700 border-blue-200" },
  energy:      { ar: "طاقة", icon: Zap, color: "bg-amber-100 text-amber-700 border-amber-200" },
  general:     { ar: "عام", icon: Leaf, color: "bg-green-100 text-green-700 border-green-200" },
};

const ALL_FILTER = "__all__";

export default function Recipes() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_FILTER);
  const [activeGoal, setActiveGoal] = useState(ALL_FILTER);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: recipes = [], isLoading } = useListRecipes({
    category: activeCategory !== ALL_FILTER ? activeCategory : undefined,
    goal: activeGoal !== ALL_FILTER ? activeGoal : undefined,
    search: search || undefined,
  });

  const filtered = recipes.filter(r =>
    !search ||
    r.titleAr?.toLowerCase().includes(search.toLowerCase()) ||
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.ingredients?.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [ALL_FILTER, ...Object.keys(CATEGORY_LABELS)];
  const goals = [ALL_FILTER, ...Object.keys(GOAL_LABELS)];

  return (
    <ProtectedRoute>
      {isLoading ? <RecipesSkeleton /> : <div className="container px-4 max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-1">وصفات الطيبات</h1>
          <p className="text-muted-foreground">مجموعة وصفات صحية متوافقة مع نظام الطيبات الغذائي</p>
        </div>

        {/* Search + Filters */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث في الوصفات..."
              className="pr-10 bg-card"
              data-testid="input-search-recipes"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 text-sm px-4 py-1.5 rounded-full border transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {cat === ALL_FILTER ? "الكل" : CATEGORY_LABELS[cat] ?? cat}
              </button>
            ))}
          </div>

          {/* Goal Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {goals.map(goal => {
              const meta = GOAL_LABELS[goal];
              return (
                <button
                  key={goal}
                  onClick={() => setActiveGoal(goal)}
                  className={`shrink-0 text-sm px-4 py-1.5 rounded-full border transition-all ${
                    activeGoal === goal
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {goal === ALL_FILTER ? "كل الأهداف" : meta?.ar ?? goal}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        {!isLoading && (
          <p className="text-sm text-muted-foreground mb-5">
            {filtered.length === 0 ? "لا توجد نتائج" : `${filtered.length} وصفة`}
          </p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-72 bg-muted rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-24 bg-card rounded-2xl border shadow-sm">
            <ChefHat className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد وصفات تطابق البحث</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((recipe, i) => {
              const goalMeta = GOAL_LABELS[recipe.goal ?? "general"];
              const GoalIcon = goalMeta?.icon ?? Leaf;
              const isExpanded = expandedId === recipe.id;
              const ingredientsList = recipe.ingredients?.split(",").map(s => s.trim()).filter(Boolean) ?? [];
              const instructionsList = recipe.instructions?.split(/\d+\./).filter(s => s.trim()) ?? [];
              return (
                <motion.div
                  key={recipe.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, layout: { duration: 0.3 } }}
                  className={`bg-card rounded-2xl border shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-shadow ${isExpanded ? "md:col-span-1 lg:col-span-1" : ""}`}
                  onClick={() => setExpandedId(isExpanded ? null : recipe.id)}
                  data-testid={`card-recipe-${recipe.id}`}
                >
                  {/* Image */}
                  <div className="h-44 bg-muted relative overflow-hidden">
                    {recipe.imageUrl ? (
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.titleAr ?? recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                        <ChefHat className="h-10 w-10 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-1.5 flex-wrap">
                      <Badge className="bg-background/90 backdrop-blur text-foreground border-0 text-xs">
                        {CATEGORY_LABELS[recipe.category] ?? recipe.category}
                      </Badge>
                    </div>
                    {goalMeta && (
                      <div className="absolute bottom-3 left-3">
                        <Badge className={`${goalMeta.color} border text-xs`}>
                          <GoalIcon className="h-3 w-3 ml-1" />
                          {goalMeta.ar}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors leading-tight">
                      {recipe.titleAr || recipe.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      {recipe.prepTimeMinutes && (
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{recipe.prepTimeMinutes} دقيقة</span>
                      )}
                      {recipe.servings && (
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{recipe.servings} أشخاص</span>
                      )}
                    </div>

                    <AnimatePresence>
                      {isExpanded ? (
                        <motion.div
                          key="expanded"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden space-y-4"
                        >
                          {/* Ingredients */}
                          <div>
                            <h4 className="font-semibold text-sm mb-2 text-primary flex items-center gap-1.5">
                              <Leaf className="h-3.5 w-3.5" />المكونات
                            </h4>
                            <ul className="space-y-1">
                              {ingredientsList.map((ing, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                  <span>{ing}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Instructions */}
                          <div>
                            <h4 className="font-semibold text-sm mb-2 text-primary flex items-center gap-1.5">
                              <BookOpen className="h-3.5 w-3.5" />طريقة التحضير
                            </h4>
                            <ol className="space-y-2">
                              {instructionsList.length > 0 ? instructionsList.map((step, idx) => (
                                <li key={idx} className="flex gap-3 text-sm">
                                  <span className="shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                                    {idx + 1}
                                  </span>
                                  <span className="text-foreground/80 leading-relaxed">{step.trim()}</span>
                                </li>
                              )) : (
                                <li className="text-sm text-foreground/80">{recipe.instructions}</li>
                              )}
                            </ol>
                          </div>

                          <button
                            onClick={(e) => { e.stopPropagation(); setExpandedId(null); }}
                            className="text-xs text-primary hover:underline"
                          >
                            إخفاء التفاصيل
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div key="collapsed" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {ingredientsList.slice(0, 3).join("، ")}
                            {ingredientsList.length > 3 && ` +${ingredientsList.length - 3} مزيد`}
                          </p>
                          <span className="text-xs text-primary mt-2 inline-block">اضغط لعرض التفاصيل</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>}
    </ProtectedRoute>
  );
}
