import { useState } from "react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import {
  useListMealPlans,
  useCreateMealPlan,
  useUpdateMealPlan,
  useDeleteMealPlan,
  getListMealPlansQueryKey,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar, Target, Trash2, CheckCircle, ChevronRight, Utensils, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MealPlansSkeleton } from "@/components/ui/page-skeleton";

const DAYS_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const MEAL_TIMES_AR: Record<string, string> = {
  breakfast: "الإفطار",
  lunch: "الغداء",
  dinner: "العشاء",
  snack: "وجبة خفيفة",
};
const GOAL_LABELS: Record<string, { ar: string; color: string }> = {
  weight_loss: { ar: "تخسيس الوزن", color: "bg-orange-100 text-orange-700 border-orange-200" },
  diabetes:    { ar: "مرضى السكري", color: "bg-blue-100 text-blue-700 border-blue-200" },
  energy:      { ar: "تعزيز الطاقة", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  general:     { ar: "عام / صحة عامة", color: "bg-green-100 text-green-700 border-green-200" },
};

const createSchema = z.object({
  title: z.string().min(2, "اسم الخطة مطلوب"),
  goal: z.enum(["weight_loss", "diabetes", "energy", "general"]),
  startDate: z.string().min(1, "تاريخ البداية مطلوب"),
  notes: z.string().optional(),
});

type CreateForm = z.infer<typeof createSchema>;

// Predefined sample plan entries for demonstration
const SAMPLE_ENTRIES: Record<string, Array<{ dayOfWeek: number; mealTime: string; foodName: string; quantity: string }>> = {
  weight_loss: [
    { dayOfWeek: 0, mealTime: "breakfast", foodName: "شوفان بالتمر والعسل", quantity: "كوب واحد" },
    { dayOfWeek: 0, mealTime: "lunch", foodName: "سلطة خضراء مع سمك مشوي", quantity: "حصة متوسطة" },
    { dayOfWeek: 0, mealTime: "dinner", foodName: "شوربة العدس بالكركم", quantity: "طبق كبير" },
    { dayOfWeek: 1, mealTime: "breakfast", foodName: "بيض مسلوق مع خضار", quantity: "بيضتان" },
    { dayOfWeek: 1, mealTime: "lunch", foodName: "دجاج مشوي بحبة البركة", quantity: "صدر دجاج" },
    { dayOfWeek: 1, mealTime: "dinner", foodName: "خضار مطبوخة بزيت الزيتون", quantity: "طبق كبير" },
    { dayOfWeek: 2, mealTime: "breakfast", foodName: "عصيدة الشعير بالعسل", quantity: "وعاء صغير" },
    { dayOfWeek: 2, mealTime: "lunch", foodName: "سمك مع أرز بني", quantity: "حصة متوسطة" },
    { dayOfWeek: 2, mealTime: "dinner", foodName: "سلطة التين والجوز", quantity: "طبق متوسط" },
  ],
  general: [
    { dayOfWeek: 0, mealTime: "breakfast", foodName: "عسل النحل مع خبز القمح الكامل", quantity: "ملعقتان كبيرتان" },
    { dayOfWeek: 0, mealTime: "lunch", foodName: "دجاج مطبوخ مع خضروات", quantity: "حصة متوسطة" },
    { dayOfWeek: 0, mealTime: "snack", foodName: "تمر مع اللوز", quantity: "٣ تمرات + حفنة لوز" },
    { dayOfWeek: 0, mealTime: "dinner", foodName: "شوربة خضار طازجة", quantity: "طبق كبير" },
    { dayOfWeek: 1, mealTime: "breakfast", foodName: "شوفان بالموز والعسل", quantity: "كوب واحد" },
    { dayOfWeek: 1, mealTime: "lunch", foodName: "سمك مشوي مع سلطة", quantity: "حصة متوسطة" },
    { dayOfWeek: 1, mealTime: "snack", foodName: "رمان طازج", quantity: "نصف رمانة" },
    { dayOfWeek: 1, mealTime: "dinner", foodName: "عدس بالكركم", quantity: "طبق متوسط" },
  ],
  energy: [
    { dayOfWeek: 0, mealTime: "breakfast", foodName: "كرات التمر واللوز", quantity: "٣ كرات" },
    { dayOfWeek: 0, mealTime: "lunch", foodName: "دجاج بالكركم والزنجبيل", quantity: "حصة كبيرة" },
    { dayOfWeek: 0, mealTime: "snack", foodName: "عسل أبيض مع خبز", quantity: "ملعقة كبيرة" },
    { dayOfWeek: 0, mealTime: "dinner", foodName: "سمك مع بطاطا مشوية", quantity: "حصة متوسطة" },
  ],
  diabetes: [
    { dayOfWeek: 0, mealTime: "breakfast", foodName: "عصيدة الشعير بدون سكر", quantity: "وعاء صغير" },
    { dayOfWeek: 0, mealTime: "lunch", foodName: "سلطة خضراء مع دجاج", quantity: "حصة متوسطة" },
    { dayOfWeek: 0, mealTime: "dinner", foodName: "شوربة العدس الحمراء", quantity: "طبق متوسط" },
    { dayOfWeek: 1, mealTime: "breakfast", foodName: "بيض مسلوق مع خضار ورقية", quantity: "بيضتان" },
    { dayOfWeek: 1, mealTime: "lunch", foodName: "سمك مشوي مع خضار مطبوخة", quantity: "حصة متوسطة" },
    { dayOfWeek: 1, mealTime: "dinner", foodName: "حساء الخضار الطازجة", quantity: "طبق كبير" },
  ],
};

export default function MealPlans() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const { data: plans = [], isLoading } = useListMealPlans();
  const createPlan = useCreateMealPlan();
  const updatePlan = useUpdateMealPlan();
  const deletePlan = useDeleteMealPlan();

  const form = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      title: "",
      goal: "general",
      startDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);
  const todayEntries = selectedPlan?.entries?.filter(
    (e) => e.dayOfWeek === new Date().getDay()
  ) ?? [];

  async function onSubmit(values: CreateForm) {
    try {
      await createPlan.mutateAsync({ data: values });
      queryClient.invalidateQueries({ queryKey: getListMealPlansQueryKey() });
      toast({ title: "تم إنشاء الخطة بنجاح" });
      form.reset();
      setShowCreate(false);
    } catch {
      toast({ title: "حدث خطأ أثناء إنشاء الخطة", variant: "destructive" });
    }
  }

  async function toggleActive(id: number, current: boolean) {
    await updatePlan.mutateAsync({ id, data: { isActive: !current } });
    queryClient.invalidateQueries({ queryKey: getListMealPlansQueryKey() });
  }

  async function handleDelete(id: number) {
    await deletePlan.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListMealPlansQueryKey() });
    if (selectedPlanId === id) setSelectedPlanId(null);
    toast({ title: "تم حذف الخطة" });
  }

  // Merge real entries with sample entries for display
  function getDisplayEntries(plan: NonNullable<typeof selectedPlan>) {
    const real = plan.entries ?? [];
    if (real.length > 0) return real;
    return SAMPLE_ENTRIES[plan.goal] ?? SAMPLE_ENTRIES.general;
  }

  return (
    <ProtectedRoute>
      {isLoading ? <MealPlansSkeleton /> : <div className="container px-4 max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-1">خطط الوجبات</h1>
            <p className="text-muted-foreground text-sm">نظّم وجباتك الأسبوعية وفق أهدافك الصحية</p>
          </div>
          <Button onClick={() => setShowCreate(!showCreate)} data-testid="button-create-plan">
            <Plus className="h-4 w-4 ml-2" />
            خطة جديدة
          </Button>
        </div>

        {/* Create Plan Form */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold font-serif">إنشاء خطة جديدة</h2>
                  <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم الخطة</FormLabel>
                        <FormControl><Input placeholder="مثال: خطة رمضان الصحية" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="goal" render={({ field }) => (
                      <FormItem>
                        <FormLabel>الهدف الصحي</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="اختر الهدف" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(GOAL_LABELS).map(([k, v]) => (
                              <SelectItem key={k} value={k}>{v.ar}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="startDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel>تاريخ البداية</FormLabel>
                        <FormControl><Input type="date" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormLabel>ملاحظات (اختياري)</FormLabel>
                        <FormControl><Input placeholder="أي ملاحظات إضافية..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="md:col-span-2 flex gap-3">
                      <Button type="submit" disabled={createPlan.isPending} data-testid="button-submit-plan">
                        {createPlan.isPending ? "جاري الإنشاء..." : "إنشاء الخطة"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>إلغاء</Button>
                    </div>
                  </form>
                </Form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted rounded-2xl animate-pulse" />)}
          </div>
        ) : plans.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-card rounded-2xl border shadow-sm">
            <Calendar className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">لا توجد خطط بعد</h3>
            <p className="text-muted-foreground text-sm mb-5">أنشئ خطتك الأولى لتنظيم وجباتك الأسبوعية</p>
            <Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4 ml-2" />إنشاء خطة</Button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan, i) => {
                const goal = GOAL_LABELS[plan.goal] ?? GOAL_LABELS.general;
                const isSelected = selectedPlanId === plan.id;
                return (
                  <motion.div key={plan.id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className={`bg-card rounded-2xl border shadow-sm p-5 cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary border-primary" : ""}`}
                    onClick={() => setSelectedPlanId(isSelected ? null : plan.id)}
                    data-testid={`card-plan-${plan.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {plan.isActive && (
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse inline-block" />
                          )}
                          <h3 className="font-bold text-base truncate">{plan.titleAr || plan.title}</h3>
                        </div>
                        <Badge className={`text-xs ${goal.color} border`}>{goal.ar}</Badge>
                      </div>
                      <div className="flex items-center gap-1 mr-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => toggleActive(plan.id, plan.isActive ?? false)}
                          className={`p-1.5 rounded-lg transition-colors ${plan.isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"}`}
                          title={plan.isActive ? "إلغاء التفعيل" : "تفعيل"}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {plan.startDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Utensils className="h-3.5 w-3.5" />
                        {(plan.entries?.length ?? 0) > 0 ? `${plan.entries?.length} وجبة` : "وجبات افتراضية"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-primary font-medium">
                        {isSelected ? "عرض أقل" : "عرض التفاصيل"}
                      </span>
                      <ChevronRight className={`h-4 w-4 text-primary transition-transform ${isSelected ? "rotate-90" : ""}`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Selected Plan Detail */}
            <AnimatePresence>
              {selectedPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-card rounded-2xl border shadow-sm overflow-hidden"
                >
                  <div className="border-b border-border p-5 flex items-center justify-between bg-primary/5">
                    <div>
                      <h2 className="font-bold font-serif text-xl">{selectedPlan.titleAr || selectedPlan.title}</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {GOAL_LABELS[selectedPlan.goal]?.ar} · يبدأ {selectedPlan.startDate}
                      </p>
                    </div>
                    <Badge className={`${GOAL_LABELS[selectedPlan.goal]?.color} border`}>
                      <Target className="h-3 w-3 ml-1" />
                      {GOAL_LABELS[selectedPlan.goal]?.ar}
                    </Badge>
                  </div>

                  {/* Today's Meals */}
                  <div className="p-5 border-b border-border">
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-primary">
                      <Clock className="h-4 w-4" />
                      وجبات اليوم — {DAYS_AR[new Date().getDay()]}
                    </h3>
                    {(() => {
                      const displayEntries = getDisplayEntries(selectedPlan);
                      const todayDisplay = displayEntries.filter(e => e.dayOfWeek === new Date().getDay());
                      return todayDisplay.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          {["breakfast", "lunch", "dinner", "snack"].map(mt => {
                            const entry = todayDisplay.find(e => e.mealTime === mt);
                            return (
                              <div key={mt} className={`rounded-xl p-3 border ${entry ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-border"}`}>
                                <div className="text-xs font-medium text-muted-foreground mb-1">{MEAL_TIMES_AR[mt]}</div>
                                {entry ? (
                                  <>
                                    <div className="font-medium text-sm">{entry.foodName}</div>
                                    {entry.quantity && <div className="text-xs text-muted-foreground mt-0.5">{entry.quantity}</div>}
                                  </>
                                ) : (
                                  <div className="text-xs text-muted-foreground/60">لم تُحدد</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">لا توجد وجبات لهذا اليوم</p>
                      );
                    })()}
                  </div>

                  {/* Weekly Plan */}
                  <div className="p-5">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      الخطة الأسبوعية
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px] text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-right py-2 pr-2 font-medium text-muted-foreground w-24">اليوم</th>
                            {Object.keys(MEAL_TIMES_AR).map(mt => (
                              <th key={mt} className="text-right py-2 px-3 font-medium text-muted-foreground">{MEAL_TIMES_AR[mt]}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {DAYS_AR.map((day, dayIdx) => {
                            const displayEntries = getDisplayEntries(selectedPlan);
                            const dayEntries = displayEntries.filter(e => e.dayOfWeek === dayIdx);
                            const isToday = dayIdx === new Date().getDay();
                            return (
                              <tr key={dayIdx} className={`border-b border-border/50 ${isToday ? "bg-primary/5" : "hover:bg-muted/30"} transition-colors`}>
                                <td className="py-3 pr-2">
                                  <span className={`font-medium ${isToday ? "text-primary" : ""}`}>{day}</span>
                                  {isToday && <span className="text-xs text-primary mr-1">(اليوم)</span>}
                                </td>
                                {Object.keys(MEAL_TIMES_AR).map(mt => {
                                  const entry = dayEntries.find(e => e.mealTime === mt);
                                  return (
                                    <td key={mt} className="py-3 px-3">
                                      {entry ? (
                                        <div>
                                          <div className="font-medium text-foreground/90">{entry.foodName}</div>
                                          {entry.quantity && <div className="text-xs text-muted-foreground">{entry.quantity}</div>}
                                        </div>
                                      ) : (
                                        <span className="text-muted-foreground/40 text-xs">—</span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>}
    </ProtectedRoute>
  );
}
