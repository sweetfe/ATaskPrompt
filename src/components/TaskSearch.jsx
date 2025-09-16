import React, { useState, memo } from 'react';

const TaskSearch = ({ tasks, pendingTasks, onEditTask }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all'); // 'all', 'completed', 'pending'
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleSearch = () => {
    // Use pendingTasks for better performance when searching pending tasks
    const tasksToSearch = searchType === 'pending' ? pendingTasks : tasks;
    
    const filteredTasks = tasksToSearch.filter(task => {
      // If no search term, match all tasks
      const matchesSearch = !searchTerm.trim() ||
                           task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (searchType === 'completed') {
        return task.completed && matchesSearch;
      } else if (searchType === 'pending') {
        return !task.completed && matchesSearch;
      }
      
      return matchesSearch;
    });
    
    setSearchResults(filteredTasks);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedTask(null);
  };

  const viewTaskDetails = (task) => {
    setSelectedTask(task);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="task-search">
      <h2 className="search-header">Search Tasks</h2>
      <div className="search-controls">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="search-type-select"
        >
          <option value="all">All Tasks</option>
          <option value="completed">Completed Tasks</option>
          <option value="pending">Pending Tasks</option>
        </select>
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
        <button onClick={clearSearch} className="clear-button">
          Clear
        </button>
      </div>
      
      {selectedTask && (
        <div className="task-details">
          <h2>Task Details</h2>
          <div className="task-content">
            <span className="task-text">{selectedTask.text}</span>
            <span className="task-category">[{selectedTask.category}]</span>
            <span className="task-status">
              {selectedTask.completed ? 'Completed' : 'Pending'}
            </span>
            {selectedTask.completedAt && (
              <div className="completion-date">
                Completed: {new Date(selectedTask.completedAt).toLocaleDateString()}
              </div>
            )}
            <button onClick={() => setSelectedTask(null)} className="clear-button">
              Close
            </button>
          </div>
        </div>
      )}
      
      {searchResults.length > 0 && !selectedTask && (
        <div className="search-results">
          <h3>Search Results ({searchResults.length})</h3>
          {searchResults.map(task => {
            // Find the icon for this task
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
            const icon = icons.find(i => i.id === task.icon);
            
            return (
              <div key={task.id} className="task-item">
                <div className="task-content" onClick={() => viewTaskDetails(task)}>
                  {icon && <span className="task-icon">{icon.name}</span>}
                  <span className="task-category">{task.category}</span>
                  <span className="task-text">{task.text}</span>
                  {task.context && (
                    <span className="task-context">Context: {task.context}</span>
                  )}
                  {task.dueDate && (
                    <span className={`task-due-date ${new Date(task.dueDate) < new Date() ? 'overdue' : ''}`}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {task.priority && task.priority !== 'normal' && (
                    <span className={`task-priority priority-${task.priority}`}>
                      {task.priority === 'high' ? '🔴 High' : '🟡 Low'}
                    </span>
                  )}
                </div>
                {!task.completed && (
                  <div className="task-actions">
                    <button
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTask && onEditTask(task);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
                <div className="task-status-section">
                  <span className={`task-status ${task.completed ? 'completed' : 'pending'}`}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>
                  {task.completedAt && (
                    <div className="completion-date">
                      Completed: {new Date(task.completedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {searchTerm && searchResults.length === 0 && !selectedTask && (
        <div className="no-results">
          <p>No tasks found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default memo(TaskSearch);