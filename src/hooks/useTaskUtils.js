import { useMemo } from 'react';

// Custom hook for task-related utilities
export const useTaskUtils = (tasks, trophies) => {
  // Memoize pending tasks calculation
  const pendingTasks = useMemo(() => {
    return tasks.filter(task => !task.completed);
  }, [tasks]);

  // Memoize completed tasks calculation
  const completedTasks = useMemo(() => {
    return tasks.filter(task => task.completed);
  }, [tasks]);

  // Memoize grouped trophies by date
  const groupedTrophiesByDate = useMemo(() => {
    const grouped = {};
    trophies.forEach(trophy => {
      const date = new Date(trophy.earnedAt).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(trophy);
    });
    return grouped;
  }, [trophies]);

  // Memoize grouped tasks by date
  const groupedTasksByDate = useMemo(() => {
    const grouped = {};
    completedTasks.forEach(task => {
      const date = new Date(task.completedAt).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(task);
    });
    return grouped;
  }, [completedTasks]);

  // Memoize all unique dates
  const allDates = useMemo(() => {
    const trophyDates = Object.keys(groupedTrophiesByDate);
    const taskDates = Object.keys(groupedTasksByDate);
    const allDates = [...new Set([...trophyDates, ...taskDates])];
    return allDates.sort((a, b) => new Date(b) - new Date(a)); // Sort descending
  }, [groupedTrophiesByDate, groupedTasksByDate]);

  // Memoize overdue tasks
  const overdueTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return pendingTasks.filter(task => {
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);
      return due < today;
    });
  }, [pendingTasks]);

  // Memoize tasks due today
  const dueTodayTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return pendingTasks.filter(task => {
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);
      return due.getTime() === today.getTime();
    });
  }, [pendingTasks]);

  return {
    pendingTasks,
    completedTasks,
    groupedTrophiesByDate,
    groupedTasksByDate,
    allDates,
    overdueTasks,
    dueTodayTasks
  };
};

export default useTaskUtils;