import { useEffect, useRef, useState } from 'react';

export type PomuMood =
  | 'idle'       // gentle float
  | 'sleeping'   // slow breathe
  | 'reading'    // slight sway
  | 'working'    // focused bob
  | 'sport'      // energetic bounce
  | 'jumping'    // big jump
  | 'waving'     // wave
  | 'curious';   // tilt

interface Props {
  mood: PomuMood;
  size?: number;
  style?: React.CSSProperties;
}

const MOOD_IMAGE: Record<PomuMood, string> = {
  idle:     '/images/wawing.png',
  sleeping: '/images/sleeping.png',
  reading:  '/images/reading.png',
  working:  '/images/reading.png',
  sport:    '/images/sport.png',
  jumping:  '/images/jumping.png',
  waving:   '/images/wawing.png',
  curious:  '/images/curious.png',
};

// Each mood gets a unique CSS animation name + keyframes
const MOOD_ANIMATION: Record<PomuMood, string> = {
  idle:     'pomu-float',
  sleeping: 'pomu-breathe',
  reading:  'pomu-sway',
  working:  'pomu-bob',
  sport:    'pomu-bounce',
  jumping:  'pomu-jump',
  waving:   'pomu-wave',
  curious:  'pomu-tilt',
};

const MOOD_DURATION: Record<PomuMood, string> = {
  idle:     '3s',
  sleeping: '4s',
  reading:  '2.5s',
  working:  '1.8s',
  sport:    '0.6s',
  jumping:  '0.8s',
  waving:   '1s',
  curious:  '2s',
};

// Inject keyframes once into the document
let injected = false;
function injectKeyframes() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pomu-float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50%       { transform: translateY(-8px) rotate(1deg); }
    }
    @keyframes pomu-breathe {
      0%, 100% { transform: scaleY(1) scaleX(1); }
      40%       { transform: scaleY(0.96) scaleX(1.03); }
      60%       { transform: scaleY(1.03) scaleX(0.98); }
    }
    @keyframes pomu-sway {
      0%, 100% { transform: rotate(-3deg) translateY(0px); }
      50%       { transform: rotate(3deg) translateY(-4px); }
    }
    @keyframes pomu-bob {
      0%, 100% { transform: translateY(0px) scaleY(1); }
      30%       { transform: translateY(-6px) scaleY(1.04); }
      60%       { transform: translateY(2px) scaleY(0.97); }
    }
    @keyframes pomu-bounce {
      0%, 100% { transform: translateY(0px) scaleY(1) scaleX(1); }
      20%       { transform: translateY(-18px) scaleY(1.08) scaleX(0.94); }
      50%       { transform: translateY(-22px) scaleY(1.1) scaleX(0.92); }
      75%       { transform: translateY(4px) scaleY(0.92) scaleX(1.06); }
    }
    @keyframes pomu-jump {
      0%   { transform: translateY(0px) scaleY(1) scaleX(1); }
      20%  { transform: translateY(6px) scaleY(0.88) scaleX(1.1); }
      50%  { transform: translateY(-28px) scaleY(1.12) scaleX(0.9); }
      80%  { transform: translateY(4px) scaleY(0.9) scaleX(1.08); }
      100% { transform: translateY(0px) scaleY(1) scaleX(1); }
    }
    @keyframes pomu-wave {
      0%, 100% { transform: rotate(0deg) translateY(0px); }
      25%       { transform: rotate(-8deg) translateY(-3px); }
      75%       { transform: rotate(8deg) translateY(-3px); }
    }
    @keyframes pomu-tilt {
      0%, 100% { transform: rotate(0deg) translateY(0px); }
      30%       { transform: rotate(-6deg) translateY(-2px); }
      70%       { transform: rotate(4deg) translateY(-4px); }
    }
  `;
  document.head.appendChild(style);
}

export function PomuAnimated({ mood, size = 120, style }: Props) {
  injectKeyframes();
  const [prevMood, setPrevMood] = useState(mood);
  const [opacity, setOpacity] = useState(1);

  // Crossfade when mood changes
  useEffect(() => {
    if (mood === prevMood) return;
    setOpacity(0);
    const t = setTimeout(() => {
      setPrevMood(mood);
      setOpacity(1);
    }, 200);
    return () => clearTimeout(t);
  }, [mood, prevMood]);

  return (
    <div style={{ width: size, height: size, ...style }}>
      <img
        src={MOOD_IMAGE[prevMood]}
        alt="Pomu"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity,
          transition: 'opacity 0.2s ease',
          animation: `${MOOD_ANIMATION[prevMood]} ${MOOD_DURATION[prevMood]} ease-in-out infinite`,
          transformOrigin: 'bottom center',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
