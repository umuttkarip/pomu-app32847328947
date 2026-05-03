import { useState } from 'react';
import { getTasks, getSettings, saveSettings, getUserName, setUserName, getStreak } from '../storage';
import { BottomNav } from '../components/BottomNav';
import type { Tab, AppSettings } from '../types';

interface Props {
  onTabChange: (tab: Tab) => void;
}

const FOCUS_OPTIONS = [15, 20, 25, 30];
const BREAK_OPTIONS = [3, 5, 10];

const LEVEL_NAMES = ['Tohum', 'Filiz', 'Fidan', 'Çiçek', 'Orman', 'Efsane'];
const XP_PER_LEVEL = 10;

export function Profile({ onTabChange }: Props) {
  const [name, setName] = useState(() => getUserName());
  const [editingName, setEditingName] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());

  const tasks = getTasks();
  const streak = getStreak();
  const totalDone = tasks.filter((t) => t.status === 'done').length;
  const focusHours = Math.round(tasks.reduce((s, t) => s + t.completedPomodoros * (settings.focusDuration / 60), 0) * 10) / 10;
  const level = Math.floor(totalDone / XP_PER_LEVEL) + 1;
  const levelName = LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];

  function saveName() {
    const trimmed = name.trim() || 'Friend';
    setName(trimmed);
    setUserName(trimmed);
    setEditingName(false);
  }

  function updateSettings(patch: Partial<AppSettings>) {
    const updated = { ...settings, ...patch };
    setSettings(updated);
    saveSettings(updated);
  }

  function Stepper({ value, options, onChange }: { value: number; options: number[]; onChange: (v: number) => void }) {
    const idx = options.indexOf(value);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => idx > 0 && onChange(options[idx - 1])}
          disabled={idx === 0}
          style={{
            width: 28, height: 28, borderRadius: '50%',
            background: idx === 0 ? '#F2F7F6' : '#EDF6F4',
            border: 'none', cursor: idx === 0 ? 'default' : 'pointer',
            fontSize: 18, fontWeight: 700, color: idx === 0 ? '#C8DEDA' : '#9FC9C3',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >−</button>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#264653', minWidth: 40, textAlign: 'center' }}>
          {value} min
        </span>
        <button
          onClick={() => idx < options.length - 1 && onChange(options[idx + 1])}
          disabled={idx === options.length - 1}
          style={{
            width: 28, height: 28, borderRadius: '50%',
            background: idx === options.length - 1 ? '#F2F7F6' : '#EDF6F4',
            border: 'none', cursor: idx === options.length - 1 ? 'default' : 'pointer',
            fontSize: 18, fontWeight: 700, color: idx === options.length - 1 ? '#C8DEDA' : '#9FC9C3',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >+</button>
      </div>
    );
  }

  function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 0',
        borderBottom: '1px solid #F2F7F6',
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#264653' }}>{label}</span>
        {children}
      </div>
    );
  }

  const stats = [
    { label: 'Toplam görev', value: totalDone },
    { label: 'Odak saati', value: `${focusHours}s` },
    { label: 'En uzun seri', value: `${streak.current}🔥` },
    { label: 'Seviye', value: `${level} · ${levelName}` },
  ];

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: '#F6FBFA',
      minHeight: '844px', width: '390px',
      overflow: 'hidden', position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ padding: '56px 24px 8px', textAlign: 'center' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#264653' }}>Profil</div>
      </div>

      {/* Pomu + name */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 24px 0' }}>
        <img src="/images/wawing.png" alt="Pomu"
          style={{ width: 100, height: 100, objectFit: 'contain' }} />

        {editingName ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveName()}
              autoFocus
              maxLength={30}
              style={{
                fontSize: 20, fontWeight: 700, color: '#264653',
                border: '2px solid #9FC9C3', borderRadius: 10,
                padding: '6px 12px', outline: 'none',
                background: '#FFFFFF',
              }}
            />
            <button onClick={saveName} style={{
              background: '#9FC9C3', border: 'none', borderRadius: 8,
              padding: '8px 14px', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, color: '#FFFFFF',
            }}>Kaydet</button>
          </div>
        ) : (
          <button onClick={() => setEditingName(true)} style={{
            marginTop: 12, background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#264653' }}>{name || 'Arkadaş'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9FC9C3" strokeWidth="2.5" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
      </div>

      {/* Stats grid */}
      <div style={{
        margin: '20px 24px 0',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: '#FFFFFF', borderRadius: 16, padding: '16px',
            boxShadow: '0 1px 8px rgba(38,70,83,0.05)',
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#264653', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#8BADA8', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div style={{
        margin: '20px 24px 0',
        background: '#FFFFFF', borderRadius: 20,
        boxShadow: '0 1px 8px rgba(38,70,83,0.05)',
        padding: '4px 20px',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#AABCB8', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '16px 0 4px' }}>
          Ayarlar
        </div>
        <SettingRow label="Odak süresi">
          <Stepper value={settings.focusDuration} options={FOCUS_OPTIONS} onChange={(v) => updateSettings({ focusDuration: v })} />
        </SettingRow>
        <SettingRow label="Mola süresi">
          <Stepper value={settings.breakDuration} options={BREAK_OPTIONS} onChange={(v) => updateSettings({ breakDuration: v })} />
        </SettingRow>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#264653' }}>Hatırlatıcılar</span>
          <button
            onClick={() => updateSettings({ reminders: !settings.reminders })}
            style={{
              width: 48, height: 26, borderRadius: 13,
              background: settings.reminders ? '#9FC9C3' : '#E4EFED',
              border: 'none', cursor: 'pointer', position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <div style={{
              position: 'absolute', top: 3,
              left: settings.reminders ? 25 : 3,
              width: 20, height: 20, borderRadius: '50%',
              background: '#FFFFFF',
              boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
              transition: 'left 0.2s',
            }} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <BottomNav active="profile" onChange={onTabChange} />
    </div>
  );
}
