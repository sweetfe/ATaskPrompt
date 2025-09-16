import React, { useState, useEffect, memo } from 'react';

const TaskPrompt = ({ task, isVisible, onResponse }) => {
  if (!isVisible || !task) {
    return null;
  }

  const [headerIndex, setHeaderIndex] = useState(0);
  
  const headers = [
    "🌟 Do you feel like doing 🌟",
    "🌟 Want to do 🌟"
  ];
  
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
    { id: 'money', name: '💰', category: 'Money' },
    { id: 'bills', name: '🧾', category: 'Bills' },
    { id: 'water', name: '💧', category: 'Self-Care / Wellness' },
    { id: 'calendar', name: '📅', category: 'Appointments / Social' },
    { id: 'car', name: '🚗', category: 'Transportation / Errands' },
    { id: 'trash', name: '🗑️', category: 'Cleaning / Maintenance' },
    { id: 'palette', name: '🎨', category: 'Hobbies / Creative Time' },
    { id: 'laptop', name: '💻', category: 'Tech / Digital' },
    { id: 'chart', name: '📊', category: 'Financial / Budgeting' }
  ];

  useEffect(() => {
    // Reset to the first header when the prompt is shown
    setHeaderIndex(0);
    
    // Alternate between headers every 3 seconds
    const interval = setInterval(() => {
      setHeaderIndex(prevIndex => (prevIndex + 1) % headers.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isVisible]);

  const handleAccept = () => {
    onResponse('accept');
  };

  const handleSkip = () => {
    onResponse('skip');
  };

  const handleDelay = () => {
    onResponse('delay');
  };

  // Find the icon for this task
  const icon = icons.find(i => i.id === task.icon);

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>{headers[headerIndex]}</h2>
        </div>
        <div className="popup-content">
          {icon && <span className="task-icon">{icon.name}</span>}
          <p className="task-text">"{task.text}"</p>
          {task.locationName && (
            <p className="task-location">Location: {task.locationName}</p>
          )}
        </div>
        <div className="popup-actions">
          <button className="accept-btn" onClick={handleAccept}>
            Sounds Fun!
          </button>
          <button className="skip-btn" onClick={handleSkip}>
            Not Now
          </button>
          <button className="delay-btn" onClick={handleDelay}>
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(TaskPrompt);