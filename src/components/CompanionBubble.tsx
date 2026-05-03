import { useEffect, useState } from 'react';

interface Props {
  message: string | null;
  visible: boolean;
}

export function CompanionBubble({ message, visible }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible && message) {
      const t = setTimeout(() => setShow(true), 300);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [visible, message]);

  if (!message) return null;

  return (
    <div style={{
      position: 'absolute',
      top: -52,
      left: '50%',
      transform: `translateX(-50%) translateY(${show ? 0 : 8}px)`,
      opacity: show ? 1 : 0,
      transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      zIndex: 10,
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
    }}>
      {/* Bubble */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: '8px 14px',
        boxShadow: '0 4px 16px rgba(38,70,83,0.12)',
        fontSize: 13,
        fontWeight: 600,
        color: '#264653',
        fontFamily: "'Nunito', sans-serif",
        border: '1.5px solid #EDF6F4',
        position: 'relative',
      }}>
        {message}
        {/* Tail */}
        <div style={{
          position: 'absolute',
          bottom: -7,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderTop: '7px solid #FFFFFF',
          filter: 'drop-shadow(0 2px 2px rgba(38,70,83,0.08))',
        }} />
      </div>
    </div>
  );
}
