// storage.js - Firestore-powered storage for TaskCat
import {
  collection,
  query,
  onSnapshot,
  setDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { auth } from './firebase.js';
import { db } from './firebase.js';
import {
  isOnline,
  queueOperation,
  loadTasksLocally,
  saveTasksLocally,
  loadTrophiesLocally,
  saveTrophiesLocally
} from './offlineStorage.js';

// Cache for tasks and trophies to reduce re-renders
let tasksCache = [];
let trophiesCache = [];
let lastTasksUpdate = 0;
let lastTrophiesUpdate = 0;
const CACHE_TIMEOUT = 1000; // 1 second cache timeout

// Check if tasks cache is still valid
const isTasksCacheValid = () => {
  return Date.now() - lastTasksUpdate < CACHE_TIMEOUT;
};

// Check if trophies cache is still valid
const isTrophiesCacheValid = () => {
  return Date.now() - lastTrophiesUpdate < CACHE_TIMEOUT;
};

// Update tasks cache
const updateTasksCache = (tasks) => {
  tasksCache = tasks;
  lastTasksUpdate = Date.now();
};

// Update trophies cache
const updateTrophiesCache = (trophies) => {
  trophiesCache = trophies;
  lastTrophiesUpdate = Date.now();
};

// Get user-specific Firestore reference
const getUserCollection = (collectionName) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not signed in');
  return collection(db, 'users', user.uid, collectionName);
};

// ===== TASKS =====

// Listen for real-time task updates
export function loadTasks(callback) {
  if (!auth.currentUser) {
    console.error('User not signed in');
    return () => {};
  }

  const q = query(getUserCollection('tasks'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        completedAt: data.completedAt?.toDate?.() || data.completedAt
      };
    });
    
    // Update cache
    updateTasksCache(tasks);
    
    callback(tasks);
  }, (error) => {
    console.error('Error loading tasks from Firestore:', error);
  });

  return unsubscribe;
}

// Add a new task
export async function addTask(task) {
  if (!auth.currentUser) {
    // If offline, save to local storage
    if (!isOnline()) {
      const localTasks = loadTasksLocally();
      localTasks.push(task);
      saveTasksLocally(localTasks);
      // Queue for later sync
      queueOperation({ type: 'ADD_TASK', data: task });
      console.log('✅ Task queued for later sync:', task.id);
      return;
    }
    throw new Error('User not signed in');
  }

  // If offline, save to local storage and queue for sync
  if (!isOnline()) {
    const localTasks = loadTasksLocally();
    localTasks.push(task);
    saveTasksLocally(localTasks);
    queueOperation({ type: 'ADD_TASK', data: task });
    console.log('✅ Task queued for later sync:', task.id);
    return;
  }

  // ✅ Use task.id as the document ID
  const taskDoc = doc(db, 'users', auth.currentUser.uid, 'tasks', task.id);

  const taskToSave = {
    ...task,
    createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
    completedAt: task.completedAt ? new Date(task.completedAt) : null
  };

  // ✅ Use setDoc — this ensures the ID matches exactly
  await setDoc(taskDoc, taskToSave);
  console.log('✅ Task added with ID:', task.id);
}

// Update a task (e.g., mark as completed)
export async function updateTask(taskId, updates) {
  if (!auth.currentUser) {
    // If offline, save to local storage
    if (!isOnline()) {
      const localTasks = loadTasksLocally();
      const taskIndex = localTasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        localTasks[taskIndex] = { ...localTasks[taskIndex], ...updates };
        saveTasksLocally(localTasks);
      }
      // Queue for later sync
      queueOperation({ type: 'UPDATE_TASK', taskId, updates });
      console.log('✅ Task update queued for later sync:', taskId);
      return;
    }
    throw new Error('User not signed in');
  }

  // If offline, save to local storage and queue for sync
  if (!isOnline()) {
    const localTasks = loadTasksLocally();
    const taskIndex = localTasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      localTasks[taskIndex] = { ...localTasks[taskIndex], ...updates };
      saveTasksLocally(localTasks);
    }
    queueOperation({ type: 'UPDATE_TASK', taskId, updates });
    console.log('✅ Task update queued for later sync:', taskId);
    return;
  }

  // ✅ Reference the task document
  const taskDoc = doc(db, 'users', auth.currentUser.uid, 'tasks', taskId);

  // ✅ Prepare updates
  const updatesToSave = {
    ...updates,
    completedAt: updates.completedAt ? new Date(updates.completedAt) : null
  };

  // ✅ Use setDoc with merge: true (creates if missing, updates if exists)
  await setDoc(taskDoc, updatesToSave, { merge: true });
  console.log('✅ Task updated in Firestore:', taskId);
}

