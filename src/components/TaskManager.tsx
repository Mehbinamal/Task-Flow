
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Repeat } from 'lucide-react';
import { TaskForm } from './TaskForm';
import { RecurringTaskForm } from './RecurringTaskForm';
import { TaskList } from './TaskList';
import { Task } from '@/types/task';
import { generateRecurringTaskInstances } from '@/utils/recurringTasks';
import { addDays, startOfDay, isToday, isSameDay } from 'date-fns';

interface TaskManagerProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export const TaskManager = ({ tasks, setTasks }: TaskManagerProps) => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Generate new recurring task instances when component mounts and daily
  useEffect(() => {
    generateUpcomingRecurringTasks();
  }, []);

  const addTask = (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    setShowTaskForm(false);
  };

  const addRecurringTask = (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const recurringTemplate: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date(),
    };

    // Generate instances for the next 30 days
    const instances = generateRecurringTaskInstances(
      recurringTemplate,
      new Date(),
      addDays(new Date(), 30)
    );

    setTasks([...tasks, recurringTemplate, ...instances]);
    setShowRecurringForm(false);
  };

  // Generate new recurring task instances periodically
  const generateUpcomingRecurringTasks = () => {
    const recurringTasks = tasks.filter(task => task.isRecurring);
    const today = startOfDay(new Date());
    const futureDate = addDays(today, 30);

    let newInstances: Task[] = [];

    recurringTasks.forEach(recurringTask => {
      const existingInstances = tasks.filter(task => task.parentRecurringId === recurringTask.id);
      const latestInstanceDate = existingInstances.length > 0 
        ? Math.max(...existingInstances.map(t => t.scheduledDate?.getTime() || 0))
        : today.getTime();

      const instances = generateRecurringTaskInstances(
        recurringTask,
        new Date(latestInstanceDate),
        futureDate
      );

      // Filter out instances that already exist
      const newUniqueInstances = instances.filter(instance => {
        return !existingInstances.some(existing => 
          existing.scheduledDate && instance.scheduledDate &&
          isSameDay(existing.scheduledDate, instance.scheduledDate)
        );
      });

      newInstances = [...newInstances, ...newUniqueInstances];
    });

    if (newInstances.length > 0) {
      setTasks([...tasks, ...newInstances]);
    }
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null);
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    
    if (taskToDelete?.isRecurring) {
      // If deleting a recurring task template, also delete all its instances
      setTasks(tasks.filter(task => 
        task.id !== taskId && task.parentRecurringId !== taskId
      ));
    } else {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date() : undefined }
        : task
    ));
  };

  // Filter tasks for today's view - only show instances scheduled for today or tasks without scheduled dates
  const todaysTasks = tasks.filter(task => {
    if (task.isRecurring) return false; // Never show recurring templates in main list
    
    if (task.scheduledDate) {
      return isToday(task.scheduledDate);
    }
    
    // Show regular tasks without scheduled dates
    return !task.parentRecurringId;
  });

  const recurringTemplates = tasks.filter(task => task.isRecurring);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Today's Tasks</h2>
          <p className="text-gray-600 mt-1">
            {todaysTasks.filter(t => !t.completed).length} pending, {todaysTasks.filter(t => t.completed).length} completed
            {recurringTemplates.length > 0 && (
              <span className="ml-2 text-indigo-600">• {recurringTemplates.length} recurring</span>
            )}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowRecurringForm(true)}
            variant="outline"
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          >
            <Repeat className="w-4 h-4 mr-2" />
            Add Recurring
          </Button>
          <Button
            onClick={() => setShowTaskForm(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {showTaskForm && (
        <Card className="border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50/30">
          <CardHeader>
            <CardTitle className="text-indigo-900">Create New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm
              onSubmit={addTask}
              onCancel={() => setShowTaskForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {showRecurringForm && (
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader>
            <CardTitle className="text-purple-900">Create Recurring Task</CardTitle>
          </CardHeader>
          <CardContent>
            <RecurringTaskForm
              onSubmit={addRecurringTask}
              onCancel={() => setShowRecurringForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {editingTask && (
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader>
            <CardTitle className="text-purple-900">Edit Task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm
              task={editingTask}
              onSubmit={updateTask}
              onCancel={() => setEditingTask(null)}
              isEditing
            />
          </CardContent>
        </Card>
      )}

      {recurringTemplates.length > 0 && (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-indigo-900">
              <Repeat className="w-5 h-5" />
              <span>Recurring Tasks ({recurringTemplates.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recurringTemplates.map(task => (
                <div key={task.id} className="p-3 bg-white rounded-lg border border-indigo-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {task.recurringPattern?.type === 'daily' && `Every ${task.recurringPattern.interval} day(s)`}
                        {task.recurringPattern?.type === 'weekly' && `Every ${task.recurringPattern.interval} week(s)`}
                        {task.recurringPattern?.type === 'monthly' && `Every ${task.recurringPattern.interval} month(s)`}
                      </p>
                      {task.scheduledTime && (
                        <p className="text-sm text-indigo-600">at {task.scheduledTime}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <TaskList
        tasks={todaysTasks}
        onToggleComplete={toggleTaskComplete}
        onEdit={setEditingTask}
        onDelete={deleteTask}
      />
    </div>
  );
};
