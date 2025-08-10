import React, { useState } from 'react';

const TaskList = ({ tasks, onAddTask, onDeleteTask, onCompleteTask }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskText.trim() !== '') {
      onAddTask(newTaskText, selectedCategory);
      setNewTaskText('');
    }
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTask(id);
    }
  };

  const categories = ['General', 'Health', 'Work', 'Personal', 'Learning'];

  return (
    <div className="task-list">
      <h2>Your Tasks</h2>
      
      <form className="add-task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task..."
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>

      <div className="task-items">
        {tasks.length === 0 ? (
          <p>No tasks yet. Add your first task above!</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="task-item">
              <div className="task-content">
                <span className="task-category">{task.category}</span>
                <span className="task-text">{task.text}</span>
              </div>
              <div className="task-actions">
                {!task.completed && (
                  <button 
                    className="complete-btn" 
                    onClick={() => onCompleteTask(task.id)}
                  >
                    Complete
                  </button>
                )}
                <button 
                  className="delete-btn" 
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;