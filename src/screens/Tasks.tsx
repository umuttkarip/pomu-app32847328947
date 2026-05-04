import { useState, useRef } from 'react';
import type { Task } from '../types';
import { BottomNav } from '../components/BottomNav';
import { Toast } from '../components/Toast';
import { getTasks, saveTasks, updateStreakForToday, todayStr } from '../storage';
import type { Tab } from '../types';

interface Props {
  onTabChange: (tab: Tab) => void;
  onAddTask: () => void;
  onStartFocus: (task: Task) => void;
  refreshKey?: number;
}

type Segment = 'Bugün' | 'Yakında' | 'Tümü';

const TOASTS = ['Süper! 🎉', 'Devam et! 💪', 'Harika! ✨', 'Bir tane daha! 🙌', 'Yanıyorsun! 🔥'];

export function Tasks({ onTabChange, onAddTask, onStartFocus, refreshKey }: Props) {
  const [tasks, setTasks] = useState<Task[]>(() => getTasks());
  const [segment, setSegment] = useState<Segment>('Bugün');
  const [toast, setToast] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-read tasks when refreshKey changes (after adding a task)
  const prevRefreshKey = useRef(refreshKey);
  if (refreshKey !== prevRefreshKey.current) {
    prevRefreshKey.current = refreshKey;
    setTasks(getTasks());
  }

  const today = todayStr();
  const tomorrow = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); })();

  function getFiltered(): Task[] {
    if (segment === 'Bugün') return tasks.filter((t) => t.dueDate === today);
    if (segment === 'Yakında') return tasks.filter((t) => t.dueDate > today);
    return tasks;
  }

  const filtered = getFiltered();
  const active = filtered.filter((t) => t.status === 'active');
  const done = filtered.filter((t) => t.status === 'done');

  function toggleTask(id: string) {
    const updated = tasks.map((t) => {
      if (t.id !== id) return t;
      const nowDone = t.status !== 'done';
      return { ...t, status: nowDone ? 'done' : 'active', completedAt: nowDone ? new Date().toISOString() : undefined } as Task;
    });
    setTasks(updated);
    saveTasks(updated);
    const task = tasks.find((t) => t.id === id);
    if (task && task.status === 'active') {
      setToast(TOASTS[Math.floor(Math.random() * TOASTS.length)]);
      updateStreakForToday();
    }
  }

  function deleteTask(id: string) {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    saveTasks(updated);
    setDeleteConfirm(null);
  }

  function handleLongPressStart(id: string) {
    longPressTimer.current = setTimeout(() => setDeleteConfirm(id), 600);
  }

  function handleLongPressEnd() {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }

  function formatDue(dueDate: string): string {
    if (dueDate === today) return 'Bugün';
    if (dueDate === tomorrow) return 'Yarın';
    return new Date(dueDate).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
  }

  function TaskRow({ task }: { task: Task }) {
    return (
      <div
        onMouseDown={() => handleLongPressStart(task.id)}
        onMouseUp={handleLongPressEnd}
        onTouchStart={() => handleLongPressStart(task.id)}
        onTouchEnd={handleLongPressEnd}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          paddingBottom: 14, marginBottom: 14,
          borderBottom: '1px solid #EDF2F1',
          opacity: task.status === 'done' ? 0.45 : 1,
          transition: 'opacity 0.3s',
        }}
      >
        <button
          onClick={() => toggleTask(task.id)}
          style={{
            width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
            background: task.status === 'done' ? '#9FC9C3' : 'transparent',
            border: task.status === 'done' ? 'none' : '2px solid #C8DEDA',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0,
            transition: 'background 0.2s',
          }}
        >
          {task.status === 'done' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 15, color: '#264653', fontWeight: 500, marginBottom: 3,
            textDecoration: task.status === 'done' ? 'line-through' : 'none',
          }}>
            {task.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: task.categoryColor }} />
            <span style={{ fontSize: 12, color: '#AABCB8', fontWeight: 500 }}>
              {task.category} · {formatDue(task.dueDate)}
            </span>
            {task.hasFocusTimer && (
              <span style={{ fontSize: 11, color: '#9FC9C3', fontWeight: 600 }}>
                🍅 {task.completedPomodoros}/{task.estimatedPomodoros}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {task.priority === 'high' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF6C6C', flexShrink: 0 }} />}
          {task.priority === 'medium' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F6B089', flexShrink: 0 }} />}
          {task.status === 'active' && task.hasFocusTimer && (
            <button
              onClick={() => onStartFocus(task)}
              style={{
                background: '#EDF6F4', border: 'none', borderRadius: 8,
                padding: '4px 8px', cursor: 'pointer',
                fontSize: 11, fontWeight: 700, color: '#9FC9C3',
              }}
            >
              Odak
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: '#F6FBFA',
      minHeight: '100dvh', height: '100%', width: '390px',
      overflow: 'hidden', position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 100,
          background: 'rgba(38,70,83,0.4)',
          display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{
            width: '100%', background: '#FFFFFF',
            borderRadius: '24px 24px 0 0', padding: '28px 24px 40px',
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#264653', marginBottom: 8 }}>Görevi sil?</div>
            <div style={{ fontSize: 14, color: '#8BADA8', fontWeight: 500, marginBottom: 24 }}>
              "{tasks.find(t => t.id === deleteConfirm)?.name}" silinecek.
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{
                flex: 1, padding: '14px 0', borderRadius: 14,
                background: '#EDF6F4', border: 'none', cursor: 'pointer',
                fontSize: 15, fontWeight: 700, color: '#264653',
              }}>Vazgeç</button>
              <button onClick={() => deleteTask(deleteConfirm)} style={{
                flex: 1, padding: '14px 0', borderRadius: 14,
                background: '#EF6C6C', border: 'none', cursor: 'pointer',
                fontSize: 15, fontWeight: 700, color: '#FFFFFF',
              }}>Sil</button>
            </div>
          </div>
        </div>
      )}

      {/* Segment control */}
      <div style={{ padding: '44px 24px 16px' }}>
        <div style={{ display: 'flex', background: '#EAEFEF', borderRadius: 12, padding: 4, gap: 2 }}>
          {(['Bugün', 'Yakında', 'Tümü'] as Segment[]).map((label) => (
            <button key={label} onClick={() => setSegment(label)} style={{
              flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 10,
              background: segment === label ? '#9FC9C3' : 'transparent',
              fontSize: 14, fontWeight: segment === label ? 700 : 500,
              color: segment === label ? '#264653' : '#9BAEAA',
              cursor: 'pointer', border: 'none',
              transition: 'background 0.2s',
            }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
        {active.length === 0 && done.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <img src="/images/sleeping.png" alt="Pomu sleeping"
              style={{ width: 100, height: 100, objectFit: 'contain', opacity: 0.6 }} />
            <div style={{ fontSize: 15, color: '#8BADA8', fontWeight: 500, marginTop: 16 }}>
              Henüz görev yok
            </div>
          </div>
        )}

        {active.map((task) => <TaskRow key={task.id} task={task} />)}

        {done.length > 0 && (
          <>
            <div style={{
              fontSize: 12, fontWeight: 700, color: '#AABCB8',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              marginBottom: 12, marginTop: 4,
            }}>
              Tamamlananlar
            </div>
            {done.map((task) => <TaskRow key={task.id} task={task} />)}
          </>
        )}
      </div>

      {/* Add task button */}
      <div style={{ padding: '12px 24px 16px' }}>
        <button onClick={onAddTask} style={{
          width: '100%', padding: '16px 0', borderRadius: 16,
          background: '#F6B089', border: 'none', cursor: 'pointer',
          fontSize: 16, fontWeight: 700, color: '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 4px 14px rgba(246,176,137,0.3)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Görev Ekle
        </button>
      </div>

      <BottomNav active="tasks" onChange={onTabChange} />

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
