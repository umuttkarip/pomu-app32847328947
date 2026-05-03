import { useState } from 'react';

interface Props {
  onComplete: (name: string) => void;
}

export function DemoWelcome({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [leaving, setLeaving] = useState(false);

  function handleSubmit() {
    if (!name.trim()) return;
    setLeaving(true);
    setTimeout(() => onComplete(formatName(name.trim())), 220);
  }

  function formatName(value: string) {
    return value ? value.charAt(0).toLocaleUpperCase('tr-TR') + value.slice(1) : '';
  }

  function goNext(next: number) {
    setLeaving(true);
    setTimeout(() => {
      setStep(next);
      setLeaving(false);
    }, 180);
  }

  const pageMotion = {
    opacity: leaving ? 0 : 1,
    transform: `translateX(${leaving ? -12 : 0}px)`,
    transition: 'opacity 0.18s ease, transform 0.18s ease',
  };

  const dots = [0, 1, 2].map((i) => (
    <div
      key={i}
      style={{
        width: i === step ? 24 : 8,
        height: 8,
        borderRadius: 4,
        background: i === step ? '#9FC9C3' : '#C8E4E1',
        transition: 'width 0.25s ease',
      }}
    />
  ));

  if (step === 0) {
    return (
      <div style={{
        fontFamily: "'Nunito', sans-serif",
        background: 'linear-gradient(160deg, #D9EFEC 0%, #EDF6F4 40%, #F6FBFA 100%)',
        minHeight: '100dvh', width: '390px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        ...pageMotion,
      }}>
        <div style={{ flex: '0 0 84px' }} />

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            position: 'absolute', width: 260, height: 260, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(159,201,195,0.25) 0%, transparent 70%)',
          }} />
          <video
            src="/pomu-intro.webm"
            autoPlay loop muted playsInline
            style={{ width: 224, height: 224, objectFit: 'contain', position: 'relative', zIndex: 1 }}
          />
        </div>

        <div style={{ marginTop: 34, textAlign: 'center', padding: '0 40px' }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#264653', margin: '0 0 12px', lineHeight: 1.1 }}>
            Pomu seni bekliyor
          </h1>
          <p style={{ fontSize: 15, color: '#5A8A84', fontWeight: 500, lineHeight: 1.65, margin: 0 }}>
            Görevlerini ekle, odaklanmak istediğinde Pomu seninle birlikte çalışsın.
          </p>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ width: '100%', padding: '0 24px 24px' }}>
          <button onClick={() => goNext(1)} style={{
            width: '100%', padding: '18px 0', borderRadius: 18,
            background: '#9FC9C3', border: 'none', cursor: 'pointer',
            fontSize: 18, fontWeight: 800, color: '#FFFFFF',
            boxShadow: '0 4px 16px rgba(159,201,195,0.35)',
            fontFamily: "'Nunito', sans-serif",
          }}>
            Devam
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 54, alignItems: 'center' }}>
          {dots}
        </div>
      </div>
    );
  }

  if (step === 1) {
    const items = [
      { title: 'Günün işlerini toparla', text: 'Okuma, ders, iş veya kişisel görevlerini aynı yerde takip et.' },
      { title: 'Odaklanmak istediğinde başla', text: 'Pomu o sırada seninle birlikte çalışır.' },
      { title: 'İlerlemeni takip et', text: 'Tamamladıkların, odak süren ve düzenin zamanla görünür hale gelir.' },
    ];

    return (
      <div style={{
        fontFamily: "'Nunito', sans-serif",
        background: '#F6FBFA',
        minHeight: '100dvh', width: '390px',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
        ...pageMotion,
      }}>
        <div style={{ padding: '72px 24px 0', textAlign: 'center' }}>
          <video
            src="/pomu-reading.webm"
            autoPlay loop muted playsInline
            style={{ width: 138, height: 138, objectFit: 'contain', borderRadius: 24 }}
          />
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#264653', margin: '22px 0 8px' }}>
            Pomu nasıl çalışır?
          </h1>
          <p style={{ fontSize: 14, color: '#8BADA8', fontWeight: 500, lineHeight: 1.55, margin: 0 }}>
            Pomu görevlerini takip ederken sana eşlik eden küçük bir karakterdir.
          </p>
        </div>

        <div style={{ padding: '28px 24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item, i) => (
            <div key={item.title} style={{
              display: 'flex', gap: 14, alignItems: 'center',
              background: '#FFFFFF', borderRadius: 16,
              padding: '16px 18px',
              boxShadow: '0 1px 8px rgba(38,70,83,0.05)',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 12,
                background: i === 1 ? '#FEF3EC' : '#EDF6F4',
                color: i === 1 ? '#F6B089' : '#9FC9C3',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, fontWeight: 900, flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#264653', marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#8BADA8', lineHeight: 1.4 }}>{item.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ width: '100%', padding: '0 24px 24px' }}>
          <button onClick={() => goNext(2)} style={{
            width: '100%', padding: '18px 0', borderRadius: 18,
            background: '#9FC9C3', border: 'none', cursor: 'pointer',
            fontSize: 18, fontWeight: 800, color: '#FFFFFF',
            boxShadow: '0 4px 16px rgba(159,201,195,0.35)',
            fontFamily: "'Nunito', sans-serif",
          }}>
            Devam
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 54, justifyContent: 'center', alignItems: 'center' }}>
          {dots}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: 'linear-gradient(160deg, #D9EFEC 0%, #EDF6F4 40%, #F6FBFA 100%)',
      minHeight: '100dvh', width: '390px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
      ...pageMotion,
    }}>
      <div style={{ flex: '0 0 80px' }} />

      {/* Pomu */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute', width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(159,201,195,0.25) 0%, transparent 70%)',
        }} />
        <video
          src="/pomu-intro.webm"
          autoPlay loop muted playsInline
          style={{ width: 220, height: 220, objectFit: 'contain', position: 'relative', zIndex: 1 }}
        />
      </div>

      <div style={{ marginTop: 32, textAlign: 'center', padding: '0 40px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#264653', margin: '0 0 12px', lineHeight: 1.1 }}>
          Pomu sana nasıl seslensin?
        </h1>
        <p style={{ fontSize: 15, color: '#5A8A84', fontWeight: 500, lineHeight: 1.65, margin: 0 }}>
          {' '}
        </p>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ width: '100%', padding: '0 24px' }}>
        <input
          value={name}
          onChange={e => setName(formatName(e.target.value))}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Adın"
          maxLength={30}
          autoFocus
          style={{
            width: '100%', background: '#FFFFFF',
            borderRadius: 16, padding: '16px 18px',
            boxShadow: '0 1px 8px rgba(38,70,83,0.06)',
            border: '2px solid #9FC9C3',
            fontSize: 18, fontWeight: 600, color: '#264653',
            outline: 'none',
          }}
        />
        <div style={{ fontSize: 12, color: '#AABCB8', fontWeight: 500, marginTop: 8, paddingLeft: 4 }}>
          Bu demo boyunca gördüğün şeyler cihazında kalır.
        </div>
      </div>

      <div style={{ height: 16 }} />

      <div style={{ width: '100%', padding: '0 24px 56px' }}>
        <button onClick={handleSubmit} disabled={!name.trim()} style={{
          width: '100%', padding: '18px 0', borderRadius: 18,
          background: name.trim() ? '#F6B089' : '#E4EFED', border: 'none', cursor: name.trim() ? 'pointer' : 'default',
          fontSize: 18, fontWeight: 800, color: '#FFFFFF',
          boxShadow: name.trim() ? '0 4px 16px rgba(246,176,137,0.35)' : 'none',
          fontFamily: "'Nunito', sans-serif",
        }}>
          Başlayalım
        </button>
      </div>
    </div>
  );
}
