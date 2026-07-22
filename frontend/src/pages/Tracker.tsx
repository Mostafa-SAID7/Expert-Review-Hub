import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import {
  useGetTodaysSummary,
  useListTrackerEntries,
  useCreateTrackerEntry,
  useDeleteTrackerEntry,
  getGetTodaysSummaryQueryKey,
  getListTrackerEntriesQueryKey,
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/notifications-context";
import { useLang } from "@/contexts/lang-context";
import { Trash2, Plus, Droplets, Clock } from "lucide-react";

export default function Tracker() {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { t, lang } = useLang();

  const { data: summary, isLoading: loadingSummary } = useGetTodaysSummary();
  const { data: entries, isLoading: loadingEntries } = useListTrackerEntries({
    startDate: todayStr,
    endDate: todayStr,
  });

  const createEntry = useCreateTrackerEntry();
  const deleteEntry = useDeleteTrackerEntry();

  const [foodName, setFoodName] = useState("");
  const [foodStatus, setFoodStatus] = useState<"tayyib" | "khabeeth">("tayyib");

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: getListTrackerEntriesQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetTodaysSummaryQueryKey() });
  };

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;
    createEntry.mutate(
      {
        data: {
          type: "meal",
          date: todayStr,
          foodName,
          foodStatus,
          time: format(new Date(), "HH:mm"),
        },
      },
      {
        onSuccess: () => {
          setFoodName("");
          refresh();
          toast({ title: t("notif_meal_added") });
          addNotification({ title: t("notif_meal_added"), body: foodName, icon: "meal" });
        },
      }
    );
  };

  const handleAddWater = () => {
    createEntry.mutate(
      {
        data: {
          type: "water",
          date: todayStr,
          waterMl: 250,
          time: format(new Date(), "HH:mm"),
        },
      },
      {
        onSuccess: () => {
          refresh();
          toast({ title: t("notif_water_added") });
          addNotification({ title: t("notif_water_added"), body: "250 ml", icon: "water" });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteEntry.mutate({ id }, { onSuccess: refresh });
  };

  const dateLocale = lang === "ar" ? ar : enUS;
  const dateStr = format(new Date(), "EEEE, d MMMM yyyy", { locale: dateLocale });

  return (
    <ProtectedRoute>
      <div className="container px-4 max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-serif font-bold mb-1">{t("tracker_title")}</h1>
        <p className="text-muted-foreground mb-8 text-sm">{dateStr}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {loadingSummary ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card p-4 rounded-xl border shadow-sm flex flex-col items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-12" />
              </div>
            ))
          ) : (
            <>
              <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center">
                <div className="text-sm text-muted-foreground mb-1">{t("tracker_tayyib")}</div>
                <div className="text-3xl font-bold text-tayyib">{summary?.tayyibCount ?? 0}</div>
              </div>
              <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center">
                <div className="text-sm text-muted-foreground mb-1">{t("tracker_khabeeth")}</div>
                <div className="text-3xl font-bold text-khabeeth">{summary?.khabeethCount ?? 0}</div>
              </div>
              <div
                className="bg-card p-4 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={handleAddWater}
              >
                <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Droplets className="h-4 w-4 text-chart-3" />
                  {t("tracker_water")}
                </div>
                <div className="text-3xl font-bold" style={{ color: "hsl(var(--chart-3))" }}>
                  {summary?.waterMl ?? 0}
                  <span className="text-sm font-normal"> {t("tracker_water_short")}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{t("tracker_water_add")}</div>
              </div>
              <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center">
                <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {t("tracker_fasting")}
                </div>
                <div className="text-3xl font-bold">
                  {summary?.fastingHours ?? 0}
                  <span className="text-sm font-normal"> {t("tracker_hours")}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Add Meal Form */}
        <div className="bg-card rounded-2xl border shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">{t("tracker_add_meal")}</h2>
          <form onSubmit={handleAddMeal} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t("tracker_what_ate")}
                value={foodName}
                onChange={e => setFoodName(e.target.value)}
                className="w-full"
                autoComplete="off"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={foodStatus === "tayyib" ? "default" : "outline"}
                className={foodStatus === "tayyib" ? "bg-tayyib hover:bg-tayyib/90 border-tayyib" : ""}
                onClick={() => setFoodStatus("tayyib")}
              >
                {t("tracker_tayyib_btn")}
              </Button>
              <Button
                type="button"
                variant={foodStatus === "khabeeth" ? "default" : "outline"}
                className={foodStatus === "khabeeth" ? "bg-khabeeth hover:bg-khabeeth/90 border-khabeeth" : ""}
                onClick={() => setFoodStatus("khabeeth")}
              >
                {t("tracker_khabeeth_btn")}
              </Button>
            </div>
            <Button type="submit" disabled={!foodName.trim() || createEntry.isPending}>
              <Plus className="h-4 w-4 ml-2" />
              {t("tracker_add_btn")}
            </Button>
          </form>
        </div>

        {/* Log */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">{t("tracker_log_title")}</h2>
          {loadingEntries ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 bg-card border rounded-xl shadow-sm flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>
              ))}
            </div>
          ) : !entries?.length ? (
            <div className="text-center py-12 text-muted-foreground border rounded-xl bg-muted/10">
              {t("tracker_empty")}
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map(entry => (
                <div
                  key={entry.id}
                  className="p-4 bg-card border rounded-xl shadow-sm flex justify-between items-center group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xl flex-shrink-0">
                      {entry.type === "water" ? "💧" : entry.type === "meal" ? "🍽️" : "⏱️"}
                    </div>
                    <div>
                      <div className="font-bold">
                        {entry.foodName || (entry.type === "water" ? t("notif_water_added") : t("tracker_fasting"))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.time || "00:00"}
                        {entry.waterMl ? ` — ${entry.waterMl} ${t("tracker_water_short")}` : ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {entry.foodStatus && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          entry.foodStatus === "tayyib"
                            ? "bg-tayyib/10 text-tayyib"
                            : "bg-khabeeth/10 text-khabeeth"
                        }`}
                      >
                        {entry.foodStatus === "tayyib" ? t("tracker_tayyib_btn") : t("tracker_khabeeth_btn")}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 text-destructive transition-opacity"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
