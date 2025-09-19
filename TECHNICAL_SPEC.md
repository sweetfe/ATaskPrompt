# ATaskPrompt Technical Specification

## 1. Overview

ATaskPrompt is an ADHD/AU-friendly task management application that uses positive reinforcement instead of traditional notifications. The app provides random task prompts, swipe-based task selection, and reward systems to encourage task completion.

## 2. Architecture

### 2.1 Technology Stack

- **Frontend Framework**: React with Vite
- **State Management**: React Context API / Redux (TBD)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Storage**: LocalStorage API (with future Firebase/Supabase integration)
- **Animations**: canvas-confetti, CSS animations
- **Gestures**: react-swipeable
- **Icons**: react-icons
- **Audio**: HTML5 Audio API

- **Build Tool**: Vite
- **Testing**: Jest, React Testing Library
- **Deployment**: Netlify/Vercel (PWA)

### 2.2 Project Structure

```
src/
  components/
    TaskList.js        // Renders all tasks, allows adding/deleting
    TaskPrompt.js       // Shows the random task popup
    TaskSwipe.js        // Lets user swipe through tasks
    RewardAnimation.js  // Handles confetti/sound rewards
    TrophyBoard.js      // Displays earned trophies & dates
    TaskDetails.js      // Shows details for a specific task
    TaskSearch.js       // Search functionality for tasks
  pages/
    Home.js             // Main dashboard page
    History.js          // Shows completed tasks over time
    Settings.js         // Categories, frequency, group options
  utils/
    randomTask.js       // Function to pick a random task
    storage.js          // Save/load tasks from local storage
    rewards.js          // Reward system management
    popup.js            // Popup timing and display logic
  styles/
    global.css
  hooks/
    useTasks.js         // Custom hook for task management
    useRewards.js       // Custom hook for reward system
    usePopup.js         // Custom hook for popup system
  context/
    AppContext.js       // Global application state
App.js                 // Main app layout and routing
main.js                // Entry point
```

## 3. Core Components

### 3.1 TaskList Component

**Purpose**: Manage and display the collection of tasks

**Props**:
- `tasks`: Array of task objects
- `onAddTask`: Function to add a new task
- `onDeleteTask`: Function to delete a task
- `onCompleteTask`: Function to mark a task as completed

**State**:
- `newTaskText`: String for the input field
- `selectedCategory`: String for filtering tasks

**Methods**:
- `handleAddTask()`: Process adding a new task
- `handleDeleteTask(id)`: Process deleting a task
- `handleCompleteTask(id)`: Process completing a task

### 3.2 TaskPrompt Component

**Purpose**: Display random positive task prompts to the user

**Props**:
- `task`: Current task object to display
- `isVisible`: Boolean to control visibility
- `onAccept`: Function called when user accepts task
- `onSkip`: Function called when user skips task
- `onDelay`: Function called when user delays task

**State**:
- `showPrompt`: Boolean to control visibility
- `currentTask`: Task object being displayed

**Methods**:
- `showRandomTask()`: Select and display a random task
- `handleAccept()`: Process task acceptance
- `handleSkip()`: Process task skipping
- `handleDelay()`: Process task delay

### 3.3 TaskSwipe Component

**Purpose**: Enable users to swipe through alternative tasks

**Props**:
- `tasks`: Array of task objects
- `onSwipeLeft`: Function called when swiping left
- `onSwipeRight`: Function called when swiping right

**State**:
- `currentIndex`: Index of currently displayed task
- `swipeDirection`: Current swipe direction for animations

**Methods**:
- `handleSwipe(direction)`: Process swipe action
- `nextTask()`: Move to next task in array
- `prevTask()`: Move to previous task in array

### 3.4 RewardAnimation Component

**Purpose**: Provide positive reinforcement through visual and auditory rewards

**Props**:
- `isActive`: Boolean to control when to show rewards
- `rewardType`: String indicating type of reward
- `onComplete`: Function called when reward animation completes

**State**:
- `showConfetti`: Boolean to control confetti display
- `soundPlaying`: Boolean to track audio status

**Methods**:
- `triggerReward()`: Start reward sequence
- `playSound()`: Play reward audio
- `showConfetti()`: Display confetti animation
- `resetReward()`: Reset reward state

### 3.5 TrophyBoard Component

**Purpose**: Display earned achievements and track progress

**Props**:
- `trophies`: Array of earned trophy objects
- `newTrophy`: Trophy object for animation

**State**:
- `selectedTask`: Task object for displaying details
- `visibleTrophies`: Array of trophies to display

