import { useEffect, useState } from 'react';

export interface SpotlightConfig {
  // Highlight edilecek alan (px, 390px container içinde)
  highlight?: {
    top: number;
    left: number;
    width: number;
    height: number;
    radius?: number;
  };
  // Tooltip metni ve pozisyonu
  tooltip: {
    text: string;
    position: 'top' | 'bottom' | 'center';
  };
  // Devam butonu
  action?: {
    label: string;
    onClick: () => void;
  };
  // Adım göstergesi
  step?: string; // "1 / 5"
}

interface Props {
  config: SpotlightConfig;
  visible: boolean;
}

export function DemoSpotlight({ config, visible }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setShow(true), 200);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [visible]);

  const { highlight, tooltip, action, step } = config;

  // Tooltip pozisyonu
  const tooltipTop = tooltip.position === 'top'
    ? (highlight ? highlight.top - 80 : 100)
    : tooltip.position === 'bottom'
    ? (highlight ? highlight.top + highlight.height + 16 : 600)
    : 380;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 800,
      pointerEvents: show ? 'all' : 'none',
      opacity: show ? 1 : 0,
      transition: 'opacity 0.3s ease',
    }}>
      {/* Karartma katmanı — highlight alanı hariç */}
      <svg
        width="390" height="844"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <mask id="spotlight-mask">
            <rect width="390" height="844" fill="white" />
            {highlight && (
              <rect
                x={highlight.left}
                y={highlight.top}
                width={highlight.width}
                height={highlight.height}
                rx={highlight.radius ?? 16}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="390" height="844"
          fill="rgba(26,26,46,0.72)"
          mask="url(#spotlight-mask)"
        />
        {/* Highlight border */}
        {highlight && (
          <rect
            x={highlight.left - 2}
            y={highlight.top - 2}
            width={highlight.width + 4}
            height={highlight.height + 4}
            rx={(highlight.radius ?? 16) + 2}
            fill="none"
            stroke="#9FC9C3"
            strokeWidth="2"
            opacity="0.8"
          />
        )}
      </svg>

      {/* Tooltip */}
      <div style={{
        position: 'absolute',
        top: tooltipTop,
        left: 24,
        right: 24,
        zIndex: 10,
        transform: `translateY(${show ? 0 : 8}px)`,
        transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <div style={{
          background: '#1a1a2e',
          borderRadius: 16,
          padding: '16px 18px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          {step && (
            <div style={{
              fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8,
            }}>
              {step}
            </div>
          )}
          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.9)',
            fontWeight: 500, lineHeight: 1.6, margin: 0,
            fontFamily: "'Nunito', sans-serif",
          }}>
            {tooltip.text}
          </p>
          {action && (
            <button onClick={action.onClick} style={{
              marginTop: 14, width: '100%',
              padding: '11px 0', borderRadius: 12,
              background: 'rgba(159,201,195,0.2)',
              border: '1px solid rgba(159,201,195,0.4)',
              cursor: 'pointer', fontSize: 14, fontWeight: 700,
              color: '#9FC9C3',
              fontFamily: "'Nunito', sans-serif",
            }}>
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
