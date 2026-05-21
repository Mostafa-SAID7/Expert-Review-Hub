import { Layout } from "@/components/layout/Layout";
import { useListFoodCategories, useListFoods, getListFoodsQueryKey, ListFoodsStatus } from "@workspace/api-client-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Leaf, ShieldAlert } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Guide() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeStatus, setActiveStatus] = useState<"all" | "tayyib" | "khabeeth">("all");

  const { data: categories } = useListFoodCategories();
  const { data: foodsResponse, isLoading } = useListFoods({
    search: search || undefined,
    category: activeCategory !== "all" ? activeCategory : undefined,
    status: activeStatus !== "all" ? activeStatus as ListFoodsStatus : undefined,
    limit: 100,
  });

  return (
    <Layout>
      <div className="bg-primary/5 py-12 md:py-16">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">دليل أطعمة الطيبات</h1>
            <p className="text-muted-foreground text-lg">
              ابحث واكتشف الأطعمة المسموحة (الطيبات) والممنوعة (الخبائث) في نظام د. ضياء العوضي.
            </p>
          </div>
        </div>
      </div>

      <div className="container px-4 max-w-6xl mx-auto py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Filters */}
          <div className="w-full md:w-64 space-y-8 flex-shrink-0">
            <div>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="ابحث عن طعام..." 
                  className="pr-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">التصنيف</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveStatus("all")}
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-colors ${activeStatus === "all" ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setActiveStatus("tayyib")}
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-colors ${activeStatus === "tayyib" ? "bg-tayyib text-tayyib-foreground border-tayyib" : "hover:bg-tayyib/10 hover:border-tayyib/20"}`}
                >
                  <span className="flex items-center gap-2"><Leaf className="h-4 w-4" /> طيبات</span>
                </button>
                <button
                  onClick={() => setActiveStatus("khabeeth")}
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-colors ${activeStatus === "khabeeth" ? "bg-khabeeth text-khabeeth-foreground border-khabeeth" : "hover:bg-khabeeth/10 hover:border-khabeeth/20"}`}
                >
                  <span className="flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> خبائث</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">الأقسام</h3>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={activeCategory === "all" ? "default" : "outline"}
                  className="cursor-pointer text-sm py-1.5 px-3"
                  onClick={() => setActiveCategory("all")}
                >
                  الكل
                </Badge>
                {categories?.map((cat) => (
                  <Badge 
                    key={cat.name}
                    variant={activeCategory === cat.name ? "default" : "outline"}
                    className="cursor-pointer text-sm py-1.5 px-3"
                    onClick={() => setActiveCategory(cat.name)}
                  >
                    {cat.nameAr || cat.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : foodsResponse?.items.length === 0 ? (
              <div className="text-center py-24 bg-muted/30 rounded-2xl border border-border border-dashed">
                <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-bold">لم نجد أي أطعمة</h3>
                <p className="text-muted-foreground">جرب كلمات بحث مختلفة</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {foodsResponse?.items.map((food, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={food.id} 
                    className="bg-card border border-card-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline" className="bg-muted text-xs">
                          {food.category}
                        </Badge>
                        <Badge 
                          className={food.status === 'tayyib' 
                            ? "bg-tayyib/10 text-tayyib hover:bg-tayyib/20 border-0" 
                            : "bg-khabeeth/10 text-khabeeth hover:bg-khabeeth/20 border-0"
                          }
                        >
                          {food.status === 'tayyib' ? 'طيب' : 'خبيث'}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg mb-1">{food.nameAr || food.name}</h3>
                      {food.descriptionAr && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {food.descriptionAr}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
