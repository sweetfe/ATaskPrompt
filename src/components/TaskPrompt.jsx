import React from 'react';

const TaskPrompt = ({ task, isVisible, onResponse }) => {
  if (!isVisible || !task) {
    return null;
  }

  const handleAccept = () => {
    onResponse('accept');
  };

  const handleSkip = () => {
    onResponse('skip');
  };

  const handleDelay = () => {
    onResponse('delay');
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>🌟 Time for a Task! 🌟</h2>
        </div>
        <div className="popup-content">
          <p className="task-text">"{task.text}"</p>
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

export default TaskPrompt;