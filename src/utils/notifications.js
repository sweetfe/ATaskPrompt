// notifications.js - Notification utilities for TaskCat
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { CONFIG } from '../config.js';

// Check if we can send notifications
export const canSendNotifications = async () => {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }
  
  try {
    const permission = await LocalNotifications.checkPermissions();
    return permission.display === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
};

// Request notification permissions
export const requestNotificationPermissions = async () => {
  if (!Capacitor.isNativePlatform()) {
    return { display: 'denied' };
  }
  
  try {
    const permission = await LocalNotifications.requestPermissions();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return { display: 'denied' };
  }
};

// Schedule a notification for a task
export const scheduleTaskNotification = async (task) => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Notifications only available on native platforms');
    return;
  }
  
  try {
    // Check if we have permission
    const hasPermission = await canSendNotifications();
    if (!hasPermission) {
      console.log('No permission to send notifications');
      return;
    }
    
    // Check if this is a bill payment task
    const isBillTask = CONFIG.BILL_CATEGORIES.includes(task.category);
    
    // Calculate notification time based on task priority and due date
    let notificationTime = new Date();
    
    if (task.dueDate) {
      if (isBillTask) {
        // For bill payments, notify 3 days before due date
        notificationTime = new Date(task.dueDate);
        notificationTime.setDate(notificationTime.getDate() - 3);
      } else {
        // For other due date tasks, notify 1 hour before due time
        notificationTime = new Date(task.dueDate);
        notificationTime.setHours(notificationTime.getHours() - 1);
      }
    } else if (task.priority === 'high') {
      // For high priority tasks, notify in 30 minutes
      notificationTime.setMinutes(notificationTime.getMinutes() + 30);
    } else {
      // For normal priority tasks, notify in 1 hour
      notificationTime.setHours(notificationTime.getHours() + 1);
    }
    
    // Don't schedule notifications in the past
    const now = new Date();
    if (notificationTime < now) {
      notificationTime = new Date(now.getTime() + 5 * 60000); // 5 minutes from now
    }
    
    // Set appropriate title and body based on task type
    let title = 'Task Reminder';
    let body = `Don't forget: ${task.text}`;
    
    if (task.priority === 'high') {
      title = 'High Priority Task!';
    } else if (isBillTask) {
      title = 'Bill Payment Reminder';
      body = `Don't forget to pay: ${task.text}`;
    }
    
    // Schedule the notification
    const result = await LocalNotifications.schedule({
      notifications: [
        {
          id: parseInt(task.id.replace(/\D/g, '').slice(-9)), // Use task ID as notification ID
          title: title,
          body: body,
          schedule: {
            at: notificationTime,
            allowWhileIdle: true
          },
          sound: 'default',
          attachments: [
            {
              id: 'taskcat',
              url: 'res://ic_launcher.png'
            }
          ],
          actionTypeId: 'taskcat',
          extra: {
            taskId: task.id,
            taskText: task.text,
            isBillTask: isBillTask
          }
        }
      ]
    });
    
    console.log('Scheduled notification for task:', task.id, 'at', notificationTime);
    return result;
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

// Cancel a notification for a task
export const cancelTaskNotification = async (taskId) => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }
  
  try {
    const notificationId = parseInt(taskId.replace(/\D/g, '').slice(-9));
    await LocalNotifications.cancel({
      notifications: [
        { id: notificationId }
      ]
    });
    console.log('Cancelled notification for task:', taskId);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};

// Initialize notification system
export const initializeNotifications = async () => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }
  
  try {
    // Request permissions
    const permission = await requestNotificationPermissions();
    console.log('Notification permission status:', permission.display);
    
    // Create notification channel for Android
    if (Capacitor.getPlatform() === 'android') {
      try {
        await LocalNotifications.createChannel({
          id: 'taskcat',
          name: 'TaskCat Notifications',
          description: 'Task reminders and alerts',
          importance: 5,
          visibility: 1
        });
      } catch (error) {
        console.log('Channel already exists or error creating channel:', error);
      }
    }
    
    // Register notification actions
    try {
      await LocalNotifications.registerActionTypes({
        types: [
          {
            id: 'taskcat',
            actions: [
              {
                id: 'complete',
                title: 'Mark as Complete'
              },
              {
                id: 'snooze',
                title: 'Snooze'
              }
            ]
          }
        ]
      });
    } catch (error) {
      console.log('Actions already registered or error registering actions:', error);
    }
    
    // Add listener for notification actions
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('Notification action performed:', notification);
      // Handle notification actions here if needed
    });
    
    console.log('Notifications initialized');
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};

// Export all functions
export default {
  canSendNotifications,
  requestNotificationPermissions,
  scheduleTaskNotification,
  cancelTaskNotification,
  initializeNotifications
};