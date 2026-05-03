import type { Tab } from '../types';

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'stats', label: 'Stats' },
  { id: 'profile', label: 'Profile' },
];

function NavIcon({ id, active }: { id: Tab; active: boolean }) {
  const color = active ? '#9FC9C3' : '#BCCCC8';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {id === 'home' && (
        <>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </>
      )}
      {id === 'tasks' && (
        <>
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </>
      )}
      {id === 'stats' && (
        <>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </>
      )}
      {id === 'profile' && (
        <>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </>
      )}
    </svg>
  );
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderTop: '1px solid #EEF4F3',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '14px 0 32px',
      flexShrink: 0,
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 16px',
          }}
        >
          <NavIcon id={tab.id} active={active === tab.id} />
          {active === tab.id && (
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#9FC9C3' }} />
          )}
        </button>
      ))}
    </div>
  );
}
