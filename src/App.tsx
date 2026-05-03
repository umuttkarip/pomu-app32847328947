import { useState, useEffect } from 'react';
import { isOnboardingDone } from './storage';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Tasks } from './screens/Tasks';
import { Stats } from './screens/Stats';
import { Profile } from './screens/Profile';
import { FocusTimer } from './screens/FocusTimer';
import { AddTask } from './screens/AddTask';
import type { Tab, Task } from './types';

type AppView = 'onboarding' | Tab;

export function App() {
  const [view, setView] = useState<AppView>(() =>
    isOnboardingDone() ? 'home' : 'onboarding'
  );
  const [prevView, setPrevView] = useState<AppView>('home');
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskRefreshKey, setTaskRefreshKey] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  function navigateTo(next: AppView) {
    if (next === view) return;
    setTransitioning(true);
    setTimeout(() => {
      setPrevView(view);
      setView(next);
      setTransitioning(false);
    }, 100);
  }

  function handleTabChange(tab: Tab) {
    navigateTo(tab);
  }

  function handleOnboardingComplete() {
    navigateTo('home');
  }

  function handleStartFocus(task: Task) {
    setFocusTask(task);
  }

  function handleCloseFocus() {
    setFocusTask(null);
    setTaskRefreshKey((k) => k + 1);
  }

  function handleAddTask() {
    setShowAddTask(true);
  }

  function handleTaskAdded() {
    setTaskRefreshKey((k) => k + 1);
  }

  const screenStyle = {
    opacity: transitioning ? 0 : 1,
    transition: 'opacity 0.2s ease',
  };

  return (
    <div style={{ position: 'relative', width: 390 }}>
      <div style={screenStyle}>
        {view === 'onboarding' && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
        {view === 'home' && (
          <Home onTabChange={handleTabChange} onStartFocus={handleStartFocus} />
        )}
        {view === 'tasks' && (
          <Tasks
            onTabChange={handleTabChange}
            onAddTask={handleAddTask}
            onStartFocus={handleStartFocus}
            refreshKey={taskRefreshKey}
          />
        )}
        {view === 'stats' && (
          <Stats onTabChange={handleTabChange} />
        )}
        {view === 'profile' && (
          <Profile onTabChange={handleTabChange} />
        )}
      </div>

      {/* Focus Timer overlay */}
      {focusTask && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 300 }}>
          <FocusTimer task={focusTask} onClose={handleCloseFocus} />
        </div>
      )}

      {/* Add Task sheet */}
      {showAddTask && (
        <AddTask
          onClose={() => setShowAddTask(false)}
          onAdded={handleTaskAdded}
        />
      )}
    </div>
  );
}
