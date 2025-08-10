import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskPrompt from './components/TaskPrompt';
import TaskSwipe from './components/TaskSwipe';
import RewardAnimation from './components/RewardAnimation';
import TrophyBoard from './components/TrophyBoard';
import { loadTasks, saveTasks, loadTrophies, saveTrophies } from './utils/storage';

function App() {
  const [tasks, setTasks] = useState([]);
  const [trophies, setTrophies] = useState([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [newTrophy, setNewTrophy] = useState(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadedTasks = loadTasks();
    const loadedTrophies = loadTrophies();
    setTasks(loadedTasks);
    setTrophies(loadedTrophies);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Save trophies to localStorage whenever trophies change
  useEffect(() => {
    saveTrophies(trophies);
  }, [trophies]);

  // Add a new task
  const addTask = (text, category = 'General') => {
    const newTask = {
      id: Date.now().toString(),
      text,
      category,
      completed: false,
      createdAt: new Date(),
      completedAt: null,
      prompted: false,
      promptCount: 0,
      completionCount: 0
    };
    setTasks([...tasks, newTask]);
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Complete a task
  const completeTask = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = {
          ...task,
          completed: true,
          completedAt: new Date(),
          completionCount: task.completionCount + 1
        };
        return updatedTask;
      }
      return task;
    }));

    // Show reward animation
    setShowReward(true);

    // Check for new trophies
    checkForTrophies();
  };

  // Show a random task prompt
  const showRandomPrompt = () => {
    const incompleteTasks = tasks.filter(task => !task.completed);
    if (incompleteTasks.length > 0) {
      const randomIndex = Math.floor(Math.random() * incompleteTasks.length);
      const task = incompleteTasks[randomIndex];
      setCurrentTask(task);
      setShowPrompt(true);

      // Update task prompt count
      setTasks(tasks.map(t => {
        if (t.id === task.id) {
          return { ...t, prompted: true, promptCount: t.promptCount + 1 };
        }
        return t;
      }));
    }
  };

  // Handle prompt response
  const handlePromptResponse = (response) => {
    setShowPrompt(false);
    if (response === 'accept') {
      completeTask(currentTask.id);
    } else if (response === 'delay') {
      // For now, we'll just close the prompt
      // In a more advanced version, we could schedule a reminder
    }
    // If response is 'skip', we just close the prompt
  };

  // Check for new trophies
  const checkForTrophies = () => {
    // Check for "First Step" trophy
    const firstStepTrophy = trophies.find(t => t.id === 'first-step');
    if (!firstStepTrophy && tasks.some(t => t.completed)) {
      const newTrophy = {
        id: 'first-step',
        name: 'First Step',
        description: 'Complete your first task',
        earnedAt: new Date(),
        icon: '🥇'
      };
      setTrophies([...trophies, newTrophy]);
      setNewTrophy(newTrophy);
    }

    // Check for "Consistency Starter" trophy
    const consistencyTrophy = trophies.find(t => t.id === 'consistency-starter');
    if (!consistencyTrophy && tasks.filter(t => t.completed).length >= 3) {
      const newTrophy = {
        id: 'consistency-starter',
        name: 'Consistency Starter',
        description: 'Complete tasks for 3 days',
        earnedAt: new Date(),
        icon: '📅'
      };
      setTrophies([...trophies, newTrophy]);
      setNewTrophy(newTrophy);
    }
  };

  // Handle reward completion
  const handleRewardComplete = () => {
    setShowReward(false);
    setNewTrophy(null);
  };

  return (
    <div className="app">
      <header>
        <h1>ATaskPrompt</h1>
        <button onClick={showRandomPrompt} className="prompt-button">
          Show Random Task
        </button>
      </header>

      <main>
        <TaskList 
          tasks={tasks} 
          onAddTask={addTask} 
          onDeleteTask={deleteTask} 
          onCompleteTask={completeTask} 
        />

        <TaskSwipe 
          tasks={tasks.filter(task => !task.completed)} 
          onSwipeLeft={(id) => console.log('Skipped task:', id)}
          onSwipeRight={completeTask}
        />

        <TrophyBoard trophies={trophies} newTrophy={newTrophy} />
      </main>

      <TaskPrompt 
        task={currentTask} 
        isVisible={showPrompt} 
        onResponse={handlePromptResponse} 
      />

      <RewardAnimation 
        isActive={showReward} 
        onComplete={handleRewardComplete} 
      />
    </div>
  );
}

export default App;