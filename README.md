# Pomu — Focus Buddy App

A fully functional React mobile app with an adorable Pomu mascot that helps you stay focused and productive.

## ✨ Features

### Implemented Screens
1. **Onboarding Flow** (3 screens)
   - Meet Pomu introduction
   - How it works walkthrough
   - Name input with localStorage persistence
   - Skip button and dot indicators

2. **Home Screen**
   - Personalized greeting with user's name
   - Pomu character with animated idle bounce
   - Circular progress ring showing task completion
   - Today's task preview (first 4 tasks)
   - Streak counter with flame icon
   - Pomu mood changes based on progress (sleeping/reading/jumping)
   - All-done celebration with confetti

3. **Tasks Screen**
   - Segment tabs: Today / Upcoming / All
   - Interactive task list with checkboxes
   - Task categories with colored dots
   - Priority indicators (low/medium/high)
   - Pomodoro progress tracking
   - Completed tasks section (auto-sorted to bottom)
   - Long-press to delete with confirmation modal
   - "Start Focus" quick action buttons

4. **Stats Screen**
   - Pomu with level accessory
   - Level system (Seedling → Ancient) with XP progress bar
   - Weekly bar chart (Mon-Sun, today highlighted)
   - Streak section with 30-day dot grid
   - Visual progress tracking

5. **Profile Screen**
   - Editable display name
   - Lifetime stats grid (Total tasks, Focus hours, Best streak, Level)
   - Settings:
     - Focus duration stepper (15/20/25/30 min)
     - Break duration stepper (3/5/10 min)
     - Reminders toggle

6. **Focus Timer** (Full-screen overlay)
   - Large circular countdown timer
   - Pomu changes based on task category (reading/sport/curious)
   - Pause/Resume functionality
   - Pomodoro completion tracking
   - Break mode with countdown
   - Completion celebration with confetti and Pomu jumping
   - "Take Break" and "Done" buttons

7. **Add Task** (Bottom sheet modal)
   - Task name input
   - Category selector (Work/Personal/Health/Study/Creative)
   - Due date selector (Today/Tomorrow)
   - Priority selector (Low/Medium/High)
   - Focus timer toggle
   - Pomodoro count selector (1-4)
   - Smooth slide-up animation

### Functional Features
- ✅ **localStorage persistence** for all data (tasks, settings, streak, user name)
- ✅ **Onboarding shown only once** (localStorage flag)
- ✅ **Task management**: Add, complete, delete tasks
- ✅ **Streak system**: Increments daily, resets if missed
- ✅ **Focus timer**: Configurable duration, pause/resume, break mode
- ✅ **Pomodoro tracking**: Tracks completed pomodoros per task
- ✅ **Level system**: XP based on completed tasks
- ✅ **Seeded sample tasks** on first launch
- ✅ **Toast notifications** on task completion
- ✅ **Confetti animations** for celebrations
- ✅ **Smooth transitions** between tabs (200ms fade)
- ✅ **Pomu idle animation** (gentle bounce on Home screen)
- ✅ **Responsive checkboxes** with fill animation
- ✅ **Bottom navigation** with active indicators

### Design System
- **Colors**: Primary #9FC9C3, Accent #F6B089, Dark #264653, Background #F6FBFA
- **Typography**: Nunito (500/600/700/800 weights)
- **Spacing**: 24px horizontal padding, 16-24px border radius
- **Shadows**: 0 1px 8px rgba(38,70,83,0.05)
- **Mobile viewport**: 390px × 844px

### Character Images
- `pomu-waving.png` — Onboarding, Profile
- `pomu-jumping.png` — Onboarding, Celebrations
- `pomu-curious.png` — Default focus state
- `pomu-reading.png` — Work/Study tasks, Home progress
- `pomu-sleeping.png` — Empty states, Break mode
- `pomu-sport.png` — Health/Exercise tasks
- `pomu-waving2.png` — Stats screen, Name input

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

**Note**: Due to Google Drive sync issues in the current workspace, install from a local directory:

```bash
# Copy the project to a local directory (outside Google Drive)
cp -r pomu-app ~/pomu-app
cd ~/pomu-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app will run at `http://localhost:5173` and is optimized for mobile viewport (390×844px). Use browser DevTools mobile emulation for the best experience.

## 📁 Project Structure

```
pomu-app/
├── public/
│   └── images/          # Pomu character images
├── src/
│   ├── components/      # Shared components
│   │   ├── BottomNav.tsx
│   │   ├── Confetti.tsx
│   │   └── Toast.tsx
│   ├── screens/         # Main screens
│   │   ├── Onboarding.tsx
│   │   ├── Home.tsx
│   │   ├── Tasks.tsx
│   │   ├── Stats.tsx
│   │   ├── Profile.tsx
│   │   ├── FocusTimer.tsx
│   │   └── AddTask.tsx
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   ├── types.ts         # TypeScript types
│   └── storage.ts       # localStorage utilities
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Design Decisions

- **No external UI libraries**: All styling is inline or CSS modules matching the exact design specs
- **localStorage only**: No backend required, fully client-side
- **Mobile-first**: Fixed 390px width, centered on desktop
- **Smooth animations**: CSS transitions for all state changes
- **Accessible**: Proper semantic HTML and ARIA labels
- **TypeScript**: Full type safety throughout

## 🐛 Known Limitations

- No swipe gestures for onboarding (click "Next" instead)
- No notification API integration (reminders toggle is UI-only)
- Streak calculation is simple (doesn't account for timezone changes)
- No task editing (delete and recreate instead)
- No task reordering (sorted by creation date)

## 📝 License

This is a demo project created for educational purposes.

---

Built with ❤️ using React, TypeScript, and Vite
