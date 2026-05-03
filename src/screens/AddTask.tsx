import { useState } from 'react';
import type { Task, Category, Priority } from '../types';
import { getTasks, saveTasks, todayStr } from '../storage';

interface Props {
  onClose: () => void;
  onAdded: () => void;
}

const CATEGORIES: { name: Category; color: string }[] = [
  { name: 'Work', color: '#9FC9C3' },
  { name: 'Personal', color: '#F6B089' },
  { name: 'Health', color: '#A8D5C8' },
  { name: 'Study', color: '#B5A8D5' },
  { name: 'Creative', color: '#F6C9A8' },
];

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Düşük', color: '#C8DEDA' },
  { value: 'medium', label: 'Orta', color: '#F6B089' },
  { value: 'high', label: 'Yüksek', color: '#EF6C6C' },
];

export function AddTask({ onClose, onAdded }: Props) {
  const [taskName, setTaskName] = useState('');
  const [category, setCategory] = useState<Category>('Work');
  const [priority, setPriority] = useState<Priority>('low');
  const [dueDate, setDueDate] = useState<'today' | 'tomorrow'>('today');
  const [hasFocus, setHasFocus] = useState(false);
  const [pomodoros, setPomodoros] = useState(1);

  const tomorrow = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  })();

  function handleAdd() {
    if (!taskName.trim()) return;
    const catColor = CATEGORIES.find((c) => c.name === category)?.color || '#9FC9C3';
    const newTask: Task = {
      id: `task-${Date.now()}`,
      name: taskName.trim(),
      category,
      categoryColor: catColor,
      priority,
      dueDate: dueDate === 'today' ? todayStr() : tomorrow,
      hasFocusTimer: hasFocus,
      estimatedPomodoros: hasFocus ? pomodoros : 1,
      completedPomodoros: 0,
      status: 'active',
    };
    const tasks = getTasks();
    saveTasks([...tasks, newTask]);
    onAdded();
    onClose();
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: 'rgba(38,70,83,0.5)',
      display: 'flex', alignItems: 'flex-end',
      fontFamily: "'Nunito', sans-serif",
    }}>
      {/* Backdrop tap to close */}
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

      <div style={{
        position: 'relative', width: '100%',
        background: '#FFFFFF',
        borderRadius: '24px 24px 0 0',
        padding: '24px 24px 40px',
        maxHeight: '85vh',
        overflowY: 'auto',
      }}>
        {/* Handle */}
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: '#E4EFED', margin: '0 auto 20px',
        }} />

        <div style={{ fontSize: 20, fontWeight: 800, color: '#264653', marginBottom: 20 }}>
          Yeni Görev
        </div>

        <input
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Ne yapman gerekiyor?"
          autoFocus
          maxLength={80}
          style={{
            width: '100%',
            background: '#F6FBFA', borderRadius: 14, padding: '14px 16px',
            border: '2px solid #9FC9C3',
            fontSize: 16, fontWeight: 600, color: '#264653',
            outline: 'none', marginBottom: 20,
          }}
        />

        {/* Category */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#8BADA8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Kategori
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 20,
                  background: category === cat.name ? cat.color + '33' : '#F6FBFA',
                  border: `2px solid ${category === cat.name ? cat.color : '#E4EFED'}`,
                  cursor: 'pointer',
                  fontSize: 13, fontWeight: 600,
                  color: category === cat.name ? '#264653' : '#8BADA8',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color }} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Due date */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#8BADA8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Tarih
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {(['today', 'tomorrow'] as const).map((d) => (
              <button key={d} onClick={() => setDueDate(d)} style={{
                padding: '8px 18px', borderRadius: 20,
                background: dueDate === d ? '#9FC9C3' : '#F6FBFA',
                border: `2px solid ${dueDate === d ? '#9FC9C3' : '#E4EFED'}`,
                cursor: 'pointer', fontSize: 14, fontWeight: 600,
                color: dueDate === d ? '#264653' : '#8BADA8',
                transition: 'all 0.15s',
              }}>
                {d === 'today' ? 'Bugün' : 'Yarın'}
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#8BADA8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Öncelik
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                onClick={() => setPriority(p.value)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '8px 0', borderRadius: 12,
                  background: priority === p.value ? p.color + '22' : '#F6FBFA',
                  border: `2px solid ${priority === p.value ? p.color : '#E4EFED'}`,
                  cursor: 'pointer',
                  fontSize: 13, fontWeight: 600,
                  color: priority === p.value ? '#264653' : '#8BADA8',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Focus timer toggle */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', background: '#F6FBFA', borderRadius: 14,
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#264653' }}>Odak Zamanlayıcı</div>
              <div style={{ fontSize: 12, color: '#8BADA8', fontWeight: 500 }}>Pomodoro seansı kullan</div>
            </div>
            <button
              onClick={() => setHasFocus(!hasFocus)}
              style={{
                width: 48, height: 26, borderRadius: 13,
                background: hasFocus ? '#9FC9C3' : '#E4EFED',
                border: 'none', cursor: 'pointer', position: 'relative',
                transition: 'background 0.2s',
              }}
            >
              <div style={{
                position: 'absolute', top: 3,
                left: hasFocus ? 25 : 3,
                width: 20, height: 20, borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                transition: 'left 0.2s',
              }} />
            </button>
          </div>

          {hasFocus && (
            <div style={{
              marginTop: 10, padding: '14px 16px',
              background: '#EDF6F4', borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#264653' }}>
                🍅 Pomodoros
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setPomodoros(n)}
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: pomodoros === n ? '#9FC9C3' : '#FFFFFF',
                      border: `2px solid ${pomodoros === n ? '#9FC9C3' : '#C8DEDA'}`,
                      cursor: 'pointer',
                      fontSize: 14, fontWeight: 700,
                      color: pomodoros === n ? '#264653' : '#8BADA8',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add button */}
        <button
          onClick={handleAdd}
          disabled={!taskName.trim()}
          style={{
            width: '100%', padding: '18px 0', borderRadius: 18,
            background: taskName.trim() ? '#F6B089' : '#E4EFED',
            border: 'none', cursor: taskName.trim() ? 'pointer' : 'default',
            fontSize: 18, fontWeight: 800,
            color: taskName.trim() ? '#FFFFFF' : '#AABCB8',
            boxShadow: taskName.trim() ? '0 4px 16px rgba(246,176,137,0.35)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          Görevi Ekle
        </button>
      </div>
    </div>
  );
}
