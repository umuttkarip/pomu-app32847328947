import { useEffect, useRef, useState } from 'react';
import type { Task } from '../types';
import { BottomNav } from '../components/BottomNav';
import { Toast } from '../components/Toast';
import { Confetti } from '../components/Confetti';
import { CompanionBubble } from '../components/CompanionBubble';
import { getTasks, saveTasks, getUserName, getStreak, updateStreakForToday, todayStr } from '../storage';
import { getDailyGreeting, getCompletionReaction, getStreakMessage } from '../companion';
import type { Tab } from '../types';

interface Props {
  onTabChange: (tab: Tab) => void;
  onStartFocus: (task: Task) => void;
}

const CELEBRATION_KEY = 'pomu_celebrated_date';

function getGreeting(name: string): string {
  const h = new Date().getHours();
  const suffix = name ? `, ${name}` : '';
  if (h < 12) return `Günaydın${suffix}`;
  if (h < 17) return `İyi günler${suffix}`;
  return `İyi akşamlar${suffix}`;
}

function formatDate(): string {
  return new Date().toLocaleDateString('tr-TR', { weekday: 'long', month: 'long', day: 'numeric' });
}

function pomuImage(done: number, total: number): string {
  if (total === 0) return '/images/sleeping.png';
  if (done === total) return '/images/jumping.png';
  if (done > 0) return '/images/reading.png';
  return '/images/wawing.png';
}

