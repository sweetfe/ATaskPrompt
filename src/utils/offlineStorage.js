// offlineStorage.js - Offline storage utilities for TaskCat
import { addTask, updateTask, deleteTask, addTrophy } from './storage.js';

// Local storage keys
const LOCAL_TASKS_KEY = 'taskcat_tasks';
const LOCAL_TROPHIES_KEY = 'taskcat_trophies';
const LOCAL_SETTINGS_KEY = 'taskcat_settings';
const LOCAL_LAST_SYNC_KEY = 'taskcat_last_sync';

// Check if we're online
export const isOnline = () => {
  return navigator.onLine !== undefined ? navigator.onLine : true;
};

// Save data to localStorage
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Load data from localStorage
export const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Save tasks to localStorage
export const saveTasksLocally = (tasks) => {
  return saveToLocalStorage(LOCAL_TASKS_KEY, tasks);
};

// Load tasks from localStorage
export const loadTasksLocally = () => {
  return loadFromLocalStorage(LOCAL_TASKS_KEY) || [];
};

// Save trophies to localStorage
export const saveTrophiesLocally = (trophies) => {
  return saveToLocalStorage(LOCAL_TROPHIES_KEY, trophies);
};

// Load trophies from localStorage
export const loadTrophiesLocally = () => {
  return loadFromLocalStorage(LOCAL_TROPHIES_KEY) || [];
};

// Save settings to localStorage
export const saveSettingsLocally = (settings) => {
  return saveToLocalStorage(LOCAL_SETTINGS_KEY, settings);
};

// Load settings from localStorage
export const loadSettingsLocally = () => {
  return loadFromLocalStorage(LOCAL_SETTINGS_KEY) || {};
};

// Save last sync time
export const saveLastSyncTime = (time) => {
  return saveToLocalStorage(LOCAL_LAST_SYNC_KEY, time);
};

// Load last sync time
export const loadLastSyncTime = () => {
  return loadFromLocalStorage(LOCAL_LAST_SYNC_KEY);
};

// Queue an operation for later sync
export const queueOperation = (operation) => {
  const operations = loadFromLocalStorage('taskcat_pending_operations') || [];
  operations.push({
    ...operation,
    timestamp: Date.now(),
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
  });
  return saveToLocalStorage('taskcat_pending_operations', operations);
};

// Get pending operations
export const getPendingOperations = () => {
  return loadFromLocalStorage('taskcat_pending_operations') || [];
};

// Remove completed operations
export const removeCompletedOperations = (completedIds) => {
  const operations = loadFromLocalStorage('taskcat_pending_operations') || [];
  const remaining = operations.filter(op => !completedIds.includes(op.id));
  return saveToLocalStorage('taskcat_pending_operations', remaining);
};

// Process pending operations when online
export const processPendingOperations = async () => {
  if (!isOnline()) return;
  
  const operations = getPendingOperations();
  const completedIds = [];
  
  for (const operation of operations) {
    try {
      switch (operation.type) {
        case 'ADD_TASK':
          await addTask(operation.data);
          break;
        case 'UPDATE_TASK':
          await updateTask(operation.taskId, operation.updates);
          break;
        case 'DELETE_TASK':
          await deleteTask(operation.taskId);
          break;
        case 'ADD_TROPHY':
          await addTrophy(operation.data);
          break;
        default:
          console.warn('Unknown operation type:', operation.type);
          continue;
      }
      completedIds.push(operation.id);
    } catch (error) {
      console.error('Error processing operation:', error);
      // If it's a network error, we'll try again later
      if (error.code === 'network_error' || error.message.includes('network')) {
        continue;
      }
      // For other errors, we'll remove the operation
      completedIds.push(operation.id);
    }
  }
  
  // Remove completed operations
  if (completedIds.length > 0) {
    removeCompletedOperations(completedIds);
  }
  
  // Update last sync time
  saveLastSyncTime(new Date().toISOString());
};

// Initialize offline storage
export const initializeOfflineStorage = () => {
  // Add event listeners for online/offline events
  window.addEventListener('online', () => {
    console.log('Browser is online - processing pending operations');
    processPendingOperations();
  });
  
  window.addEventListener('offline', () => {
    console.log('Browser is offline - switching to offline mode');
  });
  
  // Process pending operations on load if online
  if (isOnline()) {
    setTimeout(processPendingOperations, 2000); // Wait a bit for app to initialize
  }
};

// Export all functions
export default {
  isOnline,
  saveToLocalStorage,
  loadFromLocalStorage,
  saveTasksLocally,
  loadTasksLocally,
  saveTrophiesLocally,
  loadTrophiesLocally,
  saveSettingsLocally,
  loadSettingsLocally,
  saveLastSyncTime,
  loadLastSyncTime,
  queueOperation,
  getPendingOperations,
  removeCompletedOperations,
  processPendingOperations,
  initializeOfflineStorage
};