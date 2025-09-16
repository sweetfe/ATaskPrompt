import React, { useState, memo } from 'react';
import TaskDetails from './TaskDetails.jsx';

const TrophyBoard = ({ trophies, newTrophy }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Filter trophies earned today
  const todayTrophies = trophies.filter(trophy => {
    const trophyDate = new Date(trophy.earnedAt);
    trophyDate.setHours(0, 0, 0, 0);
    return trophyDate.getTime() === today.getTime();
  });
  
  const handleTrophyClick = (trophy) => {
    if (trophy.associatedTask) {
      setSelectedTask(trophy.associatedTask);
    }
  };
  
  const closeTaskDetails = () => {
    setSelectedTask(null);
  };
  
  return (
    <div className="trophy-board">
      <h2>Your Trophies</h2>
      
      {todayTrophies.length > 0 && (
        <div className="today-trophies">
          <h3>Today's Trophies</h3>
          <div className="trophy-list today-trophy-list">
            {todayTrophies.map(trophy => (
              <div
                key={trophy.id}
                className={`trophy-card ${newTrophy && newTrophy.id === trophy.id ? 'new' : ''} ${trophy.associatedTask ? 'clickable' : ''}`}
                onClick={() => handleTrophyClick(trophy)}
              >
                <div className="trophy-icon">
                  {trophy.icon.endsWith('.png') ? (
                    <img src={trophy.icon} alt={trophy.name} className="trophy-image" style={{ maxWidth: '32px', height: 'auto' }} />
                  ) : (
                    trophy.icon
                  )}
                </div>
                <div className="trophy-content">
                  <h4 className="trophy-name">{trophy.name}</h4>
                  <p className="trophy-description">{trophy.description}</p>
                </div>
                {newTrophy && newTrophy.id === trophy.id && (
                  <div className="new-badge">NEW!</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {trophies.length === 0 ? (
        <p>You haven't earned any trophies yet. Complete tasks to earn trophies!</p>
      ) : (
        <div className="all-trophies">
          <h3>All Trophies</h3>
          <div className="trophy-list">
            {trophies.map(trophy => (
              <div
                key={trophy.id}
                className={`trophy-card ${newTrophy && newTrophy.id === trophy.id ? 'new' : ''} ${trophy.associatedTask ? 'clickable' : ''}`}
                onClick={() => handleTrophyClick(trophy)}
              >
                <div className="trophy-icon">
                  {trophy.icon.endsWith('.png') ? (
                    <img src={trophy.icon} alt={trophy.name} className="trophy-image" style={{ maxWidth: '32px', height: 'auto' }} />
                  ) : (
                    trophy.icon
                  )}
                </div>
                <div className="trophy-content">
                  <h4 className="trophy-name">{trophy.name}</h4>
                  <p className="trophy-description">{trophy.description}</p>
                  <p className="trophy-date">Earned: {new Date(trophy.earnedAt).toLocaleDateString()}</p>
                </div>
                {newTrophy && newTrophy.id === trophy.id && (
                  <div className="new-badge">NEW!</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {selectedTask && (
        <TaskDetails task={selectedTask} onClose={closeTaskDetails} />
      )}
    </div>
  );
};

export default memo(TrophyBoard);