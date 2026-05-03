import { useEffect, useRef, useState } from 'react';
import { Confetti } from '../components/Confetti';

interface Props {
  onComplete: (choice: 'started' | 'some' | 'continue') => void;
}

const TOTAL_SECS = 15; // hızlandırılmış demo seansı

export function DemoFocus({ onComplete }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECS);
  const [phase, setPhase] = useState<'running' | 'question' | 'response'>('running');
  const [choice, setChoice] = useState<'started' | 'some' | 'continue' | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const progress = 1 - secondsLeft / TOTAL_SECS;
  const R = 100;
  const circ = 2 * Math.PI * R;
  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const secs = (secondsLeft % 60).toString().padStart(2, '0');

  // Bubble "Ben de okuyorum" — 1 sn sonra göster
  useEffect(() => {
    const t = setTimeout(() => setBubbleVisible(true), 1000);
    return () => clearTimeout(t);
  }, []);

  // Sayaç
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setTimeout(() => setPhase('question'), 400);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  const responseTexts = {
    started: 'Tamam, ilk adımı kaydettim.',
    some: 'Güzel. Bugünkü okuma not edildi.',
    continue: 'Tamam. İstersen birazdan ikinci seansı açarız.',
  };

  function handleChoice(c: 'started' | 'some' | 'continue') {
    setChoice(c);
    setPhase('response');
    setTimeout(() => onComplete(c), 2000);
  }

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: '#1E3A3A',
      minHeight: '844px', width: '390px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {phase === 'question' && <Confetti />}

      <div style={{ flex: '0 0 72px' }} />

      {/* Görev adı */}
      <div style={{ textAlign: 'center', padding: '0 32px', marginBottom: 8 }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: 6 }}>
          🎯 Odak seansı
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3 }}>
          Kürk Mantolu Madonna'yı oku
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#B5A8D5' }} />
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Study</span>
        </div>
      </div>

      {/* Timer ring */}
      <div style={{ position: 'relative', width: 240, height: 240, margin: '24px 0' }}>
        <svg width="240" height="240" viewBox="0 0 240 240" style={{ position: 'absolute', inset: 0 }}>
          <circle cx="120" cy="120" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
          <circle cx="120" cy="120" r={R} fill="none" stroke="#9FC9C3" strokeWidth="10"
            strokeDasharray={`${circ * progress} ${circ}`} strokeLinecap="round"
            transform="rotate(-90 120 120)"
            style={{ transition: 'stroke-dasharray 0.8s linear' }} />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          {phase === 'running' ? (
            <>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1px', lineHeight: 1 }}>
                {mins}:{secs}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: 4 }}>odak</div>
            </>
          ) : (
            <div style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}>✓</div>
          )}
        </div>
      </div>

      {/* Pomu + bubble */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Bubble */}
        <div style={{
          position: 'absolute', top: -48, left: '50%',
          transform: `translateX(-50%) translateY(${bubbleVisible && phase === 'running' ? 0 : 8}px)`,
          opacity: bubbleVisible && phase === 'running' ? 1 : 0,
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 10,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
            borderRadius: 14, padding: '7px 14px',
            fontSize: 13, fontWeight: 600, color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.2)',
            position: 'relative',
          }}>
            Ben de okuyorum.
            <div style={{
              position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
              borderTop: '6px solid rgba(255,255,255,0.15)',
            }} />
          </div>
        </div>

        <img
          src={phase === 'question' || phase === 'response' ? '/images/jumping.png' : '/images/reading.png'}
          alt="Pomu"
          style={{ width: 110, height: 110, objectFit: 'contain', transition: 'opacity 0.3s' }}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* Alt alan */}
      <div style={{ width: '100%', padding: '0 24px 48px' }}>
        {phase === 'running' && (
          <div style={{
            textAlign: 'center', fontSize: 13,
            color: 'rgba(255,255,255,0.3)', fontWeight: 500,
          }}>
            Seans devam ediyor...
          </div>
        )}

        {phase === 'question' && (
          <div style={{
            background: 'rgba(255,255,255,0.08)', borderRadius: 20,
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            <div style={{ fontSize: 15, color: '#FFFFFF', fontWeight: 600, marginBottom: 16, textAlign: 'center' }}>
              Bu seansı nasıl kaydedelim?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {([
                { key: 'started', label: 'Başladım' },
                { key: 'some', label: 'Biraz okudum' },
                { key: 'continue', label: 'Devam etmek istiyorum' },
              ] as const).map(opt => (
                <button key={opt.key} onClick={() => handleChoice(opt.key)} style={{
                  padding: '13px 0', borderRadius: 14,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#FFFFFF',
                }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'response' && choice && (
          <div style={{
            background: 'rgba(255,255,255,0.08)', borderRadius: 20,
            padding: '20px', textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            <div style={{ fontSize: 15, color: '#FFFFFF', fontWeight: 500, lineHeight: 1.6 }}>
              {responseTexts[choice]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
