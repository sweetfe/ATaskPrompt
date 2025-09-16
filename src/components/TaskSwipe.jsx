import React, { useState, useMemo, memo } from 'react';
import { useSwipeable } from 'react-swipeable';

const TaskSwipe = ({ tasks, onSwipeLeft, onSwipeRight }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);

  // Sort tasks by creation date (oldest first)
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [tasks]);

  // Icon mapping
  const icons = [
    { id: 'book', name: '📚', category: 'Learning' },
    { id: 'heart', name: '❤️', category: 'Health' },
    { id: 'briefcase', name: '💼', category: 'Work' },
    { id: 'house', name: '🏠', category: 'Home' },
    { id: 'broom', name: '🧹', category: 'Cleaning' },
    { id: 'star', name: '⭐', category: 'Priority' },
    { id: 'school', name: '🏫', category: 'School' },
    { id: 'grocery', name: '🛒', category: 'Grocery' },
    { id: 'checklist', name: '📋', category: 'General' },
    { id: 'water', name: '💧', category: 'Self-Care / Wellness' },
    { id: 'calendar', name: '📅', category: 'Appointments / Social' },
    { id: 'car', name: '🚗', category: 'Transportation / Errands' },
    { id: 'trash', name: '🗑️', category: 'Cleaning / Maintenance' },
    { id: 'palette', name: '🎨', category: 'Hobbies / Creative Time' },
    { id: 'laptop', name: '💻', category: 'Tech / Digital' },
    { id: 'money', name: '💰', category: 'Financial / Budgeting' }
  ];

  // Reset index when tasks change
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [sortedTasks]);

  // Get current task
  const currentTask = sortedTasks[currentIndex];
  
  // Calculate progress
  const progress = sortedTasks.length > 0
    ? `${currentIndex + 1} of ${sortedTasks.length}`
    : '0 of 0';

  // Handle swipe using react-swipeable
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      console.log('TaskSwipe: Swiped left');
      setSwipeDirection('left');
      handleSwipe('left');
      setTimeout(() => setSwipeDirection(null), 300);
    },
    onSwipedRight: () => {
      console.log('TaskSwipe: Swiped right');
      setSwipeDirection('right');
      handleSwipe('right');
      setTimeout(() => setSwipeDirection(null), 300);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // Handle swipe action
  const handleSwipe = (direction) => {
    if (!currentTask) return;
    
    if (direction === 'left') {
      // Move to previous task
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else {
        // If at the beginning, go to the end
        setCurrentIndex(sortedTasks.length - 1);
      }
      // Call onSwipeLeft callback
      onSwipeLeft && onSwipeLeft(currentTask.id);
    } else if (direction === 'right') {
      // Move to next task
      if (currentIndex < sortedTasks.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // If at the end, go back to the beginning
        setCurrentIndex(0);
      }
      // Don't call onSwipeRight callback for navigation
    }
  };

  // Handle click on left side (previous task)
  const handleLeftClick = () => {
    if (sortedTasks.length === 0) return;
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1); // Show previous task
    } else {
      // If at the beginning, go to the end
      setCurrentIndex(sortedTasks.length - 1);
    }
  };
  
  // Handle click on right side (next task)
  const handleRightClick = () => {
    if (sortedTasks.length === 0) return;
    if (currentIndex < sortedTasks.length - 1) {
      setCurrentIndex(currentIndex + 1); // Show next task
    } else {
      // If at the end, go back to the beginning
      setCurrentIndex(0);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (!currentTask) return;

    switch(event.key) {
      case 'ArrowLeft':
        handleSwipe('left');
        break;
      case 'ArrowRight':
        handleSwipe('right');
        break;
      case ' ':
        handleSwipe('right');
        break;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="task-swipe-container">
        <h2>Task Swipe</h2>
        <div className="swipe-area">
          <p>No tasks to swipe through. Add some tasks first!</p>
        </div>
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className="task-swipe-container">
        <h2>Task Swipe</h2>
        <div className="swipe-area">
          <p>All tasks completed! Great job!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-swipe-container">
      <h2>Task Swipe</h2>
      <div
        className={`swipe-area ${swipeDirection ? `swiping-${swipeDirection}` : ''}`}
        {...handlers}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="task-content">
          {(() => {
            const icon = icons.find(i => i.id === currentTask.icon);
            return icon ? <span className="task-icon">{icon.name}</span> : null;
          })()}
          <span className="task-category">{currentTask.category}</span>
          <p className="task-text">{currentTask.text}</p>
        </div>
        <div className="swipe-instructions">
          <p className="swipe-instruction-text">Swipe left to view previous task or right to view next task. Use buttons below to complete or skip tasks.</p>
        </div>
        <div className="swipe-progress">
          <span className="progress-text">{progress}</span>
        </div>
        <div className="swipe-actions">
          <button className="complete-task-btn" onClick={() => onSwipeRight && onSwipeRight(currentTask.id)}>
            Complete
          </button>
        </div>
        <div className="swipe-hints">
          <span className="swipe-left-hint" onClick={handleLeftClick}>← Previous</span>
          <span className="swipe-right-hint" onClick={handleRightClick}>Next →</span>
        </div>
      </div>
    </div>
  );
};

export default memo(TaskSwipe);