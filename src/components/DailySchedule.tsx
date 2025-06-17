
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, Plus, X, Calendar as CalendarIcon } from 'lucide-react';
import { Task } from '@/types/task';
import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface DailyScheduleProps {
  tasks: Task[];
  setTasks?: (tasks: Task[]) => void;
}

export const DailySchedule = ({ tasks, setTasks }: DailyScheduleProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  
  // Auto-schedule recurring tasks that have scheduled times but no scheduled date for selected date
  useEffect(() => {
    if (!setTasks) return;
    
    const recurringInstancesForDate = tasks.filter(task => 
      task.parentRecurringId && 
      task.scheduledDate && 
      isSameDay(task.scheduledDate, selectedDate) &&
      task.scheduledTime &&
      !tasks.some(t => t.scheduledTime === task.scheduledTime && t.scheduledDate && isSameDay(t.scheduledDate, selectedDate) && t.id !== task.id)
    );

    if (recurringInstancesForDate.length > 0) {
      const updatedTasks = tasks.map(task => {
        const recurringInstance = recurringInstancesForDate.find(ri => ri.id === task.id);
        if (recurringInstance && !task.scheduledTime) {
          return { ...task, scheduledTime: recurringInstance.scheduledTime, scheduledDate: selectedDate };
        }
        return task;
      });
      
      if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
        setTasks(updatedTasks);
      }
    }
  }, [selectedDate, tasks, setTasks]);
  
  // Generate time slots from 6 AM to 11 PM (every 30 minutes)
  const timeSlots = Array.from({ length: 34 }, (_, i) => {
    const hour = Math.floor(6 + i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  // Filter tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => {
    if (task.isRecurring) return false; // Never show recurring templates
    
    if (task.scheduledDate) {
      return isSameDay(task.scheduledDate, selectedDate);
    }
    
    // For tasks without scheduled dates, only show on today
    return isSameDay(new Date(), selectedDate) && !task.parentRecurringId;
  });
  
  const scheduledTasks = tasksForSelectedDate.filter(task => task.scheduledTime);
  const unscheduledTasks = tasks.filter(task => 
    !task.scheduledTime && 
    !task.completed && 
    !task.isRecurring &&
    (
      (task.scheduledDate && isSameDay(task.scheduledDate, selectedDate)) ||
      (!task.scheduledDate && !task.parentRecurringId && isSameDay(new Date(), selectedDate))
    )
  );
  
  const getTaskForTimeSlot = (time: string) => {
    return scheduledTasks.find(task => task.scheduledTime === time);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, timeSlot: string) => {
    e.preventDefault();
    
    if (draggedTask && setTasks) {
      const existingTask = getTaskForTimeSlot(timeSlot);
      if (existingTask) {
        // If slot is occupied, swap tasks or move existing task to unscheduled
        const updatedTasks = tasks.map(task => {
          if (task.id === draggedTask.id) {
            return { ...task, scheduledTime: timeSlot, scheduledDate: selectedDate };
          }
          if (task.id === existingTask.id) {
            return { ...task, scheduledTime: undefined, scheduledDate: undefined };
          }
          return task;
        });
        setTasks(updatedTasks);
      } else {
        // Empty slot, just schedule the task
        const updatedTasks = tasks.map(task => 
          task.id === draggedTask.id 
            ? { ...task, scheduledTime: timeSlot, scheduledDate: selectedDate }
            : task
        );
        setTasks(updatedTasks);
      }
    }
    
    setDraggedTask(null);
  };

  const handleRemoveFromSchedule = (taskId: string) => {
    if (setTasks) {
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, scheduledTime: undefined, scheduledDate: undefined }
          : task
      );
      setTasks(updatedTasks);
    }
  };

  const formatTimeRange = (time: string, duration: number) => {
    const [hour, minute] = time.split(':').map(Number);
    const startMinutes = hour * 60 + minute;
    const endMinutes = startMinutes + duration;
    const endHour = Math.floor(endMinutes / 60);
    const endMin = endMinutes % 60;
    
    return `${time} - ${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Daily Schedule</h2>
          <p className="text-gray-600 mt-1">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                "bg-white hover:bg-gray-50"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Timeline - Takes most of the space */}
        <div className="flex-1 min-w-0">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-80px)] overflow-y-auto">
              <div className="space-y-0">
                {timeSlots.map((time) => {
                  const task = getTaskForTimeSlot(time);
                  const [hour, minute] = time.split(':');
                  const isHourSlot = minute === '00';
                  
                  return (
                    <div
                      key={time}
                      className={`flex border-b border-gray-100 ${
                        isHourSlot ? 'border-gray-200' : 'border-gray-50'
                      }`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, time)}
                    >
                      <div className={`w-16 p-2 text-xs font-medium text-gray-600 bg-gray-50 border-r flex items-center justify-center ${
                        isHourSlot ? 'bg-gray-100 font-semibold' : ''
                      }`}>
                        {time}
                      </div>
                      <div className={`flex-1 min-h-[50px] hover:bg-blue-50 transition-colors relative ${
                        !task ? 'cursor-pointer border-2 border-dashed border-transparent hover:border-blue-200' : ''
                      }`}>
                        {task ? (
                          <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-400 h-full">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                                <p className="text-xs text-gray-600 mt-1">
                                  {formatTimeRange(time, task.estimatedDuration)}
                                </p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {task.estimatedDuration}min
                                  </Badge>
                                  <Badge 
                                    className={`text-xs ${
                                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                    }`}
                                  >
                                    {task.priority}
                                  </Badge>
                                  {task.tags.slice(0, 2).map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {task.parentRecurringId && (
                                    <Badge variant="outline" className="text-xs text-purple-600">
                                      Recurring
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFromSchedule(task.id)}
                                className="h-6 w-6 p-0 hover:bg-red-100"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 h-full flex items-center justify-center">
                            <div className="text-gray-400 text-sm text-center">
                              <Clock className="w-4 h-4 mx-auto mb-1 opacity-50" />
                              <p>Drop task here</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unscheduled Tasks Sidebar */}
        <div className="w-80 flex-shrink-0">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Unscheduled Tasks</CardTitle>
              <p className="text-sm text-gray-600">
                Drag tasks to schedule them for {format(selectedDate, 'MMM d')}
              </p>
            </CardHeader>
            <CardContent className="h-[calc(100%-100px)] overflow-y-auto">
              <div className="space-y-3">
                {unscheduledTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:shadow-md hover:border-indigo-300 transition-all duration-200 transform hover:scale-[1.02]"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm text-gray-900 leading-tight">{task.title}</h4>
                      <div className="flex-shrink-0 ml-2">
                        <Badge variant="outline" className="text-xs">
                          {task.estimatedDuration}min
                        </Badge>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center flex-wrap gap-1">
                      <Badge 
                        className={`text-xs ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {task.priority}
                      </Badge>
                      {task.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {task.deadline && (
                        <Badge variant="outline" className="text-xs text-orange-600">
                          Due: {format(task.deadline, 'MMM d')}
                        </Badge>
                      )}
                      {task.parentRecurringId && (
                        <Badge variant="outline" className="text-xs text-purple-600">
                          Recurring
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                
                {unscheduledTasks.length === 0 && (
                  <div className="text-center text-gray-500 text-sm py-8">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>All tasks are scheduled!</p>
                    <p className="text-xs mt-1">Create new tasks to schedule them.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
