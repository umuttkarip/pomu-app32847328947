export type DemoStep =
  | 'welcome'        // 3 adımlı onboarding + isim
  | 'app-home'       // Uygulama home — mevcut görevler, kitap henüz yok
  | 'app-home-book-added' // Kitap görevi dış tur katmanıyla eklendi
  | 'pomu-chat'      // Pomu ile sohbet ekranı (tam sayfa)
  | 'app-home-2'     // Uygulama home — spotlight "Odak Seansı Başlat"
  | 'focus'          // Hızlandırılmış seans
  | 'focus-end'      // Seans sonrası küçük kutlama
  | 'app-stats'      // Stats ekranı — spotlight ile
  | 'app-profile'    // Profile — hafıza kartı spotlight
  | 'tour-end'       // Tur bitti, uygulama tanıtımı
  | 'feedback'       // Anket
  | 'done';          // Teşekkür (geç seçilince)

export interface DemoState {
  name: string;
  firstTimeReading: boolean | null;
  sessionChoice: 'curious' | 'slow' | 'unsure' | null;
  step: DemoStep;
}

// Demo için localStorage'a yazılacak görevler
export const DEMO_TASKS = [
  {
    id: 'demo-1',
    name: 'Sabah rutini',
    category: 'Health' as const,
    categoryColor: '#A8D5C8',
    priority: 'low' as const,
    dueDate: new Date().toISOString().slice(0, 10),
    hasFocusTimer: false,
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    status: 'done' as const,
    completedAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    name: 'E-postaları yanıtla',
    category: 'Work' as const,
    categoryColor: '#9FC9C3',
    priority: 'medium' as const,
    dueDate: new Date().toISOString().slice(0, 10),
    hasFocusTimer: true,
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    status: 'active' as const,
  },
  {
    id: 'demo-3',
    name: 'Alışveriş listesi',
    category: 'Personal' as const,
    categoryColor: '#F6B089',
    priority: 'low' as const,
    dueDate: new Date().toISOString().slice(0, 10),
    hasFocusTimer: false,
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    status: 'active' as const,
  },
];

export const DEMO_BOOK_TASK = {
  id: 'demo-book',
  name: "Kürk Mantolu Madonna'yı oku",
  category: 'Study' as const,
  categoryColor: '#B5A8D5',
  priority: 'medium' as const,
  dueDate: new Date().toISOString().slice(0, 10),
  hasFocusTimer: true,
  estimatedPomodoros: 1,
  completedPomodoros: 0,
  status: 'active' as const,
};

export const DEMO_STREAK = {
  current: 6,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  history: Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return [0,1,2,4,5,6,8,9,11,12,13,15,16,18,19,20,22,23,25,26,27,29].includes(i)
      ? d.toISOString().slice(0, 10)
      : null;
  }).filter(Boolean) as string[],
};

export const DEMO_STATS = {
  streak: 6,
  level: 3,
  levelName: 'Düzenli',
  xp: 8,
  xpMax: 24,
  weeklyData: [
    { day: 'Pzt', count: 2, isToday: false },
    { day: 'Sal', count: 1, isToday: false },
    { day: 'Çar', count: 3, isToday: false },
    { day: 'Per', count: 0, isToday: false },
    { day: 'Cum', count: 2, isToday: false },
    { day: 'Cmt', count: 1, isToday: false },
    { day: 'Paz', count: 1, isToday: true },
  ],
  history30: Array.from({ length: 30 }, (_, i) =>
    [0, 1, 2, 4, 5, 6, 8, 9, 11, 12, 13, 15, 16, 18, 19, 20, 22, 23, 25, 26, 27, 29].includes(29 - i)
  ),
};

export function initDemoStorage(name: string) {
  localStorage.setItem('pomu_tasks', JSON.stringify(DEMO_TASKS));
  localStorage.setItem('pomu_user_name', name);
  localStorage.setItem('pomu_onboarding_done', 'true');
  localStorage.setItem('pomu_streak', JSON.stringify(DEMO_STREAK));
}

export function addDemoBookTask() {
  const raw = localStorage.getItem('pomu_tasks');
  const tasks = raw ? JSON.parse(raw) : DEMO_TASKS;
  const exists = tasks.some((task: { id: string }) => task.id === DEMO_BOOK_TASK.id);
  if (!exists) {
    localStorage.setItem('pomu_tasks', JSON.stringify([...tasks, DEMO_BOOK_TASK]));
  }
}

export function saveFeedback(data: object) {
  localStorage.setItem('pomu_demo_feedback', JSON.stringify(data));
}
