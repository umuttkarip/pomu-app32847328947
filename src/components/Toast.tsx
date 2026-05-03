import { useEffect, useState } from 'react';

interface Props {
  message: string;
  onDone: () => void;
}

export function Toast({ message, onDone }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in
    const t1 = setTimeout(() => setVisible(true), 10);
    // Fade-out after 1.8s
    const t2 = setTimeout(() => setVisible(false), 1800);
    // Remove after fade
    const t3 = setTimeout(onDone, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed',
      bottom: 100,
      left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)`,
      opacity: visible ? 1 : 0,
      transition: 'all 0.3s ease',
      background: '#264653',
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 700,
      fontFamily: "'Nunito', sans-serif",
      padding: '10px 22px',
      borderRadius: 20,
      boxShadow: '0 4px 16px rgba(38,70,83,0.25)',
      zIndex: 9999,
      whiteSpace: 'nowrap',
    }}>
      {message}
    </div>
  );
}
