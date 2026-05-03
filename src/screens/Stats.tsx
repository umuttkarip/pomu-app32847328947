import { getTasks, getStreak } from '../storage';
import { BottomNav } from '../components/BottomNav';
import type { Tab } from '../types';

interface Props {
  onTabChange: (tab: Tab) => void;
}

const LEVEL_NAMES = ['Tohum', 'Filiz', 'Fidan', 'Çiçek', 'Orman', 'Efsane'];
const XP_PER_LEVEL = 10;

function getLevelInfo(totalDone: number) {
  const level = Math.floor(totalDone / XP_PER_LEVEL);
  const xp = totalDone % XP_PER_LEVEL;
  const name = LEVEL_NAMES[Math.min(level, LEVEL_NAMES.length - 1)];
  return { level: level + 1, xp, name };
}

function getWeeklyData(): { day: string; count: number; isToday: boolean }[] {
  const tasks = getTasks();
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const today = new Date();
  const todayDay = today.getDay(); // 0=Sun
  // Map to Mon-Sun index
  const todayIdx = todayDay === 0 ? 6 : todayDay - 1;

  return days.map((day, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (todayIdx - i));
    const dateStr = d.toISOString().slice(0, 10);
    const count = tasks.filter(
      (t) => t.status === 'done' && t.completedAt && t.completedAt.slice(0, 10) === dateStr
    ).length;
    return { day, count, isToday: i === todayIdx };
  });
}

function get30DayHistory(): boolean[] {
  const streak = getStreak();
  const result: boolean[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    result.push(streak.history.includes(dateStr));
  }
  return result;
}

export function Stats({ onTabChange }: Props) {
  const tasks = getTasks();
  const streak = getStreak();
  const totalDone = tasks.filter((t) => t.status === 'done').length;
  const { level, xp, name } = getLevelInfo(totalDone);
  const weeklyData = getWeeklyData();
  const weekTotal = weeklyData.reduce((s, d) => s + d.count, 0);
  const maxBar = Math.max(...weeklyData.map((d) => d.count), 1);
  const history30 = get30DayHistory();

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: '#F6FBFA',
      minHeight: '844px', width: '390px',
      overflow: 'hidden', position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ padding: '56px 24px 8px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: '#8BADA8', fontWeight: 600, marginBottom: 2 }}>İlerlemen</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#264653' }}>İstatistikler</div>
      </div>

      {/* Pomu + Level */}
      <div style={{
        margin: '16px 24px 0',
        background: 'linear-gradient(145deg, #EDF6F4 0%, #FFFFFF 100%)',
        borderRadius: 24, padding: '24px',
        boxShadow: '0 1px 8px rgba(38,70,83,0.05)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <img src="/images/wawing2.png" alt="Pomu"
          style={{ width: 100, height: 100, objectFit: 'contain' }} />
        <div style={{ fontSize: 20, fontWeight: 800, color: '#264653', marginTop: 12 }}>
          Seviye {level} — {name}
        </div>
        <div style={{ fontSize: 13, color: '#8BADA8', fontWeight: 500, marginBottom: 12 }}>
          {xp} / {XP_PER_LEVEL} XP — sonraki seviyeye
        </div>
        <div style={{ width: '100%', height: 8, background: '#E4EFED', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${(xp / XP_PER_LEVEL) * 100}%`,
            background: '#9FC9C3', borderRadius: 4, transition: 'width 0.6s ease',
          }} />
        </div>
      </div>

      {/* Weekly chart */}
      <div style={{
        margin: '16px 24px 0', background: '#FFFFFF', borderRadius: 20,
        boxShadow: '0 1px 8px rgba(38,70,83,0.05)', padding: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#264653' }}>Bu hafta</span>
          <span style={{ fontSize: 13, color: '#8BADA8', fontWeight: 600 }}>{weekTotal} görev</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
          {weeklyData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: '100%',
                height: d.count > 0 ? `${(d.count / maxBar) * 64}px` : '4px',
                background: d.isToday ? '#F6B089' : '#9FC9C3',
                borderRadius: '4px 4px 0 0',
                opacity: d.count === 0 ? 0.3 : 1,
                transition: 'height 0.4s ease',
                minHeight: 4,
              }} />
              <span style={{
                fontSize: 11, fontWeight: d.isToday ? 700 : 500,
                color: d.isToday ? '#F6B089' : '#8BADA8',
              }}>
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Streak */}
      <div style={{
        margin: '16px 24px 0',
        background: '#FFFFFF', borderRadius: 20,
        boxShadow: '0 1px 8px rgba(38,70,83,0.05)',
        padding: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#264653' }}>Seri</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F6B089" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#264653' }}>{streak.current}</span>
            <span style={{ fontSize: 14, color: '#8BADA8', fontWeight: 600 }}>gün</span>
          </div>
        </div>
        {/* 30-day dot grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {history30.map((active, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: active ? '#9FC9C3' : '#E4EFED',
            }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#AABCB8', fontWeight: 500, marginTop: 8 }}>Son 30 gün</div>
      </div>

      <div style={{ flex: 1 }} />
      <BottomNav active="stats" onChange={onTabChange} />
    </div>
  );
}
