
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  estimatedDuration: number; // in minutes
  deadline?: Date;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  scheduledTime?: string; // HH:MM format
  scheduledDate?: Date; // New field for scheduling tasks on specific dates
  actualDuration?: number; // in minutes
  routineId?: string;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  parentRecurringId?: string; // Links generated tasks to their recurring template
}

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly';
  interval: number; // Every X days/weeks/months
  daysOfWeek?: number[]; // For weekly: 0=Sunday, 1=Monday, etc
  endDate?: Date;
  maxOccurrences?: number;
}

export interface TimeSlot {
  time: string;
  task?: Task;
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  tasks: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>[];
  createdAt: Date;
}

export interface WellnessBreak {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: 'stretching' | 'hydration' | 'breathing' | 'eyes' | 'movement';
}

export interface DaySummary {
  date: Date;
  completedTasks: number;
  totalTasks: number;
  focusTime: number; // in minutes
  completionRate: number;
  topCategory: string;
  suggestions: string[];
}

export interface MoodEntry {
  id: string;
  date: Date;
  mood: 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad';
  energy: 'high' | 'medium' | 'low';
  notes?: string;
  createdAt: Date;
}

export interface MoodAnalytics {
  averageMood: number;
  moodProductivityCorrelation: number;
  bestMoodDays: Date[];
  moodTrends: Array<{
    date: Date;
    mood: number;
    productivity: number;
  }>;
}
