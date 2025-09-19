# ATaskPrompt Popup System

## Overview

The popup system is a core feature of ATaskPrompt that replaces traditional notifications with engaging, positive prompts. Instead of interruptive alerts, users receive friendly suggestions that encourage task completion through positive reinforcement.

## Design Philosophy

### Positive Instead of Interruptive
- Popups use encouraging language rather than demanding attention
- Designed to be engaging rather than stressful
- Appear as opportunities rather than obligations

### Context-Aware
- Consider user's current activity
- Respect user's schedule and preferences
- Adapt to user's completion patterns

- Show relevant icons based on task category

### Non-Intrusive
- Easy to dismiss without penalty
- No negative consequences for skipping
- Respect user's autonomy

## Popup Types

### 1. Random Task Prompt

**Purpose**: Suggest a random task to the user

**Trigger Conditions**:
- Based on time intervals (configurable)
- After completing a task
- When app is opened after being idle

**Display**:
- Full-screen modal on mobile
- Centered card on desktop
- Positive, encouraging language

**Actions**:
- "Sounds Fun!" (Accept)
- "Not Now" (Skip)
- "Later" (Delay)

### 2. Streak Reminder

**Purpose**: Encourage maintaining task completion streaks

**Trigger Conditions**:
- When user hasn't completed a task in 24 hours
- When approaching a milestone streak

**Display**:
- Smaller banner at top of screen
- Friendly reminder text
- Streak visualization

**Actions**:
- "Let's Go!" (Show task prompt)
- "Dismiss" (Hide reminder)

### 3. Achievement Popup

**Purpose**: Celebrate task completion milestones

**Trigger Conditions**:
- When completing a task that unlocks a trophy
- When reaching daily/weekly goals
- When trying a new category

**Display**:
- Animated celebration
- Trophy reveal
- Personalized message

**Actions**:
- "Awesome!" (Dismiss)
- "View Trophy" (Go to trophy board)

### 4. Gentle Nudge

**Purpose**: Remind users of pending tasks without pressure

**Trigger Conditions**:
- Tasks pending for extended period
- User's preferred reminder times
- Pattern-based suggestions

**Display**:
- Subtle banner or toast notification
- Minimal visual impact
- Friendly reminder text

**Actions**:
- "Let's Do It!" (Show task prompt)
- "Snooze" (Remind later)
- "Dismiss" (Hide reminder)

## Timing System

### Interval Calculation

The time between popups is determined by a randomized interval within user-defined bounds:

```javascript
// Calculate next popup time
function calculateNextPopupTime() {
  const minInterval = userSettings.promptFrequency.minInterval; // minutes
  const maxInterval = userSettings.promptFrequency.maxInterval; // minutes
  const randomInterval = Math.random() * (maxInterval - minInterval) + minInterval;
  return Date.now() + (randomInterval * 60 * 1000);
}
```

### Time Restrictions

Users can set specific hours for prompts:

```javascript
// Check if current time is within allowed hours
function isWithinTimeRestrictions() {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight
  
  const startTime = parseTime(userSettings.promptFrequency.timeRestrictions.startTime);
  const endTime = parseTime(userSettings.promptFrequency.timeRestrictions.endTime);
  
  return currentTime >= startTime && currentTime <= endTime;
}
```

### Smart Timing

The system adapts to user behavior:

- **Increase frequency** when user consistently accepts prompts
- **Decrease frequency** when user frequently skips or delays
- **Pause during** known busy hours
- **Resume after** periods of inactivity

## Popup Priority System

When multiple popup conditions are met, a priority system determines which to show:

1. **Achievement Popup** (Highest priority)
2. **Streak Reminder**
3. **Random Task Prompt**
4. **Gentle Nudge** (Lowest priority)

## Display Logic

### Web/PWA Implementation

```javascript
// Popup display controller
class PopupController {
  constructor() {
    this.isVisible = false;
    this.currentPopup = null;
  }
  
  // Check if popup should be shown
  shouldShowPopup() {
    return !this.isVisible && 
           isWithinTimeRestrictions() && 
           hasAvailableTasks() &&
           isPastDueTime() &&
           
  }
  
  // Show appropriate popup
  showPopup() {
    if (!this.shouldShowPopup()) return;
    
    const popupType = this.determinePopupType();
    const popupData = this.getPopupData(popupType);
    
    this.currentPopup = popupType;
    this.isVisible = true;
    
    // Render popup component
    renderPopup(popupData);
  }
  
  // Handle user response
  handleResponse(action) {
    this.isVisible = false;
    
    switch(action) {
      case 'accept':
        this.handleAccept();
        break;
      case 'skip':
        this.handleSkip();
        break;
      case 'delay':
        this.handleDelay();
        break;
    }
    
    // Schedule next popup
    this.scheduleNextPopup();
  }
}
```

### Mobile Implementation Considerations

