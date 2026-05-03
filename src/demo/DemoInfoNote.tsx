// Bilgi notu — uygulamanın Pomu mesajlarından görsel olarak ayrışır

interface Props {
  text: string;
  onContinue: () => void;
}

export function DemoInfoNote({ text, onContinue }: Props) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 400,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'flex-end',
      fontFamily: "'Nunito', sans-serif",
    }}>
      <div style={{
        width: '100%',
        background: '#1a1a2e',
        borderRadius: '20px 20px 0 0',
        padding: '24px 24px 40px',
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 1,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
            {text}
          </p>
        </div>
        <button onClick={onContinue} style={{
          width: '100%', padding: '14px 0', borderRadius: 14,
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          cursor: 'pointer', fontSize: 15, fontWeight: 700, color: '#FFFFFF',
        }}>
          Devam
        </button>
      </div>
    </div>
  );
}
