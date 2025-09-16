import React, { useState, memo } from 'react';

const DateHistoryView = ({ tasks, trophies, groupedTrophiesByDate, groupedTasksByDate, allDates }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const groupedTrophies = groupedTrophiesByDate || {};
  const groupedTasks = groupedTasksByDate || {};
  const dates = allDates || [];

  // Filter data by selected date
  const getTrophiesForDate = (date) => {
    return groupedTrophies[date] || [];
  };

  const getTasksForDate = (date) => {
    return groupedTasks[date] || [];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="date-history-view">
      <h2>History by Date</h2>
      
      {allDates.length === 0 ? (
        <p>No history available yet. Complete tasks to see your history!</p>
      ) : (
        <>
          <div className="date-selector">
            <label htmlFor="date-select">Select a date: </label>
            <select
              id="date-select"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="">-- Select a date --</option>
              {allDates.map(date => (
                <option key={date} value={date}>
                  {formatDate(date)}
                </option>
              ))}
            </select>
          </div>

          {selectedDate && (
            <div className="date-details">
              <h3>{formatDate(selectedDate)}</h3>
              
              {/* Trophies section */}
              <div className="trophies-section">
                <h4>Trophies Earned</h4>
                {getTrophiesForDate(selectedDate).length > 0 ? (
                  <div className="trophy-list">
                    {getTrophiesForDate(selectedDate).map(trophy => (
                      <div key={trophy.id} className="trophy-card">
                        <div className="trophy-icon">
                          {trophy.icon.endsWith('.png') ? (
                            <img src={trophy.icon} alt={trophy.name} className="trophy-image" />
                          ) : (
                            trophy.icon
                          )}
                        </div>
                        <div className="trophy-content">
                          <h5 className="trophy-name">{trophy.name}</h5>
                          <p className="trophy-description">{trophy.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No trophies earned on this date.</p>
                )}
              </div>
              
              {/* Tasks section */}
              <div className="tasks-section">
                <h4>Tasks Completed</h4>
                {getTasksForDate(selectedDate).length > 0 ? (
                  <ul className="completed-tasks-list">
                    {getTasksForDate(selectedDate).map(task => (
                      <li key={task.id} className="completed-task-item">
                        <span className="task-category">[{task.category}]</span>
                        <span className="task-text">{task.text}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No tasks completed on this date.</p>
                )}
              </div>
            </div>
          )}
          
          {!selectedDate && (
            <div className="date-list">
              <h3>All Dates with Activity</h3>
              <ul>
                {allDates.map(date => (
                  <li key={date} className="date-item">
                    <button onClick={() => setSelectedDate(date)}>
                      {formatDate(date)}
                      <span className="activity-count">
                        ({(groupedTrophies[date]?.length || 0) + (groupedTasks[date]?.length || 0)} activities)
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default memo(DateHistoryView);