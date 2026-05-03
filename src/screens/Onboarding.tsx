import { useState, useRef } from 'react';
import { setOnboardingDone, setUserName } from '../storage';
import { PomuAnimated } from '../components/PomuAnimated';

interface Props {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function skip() {
    setOnboardingDone();
    onComplete();
  }

  function next() {
    if (step < 2) setStep(step + 1);
  }

  function finish() {
    const trimmed = name.trim() || 'Friend';
    setUserName(trimmed);
    setOnboardingDone();
    onComplete();
  }

  const dots = [0, 1, 2].map((i) => (
    <div
      key={i}
      style={{
        width: i === step ? 24 : 8,
        height: 8,
        borderRadius: 4,
        background: i === step ? '#9FC9C3' : '#C8E4E1',
        transition: 'width 0.3s ease',
      }}
    />
  ));

  // ── Screen 1 ──────────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div style={{
        fontFamily: "'Nunito', sans-serif",
        background: 'linear-gradient(160deg, #D9EFEC 0%, #EDF6F4 40%, #F6FBFA 100%)',
        minHeight: '844px', width: '390px',
        overflow: 'hidden', position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <button onClick={skip} style={{
          position: 'absolute', top: 56, right: 24,
          fontSize: 14, color: '#8BADA8', fontWeight: 600,
          background: 'none', border: 'none', cursor: 'pointer',
        }}>Geç</button>

