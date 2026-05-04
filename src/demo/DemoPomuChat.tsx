import { useState } from 'react';

interface Props {
  name: string;
  onChoice: (firstTime: boolean) => void;
}

type Phase = 'question' | 'thinking' | 'response';

export function DemoPomuChat({ name, onChoice }: Props) {
  const [phase, setPhase] = useState<Phase>('question');
  const [chosen, setChosen] = useState<boolean | null>(null);

  function handleChoice(firstTime: boolean) {
    setChosen(firstTime);
    setPhase('thinking');
    setTimeout(() => setPhase('response'), 700);
  }

  const response = chosen === true
    ? 'Harika bir seçim. İlk kez okuyorsan tadını çıkar; bunu ilk okuman olarak kaydediyorum.'
    : 'Tekrar okumak ayrı güzel. Bazı kitaplar ikinci seferde daha başka hissettirir; bunu da not ediyorum.';

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: 'linear-gradient(180deg, #EDF6F4 0%, #F6FBFA 100%)',
      minHeight: '100dvh', height: '100%', width: '390px',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Üst — Pomu okuma halinde, büyük */}
      <div style={{
        background: 'linear-gradient(145deg, #D9EFEC 0%, #EDF6F4 100%)',
        padding: '64px 24px 32px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(159,201,195,0.3) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        }} />
        <video
          src="/pomu-reading.webm"
          autoPlay loop muted playsInline
          style={{
            width: 160, height: 160, objectFit: 'contain',
            position: 'relative', zIndex: 1,
            borderRadius: 24, background: '#EDF6F4',
          }}
        />
        {/* Pomu ismi */}
        <div style={{
          marginTop: 12, fontSize: 13, fontWeight: 700,
          color: '#8BADA8', letterSpacing: '0.04em',
        }}>
          Pomu
        </div>
      </div>

      {/* Sohbet alanı */}
      <div style={{ flex: 1, padding: '0 24px', paddingTop: 24 }}>
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #DDEDEA',
          borderRadius: 16,
          padding: '12px 14px',
          marginBottom: 18,
          boxShadow: '0 6px 20px rgba(38,70,83,0.08)',
        }}>
          <div style={{ fontSize: 12, color: '#8BADA8', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
            Tur notu
          </div>
          <div style={{ fontSize: 13, color: '#264653', fontWeight: 600, lineHeight: 1.45 }}>
            Pomu, eklediğin göreve göre davranır. Kitap seçtiğinde okuma moduna geçer; zamanla seçimlerini ve cevaplarını hatırlar.
          </div>
        </div>

        {/* Pomu mesajı — baloncuk */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'flex-start' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#EDF6F4', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <img src="/images/pp.png" alt="Pomu"
              style={{ width: 32, height: 32, objectFit: 'cover' }} />
          </div>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '4px 18px 18px 18px',
            padding: '14px 16px',
            boxShadow: '0 2px 12px rgba(38,70,83,0.08)',
            border: '1px solid #EDF6F4',
            maxWidth: 280,
          }}>
            <p style={{
              fontSize: 15, color: '#264653', fontWeight: 500,
              lineHeight: 1.65, margin: 0,
            }}>
              Kürk Mantolu Madonna'yı seçtin. Bu, beni kodlayan Umut'un en sevdiği romanlardan biri. Daha önce okumuş muydun?
            </p>
          </div>
        </div>

        {/* Seçenekler */}
        {phase === 'question' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 42 }}>
            <button onClick={() => handleChoice(true)} style={{
              padding: '13px 18px', borderRadius: '18px 18px 18px 4px',
              background: '#EDF6F4', border: '1.5px solid #C8E4E1',
              cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#264653',
              textAlign: 'left',
              fontFamily: "'Nunito', sans-serif",
            }}>
              İlk kez okuyorum
            </button>
            <button onClick={() => handleChoice(false)} style={{
              padding: '13px 18px', borderRadius: '18px 18px 18px 4px',
              background: '#EDF6F4', border: '1.5px solid #C8E4E1',
              cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#264653',
              textAlign: 'left',
              fontFamily: "'Nunito', sans-serif",
            }}>
              Daha önce okudum
            </button>
          </div>
        )}

        {/* Yanıt sonrası — kullanıcının seçimi göster */}
        {phase !== 'question' && chosen !== null && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 0, marginBottom: 16 }}>
              <div style={{
                background: '#9FC9C3',
                borderRadius: '18px 4px 18px 18px',
                padding: '12px 16px',
                maxWidth: 240,
              }}>
                <p style={{
                  fontSize: 14, color: '#264653', fontWeight: 700,
                  margin: 0, lineHeight: 1.5,
                }}>
                  {chosen ? 'İlk kez okuyorum' : 'Daha önce okudum'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'flex-start' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#EDF6F4', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <img src="/images/pp.png" alt="Pomu"
                  style={{ width: 32, height: 32, objectFit: 'cover' }} />
              </div>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '4px 18px 18px 18px',
                padding: '14px 16px',
                boxShadow: '0 2px 12px rgba(38,70,83,0.08)',
                border: '1px solid #EDF6F4',
                maxWidth: 280,
              }}>
                <p style={{
                  fontSize: 15, color: '#264653', fontWeight: 500,
                  lineHeight: 1.65, margin: 0,
                }}>
                  {phase === 'thinking' ? '...' : response}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Alt bilgi */}
      <div style={{
        padding: '16px 24px 40px',
        textAlign: 'center',
      }}>
        {phase === 'response' && chosen !== null ? (
          <button onClick={() => onChoice(chosen)} style={{
            width: '100%',
            padding: '15px 0',
            borderRadius: 16,
            background: '#F6B089',
            border: 'none',
            cursor: 'pointer',
            fontSize: 15,
            fontWeight: 800,
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(246,176,137,0.3)',
            fontFamily: "'Nunito', sans-serif",
          }}>
            Devam
          </button>
        ) : (
          <div style={{ fontSize: 12, color: '#AABCB8', fontWeight: 500 }}>
            Bu cevap, Pomu'nun seni nasıl tanıyacağını şekillendirir.
          </div>
        )}
      </div>
    </div>
  );
}
