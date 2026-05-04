import { useState, useEffect, useRef, useCallback } from 'react';
import type { Task } from '../types';
import { getTasks, saveTasks, getSettings, updateStreakForToday } from '../storage';
import { Confetti } from '../components/Confetti';
import { PomuAnimated, type PomuMood } from '../components/PomuAnimated';
import { CompanionBubble } from '../components/CompanionBubble';
import { getFocusStartMessage, getBreakMessage, getFocusMood } from '../companion';

interface Props {
  task: Task;
  onClose: () => void;
}

type TimerState = 'idle' | 'running' | 'paused' | 'done' | 'break';

export function FocusTimer({ task, onClose }: Props) {
  const settings = getSettings();
  const focusSecs = settings.focusDuration * 60;
  const breakSecs = settings.breakDuration * 60;

  const [state, setState] = useState<TimerState>('idle');
  const [secondsLeft, setSecondsLeft] = useState(focusSecs);
  const [isBreak, setIsBreak] = useState(false);
  const [bubbleMsg, setBubbleMsg] = useState<string | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSecs = isBreak ? breakSecs : focusSecs;
  const progress = 1 - secondsLeft / totalSecs;

  const R = 100;
  const circ = 2 * Math.PI * R;
  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const secs = (secondsLeft % 60).toString().padStart(2, '0');

  // Pomu mood during focus
  const focusMood = getFocusMood(task.category) as PomuMood;
  let pomuMood: PomuMood = 'idle';
  if (state === 'done') pomuMood = 'jumping';
  else if (isBreak) pomuMood = 'sleeping';
  else if (state === 'running') pomuMood = focusMood;
  else if (state === 'paused') pomuMood = 'curious';
  else pomuMood = 'waving'; // idle state

  function showBubble(msg: string, duration = 3000) {
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    setBubbleMsg(msg);
    setBubbleVisible(true);
    bubbleTimer.current = setTimeout(() => setBubbleVisible(false), duration);
  }

  // Greeting when timer opens
  useEffect(() => {
    const msg = getFocusStartMessage(task.category);
    setTimeout(() => showBubble(msg, 3500), 600);
    return () => { if (bubbleTimer.current) clearTimeout(bubbleTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleComplete = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isBreak) {
      const tasks = getTasks();
      const updated = tasks.map((t) => {
        if (t.id !== task.id) return t;
        const newCompleted = t.completedPomodoros + 1;
        const nowDone = newCompleted >= t.estimatedPomodoros;
        return {
          ...t,
          completedPomodoros: newCompleted,
          status: nowDone ? 'done' : t.status,
          completedAt: nowDone ? new Date().toISOString() : t.completedAt,
        } as Task;
      });
      saveTasks(updated);
      updateStreakForToday();
      setState('done');
      setTimeout(() => showBubble('Harika iş! 🎉', 4000), 400);
    } else {
      setState('idle');
      setIsBreak(false);
      setSecondsLeft(focusSecs);
      setTimeout(() => showBubble(getFocusStartMessage(task.category), 3000), 400);
    }
  }, [isBreak, task.id, task.category, focusSecs]);

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) { handleComplete(); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [state, handleComplete]);

  function handleStart() {
    setState('running');
    showBubble('Odaklanıyoruz! 🎯', 2000);
  }

  function handlePause() {
    setState('paused');
    showBubble('Mola mı? Tamam 😌', 2000);
  }

  function handleResume() {
    setState('running');
    showBubble('Devam! 💪', 1500);
  }

  function startBreak() {
    setIsBreak(true);
    setSecondsLeft(breakSecs);
    setState('running');
    showBubble(getBreakMessage(), 3000);
  }

  const bgColor = isBreak ? '#1A3A4A' : '#1E3A3A';

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: bgColor,
      minHeight: '100dvh', height: '100%', width: '390px',
      overflow: 'hidden', position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      {state === 'done' && <Confetti />}

      {/* Close */}
      <button onClick={onClose} style={{
        position: 'absolute', top: 56, right: 24,
        width: 36, height: 36, borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)', border: 'none',
        cursor: 'pointer', color: 'rgba(255,255,255,0.7)',
        fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>✕</button>

      <div style={{ flex: '0 0 72px' }} />

      {/* Task info */}
      <div style={{ textAlign: 'center', padding: '0 32px', marginBottom: 8 }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: 6 }}>
          {isBreak ? '☕ Mola zamanı' : '🎯 Odak seansı'}
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3 }}>
          {task.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: task.categoryColor }} />
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{task.category}</span>
        </div>
      </div>

      {/* Timer ring */}
      <div style={{ position: 'relative', width: 240, height: 240, margin: '24px 0' }}>
        <svg width="240" height="240" viewBox="0 0 240 240" style={{ position: 'absolute', inset: 0 }}>
          <circle cx="120" cy="120" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
          <circle
            cx="120" cy="120" r={R}
            fill="none"
            stroke={isBreak ? '#F6B089' : '#9FC9C3'}
            strokeWidth="10"
            strokeDasharray={`${circ * progress} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 120 120)"
            style={{ transition: 'stroke-dasharray 0.5s linear' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1px', lineHeight: 1 }}>
            {mins}:{secs}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: 4 }}>
            {isBreak ? 'mola' : 'odak'}
          </div>
        </div>
      </div>

      {/* Animated Pomu with bubble */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {state === 'done' && (
          <div style={{ textAlign: 'center', marginBottom: 8, position: 'relative', zIndex: 11 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF' }}>Tamamlandı! 🎉</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 500, marginTop: 4 }}>
              Harika bir seans!
            </div>
          </div>
        )}
        <div style={{ position: 'relative' }}>
          {/* Bubble above Pomu — white text on dark bg */}
          <div style={{
            position: 'absolute',
            top: -52,
            left: '50%',
            transform: `translateX(-50%) translateY(${bubbleVisible ? 0 : 8}px)`,
            opacity: bubbleVisible ? 1 : 0,
            transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: 10,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              borderRadius: 16,
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 600,
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.2)',
              position: 'relative',
            }}>
              {bubbleMsg}
              <div style={{
                position: 'absolute', bottom: -6, left: '50%',
                transform: 'translateX(-50%)',
                width: 0, height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid rgba(255,255,255,0.15)',
              }} />
            </div>
          </div>
          <PomuAnimated mood={pomuMood} size={120} />
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Controls */}
      <div style={{ width: '100%', padding: '0 24px 48px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {state === 'done' ? (
          <>
            <button onClick={startBreak} style={{
              width: '100%', padding: '16px 0', borderRadius: 16,
              background: 'transparent', border: '2px solid rgba(255,255,255,0.3)',
              cursor: 'pointer', fontSize: 16, fontWeight: 700, color: '#FFFFFF',
            }}>
              ☕ Mola Al ({settings.breakDuration} dk)
            </button>
            <button onClick={onClose} style={{
              width: '100%', padding: '16px 0', borderRadius: 16,
              background: '#9FC9C3', border: 'none',
              cursor: 'pointer', fontSize: 16, fontWeight: 700, color: '#264653',
            }}>
              Bitti
            </button>
          </>
        ) : state === 'running' ? (
          <button onClick={handlePause} style={{
            width: '100%', padding: '16px 0', borderRadius: 16,
            background: 'transparent', border: '2px solid rgba(255,255,255,0.3)',
            cursor: 'pointer', fontSize: 16, fontWeight: 700, color: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
            Duraklat
          </button>
        ) : state === 'paused' ? (
          <button onClick={handleResume} style={{
            width: '100%', padding: '16px 0', borderRadius: 16,
            background: 'transparent', border: '2px solid rgba(255,255,255,0.3)',
            cursor: 'pointer', fontSize: 16, fontWeight: 700, color: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Devam Et
          </button>
        ) : (
          <button onClick={handleStart} style={{
            width: '100%', padding: '16px 0', borderRadius: 16,
            background: '#9FC9C3', border: 'none',
            cursor: 'pointer', fontSize: 16, fontWeight: 700, color: '#264653',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#264653">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Başla
          </button>
        )}
      </div>
    </div>
  );
}
