/**
 * Dashboard Domain Types
 * Single Responsibility: Dashboard and analytics type definitions only
 */

export interface DashboardSummary {
  todaySummary: TodaySummary;
  progressCharts: ProgressCharts;
  calendarData: CalendarDay[];
}

export interface TodaySummary {
  date: Date;
  totalCalories: number;
  mealsLogged: number;
  waterIntake: number;
}

export interface ProgressCharts {
  weight: ChartPoint[];
  calories: ChartPoint[];
  meals: ChartPoint[];
}

export interface ChartPoint {
  date: Date;
  value: number;
}

export interface CalendarDay {
  date: Date;
  caloriesLogged: number;
  mealsLogged: number;
}

export interface GetCalendarDataParams {
  startDate: Date;
  endDate: Date;
}

export interface GetProgressChartsParams {
  days: number;
}

export interface HealthStatus {
  status: "ok" | "error";
  timestamp: string;
  uptime: number;
}
