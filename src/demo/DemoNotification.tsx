import { useEffect, useState } from 'react';

interface Props {
  name: string;
  onTap: () => void;
  onDismiss: () => void;
}

export function DemoNotification({ name, onTap, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 300);
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDismiss]);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 500,
      padding: '52px 16px 0',
      pointerEvents: 'none',
    }}>
      <div
        onClick={() => { setVisible(false); setTimeout(onTap, 200); }}
        style={{
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(20px)',
          borderRadius: 16,
          padding: '12px 16px',
          boxShadow: '0 8px 32px rgba(38,70,83,0.18)',
          display: 'flex', alignItems: 'center', gap: 12,
          transform: `translateY(${visible ? 0 : -80}px)`,
          opacity: visible ? 1 : 0,
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          cursor: 'pointer',
          pointerEvents: 'all',
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {/* App icon */}
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'linear-gradient(145deg, #9FC9C3, #7AB5AE)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <img src="/images/wawing.png" alt="Pomu"
            style={{ width: 28, height: 28, objectFit: 'contain' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#264653', marginBottom: 2 }}>Pomu</div>
          <div style={{ fontSize: 13, color: '#5A8A84', fontWeight: 500, lineHeight: 1.4 }}>
            {name}, istersen kısa bir okuma seansı başlatalım.
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#AABCB8', fontWeight: 500, flexShrink: 0 }}>şimdi</div>
      </div>
    </div>
  );
}
