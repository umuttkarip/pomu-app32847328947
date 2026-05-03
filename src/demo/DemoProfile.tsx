import { BottomNav } from '../components/BottomNav';
import type { Tab } from '../types';

interface Props {
  name: string;
  firstTimeReading: boolean | null;
  sessionChoice: 'curious' | 'slow' | 'unsure' | null;
  onTabChange: (tab: Tab) => void;
}

export function DemoProfile({ name, firstTimeReading, sessionChoice, onTabChange }: Props) {
  const readingState = firstTimeReading === true
    ? 'ilk kez okuyormuş'
    : firstTimeReading === false
    ? 'daha önce de okumuş'
    : 'okumaya başlamış';

  const sessionState = sessionChoice === 'curious'
    ? 'okuma iyi gidiyormuş'
    : sessionChoice === 'slow'
    ? 'okuma fena değilmiş'
    : sessionChoice === 'unsure'
    ? 'kitap hakkında henüz karar vermemiş'
    : 'ilk okuma seansını tamamlamış';

  const memoryText = `${name} şu an Kürk Mantolu Madonna okuyor; bu kitabı ${readingState}. Bugünkü kısa odaklanmadan sonra ${sessionState}. Ayrıca 6 günlük bir serisi ve tamamladığı sabah rutini var.`;

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: '#F6FBFA',
      minHeight: '100dvh', width: '390px',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
    }}>
      <div style={{ padding: '50px 24px 8px', textAlign: 'center' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#264653' }}>Profil</div>
      </div>

      {/* Pomu + isim */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 24px 0' }}>
        <img src="/images/wawing.png" alt="Pomu"
          style={{ width: 82, height: 82, objectFit: 'contain' }} />
        <div style={{ fontSize: 22, fontWeight: 800, color: '#264653', marginTop: 10 }}>{name}</div>
      </div>

      {/* Stats grid */}
      <div style={{ margin: '16px 24px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: 'Toplam görev', value: '13' },
          { label: 'Odak saati', value: '4.2s' },
          { label: 'En uzun seri', value: '6🔥' },
          { label: 'Seviye', value: '3 · Düzenli' },
        ].map((s, i) => (
          <div key={i} style={{
            background: '#FFFFFF', borderRadius: 16, padding: '14px',
            boxShadow: '0 1px 8px rgba(38,70,83,0.05)',
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#264653', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#8BADA8', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Hafıza kartı */}
      <div data-tour="memory-card" style={{
        margin: '18px 24px 0',
        background: '#FFFFFF', borderRadius: 20,
        boxShadow: '0 1px 8px rgba(38,70,83,0.05)',
        padding: '20px',
        border: '1.5px solid #EDF6F4',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 10, background: '#EDF6F4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9FC9C3" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#264653' }}>Pomu'nun hatırladıkları</span>
        </div>

        <p style={{
          fontSize: 14,
          color: '#5A8A84',
          fontWeight: 500,
          lineHeight: 1.65,
          margin: '0 0 16px',
        }}>
          {memoryText}
        </p>

        <div style={{
          fontSize: 13, color: '#AABCB8', fontWeight: 500,
          fontStyle: 'italic', paddingTop: 12,
          borderTop: '1px solid #F2F7F6',
        }}>
          Bir dahaki sefere buradan devam ederiz.
        </div>
      </div>

      <div style={{ height: 24 }} />
      <div style={{ flex: 1 }} />
      <BottomNav active="profile" onChange={onTabChange} />
    </div>
  );
}
