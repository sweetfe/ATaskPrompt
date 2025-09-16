import React from 'react';

const TaskDetails = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="task-details-overlay">
      <div className="task-details-container">
        <div className="task-details-header">
          <h2>Task Details</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="task-details-content">
          <div className="task-info">
            <h3>{task.text}</h3>
            <p><strong>Category:</strong> {task.category}</p>
            <p><strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}</p>
            {task.completedAt && (
              <p><strong>Completed:</strong> {new Date(task.completedAt).toLocaleString()}</p>
            )}
            {task.locationName && (
              <p><strong>Location:</strong> {task.locationName}</p>
            )}
            <p><strong>Prompted:</strong> {task.prompted ? 'Yes' : 'No'}</p>
            <p><strong>Prompt Count:</strong> {task.promptCount}</p>
            <p><strong>Completion Count:</strong> {task.completionCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;