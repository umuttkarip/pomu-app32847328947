import { BottomNav } from '../components/BottomNav';
import { DEMO_STATS } from './demoState';
import type { Tab } from '../types';

interface Props {
  onTabChange: (tab: Tab) => void;
  onViewMemory: () => void;
}

export function DemoStats({ onTabChange, onViewMemory }: Props) {
  const { streak, level, levelName, xp, xpMax, weeklyData, history30 } = DEMO_STATS;
  const maxBar = Math.max(...weeklyData.map(d => d.count), 1);

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: '#F6FBFA',
      minHeight: '100dvh', height: '100%', width: '390px',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      <style>{`
        @keyframes pomu-demo-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(246,176,137,0.28), 0 4px 14px rgba(159,201,195,0.18); }
          50% { box-shadow: 0 0 0 8px rgba(246,176,137,0.08), 0 8px 24px rgba(159,201,195,0.24); }
        }
      `}</style>
      <div style={{ padding: '44px 24px 8px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: '#8BADA8', fontWeight: 600, marginBottom: 2 }}>İlerlemen</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#264653' }}>İstatistikler</div>
      </div>

      {/* Level */}
      <div style={{
        margin: '16px 24px 0',
        background: 'linear-gradient(145deg, #EDF6F4 0%, #FFFFFF 100%)',
        borderRadius: 24, padding: '24px',
        boxShadow: '0 1px 8px rgba(38,70,83,0.05)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <img src="/images/wawing2.png" alt="Pomu"
          style={{ width: 90, height: 90, objectFit: 'contain' }} />
        <div style={{ fontSize: 20, fontWeight: 800, color: '#264653', marginTop: 10 }}>
          Seviye {level} — {levelName}
        </div>
        <div style={{ fontSize: 13, color: '#8BADA8', fontWeight: 500, marginBottom: 12 }}>
          {xp} / {xpMax} XP — sonraki seviyeye
        </div>
        <div style={{ width: '100%', height: 8, background: '#E4EFED', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${(xp / xpMax) * 100}%`,
            background: '#9FC9C3', borderRadius: 4,
          }} />
        </div>
      </div>

      {/* Haftalık grafik */}
      <div style={{
        margin: '16px 24px 0', background: '#FFFFFF', borderRadius: 20,
        boxShadow: '0 1px 8px rgba(38,70,83,0.05)', padding: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#264653' }}>Bu hafta</span>
          <span style={{ fontSize: 13, color: '#8BADA8', fontWeight: 600 }}>
            {weeklyData.reduce((s, d) => s + d.count, 0)} görev
          </span>
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
                minHeight: 4,
              }} />
              <span style={{
                fontSize: 11, fontWeight: d.isToday ? 700 : 500,
                color: d.isToday ? '#F6B089' : '#8BADA8',
              }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Seri */}
      <div style={{
        margin: '16px 24px 0', background: '#FFFFFF', borderRadius: 20,
        boxShadow: '0 1px 8px rgba(38,70,83,0.05)', padding: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#264653' }}>Seri</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F6B089" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#264653' }}>{streak}</span>
            <span style={{ fontSize: 14, color: '#8BADA8', fontWeight: 600 }}>gün</span>
          </div>
        </div>
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

      {/* Hafıza butonu */}
      <div style={{ padding: '16px 24px 0' }}>
        <button data-tour="memory-button" onClick={onViewMemory} style={{
          width: '100%', padding: '14px 0', borderRadius: 16,
          background: '#FFFFFF', border: '2px solid #9FC9C3',
          cursor: 'pointer', fontSize: 15, fontWeight: 800, color: '#264653',
          animation: 'pomu-demo-pulse 1.8s ease-in-out infinite',
        }}>
          Pomu'nun hafızasına bak →
        </button>
      </div>

      <div style={{ flex: 1 }} />
      <BottomNav active="stats" onChange={onTabChange} />
    </div>
  );
}
