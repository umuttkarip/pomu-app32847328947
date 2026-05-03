export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'active' | 'done';
export type Category = 'Work' | 'Personal' | 'Health' | 'Study' | 'Creative';

export interface Task {
  id: string;
  name: string;
  category: Category;
  categoryColor: string;
  priority: Priority;
  dueDate: string; // ISO date string YYYY-MM-DD
  hasFocusTimer: boolean;
  estimatedPomodoros: number;
  completedPomodoros: number;
  status: TaskStatus;
  completedAt?: string;
}

export interface AppSettings {
  focusDuration: number;   // minutes: 15/20/25/30
  breakDuration: number;   // minutes: 3/5/10
  reminders: boolean;
}

export interface StreakData {
  current: number;
  lastActiveDate: string; // YYYY-MM-DD
  history: string[];      // array of YYYY-MM-DD strings with activity
}

export type Screen = 'onboarding' | 'home' | 'tasks' | 'stats' | 'profile';
export type Tab = 'home' | 'tasks' | 'stats' | 'profile';
