import type { Task, AppSettings, StreakData } from './types';

const KEYS = {
  onboardingDone: 'pomu_onboarding_done',
  userName: 'pomu_user_name',
  tasks: 'pomu_tasks',
  settings: 'pomu_settings',
  streak: 'pomu_streak',
};

// ── Onboarding ──────────────────────────────────────────────────────────────
export function isOnboardingDone(): boolean {
  return localStorage.getItem(KEYS.onboardingDone) === 'true';
}
export function setOnboardingDone(): void {
  localStorage.setItem(KEYS.onboardingDone, 'true');
}

// ── User name ────────────────────────────────────────────────────────────────
export function getUserName(): string {
  return localStorage.getItem(KEYS.userName) || '';
}
export function setUserName(name: string): void {
  localStorage.setItem(KEYS.userName, name);
}

// ── Tasks ────────────────────────────────────────────────────────────────────
const SAMPLE_TASKS: Task[] = [
  {
    id: 'seed-1',
    name: 'Design system review',
    category: 'Work',
    categoryColor: '#9FC9C3',
    priority: 'low',
    dueDate: todayStr(),
    hasFocusTimer: true,
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    status: 'active',
  },
  {
    id: 'seed-2',
    name: 'Call dentist',
    category: 'Personal',
    categoryColor: '#F6B089',
    priority: 'high',
    dueDate: todayStr(),
    hasFocusTimer: false,
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    status: 'active',
  },
  {
    id: 'seed-3',
    name: 'Morning run',
    category: 'Health',
    categoryColor: '#A8D5C8',
    priority: 'medium',
    dueDate: todayStr(),
    hasFocusTimer: true,
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    status: 'active',
  },
  {
    id: 'seed-4',
    name: 'Read design patterns book',
    category: 'Study',
    categoryColor: '#B5A8D5',
    priority: 'low',
    dueDate: tomorrowStr(),
    hasFocusTimer: true,
    estimatedPomodoros: 3,
    completedPomodoros: 0,
    status: 'active',
  },
  {
    id: 'seed-5',
    name: 'Sketch new app concept',
    category: 'Creative',
    categoryColor: '#F6C9A8',
    priority: 'medium',
    dueDate: tomorrowStr(),
    hasFocusTimer: true,
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    status: 'active',
  },
];

export function getTasks(): Task[] {
  const raw = localStorage.getItem(KEYS.tasks);
  if (!raw) {
    localStorage.setItem(KEYS.tasks, JSON.stringify(SAMPLE_TASKS));
    return SAMPLE_TASKS;
  }
  return JSON.parse(raw) as Task[];
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(KEYS.tasks, JSON.stringify(tasks));
}

// ── Settings ─────────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS: AppSettings = {
  focusDuration: 25,
  breakDuration: 5,
  reminders: true,
};

export function getSettings(): AppSettings {
  const raw = localStorage.getItem(KEYS.settings);
  if (!raw) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
}

export function saveSettings(s: AppSettings): void {
  localStorage.setItem(KEYS.settings, JSON.stringify(s));
}

// ── Streak ───────────────────────────────────────────────────────────────────
const DEFAULT_STREAK: StreakData = {
  current: 0,
  lastActiveDate: '',
  history: [],
};

export function getStreak(): StreakData {
  const raw = localStorage.getItem(KEYS.streak);
  if (!raw) return DEFAULT_STREAK;
  return JSON.parse(raw) as StreakData;
}

export function saveStreak(s: StreakData): void {
  localStorage.setItem(KEYS.streak, JSON.stringify(s));
}

export function updateStreakForToday(): StreakData {
  const streak = getStreak();
  const today = todayStr();
  const yesterday = yesterdayStr();

  if (streak.lastActiveDate === today) return streak; // already counted

  const newHistory = streak.history.includes(today)
    ? streak.history
    : [...streak.history, today];

  let newCurrent: number;
  if (streak.lastActiveDate === yesterday) {
    newCurrent = streak.current + 1;
  } else if (streak.lastActiveDate === '') {
    newCurrent = 1;
  } else {
    newCurrent = 1; // reset
  }

  const updated: StreakData = {
    current: newCurrent,
    lastActiveDate: today,
    history: newHistory,
  };
  saveStreak(updated);
  return updated;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
