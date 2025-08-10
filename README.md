# ATaskPrompt

An ADHD/AU-friendly task app with positive prompts.

## Project Overview

ATaskPrompt is designed to help individuals with ADHD and Autism Spectrum disorders manage tasks through positive reinforcement rather than traditional notifications. The app uses popups, swipe gestures, and reward systems to make task completion engaging and satisfying.

## Architecture Plan

### 1. Overall App Strategy

The app will be built as a **Progressive Web App (PWA)** using **React** for the following reasons:

* **React PWA route** → works in browsers, can be installed on a phone's home screen, can be ported to mobile using Capacitor or Cordova later.
* Quick to build and test in VS Code
* Portable to phone apps in the future
* No need to set up native tooling initially

### 2. Directory Structure

```
src/
  components/
    TaskList.js        // Renders all tasks, allows adding/deleting
    TaskPrompt.js       // Shows the random task popup
    TaskSwipe.js        // Lets user swipe through tasks
    RewardAnimation.js  // Handles confetti/sound rewards
    TrophyBoard.js      // Displays earned trophies & dates
  pages/
    Home.js             // Main dashboard page
    History.js          // Shows completed tasks over time
    Settings.js         // Categories, frequency, group options
  utils/
    randomTask.js       // Function to pick a random task
    storage.js          // Save/load tasks from local storage
  styles/
    global.css
App.js                 // Main app layout and routing
index.js               // Entry point
```

### 3. Core Components

#### TaskList Component
- Renders all tasks in the system
- Provides interface for adding new tasks
- Allows deleting tasks
- Shows task categories and status

#### TaskPrompt Component
- Shows random task popup with positive phrasing
- Appears on schedule or randomly while the app is open
- Full-screen modal or centered popup card
- Designed to be engaging rather than interruptive

#### TaskSwipe Component
- Allows users to swipe through alternative tasks
- Uses react-swipeable for smooth mobile experience
- Provides quick task selection interface

#### RewardAnimation Component
- Handles confetti animations using canvas-confetti
- Manages sound rewards with HTML5 audio
- Provides visual and auditory positive reinforcement

#### TrophyBoard Component
- Displays earned trophies with date stamps
- Shows progress over time
- Provides motivation through achievement tracking

### 4. Data Models

#### Task Model
```javascript
{
  id: string,           // Unique identifier
  text: string,         // Task description
  category: string,     // Task category (e.g., "Health", "Work")
  completed: boolean,   // Completion status
  createdAt: Date,      // When task was created
  completedAt: Date     // When task was completed (if applicable)
}
```

#### Trophy Model
```javascript
{
  id: string,           // Unique identifier
  name: string,         // Trophy name
  description: string,  // Trophy description
  earnedAt: Date,       // When trophy was earned
  icon: string          // Trophy icon identifier
}
```

### 5. Storage Approach

* **Local Storage**: For solo mode, tasks and trophies will be stored in browser's local storage
* **Firebase/Supabase**: For multi-user mode, cloud storage will be implemented later

### 6. Core Tools and Libraries

* **Framework:** React with Vite for fast development
* **Storage:** LocalStorage API
* **Popups:** Custom modal component for better control
* **Swipe Feature:** react-swipeable library
* **Confetti:** canvas-confetti library
* **Sound Rewards:** HTML5 `<audio>` element
* **Trophies/Icons:** react-icons library
* **Styling:** Tailwind CSS for responsive design

### 7. UI/UX Design Principles

* **Positive Phrasing**: All prompts use encouraging language
* **Minimal Distractions**: Clean interface without unnecessary elements
* **Clear Visual Feedback**: Immediate response to user actions
* **Accessibility**: Support for screen readers and keyboard navigation
* **Mobile-First**: Responsive design that works well on all devices

### 8. Build Phases

#### Phase 1 (Solo Use - MVP)
* Add/delete tasks
* Random task popup with positive phrasing
* Swipe through alternatives
* Confetti + sound reward
* Trophy board with date stamps

#### Phase 2 (Shared Mode)
* Firebase backend for group lists
* Fair task rotation logic
* Category filters

#### Phase 3 (Smart Features)
* Productivity pattern analytics
* Customizable reward packs
* Mood-based task suggestions

### 9. Technical Considerations

* **Performance**: Lightweight implementation to ensure fast loading
* **Offline Support**: PWA capabilities for offline usage
* **Cross-Platform**: Consistent experience across browsers and devices
* **Scalability**: Modular architecture to support future enhancements