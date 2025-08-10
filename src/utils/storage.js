// Storage utility functions for ATaskPrompt

// Storage keys
const STORAGE_KEYS = {
  TASKS: 'ataskprompt_tasks',
  TROPHIES: 'ataskprompt_trophies',
  SETTINGS: 'ataskprompt_settings',
  LAST_PROMPT: 'ataskprompt_lastPrompt'
};

// Save tasks to localStorage
export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
}

// Load tasks from localStorage
export function loadTasks() {
  try {
    const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
}

// Save trophies to localStorage
export function saveTrophies(trophies) {
  try {
    localStorage.setItem(STORAGE_KEYS.TROPHIES, JSON.stringify(trophies));
  } catch (error) {
    console.error('Error saving trophies to localStorage:', error);
  }
}

// Load trophies from localStorage
export function loadTrophies() {
  try {
    const trophies = localStorage.getItem(STORAGE_KEYS.TROPHIES);
    return trophies ? JSON.parse(trophies) : [];
  } catch (error) {
    console.error('Error loading trophies from localStorage:', error);
    return [];
  }
}

// Save settings to localStorage
export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
}

// Load settings from localStorage
export function loadSettings() {
  try {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error('Error loading settings from localStorage:', error);
    return null;
  }
}

// Save last prompt time
export function saveLastPromptTime(time) {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_PROMPT, time.toISOString());
  } catch (error) {
    console.error('Error saving last prompt time to localStorage:', error);
  }
}

// Load last prompt time
export function loadLastPromptTime() {
  try {
    const time = localStorage.getItem(STORAGE_KEYS.LAST_PROMPT);
    return time ? new Date(time) : null;
  } catch (error) {
    console.error('Error loading last prompt time from localStorage:', error);
    return null;
  }
}