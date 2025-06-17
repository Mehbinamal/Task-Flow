
import { Task, RecurringPattern } from '@/types/task';
import { addDays, addWeeks, addMonths, isBefore, startOfDay, format } from 'date-fns';

export const generateRecurringTaskInstances = (
  recurringTask: Task,
  fromDate: Date,
  toDate: Date
): Task[] => {
  if (!recurringTask.isRecurring || !recurringTask.recurringPattern) {
    return [];
  }

  const instances: Task[] = [];
  const pattern = recurringTask.recurringPattern;
  let currentDate = startOfDay(fromDate);
  const endDate = startOfDay(toDate);
  let occurrenceCount = 0;

  while (isBefore(currentDate, endDate) || currentDate.getTime() === endDate.getTime()) {
    // Check if we've reached the end conditions
    if (pattern.endDate && currentDate > pattern.endDate) break;
    if (pattern.maxOccurrences && occurrenceCount >= pattern.maxOccurrences) break;

    let shouldCreateInstance = false;
    
    switch (pattern.type) {
      case 'daily':
        shouldCreateInstance = true;
        break;
        
      case 'weekly':
        const dayOfWeek = currentDate.getDay();
        shouldCreateInstance = pattern.daysOfWeek?.includes(dayOfWeek) || false;
        break;
        
      case 'monthly':
        // Create on the same day of month as the original creation date
        const originalDay = recurringTask.createdAt.getDate();
        shouldCreateInstance = currentDate.getDate() === originalDay;
        break;
    }

    if (shouldCreateInstance && currentDate >= startOfDay(fromDate)) {
      const instance: Task = {
        ...recurringTask,
        id: crypto.randomUUID(),
        scheduledDate: new Date(currentDate),
        parentRecurringId: recurringTask.id,
        isRecurring: false,
        recurringPattern: undefined,
        completed: false,
        completedAt: undefined,
      };
      
      instances.push(instance);
      occurrenceCount++;
    }

    // Move to next occurrence
    switch (pattern.type) {
      case 'daily':
        currentDate = addDays(currentDate, pattern.interval);
        break;
      case 'weekly':
        if (pattern.daysOfWeek && pattern.daysOfWeek.length > 0) {
          // Find next day in the week pattern
          const nextDay = findNextDayInWeek(currentDate, pattern.daysOfWeek);
          if (nextDay) {
            currentDate = nextDay;
          } else {
            currentDate = addWeeks(currentDate, pattern.interval);
            // Find first day of week in pattern
            const firstDayOfWeek = Math.min(...pattern.daysOfWeek);
            const daysToAdd = (firstDayOfWeek - currentDate.getDay() + 7) % 7;
            currentDate = addDays(currentDate, daysToAdd);
          }
        } else {
          currentDate = addWeeks(currentDate, pattern.interval);
        }
        break;
      case 'monthly':
        currentDate = addMonths(currentDate, pattern.interval);
        break;
    }
  }

  return instances;
};

const findNextDayInWeek = (currentDate: Date, daysOfWeek: number[]): Date | null => {
  const currentDay = currentDate.getDay();
  const nextDays = daysOfWeek.filter(day => day > currentDay);
  
  if (nextDays.length > 0) {
    const nextDay = Math.min(...nextDays);
    const daysToAdd = nextDay - currentDay;
    return addDays(currentDate, daysToAdd);
  }
  
  return null;
};
