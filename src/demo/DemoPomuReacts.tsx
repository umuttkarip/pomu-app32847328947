import { useState } from 'react';

interface Props {
  name: string;
  onChoice: (firstTime: boolean) => void;
}

export function DemoPomuReacts({ name, onChoice }: Props) {
  const [chosen, setChosen] = useState<boolean | null>(null);
  const [showResponse, setShowResponse] = useState(false);

  function handleChoice(firstTime: boolean) {
    setChosen(firstTime);
    setShowResponse(true);
    setTimeout(() => onChoice(firstTime), 2200);
  }

  const responseText = chosen === true
    ? 'O zaman yavaş başlamasına takılma. Bir süre sonra Raif Efendi\'nin içine kapanıklığı daha anlamlı gelmeye başlıyor.'
    : 'Tekrar okuyunca bazı yerler başka türlü çarpıyor. Özellikle Raif Efendi\'yi insan ikinci okuyuşta daha farklı görüyor.';

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: '#F6FBFA',
      minHeight: '100dvh', width: '390px',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Üst alan — Pomu okuma halinde */}
      <div style={{
        background: 'linear-gradient(145deg, #EDF6F4 0%, #FFFFFF 100%)',
        padding: '56px 24px 32px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <img src="/images/reading.png" alt="Pomu"
          style={{ width: 110, height: 110, objectFit: 'contain', marginBottom: 8 }} />
      </div>

      {/* Pomu mesaj kartı */}
      <div style={{ padding: '0 24px', marginTop: -8 }}>
        <div style={{
          background: '#FFFFFF', borderRadius: 20,
          boxShadow: '0 2px 16px rgba(38,70,83,0.08)',
          padding: '20px',
          border: '1.5px solid #EDF6F4',
        }}>
          {!showResponse ? (
            <>
              <div style={{ fontSize: 15, color: '#264653', fontWeight: 500, lineHeight: 1.65, marginBottom: 20 }}>
                Kürk Mantolu Madonna'yı okuyacaksın demek. Sabahattin Ali'nin en sessiz ama en çok iz bırakan romanlarından biri. Daha önce okumuş muydun?
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={() => handleChoice(true)} style={{
                  padding: '13px 0', borderRadius: 14,
                  background: '#EDF6F4', border: '1.5px solid #C8E4E1',
                  cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#264653',
                }}>
                  İlk kez okuyorum
                </button>
                <button onClick={() => handleChoice(false)} style={{
                  padding: '13px 0', borderRadius: 14,
                  background: '#EDF6F4', border: '1.5px solid #C8E4E1',
                  cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#264653',
                }}>
                  Daha önce okudum
                </button>
              </div>
            </>
          ) : (
            <div style={{
              fontSize: 15, color: '#264653', fontWeight: 500, lineHeight: 1.65,
              opacity: showResponse ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}>
              {responseText}
            </div>
          )}
        </div>
      </div>

      {/* Görev önizleme */}
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ fontSize: 13, color: '#8BADA8', fontWeight: 600, marginBottom: 10 }}>Bugün</div>
        <div style={{ background: '#FFFFFF', borderRadius: 16, boxShadow: '0 1px 8px rgba(38,70,83,0.05)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #C8DEDA', flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 15, color: '#264653', fontWeight: 500 }}>
              Kürk Mantolu Madonna'yı oku
            </span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#B5A8D5' }} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
    </div>
  );
}