**Methods**:
- `handleTrophyClick(trophy)`: Handle clicking on a trophy to show task details
- `closeTaskDetails()`: Close the task details view

### 3.6 TaskDetails Component

**Purpose**: Display detailed information about a task associated with a trophy

**Props**:
- `task`: Task object to display details for
- `onClose`: Function called when closing the details view

**State**:
- None

**Methods**:
- None

### 3.7 TaskSearch Component

**Purpose**: Provide search functionality for tasks
**Placement**: Rendered below the task addition form in TaskList component

**Props**:
- `tasks`: Array of all task objects

**State**:
- `searchTerm`: String for the search input
- `searchType`: String indicating search type ("all", "completed", "pending")
- `searchResults`: Array of tasks matching the search

**Methods**:
- `handleSearch()`: Process the search
- `clearSearch()`: Clear the search results

## 4. Data Models

### 4.1 Task Model

```javascript
{
  id: string,           // Unique identifier
  text: string,         // Task description
  category: string,     // Task category (e.g., "Health", "Work")
  completed: boolean,   // Completion status
  createdAt: Date,      // When task was created
  completedAt: Date,    // When task was completed (if applicable)
  prompted: boolean,    // Whether the task has been shown in a prompt
  promptCount: number,  // How many times the task has been prompted
  completionCount: number, // How many times the task has been completed
  
  icon: string | null   // Icon identifier for display
}
```

### 4.2 Trophy Model

```javascript
{
  id: string,           // Unique identifier
  name: string,         // Trophy name
  description: string,  // Trophy description
  earnedAt: Date,       // When trophy was earned
  icon: string,         // Trophy icon identifier
  category: string      // Trophy category
}
```

### 4.3 User Settings Model

```javascript
{
  categories: Array<{
    id: string,
    name: string,
    color: string
  }>,
  promptFrequency: {
    minInterval: number,
    maxInterval: number,
    timeRestrictions: {
      enabled: boolean,
      startTime: string,
      endTime: string
    }
  },
  rewards: {
    confettiEnabled: boolean,
    soundEnabled: boolean,
    volume: number,
    soundPack: string
  },
  accessibility: {
    largeText: boolean,
    highContrast: boolean,
    reducedMotion: boolean
  }
}
```

## 5. Storage Strategy

### 5.1 Local Storage (Phase 1)

```javascript
// Storage keys
const STORAGE_KEYS = {
  TASKS: 'ataskprompt_tasks',
  TROPHIES: 'ataskprompt_trophies',
  SETTINGS: 'ataskprompt_settings',
  HISTORY: 'ataskprompt_history',
  LAST_PROMPT: 'ataskprompt_lastPrompt'
};

// Storage utility functions
saveTasks(tasks)
loadTasks()
saveTrophies(trophies)
loadTrophies()
saveSettings(settings)
loadSettings()

// Enhanced storage functions with proper Date handling
saveTasks(tasks) {
  // Convert Date objects to ISO strings for proper serialization
  const tasksToSave = tasks.map(task => ({
    ...task,
    createdAt: task.createdAt instanceof Date ? task.createdAt.toISOString() : task.createdAt,
    completedAt: task.completedAt instanceof Date ? task.completedAt.toISOString() : task.completedAt
  }));
  
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasksToSave));
}

loadTasks() {
  // Convert ISO strings back to Date objects
  const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
  const parsedTasks = tasks ? JSON.parse(tasks) : [];
  
  return parsedTasks.map(task => ({
    ...task,
    createdAt: task.createdAt ? new Date(task.createdAt) : null,
    completedAt: task.completedAt ? new Date(task.completedAt) : null
  }));
}

saveTrophies(trophies) {
  // Convert Date objects to ISO strings for proper serialization
  const trophiesToSave = trophies.map(trophy => ({
    ...trophy,
    earnedAt: trophy.earnedAt instanceof Date ? trophy.earnedAt.toISOString() : trophy.earnedAt,
    associatedTask: trophy.associatedTask ? {
      ...trophy.associatedTask,
      createdAt: trophy.associatedTask.createdAt instanceof Date ? trophy.associatedTask.createdAt.toISOString() : trophy.associatedTask.createdAt,
      completedAt: trophy.associatedTask.completedAt instanceof Date ? trophy.associatedTask.completedAt.toISOString() : trophy.associatedTask.completedAt
    } : null
  }));
  
  localStorage.setItem(STORAGE_KEYS.TROPHIES, JSON.stringify(trophiesToSave));
}

loadTrophies() {
  // Convert ISO strings back to Date objects
  const trophies = localStorage.getItem(STORAGE_KEYS.TROPHIES);
  const parsedTrophies = trophies ? JSON.parse(trophies) : [];
  
  return parsedTrophies.map(trophy => ({
    ...trophy,
    earnedAt: trophy.earnedAt ? new Date(trophy.earnedAt) : null,
    associatedTask: trophy.associatedTask ? {
      ...trophy.associatedTask,
      createdAt: trophy.associatedTask.createdAt ? new Date(trophy.associatedTask.createdAt) : null,
      completedAt: trophy.associatedTask.completedAt ? new Date(trophy.associatedTask.completedAt) : null
    } : null
  }));
}
```

