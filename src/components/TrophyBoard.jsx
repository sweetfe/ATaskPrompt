import React from 'react';

const TrophyBoard = ({ trophies, newTrophy }) => {
  return (
    <div className="trophy-board">
      <h2>Your Trophies</h2>
      {trophies.length === 0 ? (
        <p>You haven't earned any trophies yet. Complete tasks to earn trophies!</p>
      ) : (
        <div className="trophy-list">
          {trophies.map(trophy => (
            <div 
              key={trophy.id} 
              className={`trophy-card ${newTrophy && newTrophy.id === trophy.id ? 'new' : ''}`}
            >
              <div className="trophy-icon">{trophy.icon}</div>
              <div className="trophy-content">
                <h3 className="trophy-name">{trophy.name}</h3>
                <p className="trophy-description">{trophy.description}</p>
                <p className="trophy-date">Earned: {new Date(trophy.earnedAt).toLocaleDateString()}</p>
              </div>
              {newTrophy && newTrophy.id === trophy.id && (
                <div className="new-badge">NEW!</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrophyBoard;