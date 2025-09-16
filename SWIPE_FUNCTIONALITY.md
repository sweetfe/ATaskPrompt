# ATaskPrompt Swipe Functionality

## Overview

The swipe functionality in ATaskPrompt allows users to quickly navigate through tasks using intuitive swipe gestures. This feature is particularly useful on mobile devices but will also work on desktop browsers with mouse drag gestures.

## Design Principles

### Intuitive Gestures
- Left swipe to navigate to previous task
- Right swipe to navigate to next task
- Explicit "Complete" button to complete the current task
- Up/down swipes for additional actions (if needed)

### Visual Feedback
- Real-time visual feedback during swipe
- Smooth animations
- Clear indication of swipe outcomes

### Accessibility
- Keyboard alternatives for all swipe actions
- Screen reader support
- Adjustable sensitivity

## Technical Implementation

### Library Selection

We'll use the `react-swipeable` library for implementing swipe gestures:

```bash
npm install react-swipeable
```

### Basic Swipe Component

```jsx
import { useSwipeable } from 'react-swipeable';

const TaskSwipe = ({ task, onSwipeLeft, onSwipeRight }) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div className="task-swipe-container" {...handlers}>
      <div className="task-card">
        <div className="task-content">
          <span className="category-tag">{task.category}</span>
          <p className="task-text">{task.text}</p>
        </div>
        <div className="swipe-hints">
          <span className="swipe-left-hint">← Skip</span>
          <span className="swipe-right-hint">Accept →</span>
        </div>
      </div>
    </div>
  );
};
```

## Swipe Gestures

### Horizontal Swipes

#### Left Swipe (Navigate to Previous Task)
- **Gesture**: Swipe from right to left
- **Action**: Navigate to the previous task
- **Visual Feedback**: Card moves left with neutral overlay
- **Outcome**: Previous task is shown

#### Right Swipe (Navigate to Next Task)
- **Gesture**: Swipe from left to right
- **Action**: Navigate to the next task
- **Visual Feedback**: Card moves right with neutral overlay
- **Outcome**: Next task is shown

#### Complete Button (Complete Task)
- **Action**: Click the "Complete" button
- **Outcome**: Task is marked as completed, reward is triggered

### Vertical Swipes (Optional)

#### Up Swipe (Details)
- **Gesture**: Swipe from bottom to top
- **Action**: Show task details
- **Visual Feedback**: Card moves up with info icon
- **Outcome**: Task details panel is displayed

#### Down Swipe (Dismiss)
- **Gesture**: Swipe from top to bottom
- **Action**: Dismiss current view
- **Visual Feedback**: Card moves down with dismiss animation
- **Outcome**: Return to previous view

## Animation and Visual Feedback

### During Swipe

```css
.task-swipe-container {
  position: relative;
  overflow: hidden;
  touch-action: pan-y;
}

.task-card {
  transition: transform 0.3s ease-out;
  will-change: transform;
}

.task-card.swiping-left {
  transform: translateX(-100px);
  background: linear-gradient(90deg, #ffebee 0%, #ffffff 100%);
}

.task-card.swiping-right {
  transform: translateX(100px);
  background: linear-gradient(90deg, #ffffff 0%, #e8f5e9 100%);
}
```

### After Swipe

```css
@keyframes swipeLeft {
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(-100%); opacity: 0; }
}

@keyframes swipeRight {
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
}

.task-card.swiped-left {
  animation: swipeLeft 0.3s forwards;
}

.task-card.swiped-right {
  animation: swipeRight 0.3s forwards;
}
```

## Sensitivity and Thresholds

### Swipe Detection Parameters

```javascript
const swipeConfig = {
  // Minimum distance in pixels
  delta: 50,
  
  // Minimum velocity (pixels/ms)
  velocity: 0.3,
  
  // Prevent page scroll during swipe
  preventScrollOnSwipe: true,
  
  // Track mouse events for desktop
  trackMouse: true,
  
  // Track touch events
  trackTouch: true,
  
  // Rotation angle tolerance (degrees)
  rotationAngle: 15
};
```

### Custom Thresholds

Users can adjust swipe sensitivity:

- **Low Sensitivity**: 100px minimum distance
- **Medium Sensitivity**: 50px minimum distance (default)
- **High Sensitivity**: 25px minimum distance

## Multi-Task Swiping

### Task Stack Visualization

```jsx
const TaskStack = ({ tasks, currentIndex, onSwipe }) => {
  return (
    <div className="task-stack">
      {tasks.slice(currentIndex, currentIndex + 3).map((task, index) => (
        <TaskSwipe
          key={task.id}
          task={task}
          style={{
            transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
            zIndex: 3 - index
          }}
          onSwipeLeft={() => onSwipe('left', task.id)}
          onSwipeRight={() => onSwipe('right', task.id)}
        />
      ))}
    </div>
  );
};
```

## Keyboard Navigation

### Alternative Controls

For accessibility and desktop users:

- **Left Arrow**: Navigate to previous task
- **Right Arrow**: Navigate to next task
- **Space**: Complete current task

### Keyboard Event Handling

```javascript
const TaskSwipe = ({ task, onSwipeLeft, onSwipeRight }) => {
  const handleKeyDown = (event) => {
    switch(event.key) {
      case 'ArrowLeft':
        handleSwipe('left');
        break;
      case 'ArrowRight':
        handleSwipe('right');
        break;
      case ' ':
        // Complete task
        onSwipeRight && onSwipeRight(currentTask.id);
        break;
    }
  };

  return (
    <div 
      className="task-swipe-container" 
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Task content */}
    </div>
  );
};
```

## Haptic Feedback

### Mobile Enhancements

On mobile devices, provide haptic feedback:

```javascript
// Trigger haptic feedback
function triggerHapticFeedback(type) {
  if (navigator.vibrate) {
    switch(type) {
      case 'swipe':
        navigator.vibrate(10);
        break;
      case 'accept':
        navigator.vibrate([15, 10, 15]);
        break;
      case 'skip':
        navigator.vibrate(15);
        break;
    }
  }
}
```

## Error Handling

### Swipe Conflicts

When swipe gestures conflict with other interactions:

```javascript
const handlers = useSwipeable({
  onSwipeStart: (eventData) => {
    // Check if swipe should be enabled
    if (isInputFocused() || isScrolling()) {
      eventData.event.preventDefault();
      return false;
    }
  },
  onSwiped: (eventData) => {
    // Handle swipe completion
    if (eventData.velocity > swipeConfig.velocity && 
        Math.abs(eventData.deltaX) > swipeConfig.delta) {
      handleSwipe(eventData.dir);
    }
  }
});
```

## Performance Considerations

### Animation Optimization

- Use CSS transforms instead of changing layout properties
- Leverage `will-change` property for smooth animations
- Limit the number of simultaneously animated elements

### Memory Management

- Clean up event listeners when component unmounts
- Cancel ongoing animations when component updates
- Use React.memo for performance optimization

## Testing Scenarios

### Gesture Recognition

- Verify swipe detection with different speeds
- Test swipe recognition at various angles
- Validate swipe cancellation when not meeting thresholds

### Cross-Platform Testing

- Test on iOS Safari
- Test on Android Chrome
- Test on desktop browsers (Chrome, Firefox, Safari, Edge)
- Test with touch screen laptops

### Accessibility Testing

- Verify keyboard navigation works correctly
- Test with screen readers
- Validate focus management

## Future Enhancements

### Advanced Gestures

- **Diagonal Swipes**: For additional actions
- **Multi-Touch**: For complex gestures
- **Long Press + Swipe**: For contextual actions

### Machine Learning

- **Adaptive Thresholds**: Adjust sensitivity based on user behavior
- **Gesture Prediction**: Anticipate user intentions
- **Personalized Actions**: Learn user's preferred swipe actions

### Integration with Other Features

- **Swipe + Voice**: Combine gestures with voice commands
- **Swipe + Shake**: Add device motion detection
- **Swipe + Biometrics**: Integrate with fingerprint/face recognition