// Delete a task
export async function deleteTask(taskId) {
  if (!auth.currentUser) {
    // If offline, save to local storage
    if (!isOnline()) {
      const localTasks = loadTasksLocally();
      const filteredTasks = localTasks.filter(t => t.id !== taskId);
      saveTasksLocally(filteredTasks);
      // Queue for later sync
      queueOperation({ type: 'DELETE_TASK', taskId });
      console.log('✅ Task deletion queued for later sync:', taskId);
      return;
    }
    throw new Error('User not signed in');
  }

  // If offline, save to local storage and queue for sync
  if (!isOnline()) {
    const localTasks = loadTasksLocally();
    const filteredTasks = localTasks.filter(t => t.id !== taskId);
    saveTasksLocally(filteredTasks);
    queueOperation({ type: 'DELETE_TASK', taskId });
    console.log('✅ Task deletion queued for later sync:', taskId);
    return;
  }

  const taskDoc = doc(db, 'users', auth.currentUser.uid, 'tasks', taskId);
  await deleteDoc(taskDoc);
  console.log('✅ Task deleted:', taskId);
}

// ===== TROPHIES =====

export function loadTrophies(callback) {
  if (!auth.currentUser) return () => {};

  const q = query(getUserCollection('trophies'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const trophies = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        earnedAt: data.earnedAt?.toDate?.() || data.earnedAt,
        associatedTask: data.associatedTask ? {
          ...data.associatedTask,
          createdAt: data.associatedTask.createdAt?.toDate?.() || data.associatedTask.createdAt,
          completedAt: data.associatedTask.completedAt?.toDate?.() || data.associatedTask.completedAt
        } : null
      };
    });
    
    // Update cache
    updateTrophiesCache(trophies);
    
    callback(trophies);
  }, (error) => {
    console.error('Error loading trophies from Firestore:', error);
  });

  return unsubscribe;
}

export async function addTrophy(trophy) {
  if (!auth.currentUser) {
    // If offline, save to local storage
    if (!isOnline()) {
      const localTrophies = loadTrophiesLocally();
      localTrophies.push(trophy);
      saveTrophiesLocally(localTrophies);
      // Queue for later sync
      queueOperation({ type: 'ADD_TROPHY', data: trophy });
      console.log('✅ Trophy queued for later sync:', trophy.id);
      return;
    }
    throw new Error('User not signed in');
  }

  // If offline, save to local storage and queue for sync
  if (!isOnline()) {
    const localTrophies = loadTrophiesLocally();
    localTrophies.push(trophy);
    saveTrophiesLocally(localTrophies);
    queueOperation({ type: 'ADD_TROPHY', data: trophy });
    console.log('✅ Trophy queued for later sync:', trophy.id);
    return;
  }

  const trophyId = trophy.id || `trophy_${Date.now()}`;
  const trophyDoc = doc(db, 'users', auth.currentUser.uid, 'trophies', trophyId);

  const trophyToSave = {
    ...trophy,
    id: trophyId,
    earnedAt: trophy.earnedAt ? new Date(trophy.earnedAt) : new Date(),
    associatedTask: trophy.associatedTask ? {
      ...trophy.associatedTask,
      createdAt: trophy.associatedTask.createdAt ? new Date(trophy.associatedTask.createdAt) : null,
      completedAt: trophy.associatedTask.completedAt ? new Date(trophy.associatedTask.completedAt) : null
    } : null
  };

  await setDoc(trophyDoc, trophyToSave);
  console.log('✅ Trophy added with ID:', trophyId);
}

// ===== SETTINGS & LAST PROMPT TIME =====
// (Keep the rest of your functions — they’re fine)

export async function saveSettings(settings) {
  if (!auth.currentUser) return;
  const settingsDoc = doc(db, 'users', auth.currentUser.uid, 'settings', 'userSettings');
  await setDoc(settingsDoc, settings, { merge: true });
}

export function loadSettings(callback) {
  if (!auth.currentUser) return () => {};
  const settingsDoc = doc(db, 'users', auth.currentUser.uid, 'settings', 'userSettings');
  return onSnapshot(settingsDoc, (doc) => {
    if (doc.exists()) callback(doc.data());
    else callback(null);
  });
}

export async function saveLastPromptTime(time) {
  if (!auth.currentUser) return;
  const promptDoc = doc(db, 'users', auth.currentUser.uid, 'settings', 'lastPrompt');
  await setDoc(promptDoc, { time: new Date(time) }, { merge: true });
}

export function loadLastPromptTime(callback) {
  if (!auth.currentUser) return () => {};
  const promptDoc = doc(db, 'users', auth.currentUser.uid, 'settings', 'lastPrompt');
  return onSnapshot(promptDoc, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback(data.time?.toDate?.() || data.time);
    } else {
      callback(null);
    }
  });
}