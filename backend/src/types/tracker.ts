/**
 * Tracker Domain Types
 * Single Responsibility: Food tracking and entry type definitions only
 */

export interface TrackerEntry {
  id: string;
  userId: string;
  foodId: string;
  foodStatus: string;
  type: string;
  date: Date;
  created_at?: Date;
}

export interface TrackerEntryInput {
  foodId: string;
  foodStatus: TrackerEntryInputFoodStatus;
  type: TrackerEntryInputType;
  date: Date;
}

export interface TrackerEntryInputFoodStatus {
  value: string;
}

export interface TrackerEntryInputType {
  value: string;
}

export interface TrackerEntryType {
  value: string;
}

export interface TrackerEntryUpdate {
  foodId?: string;
  type?: TrackerEntryUpdateType;
  date?: Date;
}

export interface TrackerEntryUpdateType {
  value: string;
}

export interface ListTrackerEntriesParams {
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface WeightLog {
  id: string;
  userId: string;
  weight: number;
  unit: string;
  date: Date;
  created_at?: Date;
}

export interface WeightLogInput {
  weight: number;
  unit: string;
  date: Date;
}

export interface ListWeightLogsParams {
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}
