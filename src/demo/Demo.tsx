import { useEffect, useState } from 'react';
import { DemoWelcome } from './DemoWelcome';
import { DemoHome } from './DemoHome';
import { DemoPomuChat } from './DemoPomuChat';
import { DemoFocusSession } from './DemoFocusSession';
import { DemoFocusEnd } from './DemoFocusEnd';
import { DemoStats } from './DemoStats';
import { DemoProfile } from './DemoProfile';
import { DemoTourEnd } from './DemoTourEnd';
import { DemoSurvey } from './DemoSurvey';
import { addDemoBookTask, initDemoStorage } from './demoState';
import type { DemoStep, DemoState } from './demoState';

// Spotlight: karartma + tooltip + highlight border
function Spotlight({
  highlight,
  target,
  tooltip,
  step: stepLabel,
  onHighlightClick,
  actionLabel,
  onAction,
}: {
  highlight?: Partial<{ top: number; left: number; width: number; height: number; radius: number }>;
  target?: string;
  tooltip: { text: string; position?: 'top' | 'bottom'; top?: number };
  step?: string;
  onHighlightClick?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const [measured, setMeasured] = useState(highlight);

  useEffect(() => {
    if (!target) {
      setMeasured(highlight);
      return;
    }

    function measure() {
      const root = document.querySelector('[data-demo-root]');
      const el = document.querySelector(`[data-tour="${target}"]`);
      if (!root || !el) return;
      const rootRect = root.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      setMeasured({
        top: rect.top - rootRect.top,
        left: rect.left - rootRect.left,
        width: rect.width,
        height: rect.height,
        radius: highlight?.radius ?? 16,
      });
    }

    measure();
    const raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, [target, highlight?.radius]);

  if (
    !measured ||
    measured.top === undefined ||
    measured.left === undefined ||
    measured.width === undefined ||
    measured.height === undefined
  ) return null;

  const r = measured.radius ?? 16;
  const wantedPosition = tooltip.position ?? (measured.top > 430 ? 'top' : 'bottom');
  const tooltipTop = tooltip.top !== undefined
    ? tooltip.top
    : wantedPosition === 'top'
    ? Math.max(measured.top - 150, 42)
    : Math.min(measured.top + measured.height + 16, 680);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 800 }}>
      {/* Karartma — SVG mask ile highlight alanı açık */}
      <svg width="390" height="844" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <defs>
          <mask id="sm">
            <rect width="390" height="844" fill="white" />
            <rect x={measured.left} y={measured.top}
              width={measured.width} height={measured.height} rx={r} fill="black" />
          </mask>
        </defs>
        <rect width="390" height="844" fill="rgba(38,70,83,0.42)" mask="url(#sm)" />
        {/* Highlight border */}
        <rect x={measured.left - 3} y={measured.top - 3}
          width={measured.width + 6} height={measured.height + 6}
          rx={r + 3} fill="none" stroke="#F6B089" strokeWidth="3" opacity="0.95" />
      </svg>

      {/* Tıklanabilir highlight alanı */}
      {onHighlightClick && (
        <div
          onClick={onHighlightClick}
          style={{
            position: 'absolute',
            top: measured.top, left: measured.left,
            width: measured.width, height: measured.height,
            borderRadius: r, cursor: 'pointer', zIndex: 2,
          }}
        />
      )}

      {/* Tooltip */}
      <div style={{
        position: 'absolute',
        top: Math.max(tooltipTop, 60),
        left: 20, right: 20,
        zIndex: 3,
      }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: 18, padding: '16px 18px',
          boxShadow: '0 14px 40px rgba(38,70,83,0.18)',
          border: '1.5px solid #DDEDEA',
          fontFamily: "'Nunito', sans-serif",
        }}>
          {stepLabel && (
            <div style={{
              fontSize: 11, fontWeight: 800, color: '#F6B089',
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8,
            }}>
              {stepLabel}
            </div>
          )}
          <p style={{
            fontSize: 14, color: '#264653',
            fontWeight: 600, lineHeight: 1.6, margin: 0,
          }}>
            {tooltip.text}
          </p>
          {actionLabel && onAction && (
            <button onClick={onAction} style={{
              marginTop: 14, width: '100%',
              padding: '11px 0', borderRadius: 12,
              background: '#F6B089',
              border: 'none',
              cursor: 'pointer', fontSize: 14, fontWeight: 700,
              color: '#FFFFFF', fontFamily: "'Nunito', sans-serif",
            }}>
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function Demo() {
  const [state, setState] = useState<DemoState>({
    name: '', firstTimeReading: null, sessionChoice: null, step: 'welcome',
  });
  const [transitioning, setTransitioning] = useState(false);

  function goTo(step: DemoStep, patch?: Partial<DemoState>) {
    setTransitioning(true);
    setTimeout(() => {
      setState(prev => ({ ...prev, ...patch, step }));
      setTransitioning(false);
    }, 180);
  }

  const { step, name, firstTimeReading, sessionChoice } = state;

  const fade = {
    opacity: transitioning ? 0 : 1,
    transition: 'opacity 0.18s ease',
  };

  // ── Tam sayfa ekranlar ────────────────────────────────────────────────────
  if (step === 'welcome') {
    return (
      <DemoWelcome onComplete={n => {
        initDemoStorage(n);
        goTo('app-home', { name: n });
      }} />
    );
  }

  if (step === 'pomu-chat') {
    return (
      <div style={fade}>
        <DemoPomuChat name={name} onChoice={firstTime =>
          goTo('app-home-2', { firstTimeReading: firstTime })
        } />
      </div>
    );
  }

  if (step === 'focus') {
    return (
      <div style={fade}>
        <DemoFocusSession onComplete={choice =>
          goTo('focus-end', { sessionChoice: choice })
        } />
      </div>
    );
  }

  if (step === 'focus-end') {
    return (
      <div style={fade}>
        <DemoFocusEnd
          onViewStats={() => goTo('app-stats')}
          onHome={() => goTo('app-home-2')}
        />
      </div>
    );
  }

  if (step === 'tour-end') {
    return (
      <div style={fade}>
        <DemoTourEnd
          onStartFeedback={() => goTo('feedback')}
          onSkip={() => goTo('done')}
        />
      </div>
    );
  }

  if (step === 'feedback') {
    return <div style={fade}><DemoSurvey name={name} /></div>;
  }

  if (step === 'done') {
    return (
      <div style={{ ...fade, fontFamily: "'Nunito', sans-serif", background: '#F6FBFA', minHeight: '100dvh', height: '100%', width: '390px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center', gap: 20 }}>
        <img src="/images/jumping.png" alt="Pomu" style={{ width: 120, height: 120, objectFit: 'contain' }} />
        <div style={{ fontSize: 24, fontWeight: 800, color: '#264653' }}>Teşekkürler!</div>
        <div style={{ fontSize: 15, color: '#8BADA8', fontWeight: 500, lineHeight: 1.6 }}>
          Geri bildirimin Pomu'nun gelişimine katkı sağlayacak.
        </div>
      </div>
    );
  }

  // ── Uygulama + spotlight ──────────────────────────────────────────────────
  return (
    <div data-demo-root style={{ position: 'relative', width: 390, ...fade }}>
      {(step === 'app-home' || step === 'app-home-book-added' || step === 'app-home-2') && (
        <DemoHome
          name={name}
          taskAdded={step !== 'app-home'}
          onAddTask={() => goTo('pomu-chat')}
          onTabChange={() => {}}
          onStartFocus={() => goTo('focus')}
        />
      )}

      {step === 'app-stats' && (
        <DemoStats
          onTabChange={() => {}}
          onViewMemory={() => goTo('app-profile')}
        />
      )}

      {step === 'app-profile' && (
        <DemoProfile
          name={name}
          firstTimeReading={firstTimeReading}
          sessionChoice={sessionChoice}
          onTabChange={() => {}}
        />
      )}

      {/* ADIM 1: kitap görevi dış tur katmanından eklenir */}
      {step === 'app-home' && (
        <Spotlight
          target="task-list"
          highlight={{ radius: 20 }}
          tooltip={{
            text: `Her gün takip ettiğin birkaç görev var. Bir de Kürk Mantolu Madonna okumak istiyorsun; onu da listene ekleyelim.`,
            position: 'bottom',
          }}
          step="1 / 5"
          actionLabel="Görevi ekle"
          onAction={() => {
            addDemoBookTask();
            goTo('app-home-book-added');
          }}
        />
      )}

      {/* ADIM 2: eklenen görev satırına dokunulur */}
      {step === 'app-home-book-added' && (
        <Spotlight
          target="book-task"
          highlight={{ radius: 16 }}
          tooltip={{
            text: `Görev eklendi. Şimdi bu satırı birlikte inceleyelim.`,
            position: 'top',
          }}
          step="2 / 5"
          onHighlightClick={() => goTo('pomu-chat')}
        />
      )}

      {/* ADIM 3: app-home-2 — "Odak Seansı Başlat" highlight */}
      {step === 'app-home-2' && (
        <Spotlight
          target="focus-button"
          highlight={{ radius: 16 }}
          tooltip={{
            text: 'Kitap okurken odaklanma modunu kullanalım, şimdi kısa bir seans başlatalım.',
            position: 'bottom',
            top: 750,
          }}
          step="3 / 5"
          onHighlightClick={() => goTo('focus')}
        />
      )}

      {/* ADIM 4: app-stats — hafıza butonu highlight */}
      {step === 'app-stats' && (
        <Spotlight
          target="memory-button"
          highlight={{ radius: 16 }}
          tooltip={{
            text: 'Burada son birkaç gündeki ilerleme görünüyor. Şimdi Pomu neleri hatırlıyor ona bakalım.',
            position: 'top',
            top: 500,
          }}
          step="4 / 5"
          onHighlightClick={() => goTo('app-profile')}
        />
      )}

      {/* ADIM 5: app-profile — hafıza kartı highlight */}
      {step === 'app-profile' && (
        <Spotlight
          target="memory-card"
          highlight={{ radius: 20 }}
          tooltip={{
            text: 'Pomu zamanla adını, işlerini, cevaplarını ve yarım kalan şeyleri hatırlayarak daha kişisel hale gelir.',
            position: 'bottom',
            top: 690,
          }}
          step="5 / 5"
          actionLabel="Turu bitir"
          onAction={() => goTo('tour-end')}
        />
      )}
    </div>
  );
}
