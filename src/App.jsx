// App.jsx - Main component for TaskCat
 import React, { useState, useEffect } from 'react';
 import TaskList from './components/TaskList.jsx';
 import TaskPrompt from './components/TaskPrompt.jsx';
 import TaskSwipe from './components/TaskSwipe.jsx';
 import RewardAnimation from './components/RewardAnimation.jsx';
 import TrophyBoard from './components/TrophyBoard.jsx';
 import DateHistoryView from './components/DateHistoryView.jsx';
 import TaskSearch from './components/TaskSearch.jsx';
 import Spacer from './components/Spacer.jsx';
 import LoadingIndicator from './components/LoadingIndicator.jsx';
 import {
   loadTasks,
   addTask as firestoreAddTask,
   updateTask as firestoreUpdateTask,
   deleteTask as firestoreDeleteTask,
   loadTrophies,
   addTrophy,
   loadSettings,
   saveSettings
 } from './utils/storage.js';
 import { useAuth } from './contexts/AuthContext.jsx';
 import { initializeOfflineStorage, isOnline, loadTasksLocally, loadTrophiesLocally } from './utils/offlineStorage.js';
 import { useTaskUtils } from './hooks/useTaskUtils.js';
 import { CONFIG } from './config.js';
 import { initializeNotifications, scheduleTaskNotification, cancelTaskNotification } from './utils/notifications.js';

 function App() {
   const { currentUser, signIn, signOut } = useAuth();
   const [tasks, setTasks] = useState([]);
   const [trophies, setTrophies] = useState([]);
   const [dataLoaded, setDataLoaded] = useState(false);
   const [showPrompt, setShowPrompt] = useState(false);
   const [currentTask, setCurrentTask] = useState(null);
   const [showReward, setShowReward] = useState(false);
   const [newTrophy, setNewTrophy] = useState(null);
   const [activeTab, setActiveTab] = useState('trophies');
   const [isOffline, setIsOffline] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [currentContext, setCurrentContext] = useState('All');
   const [taskToEdit, setTaskToEdit] = useState(null);
   const [customContexts, setCustomContexts] = useState([]);
   const [showTasks, setShowTasks] = useState(true);

   // Initialize offline storage
   useEffect(() => {
     initializeOfflineStorage();
     initializeNotifications();
     
     // Check initial online status
     setIsOffline(!isOnline());
     
     // Listen for online/offline events
     const handleOnline = () => {
       setIsOffline(false);
       console.log('App is now online');
     };
     
     const handleOffline = () => {
       setIsOffline(true);
       console.log('App is now offline');
     };
     
     window.addEventListener('online', handleOnline);
     window.addEventListener('offline', handleOffline);
     
     return () => {
       window.removeEventListener('online', handleOnline);
       window.removeEventListener('offline', handleOffline);
     };
   }, []);

   // Load tasks and trophies from Firestore when user signs in
   useEffect(() => {
     if (!currentUser) return;

     console.log('🔄 Loading tasks and trophies from Firestore...');
     const unsubscribeTasks = loadTasks((loadedTasks) => {
       console.log('📥 Tasks updated from Firestore:', loadedTasks);
       setTasks(loadedTasks);
     });

     const unsubscribeTrophies = loadTrophies((loadedTrophies) => {
       console.log('📥 Trophies updated:', loadedTrophies);
       setTrophies(loadedTrophies);
     });

     // Load settings including custom contexts
     const unsubscribeSettings = loadSettings((settings) => {
       if (settings && settings.customContexts) {
         setCustomContexts(settings.customContexts);
       }
     });

     setDataLoaded(true);

     return () => {
       console.log('🛑 Stopping Firestore listeners');
       unsubscribeTasks();
       unsubscribeTrophies();
       if (unsubscribeSettings) unsubscribeSettings();
     };
   }, [currentUser]);

   // Add a new task - save to Firestore
   const addTask = async (text, category = 'General', context = 'Home', dueDate = null, priority = 'normal') => {
     const iconMap = {
       'Learning': 'book',
       'Health': 'heart',
       'Work': 'briefcase',
       'Home': 'house',
       'Cleaning': 'broom',
       'Priority': 'star',
       'School': 'school',
       'Grocery': 'grocery',
       'General': 'checklist',
       'Self-Care / Wellness': 'water',
       'Appointments / Social': 'calendar',
       'Transportation / Errands': 'car',
       'Cleaning / Maintenance': 'trash',
       'Hobbies / Creative Time': 'palette',
       'Tech / Digital': 'laptop',
       'Financial / Budgeting': 'money'
     };

     const icon = iconMap[category] || 'checklist';

     // ✅ Use Date.now().toString() for consistent, predictable IDs
     const newTask = {
       id: Date.now().toString(),
       text,
       category,
       context,
       completed: false, // ❌ Not done yet
       createdAt: new Date(),
       completedAt: null,
       prompted: false,
       promptCount: 0,
       completionCount: 0,
       icon,
       dueDate,
       priority
     };

     try {
       setIsLoading(true);
       await firestoreAddTask(newTask);
     } catch (error) {
       console.error('Failed to save task to Firestore:', error);
     } finally {
       setIsLoading(false);
       // Schedule notification for the new task
       scheduleTaskNotification(newTask);
     }
   };

   // Delete a task - remove from Firestore
   const deleteTask = async (id) => {
     try {
       setIsLoading(true);
       await firestoreDeleteTask(id);
     } catch (error) {
       console.error('Failed to delete task from Firestore:', error);
     } finally {
       setIsLoading(false);
       // Cancel notification for the deleted task
       cancelTaskNotification(id);
     }
   };

   // Complete a task
   const completeTask = async (id) => {
     const task = tasks.find(t => t.id === id);
     if (!task) return;

     // ✅ Create updated task object
     const completedTask = {
       ...task,
       completed: true, // ✅ Mark as done
       completedAt: new Date(),
       completionCount: (task.completionCount || 0) + 1
     };

     try {
       setIsLoading(true);
       // ✅ Save to Firestore
       await firestoreUpdateTask(id, {
         completed: true,
         completedAt: completedTask.completedAt,
         completionCount: completedTask.completionCount
       });

       // ✅ Update local state to trigger re-render
       setTasks(prevTasks => prevTasks.map(t => (t.id === id ? completedTask : t)));

       // ✅ Show confetti and trophy
       setShowReward(true);

       // ✅ Check for new trophies
       checkForTrophies(tasks.map(t => (t.id === id ? completedTask : t)));
     } catch (error) {
       console.error('Failed to complete task:', error);
     } finally {
       setIsLoading(false);
       // Cancel notification for the completed task
       cancelTaskNotification(id);
     }
   };

   // ✅ Renamed to avoid conflict with imported firestoreUpdateTask
   const handleTaskUpdate = async (id, updates) => {
     console.log('🔧 Updating task with ID:', id);
     const updatedTask = { ...tasks.find(t => t.id === id), ...updates };
     try {
       setIsLoading(true);
       await firestoreUpdateTask(id, updatedTask);
       console.log('✅ Updated in Firestore');
     } catch (error) {
       console.error('❌ Failed to update task:', error);
     } finally {
       setIsLoading(false);
       // Reschedule notification for the updated task
       const updatedTask = tasks.find(t => t.id === id);
       if (updatedTask) {
         cancelTaskNotification(id);
         scheduleTaskNotification({ ...updatedTask, ...updates });
       }
     }
   };


   
      // Show a random task prompt
      const showRandomPrompt = () => {
        const availableTasks = (tasks || []).filter(task => {
          // Filter by completion status
          const isNotCompleted = !task.completed;
          
          // Filter by context if not "All"
          const matchesContext = currentContext === 'All' || task.context === currentContext;
          
          return isNotCompleted && matchesContext;
        });
   
        if (availableTasks.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableTasks.length);
          const task = availableTasks[randomIndex];
          setCurrentTask(task);
          setShowPrompt(true);
   
          // Update task prompt count
          const updatedTask = { ...task, prompted: true, promptCount: task.promptCount + 1 };
          firestoreUpdateTask(task.id, updatedTask);
        } else {
          const contextMessage = currentContext === 'All' ? 'any context' : `context "${currentContext}"`;
          alert(`No tasks available to show. Either all tasks are completed or none match your current ${contextMessage}.`);
        }
      };
   // Handle prompt response
   const handlePromptResponse = (response) => {
     setShowPrompt(false);
     if (response === 'accept') {
       completeTask(currentTask.id);
     }
   };

   // Check for new trophies
   const checkForTrophies = (updatedTasks) => {
     const completedTasks = updatedTasks.filter(t => t.completed);
     
     // Get tasks completed in the last 24 hours
     const now = new Date();
     const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
     const todayCompletedTasks = completedTasks.filter(task => 
       new Date(task.completedAt) >= twentyFourHoursAgo
     );
     const todayCompletedCount = todayCompletedTasks.length;

     const mostRecentTask = completedTasks.length > 0
       ? completedTasks.reduce((latest, task) =>
           new Date(task.completedAt) > new Date(latest.completedAt) ? task : latest
         )
       : null;

     // Only award trophy if we just completed a task (mostRecentTask should be within last minute)
     if (!mostRecentTask || new Date(mostRecentTask.completedAt) < new Date(now.getTime() - 60000)) {
       return;
     }

     let trophyIcon = '';
     let trophyName = '';
     let trophyDescription = '';

     // Award trophies based on tasks completed in 24-hour period
     if (todayCompletedCount <= 10) {
       trophyIcon = '/trophy_art/silver-trophy-ChatGPT.png';
       trophyName = `Silver Trophy #${todayCompletedCount}`;
       trophyDescription = `Completed ${todayCompletedCount} task${todayCompletedCount > 1 ? 's' : ''} in 24 hours`;
     } else if (todayCompletedCount <= 20) {
       trophyIcon = '/trophy_art/bronze-trophy-ChatGPT.png';
       trophyName = `Bronze Trophy #${todayCompletedCount - 10}`;
       trophyDescription = `Completed ${todayCompletedCount} tasks in 24 hours`;
     } else {
       trophyIcon = '🏆';
       trophyName = `Gold Trophy #${todayCompletedCount - 20}`;
       trophyDescription = `Completed ${todayCompletedCount} tasks in 24 hours`;
     }

     // Create unique trophy ID based on date and count
     const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
     const newTrophy = {
       id: `${today}-task-${todayCompletedCount}`,
       name: trophyName,
       description: trophyDescription,
       earnedAt: new Date(),
       icon: trophyIcon,
       associatedTask: mostRecentTask ? {
         id: mostRecentTask.id,
         text: mostRecentTask.text,
         category: mostRecentTask.category,
         createdAt: mostRecentTask.createdAt,
         completedAt: mostRecentTask.completedAt,
         
         promptCount: mostRecentTask.promptCount,
         completionCount: mostRecentTask.completionCount
       } : null
     };

     setTrophies(prev => [...prev, newTrophy]);
     setNewTrophy(newTrophy);

     // Check for "Variety Seeker" trophy
     const varietySeekerTrophy = trophies.find(t => t.id === 'variety-seeker');
     if (!varietySeekerTrophy) {
       const categories = [...new Set(completedTasks.map(t => t.category))];
       if (categories.length >= 5) {
         const varietyTrophy = {
           id: 'variety-seeker',
           name: 'Variety Seeker',
           description: 'Complete tasks from 5 different categories',
           earnedAt: new Date(),
           icon: '🏆',
           associatedTask: mostRecentTask ? {
             id: mostRecentTask.id,
             text: mostRecentTask.text,
             category: mostRecentTask.category,
             createdAt: mostRecentTask.createdAt,
             completedAt: mostRecentTask.completedAt,
             
             promptCount: mostRecentTask.promptCount,
             completionCount: mostRecentTask.completionCount
           } : null
         };
         setTrophies(prev => [...prev, varietyTrophy]);
         setNewTrophy(varietyTrophy);
         // Also save the variety trophy
         try {
           addTrophy(varietyTrophy);
         } catch (error) {
           console.error('Failed to save variety trophy to Firestore:', error);
         }
       }
     }

     try {
       addTrophy(newTrophy);
     } catch (error) {
       console.error('Failed to save trophy to Firestore:', error);
     }
   };

   // Handle reward completion
   const handleRewardComplete = () => {
     setShowReward(false);
     setNewTrophy(null);
   };

   const clearDataAndReload = () => {
     window.location.reload();
   };

   // Handle Google sign in
   const handleSignIn = async () => {
     try {
       await signIn();
     } catch (error) {
       console.error('Error signing in:', error);
       alert('Failed to sign in. Please try again.');
     }
   };

   // Handle sign out
   const handleSignOut = async () => {
     try {
       await signOut();
       setTasks([]);
       setTrophies([]);
     } catch (error) {
       console.error('Error signing out:', error);
       alert('Failed to sign out. Please try again.');
     }
   };

   // Handle new context creation
   const handleContextCreated = async (newContext) => {
     if (!customContexts.includes(newContext) && !CONFIG.CONTEXTS.includes(newContext)) {
       const updatedContexts = [...customContexts, newContext];
       setCustomContexts(updatedContexts);
       // Save to settings
       try {
         await saveSettings({ customContexts: updatedContexts });
       } catch (error) {
         console.error('Failed to save custom contexts to settings:', error);
       }
     }
   };

   // If user is not authenticated, show login screen
   if (!currentUser) {
     return (
       <div className="app">
         <header>
           <h1>Task Cat</h1>
         </header>
         <main className="login-container">
           <div className="login-card">
             <h2>Welcome to Task Cat</h2>
             <p>Sign in with your Google account to get started</p>
             <button onClick={handleSignIn} className="google-signin-button">
               Sign in with Google
             </button>
           </div>
         </main>
       </div>
     );
   }

   // ✅ Use custom hook for task utilities
   const { pendingTasks, completedTasks, groupedTrophiesByDate, groupedTasksByDate, allDates, overdueTasks, dueTodayTasks } = useTaskUtils(tasks, trophies);

   return (
     <div className="app">
       <header>
         <div>
           <h1>
             <img src="/favicon_ioTaskCat/favicon.svg" alt="TaskCat Logo" className="header-icon" />
             Task Cat
           </h1>
           {isOffline && (
             <div className="offline-indicator">
               <span>Offline Mode</span>
             </div>
           )}
         </div>
         <div>
           <select
             value={currentContext}
             onChange={(e) => {
               if (e.target.value === 'AddNew') {
                 const newContext = prompt('Enter a new context name:');
                 if (newContext && newContext.trim()) {
                   const trimmedContext = newContext.trim();
                   setCurrentContext(trimmedContext);
                   // Add to custom contexts if not already present
                   handleContextCreated(trimmedContext);
                 }
               } else {
                 setCurrentContext(e.target.value);
               }
             }}
             className="context-selector"
           >
             <option value="All">All Modes</option>
             {CONFIG.CONTEXTS.map(context => (
               <option key={context} value={context}>{context}</option>
             ))}
             {customContexts.map(context => (
               <option key={context} value={context}>{context}</option>
             ))}
             <option value="AddNew">+ Add New Context</option>
           </select>
           <button onClick={showRandomPrompt} className="prompt-button">
             Show Random Task
           </button>
           <button onClick={clearDataAndReload} className="clear-data-button">
             Clear Data & Reload
           </button>
           <button onClick={handleSignOut} className="signout-button">
             Sign Out
           </button>
         </div>
       </header>

       <main>
         <TaskList
           tasks={currentContext === 'All' ? (pendingTasks || []) : (pendingTasks || []).filter(task => task.context === currentContext)} // Filter by context
            allPendingTasks={pendingTasks || []}
           onAddTask={addTask}
           onDeleteTask={deleteTask}
           onCompleteTask={completeTask}
           onUpdateTask={handleTaskUpdate}
           overdueTasks={overdueTasks}
           dueTodayTasks={dueTodayTasks}
           taskToEdit={taskToEdit}
           onContextCreated={handleContextCreated}
           customContexts={customContexts}
           showTasks={showTasks}
           onShowTasksChange={setShowTasks}
         />

        <TaskSwipe
          tasks={(tasks || []).filter(task => !task.completed)}
          onSwipeLeft={(id) => console.log('Viewed previous task:', id)}
          onSwipeRight={completeTask}
        />

         <div className="history-section">
           <div className="tab-navigation">
             <button
               className={`tab-button ${activeTab === 'trophies' ? 'active' : ''}`}
               onClick={() => setActiveTab('trophies')}
             >
               Trophy Board
             </button>
             <button
               className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
               onClick={() => setActiveTab('history')}
             >
               Date History
             </button>
           </div>

           <div className="tab-content">
             {activeTab === 'trophies' ? (
               <TrophyBoard trophies={trophies || []} newTrophy={newTrophy} />
             ) : (
               <DateHistoryView
                 tasks={tasks || []}
                 trophies={trophies || []}
                 groupedTrophiesByDate={groupedTrophiesByDate}
                 groupedTasksByDate={groupedTasksByDate}
                 allDates={allDates}
               />
             )}
           </div>
         </div>
       </main>

       <TaskSearch
         tasks={tasks || []}
         pendingTasks={pendingTasks || []}
         onEditTask={(task) => {
           // If task has updated properties, save them
           if (task.text !== undefined) {
             handleTaskUpdate(task.id, {
               text: task.text,
               category: task.category,
               context: task.context,
               dueDate: task.dueDate,
               priority: task.priority
             });
           } else {
             // Show the task list and set the task for editing
             setShowTasks(true);
             // Set the task for editing in TaskList
             setTaskToEdit(task);
             // Scroll to task list after a short delay to ensure it's visible
             setTimeout(() => {
               const taskListElement = document.getElementById('task-list');
               if (taskListElement) {
                 taskListElement.scrollIntoView({ behavior: 'smooth' });
               }
             }, 100);
           }
         }}
       />

       <Spacer />

       <TaskPrompt
         task={currentTask}
         isVisible={showPrompt}
         onResponse={handlePromptResponse}
       />

       <RewardAnimation
         isActive={showReward}
         onComplete={handleRewardComplete}
         newTrophy={newTrophy}
       />
       
       <LoadingIndicator isLoading={isLoading} />
     </div>
   );
 }

 export default App;