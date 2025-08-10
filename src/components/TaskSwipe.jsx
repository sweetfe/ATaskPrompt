import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

const TaskSwipe = ({ tasks, onSwipeLeft, onSwipeRight }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);

  // Reset index when tasks change
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [tasks.length]);

  // Get current task
  const currentTask = tasks[currentIndex];

  // Handle swipe
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setSwipeDirection('left');
      setTimeout(() => {
        handleSwipe('left');
        setSwipeDirection(null);
      }, 300);
    },
    onSwipedRight: () => {
      setSwipeDirection('right');
      setTimeout(() => {
        handleSwipe('right');
        setSwipeDirection(null);
      }, 300);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // Handle swipe action
  const handleSwipe = (direction) => {
    if (!currentTask) return;

    if (direction === 'left') {
      onSwipeLeft(currentTask.id);
    } else if (direction === 'right') {
      onSwipeRight(currentTask.id);
    }

    // Move to next task
    if (currentIndex < tasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // If we're at the end, go back to the beginning
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
          <span className="task-category">{currentTask.category}</span>
          <p className="task-text">{currentTask.text}</p>
        </div>
        <div className="swipe-hints">
          <span className="swipe-left-hint">← Skip</span>
          <span className="swipe-right-hint">Accept →</span>
        </div>
      </div>
    </div>
  );
};

export default TaskSwipe;