- **Always-on approach**: For mobile apps, consider a background service that can show true system notifications
- **Web limitations**: PWA popups only appear when app is active in browser tab
- **Push API**: For supported browsers, implement Push API for true background notifications

## User Controls

### Frequency Settings

Users can control how often they receive prompts:

- **Very Low**: Every 2-4 hours
- **Low**: Every 1-2 hours
- **Medium**: Every 30-60 minutes
- **High**: Every 15-30 minutes
- **Very High**: Every 5-15 minutes

### Time Restrictions

Users can set when they want to receive prompts:

- **All Day**: 24/7
- **Morning**: 6AM - 12PM
- **Afternoon**: 12PM - 6PM
- **Evening**: 6PM - 10PM
- **Custom**: User-defined hours

### Content Preferences

Users can control what types of prompts they receive:

- **All Tasks**: Any available task
- **By Category**: Only from selected categories
- **By Icon**: Only tasks with specific icons
- **New Tasks**: Only tasks not yet prompted
- **Pending Tasks**: Only incomplete tasks


## Technical Implementation

### Popup Component Structure

```jsx
// TaskPrompt.jsx
const TaskPrompt = ({ task, isVisible, onAccept, onSkip, onDelay }) => {
  if (!isVisible) return null;
  
  // Define icons for different categories
  const icons = {
    'Learning': '📚',
    'Health': '❤️',
    'Work': '💼',
    'Home': '🏠',
    'Cleaning': '🧹',
    'General': '⭐',
    'Personal': '👤'
  };
  
  // Get icon for this task
  const icon = task.icon ? icons[task.icon] || '⭐' : '⭐';
  
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>🌟 Do you feel like doing 🌟</h2>
        </div>
        <div className="popup-content">
          <p className="task-text">{icon} "{task.text}"</p>
        </div>
        <div className="popup-actions">
          <button className="accept-btn" onClick={onAccept}>
            Sounds Fun!
          </button>
          <button className="skip-btn" onClick={onSkip}>
            Not Now
          </button>
          <button className="delay-btn" onClick={onDelay}>
            Later
          </button>
        </div>
      </div>
    </div>
  );
  
  // Note: The header alternates between "Do you feel like doing" and "Want to do" every 3 seconds.
};
```

### State Management

```javascript
// Popup state management
const popupState = {
  // Current popup visibility
  isVisible: false,
  
  // Type of current popup
  type: null,
  
  // Data for current popup
  data: null,
  
  // Next scheduled popup time
  nextPopupTime: null,
  
  // User's response history
  responseHistory: []
};
```

### Storage Integration

```javascript
// Save popup-related data
function savePopupData() {
  const popupData = {
    nextPopupTime: popupState.nextPopupTime,
    responseHistory: popupState.responseHistory,
    lastPromptedTaskIds: getLastPromptedTaskIds()
  };
  
  storage.save('popup_data', popupData);
}

// Load popup-related data
function loadPopupData() {
  const popupData = storage.load('popup_data');
  if (popupData) {
    popupState.nextPopupTime = popupData.nextPopupTime;
    popupState.responseHistory = popupData.responseHistory;
  }
}
```

## Analytics and Adaptation

### Response Tracking

The system tracks user responses to improve timing and content:

- **Acceptance rate**: Percentage of accepted prompts
- **Skip patterns**: When users tend to skip
- **Delay frequency**: How often users delay tasks
- **Completion rate**: How often prompted tasks are completed

### Adaptive Algorithm

```javascript
// Adjust popup frequency based on user behavior
function adjustPopupFrequency() {
  const acceptanceRate = calculateAcceptanceRate();
  const skipRate = calculateSkipRate();
  
  if (acceptanceRate > 0.8) {
    // User is engaged, slightly increase frequency
    decreaseInterval();
  } else if (skipRate > 0.5) {
    // User is skipping often, decrease frequency
    increaseInterval();
  }
  
  // Save adjusted settings
  saveUserSettings();
}
```

## Accessibility Considerations

### Visual
- High contrast popup design
- Large, readable text
- Clear focus indicators

### Audio
- Optional sound cues
- Volume controls
- Screen reader compatibility

### Cognitive
- Simple, clear language
- Consistent interaction patterns
- No time pressure

## Testing Scenarios

### Timing Tests
- Verify popups appear at correct intervals
- Test time restriction enforcement
- Validate smart timing adjustments

### Priority Tests
- Verify correct popup type is shown when multiple conditions met
- Test achievement popup interruption
- Validate fallback behavior

### User Control Tests
- Verify frequency settings take effect
- Test time restriction functionality
- Validate content preference filtering

## Future Enhancements

### AI-Powered Suggestions
- Analyze user patterns for better task timing
- Suggest tasks based on mood/time of day
- Personalize prompt language
- Recommend icons based on task content

### Social Features
- Group challenge popups
- Friend activity notifications
- Shared achievement celebrations

### Context Awareness
- Location-based task suggestions
- Calendar integration
- Weather-based recommendations
- Icon-based task categorization

