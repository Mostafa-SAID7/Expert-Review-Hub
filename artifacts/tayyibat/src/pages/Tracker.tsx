import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useGetTodaysSummary, useListTrackerEntries, useCreateTrackerEntry, useDeleteTrackerEntry, getGetTodaysSummaryQueryKey, getListTrackerEntriesQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Droplets, Clock } from "lucide-react";

export default function Tracker() {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: summary, isLoading: loadingSummary } = useGetTodaysSummary();
  const { data: entries, isLoading: loadingEntries } = useListTrackerEntries({ startDate: todayStr, endDate: todayStr });
  
  const createEntry = useCreateTrackerEntry();
  const deleteEntry = useDeleteTrackerEntry();

  const [foodName, setFoodName] = useState("");
  const [foodStatus, setFoodStatus] = useState<"tayyib" | "khabeeth">("tayyib");

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName) return;

    createEntry.mutate({
      data: {
        type: "meal",
        date: todayStr,
        foodName,
        foodStatus,
        time: format(new Date(), 'HH:mm')
      }
    }, {
      onSuccess: () => {
        setFoodName("");
        queryClient.invalidateQueries({ queryKey: getListTrackerEntriesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTodaysSummaryQueryKey() });
        toast({ title: "تم إضافة الوجبة بنجاح" });
      }
    });
  };

  const handleAddWater = () => {
    createEntry.mutate({
      data: {
        type: "water",
        date: todayStr,
        waterMl: 250,
        time: format(new Date(), 'HH:mm')
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetTodaysSummaryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListTrackerEntriesQueryKey() });
        toast({ title: "تم تسجيل شرب الماء" });
      }
    });
  };

  const handleDelete = (id: number) => {
    deleteEntry.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTrackerEntriesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTodaysSummaryQueryKey() });
        toast({ title: "تم الحذف بنجاح" });
      }
    });
  };

  return (
    <ProtectedRoute>
      <div className="container px-4 max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-serif font-bold mb-2">التتبع اليومي</h1>
        <p className="text-muted-foreground mb-8">
          {format(new Date(), 'EEEE, d MMMM yyyy', { locale: ar })}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center">
            <div className="text-sm text-muted-foreground mb-1">الطيبات</div>
            <div className="text-3xl font-bold text-tayyib">{summary?.tayyibCount || 0}</div>
          </div>
          <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center">
            <div className="text-sm text-muted-foreground mb-1">الخبائث</div>
            <div className="text-3xl font-bold text-khabeeth">{summary?.khabeethCount || 0}</div>
          </div>
          <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={handleAddWater}>
            <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1"><Droplets className="h-4 w-4 text-blue-500" /> الماء</div>
            <div className="text-3xl font-bold text-blue-500">{summary?.waterMl || 0} <span className="text-sm font-normal">مل</span></div>
            <div className="text-xs text-muted-foreground mt-1">+250 مل</div>
          </div>
          <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center">
            <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1"><Clock className="h-4 w-4" /> الصيام</div>
            <div className="text-3xl font-bold">{summary?.fastingHours || 0} <span className="text-sm font-normal">ساعة</span></div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">إضافة وجبة</h2>
          <form onSubmit={handleAddMeal} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder="ماذا أكلت؟" 
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                type="button"
                variant={foodStatus === 'tayyib' ? 'default' : 'outline'}
                className={foodStatus === 'tayyib' ? 'bg-tayyib hover:bg-tayyib/90' : ''}
                onClick={() => setFoodStatus('tayyib')}
              >
                طيب
              </Button>
              <Button 
                type="button"
                variant={foodStatus === 'khabeeth' ? 'default' : 'outline'}
                className={foodStatus === 'khabeeth' ? 'bg-khabeeth hover:bg-khabeeth/90' : ''}
                onClick={() => setFoodStatus('khabeeth')}
              >
                خبيث
              </Button>
            </div>
            <Button type="submit" disabled={!foodName || createEntry.isPending}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة
            </Button>
          </form>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">سجل اليوم</h2>
          {loadingEntries ? (
            <div className="text-center py-12">جاري التحميل...</div>
          ) : entries?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border rounded-xl bg-muted/10">
              لا توجد مدخلات اليوم
            </div>
          ) : (
            <div className="space-y-3">
              {entries?.map(entry => (
                <div key={entry.id} className="p-4 bg-card border rounded-xl shadow-sm flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xl">
                      {entry.type === 'water' ? '💧' : entry.type === 'meal' ? '🍽️' : '⏱️'}
                    </div>
                    <div>
                      <div className="font-bold">{entry.foodName || (entry.type === 'water' ? 'شرب ماء' : 'صيام')}</div>
                      <div className="text-sm text-muted-foreground">{entry.time || '00:00'} {entry.waterMl ? `- ${entry.waterMl} مل` : ''}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {entry.foodStatus && (
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${entry.foodStatus === 'tayyib' ? 'bg-tayyib/10 text-tayyib' : 'bg-khabeeth/10 text-khabeeth'}`}>
                        {entry.foodStatus === 'tayyib' ? 'طيب' : 'خبيث'}
                      </div>
                    )}
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-destructive" onClick={() => handleDelete(entry.id)}>
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
