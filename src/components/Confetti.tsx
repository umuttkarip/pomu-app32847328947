import { useEffect, useRef } from 'react';

const COLORS = ['#9FC9C3', '#F6B089', '#264653', '#A8D5C8', '#F6C9A8', '#B5A8D5'];

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 390;
    canvas.height = 844;

    const particles: Particle[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * 390,
      y: -20,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      opacity: 1,
    }));

    let animId: number;
    let frame = 0;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.rotation += p.rotationSpeed;
        if (frame > 60) p.opacity = Math.max(0, p.opacity - 0.015);

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });

      if (particles.some((p) => p.opacity > 0)) {
        animId = requestAnimationFrame(draw);
      }
    }

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
}
