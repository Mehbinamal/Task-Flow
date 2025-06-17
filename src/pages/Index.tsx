
import { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { TaskManager } from '@/components/TaskManager';
import { DailySchedule } from '@/components/DailySchedule';
import { FocusTimer } from '@/components/FocusTimer';
import { Analytics } from '@/components/Analytics';
import { RoutineBuilder } from '@/components/RoutineBuilder';
import { WellnessBreaks } from '@/components/WellnessBreaks';
import { NightSummary } from '@/components/NightSummary';
import { Task, Routine, WellnessBreak, MoodEntry } from '@/types/task';

const Index = () => {
  const [activeView, setActiveView] = useState<'tasks' | 'schedule' | 'focus' | 'analytics' | 'routines' | 'wellness' | 'summary'>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [focusTimeToday, setFocusTimeToday] = useState(0);
  const [completedBreaks, setCompletedBreaks] = useState(0);

  const applyRoutine = (routine: Routine) => {
    const newTasks = routine.tasks.map(task => ({
      ...task,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date(),
      routineId: routine.id,
    }));
    
    setTasks([...tasks, ...newTasks]);
    setActiveView('tasks');
  };

  const handleBreakComplete = (breakItem: WellnessBreak) => {
    setCompletedBreaks(prev => prev + 1);
  };

  const handleFocusTimeUpdate = (minutes: number) => {
    setFocusTimeToday(prev => prev + minutes);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DashboardHeader activeView={activeView} setActiveView={setActiveView} />
      
      <main className="container mx-auto px-4 py-6">
        {activeView === 'tasks' && <TaskManager tasks={tasks} setTasks={setTasks} />}
        {activeView === 'schedule' && <DailySchedule tasks={tasks} setTasks={setTasks} />}
        {activeView === 'focus' && <FocusTimer onFocusTimeUpdate={handleFocusTimeUpdate} />}
        {activeView === 'analytics' && <Analytics tasks={tasks} moodEntries={moodEntries} />}
        {activeView === 'routines' && (
          <RoutineBuilder 
            routines={routines} 
            setRoutines={setRoutines} 
            onApplyRoutine={applyRoutine}
          />
        )}
        {activeView === 'wellness' && (
          <WellnessBreaks 
            onBreakComplete={handleBreakComplete}
            moodEntries={moodEntries}
            setMoodEntries={setMoodEntries}
            tasks={tasks}
          />
        )}
        {activeView === 'summary' && (
          <NightSummary 
            tasks={tasks}
            focusTimeToday={focusTimeToday}
            completedBreaks={completedBreaks}
            onPlanTomorrow={() => setActiveView('tasks')}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