export function Home({ onTabChange, onStartFocus }: Props) {
  const [tasks, setTasks] = useState<Task[]>(() => getTasks());
  const [toast, setToast] = useState<string | null>(null);
  const [allDoneCelebration, setAllDoneCelebration] = useState(false);
  const [streak, setStreak] = useState(() => getStreak());
  const [bubbleMsg, setBubbleMsg] = useState<string | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  // Track whether we've triggered celebration this session
  const celebratedRef = useRef(false);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const userName = getUserName();
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr());
  const doneTasks = todayTasks.filter((t) => t.status === 'done');
  const total = todayTasks.length;
  const done = doneTasks.length;
  const progress = total > 0 ? done / total : 0;

  function showBubble(msg: string, duration = 3500) {
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    setBubbleMsg(msg);
    setBubbleVisible(true);
    bubbleTimer.current = setTimeout(() => setBubbleVisible(false), duration);
  }

  // Daily greeting — once per day
  useEffect(() => {
    const greeting = getDailyGreeting();
    if (greeting) {
      setTimeout(() => showBubble(greeting, 4000), 800);
    }
    // If tasks are already all done when we open the app, don't celebrate again
    if (total > 0 && done === total) {
      celebratedRef.current = true;
    }
    return () => { if (bubbleTimer.current) clearTimeout(bubbleTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // All-done celebration — only once per day, only when the LAST task is checked off
  function triggerCelebration() {
    const today = todayStr();
    if (localStorage.getItem(CELEBRATION_KEY) === today) return; // already celebrated today
    localStorage.setItem(CELEBRATION_KEY, today);

    const s = updateStreakForToday();
    setStreak(s);
    setAllDoneCelebration(true);
    setTimeout(() => setAllDoneCelebration(false), 3000);

    const streakMsg = getStreakMessage(s.current);
    if (streakMsg) setTimeout(() => showBubble(streakMsg, 4000), 3200);
  }

  function toggleTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    const updated = tasks.map((t) => {
      if (t.id !== id) return t;
      const nowDone = t.status !== 'done';
      return { ...t, status: nowDone ? 'done' : 'active', completedAt: nowDone ? new Date().toISOString() : undefined } as Task;
    });
    setTasks(updated);
    saveTasks(updated);

    if (task && task.status === 'active') {
      const s = updateStreakForToday();
      setStreak(s);

      // Check if this was the last task
      const todayUpdated = updated.filter((t) => t.dueDate === todayStr());
      const allNowDone = todayUpdated.length > 0 && todayUpdated.every((t) => t.status === 'done');
      if (allNowDone) {
        triggerCelebration();
      } else {
        const reaction = getCompletionReaction();
        if (reaction) {
          setToast(reaction);
          showBubble(reaction, 2500);
        }
      }
    }
  }

  const R = 56;
  const circ = 2 * Math.PI * R;
  const previewTasks = todayTasks.slice(0, 4);
  const img = pomuImage(done, total);

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: '#F6FBFA',
      minHeight: '100dvh', height: '100%', width: '390px',
      overflow: 'hidden', position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* All-done celebration — brief overlay, then disappears */}
      {allDoneCelebration && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 50,
          background: 'rgba(246,251,250,0.94)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
        }}>
          <Confetti />
          <img src="/images/jumping.png" alt="Pomu"
            style={{ width: 160, height: 160, objectFit: 'contain', position: 'relative', zIndex: 11 }} />
          <div style={{ fontSize: 28, fontWeight: 800, color: '#264653', zIndex: 11 }}>Hepsini bitirdin! 🎉</div>
          <div style={{ fontSize: 16, color: '#8BADA8', fontWeight: 500, zIndex: 11 }}>Pomu seninle gurur duyuyor</div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '44px 24px 16px' }}>
        <div>
          <div style={{ fontSize: 13, color: '#8BADA8', fontWeight: 600, marginBottom: 2 }}>{formatDate()}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#264653', lineHeight: 1 }}>
            {getGreeting(userName)}
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#FFFFFF', border: '1px solid #E8F0EE',
          borderRadius: 20, padding: '6px 14px',
          boxShadow: '0 1px 8px rgba(38,70,83,0.05)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F6B089" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#264653' }}>{streak.current}</span>
        </div>
      </div>

      {/* Hero Pomu Card */}
      <div style={{
        margin: '8px 24px 0',
        background: 'linear-gradient(145deg, #EDF6F4 0%, #FFFFFF 100%)',
        borderRadius: 24, padding: '28px 24px 24px',
        boxShadow: '0 1px 8px rgba(38,70,83,0.05)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{ position: 'relative', width: 140, height: 140, marginBottom: 16 }}>
          <svg width="140" height="140" viewBox="0 0 140 140" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="70" cy="70" r={R} fill="none" stroke="#E4EFED" strokeWidth="7" />
            <circle
              cx="70" cy="70" r={R}
              fill="none" stroke="#9FC9C3" strokeWidth="7"
              strokeDasharray={`${circ * progress} ${circ}`}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              <CompanionBubble message={bubbleMsg} visible={bubbleVisible} />
              {/* Static image — no CSS animation */}
              <img src={img} alt="Pomu"
                style={{ width: 100, height: 100, objectFit: 'contain', display: 'block' }} />
            </div>
          </div>
        </div>

        <div style={{ fontSize: 18, fontWeight: 700, color: '#264653', marginBottom: 6 }}>
          {done} / {total} tamamlandı
        </div>
        <div style={{ fontSize: 13, color: '#8BADA8', fontWeight: 500 }}>
          {done === 0 && total === 0 ? 'Bugün görev ekle 🌱' :
           done === 0 ? 'Başlamaya hazır mısın?' :
           done === total ? 'Mükemmel bir gün! 🎉' : 'Devam et, neredeyse bitti!'}
        </div>
      </div>

      {/* Today's Tasks */}
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#264653' }}>Bugün</span>
          <button onClick={() => onTabChange('tasks')} style={{
            fontSize: 13, color: '#9FC9C3', fontWeight: 700,
            background: 'none', border: 'none', cursor: 'pointer',
          }}>Tümünü gör</button>
        </div>

        {previewTasks.length === 0 ? (
          <div style={{
            background: '#FFFFFF', borderRadius: 20,
            boxShadow: '0 1px 8px rgba(38,70,83,0.05)',
            padding: '28px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 14, color: '#8BADA8', fontWeight: 500 }}>Bugün için henüz görev yok</div>
            <div style={{ fontSize: 12, color: '#C8DEDA', fontWeight: 500, marginTop: 4 }}>Pomu seninle çalışmaya hazır 🌱</div>
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', borderRadius: 20, boxShadow: '0 1px 8px rgba(38,70,83,0.05)', overflow: 'hidden' }}>
            {previewTasks.map((task, i) => (
              <div key={task.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px',
                borderBottom: i < previewTasks.length - 1 ? '1px solid #F2F7F6' : 'none',
                opacity: task.status === 'done' ? 0.5 : 1,
                transition: 'opacity 0.3s',
              }}>
                <button
                  onClick={() => toggleTask(task.id)}
                  style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: task.status === 'done' ? '#9FC9C3' : 'transparent',
                    border: task.status === 'done' ? 'none' : '2px solid #C8DEDA',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', padding: 0,
                    transition: 'background 0.2s',
                  }}
                >
                  {task.status === 'done' && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                <span style={{
                  flex: 1, fontSize: 15, color: '#264653', fontWeight: 500,
                  textDecoration: task.status === 'done' ? 'line-through' : 'none',
                }}>
                  {task.name}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: task.categoryColor }} />
                  {task.priority === 'high' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF6C6C' }} />}
                  {task.priority === 'medium' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#F6B089' }} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Focus CTA */}
      {tasks.filter(t => t.status === 'active' && t.hasFocusTimer && t.dueDate === todayStr()).length > 0 && (
        <div style={{ padding: '16px 24px 0' }}>
          <button
            onClick={() => {
              const focusTask = tasks.find(t => t.status === 'active' && t.hasFocusTimer && t.dueDate === todayStr());
              if (focusTask) onStartFocus(focusTask);
            }}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 16,
              background: 'transparent', border: '2px solid #9FC9C3',
              cursor: 'pointer', fontSize: 15, fontWeight: 700, color: '#9FC9C3',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9FC9C3" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            Odak Seansı Başlat
          </button>
        </div>
      )}

      <div style={{ flex: 1 }} />
      <BottomNav active="home" onChange={onTabChange} />
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