        <div style={{ flex: '0 0 80px' }} />

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            position: 'absolute', width: 260, height: 260, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(159,201,195,0.25) 0%, transparent 70%)',
          }} />
          <video
            src="/pomu-intro.webm"
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: 240, height: 240,
              objectFit: 'contain',
              position: 'relative', zIndex: 1,
            }}
          />
        </div>

        <div style={{ marginTop: 36, textAlign: 'center', padding: '0 40px' }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: '#264653', margin: '0 0 16px', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
            Pomu ile tanış
          </h1>
          <p style={{ fontSize: 16, color: '#5A8A84', fontWeight: 500, lineHeight: 1.65, margin: 0 }}>
            Senin odak arkadaşın. Sen çalışırken o da çalışır, dinlenirken o da dinlenir. Birlikte büyürsünüz.
          </p>
        </div>

        <div style={{ flex: 1 }} />

        <button onClick={next} style={{
          width: 'calc(100% - 48px)', padding: '18px 0', borderRadius: 18,
          background: '#9FC9C3', border: 'none', cursor: 'pointer',
          fontSize: 18, fontWeight: 800, color: '#FFFFFF',
          boxShadow: '0 4px 16px rgba(159,201,195,0.4)',
          marginBottom: 24,
        }}>
          Devam
        </button>

        <div style={{ display: 'flex', gap: 8, marginBottom: 60, alignItems: 'center' }}>
          {dots}
        </div>
      </div>
    );
  }

  // ── Screen 2 ──────────────────────────────────────────────────────────────
  if (step === 1) {
    const steps = [
      { num: '1', title: 'Görev ekle', desc: 'Büyük ya da küçük, ne yapman gerekiyorsa yaz.', color: '#9FC9C3', lightColor: '#EDF6F4' },
      { num: '2', title: 'Odaklan', desc: 'Seans başlat. Pomu seninle birlikte çalışır.', color: '#F6B089', lightColor: '#FEF3EC' },
      { num: '3', title: 'Birlikte büyü', desc: 'Görevleri tamamla, Pomu\'nun gelişimini izle.', color: '#9FC9C3', lightColor: '#EDF6F4' },
    ];

    return (
      <div style={{
        fontFamily: "'Nunito', sans-serif",
        background: '#F6FBFA',
        minHeight: '844px', width: '390px',
        overflow: 'hidden', position: 'relative',
        display: 'flex', flexDirection: 'column',
      }}>
        <button onClick={skip} style={{
          position: 'absolute', top: 56, right: 24,
          fontSize: 14, color: '#8BADA8', fontWeight: 600,
          background: 'none', border: 'none', cursor: 'pointer',
        }}>Geç</button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 72, paddingBottom: 8 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: -16, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(246,176,137,0.18) 0%, transparent 70%)',
            }} />
            <video
              src="/pomu-reading.webm"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: 140, height: 140,
                objectFit: 'contain',
                position: 'relative',
                borderRadius: 24,
                background: '#F6FBFA',
              }}
            />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#264653', margin: '20px 0 6px', textAlign: 'center' }}>
            Nasıl çalışır?
          </h1>
          <p style={{ fontSize: 14, color: '#8BADA8', fontWeight: 500, textAlign: 'center', margin: '0 40px', lineHeight: 1.5 }}>
            Görevlerini takip et, odaklan, birlikte büyü
          </p>
        </div>

        <div style={{ padding: '24px 24px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: '#FFFFFF', borderRadius: 16, padding: '18px 20px',
              boxShadow: '0 1px 8px rgba(38,70,83,0.05)',
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, background: s.lightColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.num}</span>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#264653', marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#8BADA8', fontWeight: 500, lineHeight: 1.4 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <button onClick={next} style={{
          width: 'calc(100% - 48px)', margin: '0 24px', padding: '18px 0', borderRadius: 18,
          background: '#9FC9C3', border: 'none', cursor: 'pointer',
          fontSize: 18, fontWeight: 800, color: '#FFFFFF',
          boxShadow: '0 4px 16px rgba(159,201,195,0.4)',
          marginBottom: 24,
        }}>
          Devam
        </button>

        <div style={{ display: 'flex', gap: 8, marginBottom: 60, justifyContent: 'center', alignItems: 'center' }}>
          {dots}
        </div>
      </div>
    );
  }

  // ── Screen 3 ──────────────────────────────────────────────────────────────
  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: 'linear-gradient(180deg, #F6FBFA 0%, #EDF6F4 100%)',
      minHeight: '844px', width: '390px',
      overflow: 'hidden', position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <button onClick={skip} style={{
        position: 'absolute', top: 56, right: 24,
        fontSize: 14, color: '#8BADA8', fontWeight: 600,
        background: 'none', border: 'none', cursor: 'pointer',
      }}>Geç</button>

      <div style={{ flex: '0 0 72px' }} />

      <div style={{ textAlign: 'center', padding: '0 32px', marginBottom: 40 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#264653', margin: '0 0 10px', lineHeight: 1.15 }}>
          Sana nasıl seslenelim?
        </h1>
        <p style={{ fontSize: 14, color: '#8BADA8', fontWeight: 500, margin: 0 }}>
          İstediğin zaman değiştirebilirsin
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <video
          src="/pomu-step3.webm"
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: 170, height: 170,
            objectFit: 'contain',
          }}
        />
      </div>

      <div style={{ width: '100%', padding: '0 24px' }}>
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && finish()}
          placeholder="Adın"
          maxLength={30}
          style={{
            width: '100%',
            background: '#FFFFFF', borderRadius: 16, padding: '16px 18px',
            boxShadow: '0 1px 8px rgba(38,70,83,0.06)',
            border: '2px solid #9FC9C3',
            fontSize: 18, fontWeight: 600, color: '#264653',
            outline: 'none',
          }}
        />
        <div style={{ fontSize: 12, color: '#AABCB8', fontWeight: 500, marginTop: 8, paddingLeft: 4 }}>
          Adın
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ width: '100%', padding: '0 24px 24px' }}>
        <button onClick={finish} style={{
          width: '100%', padding: '18px 0', borderRadius: 18,
          background: '#F6B089', border: 'none', cursor: 'pointer',
          fontSize: 18, fontWeight: 800, color: '#FFFFFF',
          boxShadow: '0 4px 16px rgba(246,176,137,0.35)',
          letterSpacing: 0.2,
        }}>
          Hadi başlayalım!
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 48, alignItems: 'center' }}>
        {dots}
      </div>
    </div>
  );
}
