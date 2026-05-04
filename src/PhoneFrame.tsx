import { type ReactNode, useState, useEffect } from 'react';

interface Props {
  children: ReactNode;
}

function StatusBarClock() {
  const [time, setTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  });
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(id);
  }, []);
  return <span style={{ fontSize: 14, fontWeight: 600, color: '#264653', letterSpacing: 0.3 }}>{time}</span>;
}

// Sadece geniş ekranlarda (masaüstü) telefon çerçevesi göster.
// Mobilde doğrudan içerik render edilir.
export function PhoneFrame({ children }: Props) {
  // Ekran içeriği 390x844 olarak tasarlanmış, çerçeveye sığdırmak için küçültülüyor
  const screenW = 340;
  const screenH = 736;
  const contentW = 390;
  const contentH = 844;
  const scale = screenW / contentW;

  return (
    <>
      {/* Masaüstü: telefon çerçevesi */}
      <div className="phone-frame-desktop">
        <style>{`
          .phone-frame-desktop {
            display: none;
          }
          @media (min-width: 600px) {
            body {
              background: linear-gradient(135deg, #0f1923 0%, #1a2a3a 40%, #1e2d3d 100%) !important;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0;
            }
            .phone-frame-desktop {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              width: 100%;
            }
            .phone-frame-mobile {
              display: none !important;
            }
          }
        `}</style>

        {/* Telefon dış gövdesi */}
        <div style={{
          position: 'relative',
          width: 370,
          height: 790,
          background: 'linear-gradient(145deg, #2C2C2E 0%, #1C1C1E 50%, #232323 100%)',
          borderRadius: 52,
          boxShadow: `
            0 0 0 1px rgba(255,255,255,0.12),
            0 2px 4px rgba(0,0,0,0.3),
            0 12px 30px rgba(0,0,0,0.5),
            0 40px 80px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.08),
            inset 0 0 0 1.5px #3A3A3C
          `,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}>

          {/* Yan butonlar — sol (sessiz, vol up, vol down) */}
          <div style={{
            position: 'absolute', left: -2.5, top: 128,
            width: 2.5, height: 28, borderRadius: '2px 0 0 2px',
            background: 'linear-gradient(180deg, #4A4A4C, #3A3A3C)',
          }} />
          <div style={{
            position: 'absolute', left: -2.5, top: 172,
            width: 2.5, height: 52, borderRadius: '2px 0 0 2px',
            background: 'linear-gradient(180deg, #4A4A4C, #3A3A3C)',
          }} />
          <div style={{
            position: 'absolute', left: -2.5, top: 234,
            width: 2.5, height: 52, borderRadius: '2px 0 0 2px',
            background: 'linear-gradient(180deg, #4A4A4C, #3A3A3C)',
          }} />
          {/* Yan buton — sağ (power) */}
          <div style={{
            position: 'absolute', right: -2.5, top: 182,
            width: 2.5, height: 64, borderRadius: '0 2px 2px 0',
            background: 'linear-gradient(180deg, #4A4A4C, #3A3A3C)',
          }} />

          {/* Ekran alanı — tam yuvarlatılmış */}
          <div style={{
            width: screenW,
            height: screenH,
            marginTop: 15,
            borderRadius: 40,
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
            background: '#F6FBFA',
          }}>

            {/* iOS Status Bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: 54, zIndex: 20,
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '14px 28px 0',
              pointerEvents: 'none',
            }}>
              {/* Sol: Saat */}
              <div style={{ flex: 1 }}>
                <StatusBarClock />
              </div>

              {/* Orta: Dynamic Island */}
              <div style={{
                width: 120, height: 34,
                background: '#000000',
                borderRadius: 20,
                position: 'relative',
                top: -2,
                flexShrink: 0,
              }} />

              {/* Sağ: Sinyal + WiFi + Pil */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 5 }}>
                {/* Sinyal */}
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <rect x="0" y="8" width="3" height="4" rx="0.5" fill="#264653"/>
                  <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="#264653"/>
                  <rect x="9" y="2" width="3" height="10" rx="0.5" fill="#264653"/>
                  <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" fill="#264653" opacity="0.3"/>
                </svg>
                {/* WiFi */}
                <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                  <path d="M7 9.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" fill="#264653"/>
                  <path d="M4.2 8.2a4 4 0 015.6 0" stroke="#264653" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
                  <path d="M1.8 5.8a7.2 7.2 0 0110.4 0" stroke="#264653" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
                </svg>
                {/* Pil */}
                <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
                  <rect x="0.5" y="0.5" width="20" height="10" rx="2" stroke="#264653" strokeWidth="1" fill="none"/>
                  <rect x="21" y="3" width="2" height="5" rx="1" fill="#264653" opacity="0.4"/>
                  <rect x="1.5" y="1.5" width="16" height="8" rx="1" fill="#264653"/>
                </svg>
              </div>
            </div>

            {/* Uygulama içeriği */}
            <div style={{
              width: contentW,
              height: contentH,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}>
              {children}
            </div>
          </div>

          {/* Home bar */}
          <div style={{
            flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 120, height: 5,
              background: 'rgba(255,255,255,0.35)',
              borderRadius: 3,
            }} />
          </div>
        </div>
      </div>

      {/* Mobil: direkt içerik */}
      <div className="phone-frame-mobile">
        {children}
      </div>
    </>
  );
}