### 5.2 Cloud Storage (Phase 2)

**Database Schema**:
- Tasks Table
- Trophies Table
- Users Table
- User Settings Table
- Task History Table

## 6. Popup System

### 6.1 Timing Logic

```javascript
// Calculate next popup time
function calculateNextPopupTime() {
  const minInterval = userSettings.promptFrequency.minInterval;
  const maxInterval = userSettings.promptFrequency.maxInterval;
  const randomInterval = Math.random() * (maxInterval - minInterval) + minInterval;
  return Date.now() + (randomInterval * 60 * 1000);
}
```

### 6.2 Popup Priority

1. Achievement Popup (Highest priority)
2. Streak Reminder
3. Random Task Prompt
4. Gentle Nudge (Lowest priority)

## 7. Swipe Functionality

### 7.1 Library Integration

```bash
npm install react-swipeable
```

### 7.2 Swipe Gestures

- Left Swipe: Navigate to previous task
- Right Swipe: Navigate to next task
- Up Swipe: Show task details (optional)
- Down Swipe: Dismiss view (optional)

## 8. Reward System

### 8.1 Visual Rewards

```bash
npm install canvas-confetti
```

### 8.2 Auditory Rewards

HTML5 Audio API implementation with customizable sound packs.

### 8.3 Achievement Rewards

Trophy-based achievement system with multiple categories:
- Completion Trophies
- Streak Trophies
- Variety Trophies
- Consistency Trophies
- Challenge Trophies

## 9. UI/UX Design

### 9.1 Design Principles

- Positive Phrasing
- Minimal Distractions
- Clear Visual Feedback
- Accessibility First
- Mobile-First Responsive Design

### 9.2 Color Palette

- Primary: #4CAF50 (Green)
- Secondary: #2196F3 (Blue)
- Accent: #FF9800 (Orange)

### 9.3 Typography

- Primary: 'Open Sans'
- Secondary: 'Roboto'

## 10. Build Phases

### 10.1 Phase 1 (Solo Use - MVP)
- Add/delete tasks
- Random task popup with positive phrasing
- Swipe through alternatives
- Confetti + sound reward
- Trophy board with date stamps

### 10.2 Phase 2 (Shared Mode)
- Firebase backend for group lists
- Fair task rotation logic
- Category filters

### 10.3 Phase 3 (Smart Features)
- Productivity pattern analytics
- Customizable reward packs
- Mood-based task suggestions

## 11. Performance Considerations

### 11.1 Optimization Strategies

- Efficient state management
- Lazy loading of components
- Image optimization
- Code splitting
- Caching strategies

### 11.2 Resource Management

- Preload critical resources
- Clean up event listeners
- Optimize animations
- Manage memory usage

## 12. Security Considerations

### 12.1 Data Protection

- Client-side data encryption
- Secure storage practices
- Input validation
- Access control

### 12.2 Privacy

- Minimal data collection
- User consent for data usage
- Clear privacy policy
- Data export/deletion options

## 13. Testing Strategy

### 13.1 Unit Testing

- Component testing with Jest
- Utility function testing
- Hook testing
- State management testing

### 13.2 Integration Testing

- Component interaction testing
- Data flow testing
- API integration testing

### 13.3 End-to-End Testing

- User flow testing
- Cross-browser testing
- Mobile responsiveness testing

## 14. Deployment

### 14.1 Build Process

- Vite build optimization
- Environment-specific configurations
- Asset optimization
- PWA configuration

### 14.2 Hosting

- Netlify or Vercel deployment
- Custom domain setup
- SSL configuration
- Performance monitoring

## 15. Future Enhancements

### 15.1 AI Integration

- Personalized task suggestions
- Adaptive timing algorithms
- Mood-based recommendations

### 15.2 Social Features

- Group challenges
- Friend activity feeds
- Shared achievements

### 15.3 Advanced Analytics

- Productivity insights
- Pattern recognition
- Custom reporting