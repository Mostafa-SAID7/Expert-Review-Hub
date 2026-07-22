import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useGetDashboardSummary, useGetProgressCharts } from "@/lib/api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { DashboardSkeleton } from "@/components/ui/page-skeleton";
import { useLang } from "@/contexts/lang-context";

export default function Dashboard() {
  const { t } = useLang();

  // Dashboard data changes infrequently — 3-minute staleTime is fine
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary({
    query: { staleTime: 1000 * 60 * 3 } as any,
  });
  const { data: charts, isLoading: loadingCharts } = useGetProgressCharts(
    { days: 14 },
    { query: { staleTime: 1000 * 60 * 3 } as any },
  );

  const isLoading = loadingSummary || loadingCharts;

  return (
    <ProtectedRoute>
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="container px-4 max-w-6xl mx-auto py-8">
          <h1 className="text-3xl font-serif font-bold mb-8">{t("dashboard_title")}</h1>

          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-tayyib/10 border border-tayyib/20 p-6 rounded-2xl">
              <h3 className="text-sm font-medium text-tayyib mb-2">{t("dash_adherence")}</h3>
              <div className="text-4xl font-bold text-tayyib">
                {summary?.tayyibAdherencePercent ?? 0}%
              </div>
            </div>
            <div className="bg-card p-6 rounded-2xl border shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("dash_streak")}</h3>
              <div className="text-4xl font-bold">{summary?.currentStreak ?? 0}</div>
            </div>
            <div className="bg-card p-6 rounded-2xl border shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("dash_total")}</h3>
              <div className="text-4xl font-bold">{summary?.totalMealsLogged ?? 0}</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">{t("dash_chart_adherence")}</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts?.adherenceData ?? []}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                    <XAxis
                      dataKey="date"
                      strokeOpacity={0.5}
                      fontSize={12}
                      tickFormatter={(val) => val.split("-").slice(1).join("/")}
                    />
                    <YAxis strokeOpacity={0.5} fontSize={12} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        background: "hsl(var(--card))",
                        color: "hsl(var(--card-foreground))",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--tayyib))"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "hsl(var(--tayyib))" }}
                      activeDot={{ r: 6 }}
                      name={t("dash_adherence_pct")}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card rounded-2xl border shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">{t("dash_chart_water")}</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts?.waterData ?? []}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                    <XAxis
                      dataKey="date"
                      strokeOpacity={0.5}
                      fontSize={12}
                      tickFormatter={(val) => val.split("-").slice(1).join("/")}
                    />
                    <YAxis strokeOpacity={0.5} fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        background: "hsl(var(--card))",
                        color: "hsl(var(--card-foreground))",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="hsl(var(--chart-3))"
                      radius={[4, 4, 0, 0]}
                      name={t("dash_water_ml")}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
