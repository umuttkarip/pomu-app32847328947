import { Confetti } from '../components/Confetti';

interface Props {
  onViewStats: () => void;
  onHome: () => void;
}

export function DemoFocusEnd({ onViewStats, onHome }: Props) {
  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: '#1E3A3A',
      minHeight: '844px', width: '390px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 16,
      position: 'relative', overflow: 'hidden',
    }}>
      <Confetti />

      <img src="/images/jumping.png" alt="Pomu"
        style={{ width: 140, height: 140, objectFit: 'contain', position: 'relative', zIndex: 11 }} />

      <div style={{ textAlign: 'center', zIndex: 11 }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>
          Okuma kaydedildi
        </div>
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
          Pomu seninle gurur duyuyor.
        </div>
      </div>

      <div style={{ width: '100%', padding: '24px 24px 0', display: 'flex', flexDirection: 'column', gap: 12, zIndex: 11 }}>
        <div style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.55)',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 2,
        }}>
          Turun sonraki adımı ilerleme ekranı.
        </div>
        <button onClick={onViewStats} style={{
          width: '100%', padding: '16px 0', borderRadius: 16,
          background: '#9FC9C3', border: 'none', cursor: 'pointer',
          fontSize: 16, fontWeight: 700, color: '#264653',
          boxShadow: '0 0 0 4px rgba(159,201,195,0.16), 0 8px 24px rgba(0,0,0,0.18)',
        }}>
          İlerlemeni gör
        </button>
        <button disabled onClick={onHome} style={{
          width: '100%', padding: '16px 0', borderRadius: 16,
          background: 'transparent', border: '1.5px solid rgba(255,255,255,0.25)',
          cursor: 'default', fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.28)',
          opacity: 0.65,
        }}>
          Ana sayfaya dön
        </button>
      </div>
    </div>
  );
}
