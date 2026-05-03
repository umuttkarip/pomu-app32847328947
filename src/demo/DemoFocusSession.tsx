import { useEffect, useRef, useState } from 'react';
import { Confetti } from '../components/Confetti';

interface Props {
  onComplete: (choice: 'curious' | 'slow' | 'unsure') => void;
}

const TOTAL_SECS = 12;

export function DemoFocusSession({ onComplete }: Props) {
  const [timeLeftMs, setTimeLeftMs] = useState(TOTAL_SECS * 1000);
  const [phase, setPhase] = useState<'running' | 'question' | 'response'>('running');
  const [choice, setChoice] = useState<'curious' | 'slow' | 'unsure' | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const secondsLeft = Math.ceil(timeLeftMs / 1000);
  const progress = 1 - timeLeftMs / (TOTAL_SECS * 1000);
  const R = 100;
  const circ = 2 * Math.PI * R;
  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const secs = (secondsLeft % 60).toString().padStart(2, '0');

  useEffect(() => {
    const t = setTimeout(() => setBubbleVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeftMs(prev => {
        if (prev <= 100) {
          clearInterval(intervalRef.current!);
          setTimeout(() => setPhase('question'), 500);
          return 0;
        }
        return prev - 100;
      });
    }, 100);
    return () => clearInterval(intervalRef.current!);
  }, []);

  const responses: Record<'curious' | 'slow' | 'unsure', string> = {
    curious: 'Güzel. Bunu iyi giden bir okuma olarak kaydettim.',
    slow: 'Tamam. Bugünkü okumayı fena değil diye not ettim.',
    unsure: 'Tamam. Birkaç sayfa sonra tekrar bakarız.',
  };

  function handleChoice(c: 'curious' | 'slow' | 'unsure') {
    setChoice(c);
    setPhase('response');
    setTimeout(() => onComplete(c), 2000);
  }

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: '#1E3A3A',
      minHeight: '100dvh', width: '390px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {phase !== 'running' && <Confetti />}

      <div style={{ flex: '0 0 72px' }} />

      {/* Görev */}
      <div style={{ textAlign: 'center', padding: '0 32px', marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Odak seansı
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3 }}>
          Kürk Mantolu Madonna'yı oku
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#B5A8D5' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Okuma</span>
        </div>
      </div>

      {/* Ring */}
      <div style={{ position: 'relative', width: 240, height: 240, margin: '20px 0' }}>
        <svg width="240" height="240" viewBox="0 0 240 240" style={{ position: 'absolute', inset: 0 }}>
          <circle cx="120" cy="120" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          <circle cx="120" cy="120" r={R} fill="none" stroke="#9FC9C3" strokeWidth="10"
            strokeDasharray={`${circ * progress} ${circ}`} strokeLinecap="round"
            transform="rotate(-90 120 120)"
            style={{ transition: 'stroke-dasharray 0.1s linear' }} />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          {phase === 'running' ? (
            <>
              <div style={{ fontSize: 52, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-2px', lineHeight: 1 }}>
                {mins}:{secs}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: 6, letterSpacing: '0.06em' }}>
                odak
              </div>
            </>
          ) : (
            <div style={{ fontSize: 36, color: '#9FC9C3' }}>✓</div>
          )}
        </div>
      </div>

      {/* Pomu + bubble — bubble sayacın altında, Pomu daha aşağıda */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 26 }}>
        {/* Bubble — Pomu'nun üstünde ama ring'in altında */}
        <div style={{
          marginBottom: 8,
          opacity: bubbleVisible && phase === 'running' ? 1 : 0,
          transform: `translateY(${bubbleVisible && phase === 'running' ? 0 : 6}px)`,
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: 'none',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
            borderRadius: 14, padding: '8px 14px',
            fontSize: 13, fontWeight: 600, color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.15)',
            position: 'relative',
          }}>
            Ben de okuyorum.
            <div style={{
              position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
              borderTop: '6px solid rgba(255,255,255,0.12)',
            }} />
          </div>
        </div>

        <video
          src={phase !== 'running' ? undefined : '/pomu-reading.webm'}
          autoPlay loop muted playsInline
          style={{
            width: 110, height: 110, objectFit: 'contain',
            borderRadius: 16, background: 'transparent',
            display: phase !== 'running' ? 'none' : 'block',
          }}
        />
        {phase !== 'running' && (
          <img src="/images/jumping.png" alt="Pomu"
            style={{ width: 110, height: 110, objectFit: 'contain' }} />
        )}
      </div>

      {phase === 'running' && (
        <div style={{
          marginTop: 14,
          width: 'calc(100% - 48px)',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 16,
          padding: '12px 14px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
            Tur notu
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.84)', fontWeight: 600, lineHeight: 1.45 }}>
            Pomu seçtiğin işe eşlik eder. Burada kısa bir okuma molasında seninle birlikte.
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Alt */}
      <div style={{ width: '100%', padding: '0 24px 48px' }}>
        {phase === 'running' && (
          <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>
            Odaklanma devam ediyor
          </div>
        )}

        {phase === 'question' && (
          <div style={{
            background: 'rgba(255,255,255,0.06)', borderRadius: 20,
            padding: '20px', border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{
              fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 600,
              marginBottom: 14, textAlign: 'center',
            }}>
              Okuma nasıl gidiyor?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {([
                { key: 'curious' as const, label: 'İyi gidiyor' },
                { key: 'slow' as const, label: 'Fena değil' },
                { key: 'unsure' as const, label: 'Henüz karar vermedim' },
              ]).map(opt => (
                <button key={opt.key} onClick={() => handleChoice(opt.key)} style={{
                  padding: '13px 0', borderRadius: 14,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#FFFFFF',
                  fontFamily: "'Nunito', sans-serif",
                }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'response' && choice && (
          <div style={{
            background: 'rgba(255,255,255,0.06)', borderRadius: 20,
            padding: '20px', textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ fontSize: 15, color: '#FFFFFF', fontWeight: 500, lineHeight: 1.6 }}>
              {responses[choice]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
