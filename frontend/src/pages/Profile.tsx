import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useGetMe, useGetProfile, useUpdateProfile } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfileSkeleton } from "@/components/ui/page-skeleton";
import { useState, useEffect } from "react";

export default function Profile() {
  const { data: user, isLoading: loadingUser } = useGetMe();
  const { data: profile, isLoading: loadingProfile } = useGetProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();

  const [goal, setGoal] = useState<string>("general");
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [targetWeight, setTargetWeight] = useState<string>("");

  useEffect(() => {
    if (profile) {
      if (profile.goal) setGoal(profile.goal);
      if (profile.currentWeight) setCurrentWeight(profile.currentWeight.toString());
      if (profile.targetWeight) setTargetWeight(profile.targetWeight.toString());
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile.mutate(
      {
        data: {
          goal: goal as any,
          currentWeight: currentWeight ? Number(currentWeight) : undefined,
          targetWeight: targetWeight ? Number(targetWeight) : undefined,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "تم حفظ التغييرات بنجاح" });
        },
      }
    );
  };

  return (
    <ProtectedRoute>
      {loadingUser || loadingProfile ? (
        <ProfileSkeleton />
      ) : (
        <div className="container px-4 max-w-2xl mx-auto py-8">
          <h1 className="text-3xl font-serif font-bold mb-8">الملف الشخصي</h1>

          <div className="bg-card rounded-2xl border shadow-sm p-6 md:p-8 space-y-8">
            {/* Avatar + name */}
            <div className="flex items-center gap-4 pb-8 border-b">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <div className="text-xl font-bold">{user?.name}</div>
                <div className="text-muted-foreground" dir="ltr">{user?.email}</div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold">المعلومات الصحية</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">الهدف الصحي</label>
                  <Select value={goal} onValueChange={setGoal}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر هدفك" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">صحة عامة</SelectItem>
                      <SelectItem value="weight_loss">تخفيف الوزن</SelectItem>
                      <SelectItem value="energy">زيادة الطاقة</SelectItem>
                      <SelectItem value="diabetes">السيطرة على السكري</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">الوزن الحالي (كجم)</label>
                    <Input
                      type="number"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">الوزن المستهدف (كجم)</label>
                    <Input
                      type="number"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={updateProfile.isPending}
                className="w-full"
              >
                {updateProfile.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
