import { BottomNav } from '../components/BottomNav';
import type { Tab } from '../types';

interface Props {
  name: string;
  taskAdded: boolean;
  onAddTask?: () => void;
  onTabChange: (tab: Tab) => void;
  onStartFocus: () => void;
}

function formatDate(): string {
  return new Date().toLocaleDateString('tr-TR', { weekday: 'long', month: 'long', day: 'numeric' });
}

function getGreeting(name: string): string {
  const h = new Date().getHours();
  const suffix = name ? `, ${name}` : '';
  if (h < 12) return `Günaydın${suffix}`;
  if (h < 17) return `İyi günler${suffix}`;
  return `İyi akşamlar${suffix}`;
}

export function DemoHome({ name, taskAdded, onAddTask, onTabChange, onStartFocus }: Props) {
  const R = 56;
  const circ = 2 * Math.PI * R;
  const progress = taskAdded ? 0.25 : 0.2;

  // Pomu görseli
  const pomuImg = taskAdded ? '/images/reading.png' : '/images/wawing2.png';
  const tasks = [
    { id: 'routine', name: 'Sabah rutini', done: true, color: '#A8D5C8' },
    { id: 'mail', name: 'E-postaları yanıtla', done: false, color: '#9FC9C3' },
    { id: 'shopping', name: 'Alışveriş listesi', done: false, color: '#F6B089' },
    ...(taskAdded ? [{ id: 'book', name: "Kürk Mantolu Madonna'yı oku", done: false, color: '#B5A8D5' }] : []),
  ];
  const done = tasks.filter((task) => task.done).length;

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: '#F6FBFA',
      minHeight: '100dvh', width: '390px',
      position: 'relative', display: 'flex', flexDirection: 'column',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '56px 24px 16px' }}>
        <div>
          <div style={{ fontSize: 13, color: '#8BADA8', fontWeight: 600, marginBottom: 2 }}>{formatDate()}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#264653', lineHeight: 1 }}>
            {getGreeting(name)}
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
          <span style={{ fontSize: 14, fontWeight: 800, color: '#264653' }}>6</span>
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
            <circle cx="70" cy="70" r={R} fill="none" stroke="#9FC9C3" strokeWidth="7"
              strokeDasharray={`${circ * progress} ${circ}`} strokeLinecap="round"
              transform="rotate(-90 70 70)" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={pomuImg} alt="Pomu"
              style={{ width: 100, height: 100, objectFit: 'contain', transition: 'opacity 0.4s' }} />
          </div>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#264653', marginBottom: 6 }}>
          {done} / {tasks.length} tamamlandı
        </div>
        <div style={{ fontSize: 13, color: '#8BADA8', fontWeight: 500 }}>
          {taskAdded ? 'Okuma görevi eklendi' : 'Bugün birkaç küçük iş var'}
        </div>
      </div>

      {/* Bugün */}
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#264653' }}>Bugün</span>
        </div>

        <div data-tour="task-list" style={{ background: '#FFFFFF', borderRadius: 20, boxShadow: '0 1px 8px rgba(38,70,83,0.05)', overflow: 'hidden' }}>
          {tasks.map((task, i) => (
            <button
              key={task.id}
              data-tour={task.id === 'book' ? 'book-task' : undefined}
              disabled={task.id !== 'book'}
              onClick={task.id === 'book' ? onAddTask : undefined}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px',
                border: 'none',
                borderBottom: i < tasks.length - 1 ? '1px solid #F2F7F6' : 'none',
                background: '#FFFFFF',
                cursor: task.id === 'book' ? 'pointer' : 'default',
                opacity: task.done ? 0.52 : 1,
                textAlign: 'left',
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                border: task.done ? 'none' : '2px solid #C8DEDA',
                background: task.done ? '#9FC9C3' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {task.done && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span style={{
                flex: 1,
                fontSize: 15,
                color: '#264653',
                fontWeight: 500,
                textDecoration: task.done ? 'line-through' : 'none',
              }}>
                {task.name}
              </span>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: task.color }} />
            </button>
          ))}
        </div>
      </div>

      {/* Focus CTA — görev eklendikten sonra */}
      {taskAdded && (
        <div style={{ padding: '16px 24px 0' }}>
          <button data-tour="focus-button" onClick={onStartFocus} style={{
            width: '100%', padding: '14px 0', borderRadius: 16,
            background: 'transparent', border: '2px solid #9FC9C3',
            cursor: 'pointer', fontSize: 15, fontWeight: 700, color: '#9FC9C3',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9FC9C3" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            Odak seansı başlat
          </button>
        </div>
      )}

      <div style={{ flex: 1 }} />
      <BottomNav active="home" onChange={onTabChange} />
    </div>
  );
}
