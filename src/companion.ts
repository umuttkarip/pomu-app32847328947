// Companion message system — rule-based, no API needed.
// Philosophy: messages are rare and feel like gifts.

import { getTasks, getStreak, todayStr } from './storage';

const KEYS = {
  lastMessageDate: 'pomu_last_msg_date',
  lastMessageIndex: 'pomu_last_msg_idx',
  taskCompletedCount: 'pomu_completed_today',
};

// ── Morning greetings (shown once per day on first open) ─────────────────────
const MORNING_MESSAGES = [
  'Günaydın! Bugün ne yapıyoruz? 🌱',
  'Hazır mısın? Ben hazırım! ✨',
  'Bugün harika şeyler yapacağız 💪',
  'Yeni bir gün, yeni bir başlangıç! 🌤️',
  'Seninle çalışmayı seviyorum 🥰',
];

const AFTERNOON_MESSAGES = [
  'Öğleden sonra enerjin nasıl? ⚡',
  'Bir mola verdik mi? ☕',
  'Devam edelim mi? 🎯',
];

const EVENING_MESSAGES = [
  'Bugün çok çalıştık 🌙',
  'Akşam seansı başlasın! 🌟',
  'Gece çalışmak bazen en iyisi 🦉',
];

// ── Task completion reactions (randomized, not every time) ───────────────────
const COMPLETION_REACTIONS = [
  'Süper! 🎉',
  'Harika iş! ✨',
  'Bir tane daha! 💪',
  'Bunu bekledim! 🥳',
  null, // sometimes Pomu stays silent
  null, // silence is golden
  'Devam et! 🔥',
  'Gurur duyuyorum 🥰',
];

// ── Streak messages ──────────────────────────────────────────────────────────
const STREAK_MESSAGES: Record<number, string> = {
  3:  '3 gün üst üste! Alışkanlık oluşuyor 🌱',
  7:  'Bir hafta! Artık bir rutinimiz var 🔥',
  14: 'İki hafta! Sen gerçekten kararlısın 💎',
  30: '30 gün! Efsane oluyoruz 🏆',
};

// ── All-done messages ────────────────────────────────────────────────────────
const ALL_DONE_MESSAGES = [
  'Hepsini bitirdin! Bugün çok iyiydin 🎊',
  'Tüm görevler tamam! Gurur duyuyorum 🥰',
  'Bugünlük bitti! Hak ettin 🌟',
];

// ── Focus start messages ─────────────────────────────────────────────────────
const FOCUS_START_MESSAGES: Record<string, string[]> = {
  Health:   ['Hadi spor yapalım! 🏃', 'Ben de seninle yapıyorum! 💪', 'Hazır mısın? Başlıyoruz! 🔥'],
  Study:    ['Birlikte çalışalım 📚', 'Odaklan, ben de odaklanıyorum ✏️', 'Ders zamanı! 🎓'],
  Work:     ['Çalışma moduna geçtik 💻', 'Odak zamanı! 🎯', 'Birlikte üretelim ✨'],
  Creative: ['Yaratıcı mod açık! 🎨', 'Hayal gücünü serbest bırak 🌈', 'Birlikte bir şeyler yaratalım ✨'],
  Personal: ['Hadi halledelim! ✅', 'Seninleyim 🤝', 'Birlikte yaparsak kolay 💪'],
};

// ── Break messages ───────────────────────────────────────────────────────────
const BREAK_MESSAGES = [
  'Mola zamanı! Ben de dinleniyorum ☕',
  'Biraz nefes alalım 🌿',
  'Hak ettin bu molayı 😌',
  'Gözlerini dinlendir, ben buradayım 💤',
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getHour(): number {
  return new Date().getHours();
}

function todayMessageShown(): boolean {
  return localStorage.getItem(KEYS.lastMessageDate) === todayStr();
}

function markTodayMessageShown(): void {
  localStorage.setItem(KEYS.lastMessageDate, todayStr());
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Called on Home screen mount — returns a greeting if not shown today */
export function getDailyGreeting(): string | null {
  if (todayMessageShown()) return null;
  markTodayMessageShown();
  const h = getHour();
  if (h < 12) return pickRandom(MORNING_MESSAGES);
  if (h < 17) return pickRandom(AFTERNOON_MESSAGES);
  return pickRandom(EVENING_MESSAGES);
}

/** Called when a task is completed — sometimes returns a message, sometimes null */
export function getCompletionReaction(): string | null {
  // Check if all tasks done
  const tasks = getTasks();
  const today = todayStr();
  const todayTasks = tasks.filter(t => t.dueDate === today);
  const doneTasks = todayTasks.filter(t => t.status === 'done');

  if (todayTasks.length > 0 && doneTasks.length === todayTasks.length) {
    return pickRandom(ALL_DONE_MESSAGES);
  }

  return pickRandom(COMPLETION_REACTIONS);
}

/** Called when streak milestone is hit */
export function getStreakMessage(streak: number): string | null {
  return STREAK_MESSAGES[streak] ?? null;
}

/** Called when focus session starts */
export function getFocusStartMessage(category: string): string {
  const msgs = FOCUS_START_MESSAGES[category] ?? FOCUS_START_MESSAGES['Work'];
  return pickRandom(msgs);
}

/** Called when break starts */
export function getBreakMessage(): string {
  return pickRandom(BREAK_MESSAGES);
}

/** Pomu mood based on task category during focus */
export type PomuFocusMood = 'sport' | 'reading' | 'working' | 'curious';
export function getFocusMood(category: string): PomuFocusMood {
  if (category === 'Health') return 'sport';
  if (category === 'Study') return 'reading';
  if (category === 'Work') return 'working';
  if (category === 'Creative') return 'curious';
  return 'working';
}
