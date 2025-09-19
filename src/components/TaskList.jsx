import React, { useState, memo, useEffect } from 'react';
import { CONFIG } from '../config.js';

const TaskList = ({ tasks, allPendingTasks, onAddTask, onDeleteTask, onCompleteTask, onUpdateTask, overdueTasks, dueTodayTasks, taskToEdit, onContextCreated, customContexts = [], showTasks: controlledShowTasks, onShowTasksChange }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [selectedContext, setSelectedContext] = useState('Home');
  const [newContext, setNewContext] = useState('');
  const [showNewContextInput, setShowNewContextInput] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('normal');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingCategory, setEditingCategory] = useState('');
  const [editingContext, setEditingContext] = useState('');
  const [editingTaskText, setEditingTaskText] = useState('');
  const [editingDueDate, setEditingDueDate] = useState('');
  const [editingPriority, setEditingPriority] = useState('normal');
  const [showTasks, setShowTasks] = useState(true);
  
  // Use controlled showTasks prop if provided, otherwise use local state
  const isShowTasksControlled = controlledShowTasks !== undefined;
  const actualShowTasks = isShowTasksControlled ? controlledShowTasks : showTasks;
  const setShowTasksWrapper = isShowTasksControlled ? onShowTasksChange : setShowTasks;

  // Handle setting a task for editing from external sources (e.g., search results)
  useEffect(() => {
    if (taskToEdit) {
      startEditing(taskToEdit);
    }
  }, [taskToEdit]);

  // Check if a task is overdue
  const isTaskOverdue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTaskText.trim() !== '') {
      // Handle adding a new context
      let contextToUse = selectedContext;
      if (showNewContextInput && newContext.trim() !== '') {
        contextToUse = newContext.trim();
        // Notify parent component of new context creation
        if (onContextCreated) {
          await onContextCreated(contextToUse);
        }
      }
      
      onAddTask(newTaskText, selectedCategory, contextToUse, dueDate || null, priority);
      setNewTaskText('');
      setDueDate('');
      setPriority('normal');
      setNewContext('');
      setShowNewContextInput(false);
    }
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTask(id);
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingCategory(task.category);
    setEditingContext(task.context || 'Home');
    setEditingTaskText(task.text);
    setEditingDueDate(task.dueDate || '');
    setEditingPriority(task.priority || 'normal');
  };

  const saveEditing = (id) => {
    onUpdateTask(id, {
      category: editingCategory,
      context: editingContext,
      text: editingTaskText,
      dueDate: editingDueDate || null,
      priority: editingPriority
    });
    setEditingTaskId(null);
    setEditingCategory('');
    setEditingContext('');
    setEditingTaskText('');
    setEditingDueDate('');
    setEditingPriority('normal');
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingCategory('');
    setEditingContext('');
    setEditingTaskText('');
    setEditingDueDate('');
    setEditingPriority('normal');
  };

  

  const categories = ['General', 'Health', 'Work', 'School', 'Learning', 'Home', 'Cleaning', 'Priority', 'Grocery', 'Self-Care / Wellness', 'Appointments / Social', 'Transportation / Errands', 'Cleaning / Maintenance', 'Hobbies / Creative Time', 'Tech / Digital', 'Financial / Budgeting'];
  
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

  return (
    <div id="task-list" className="task-list">
      <div className="task-list-header">
        <h2>Things I Want to Do</h2>
        <button
          className="toggle-tasks-btn"
          onClick={() => setShowTasksWrapper(!actualShowTasks)}
        >
          {actualShowTasks ? "Hide Pending Tasks" : "Show Pending Tasks"}
        </button>
      </div>
      
      <form className="add-task-form" onSubmit={(e) => handleAddTask(e)}>
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
          {categories.map(category => {
            const icon = icons.find(i => i.category === category);
            return (
              <option key={category} value={category}>
                {icon ? `${icon.name} ${category}` : category}
              </option>
            );
          })}
        </select>
        <select
          value={selectedContext}
          onChange={(e) => {
            if (e.target.value === 'AddNew') {
              setShowNewContextInput(true);
            } else {
              setSelectedContext(e.target.value);
              setShowNewContextInput(false);
            }
          }}
        >
          <option value="">Select Context</option>
          {CONFIG.CONTEXTS.map(context => (
            <option key={context} value={context}>{context}</option>
          ))}
          {customContexts.map(context => (
            <option key={context} value={context}>{context}</option>
          ))}
          <option value="AddNew">+ Add New Context</option>
        </select>
        {showNewContextInput && (
          <input
            type="text"
            value={newContext}
            onChange={(e) => setNewContext(e.target.value)}
            placeholder="Enter new context"
          />
        )}
        <div className="date-input-container">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <span className="calendar-icon">📅</span>
        </div>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low Priority</option>
          <option value="normal">Normal Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button type="submit">Add</button>
      </form>
      {actualShowTasks && (
        <div className="task-items mt-4">
          {tasks.length === 0 ? (
            // Check if there are pending tasks in other contexts
            (allPendingTasks && allPendingTasks.length > 0) ? (
              <p>No tasks in the current context. There are {allPendingTasks.length} pending tasks in other contexts.</p>
            ) : (
              <p>No tasks yet. Add your first task above!</p>
            )
          ) : (
            tasks.filter(task => !task.completed).map(task => {
              // Find the icon for this task
              const icon = icons.find(i => i.id === task.icon);
              
              // Check if this task is being edited
              const isEditing = editingTaskId === task.id;
              
              return (
                <div key={task.id} className="task-item">
                  {isEditing ? (
                    // Edit mode
                    <div className="task-edit-form">
                      <div className="task-content">
                        {icon && <span className="task-icon">{icon.name}</span>}
                        <select
                          value={editingCategory}
                          onChange={(e) => setEditingCategory(e.target.value)}
                          className="edit-category-select"
                        >
                          {categories.map(category => {
                            const categoryIcon = icons.find(i => i.category === category);
                            return (
                              <option key={category} value={category}>
                                {categoryIcon ? `${categoryIcon.name} ${category}` : category}
                              </option>
                            );
                          })}
                        </select>
                        <select
                          value={editingContext}
                          onChange={(e) => setEditingContext(e.target.value)}
                          className="edit-context-select"
                        >
                          <option value="">Select Context</option>
                          {CONFIG.CONTEXTS.map(context => (
                            <option key={context} value={context}>{context}</option>
                          ))}
                          {customContexts.map(context => (
                            <option key={context} value={context}>{context}</option>
                          ))}
                          <option value="AddNew">+ Add New Context</option>
                        </select>
                        <input
                          type="text"
                          value={editingTaskText}
                          onChange={(e) => setEditingTaskText(e.target.value)}
                          className="edit-task-input"
                        />
                        <input
                          type="date"
                          value={editingDueDate}
                          onChange={(e) => setEditingDueDate(e.target.value)}
                          className="edit-due-date-input"
                        />
                        <select
                          value={editingPriority}
                          onChange={(e) => setEditingPriority(e.target.value)}
                          className="edit-priority-select"
                        >
                          <option value="low">Low Priority</option>
                          <option value="normal">Normal Priority</option>
                          <option value="high">High Priority</option>
                        </select>
                      </div>
                      <div className="task-actions">
                        <button
                          className="save-btn"
                          onClick={() => saveEditing(task.id)}
                        >
                          Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="task-content">
                      {icon && <span className="task-icon">{icon.name}</span>}
                      <span className="task-category">{task.category}</span>
                      <span className="task-text">{task.text}</span>
                      {task.context && (
                        <span className="task-context">{task.context}</span>
                      )}
                      {task.dueDate && (
                        <span className={`task-due-date ${isTaskOverdue(task.dueDate) ? 'overdue' : ''}`}>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {task.priority && task.priority !== 'normal' && (
                        <span className={`task-priority priority-${task.priority}`}>
                          {task.priority === 'high' ? '🔴 High' : '🟡 Low'}
                        </span>
                      )}
                    </div>
                  )}
                  {!isEditing && (
                    <div className="task-actions">
                      <button
                        className="edit-btn"
                        onClick={() => startEditing(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="complete-btn"
                        onClick={() => onCompleteTask(task.id)}
                      >
                        Complete
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default memo(TaskList);