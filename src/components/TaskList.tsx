
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, Clock, Calendar } from 'lucide-react';
import { Task } from '@/types/task';
import { format, isToday, isPast } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskList = ({ tasks, onToggleComplete, onEdit, onDelete }: TaskListProps) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
  };

  const priorityBorderColors = {
    low: 'border-l-green-400',
    medium: 'border-l-yellow-400',
    high: 'border-l-red-400',
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  const TaskItem = ({ task }: { task: Task }) => {
    const isOverdue = task.deadline && isPast(task.deadline) && !task.completed;
    
    return (
      <Card className={`transition-all duration-200 hover:shadow-md border-l-4 ${priorityBorderColors[task.priority]} ${
        task.completed ? 'opacity-60 bg-gray-50' : 'bg-white hover:bg-gray-50/50'
      } ${isOverdue ? 'border-red-200 bg-red-50/20' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleComplete(task.id)}
              className="mt-1"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(task)}
                    className="text-gray-500 hover:text-indigo-600"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(task.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-2 mt-3">
                <Badge className={priorityColors[task.priority]}>
                  {task.priority} priority
                </Badge>
                
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                
                <div className="flex items-center text-xs text-gray-500 space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{task.estimatedDuration}min</span>
                  </div>
                  
                  {task.deadline && (
                    <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                      <Calendar className="w-3 h-3" />
                      <span>
                        Due {isToday(task.deadline) ? 'today' : format(task.deadline, 'MMM d, HH:mm')}
                        {isOverdue && ' (Overdue)'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (tasks.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-dashed border-2 border-indigo-200">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first task to get organized!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {pendingTasks.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Pending Tasks ({pendingTasks.length})</h3>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Completed Tasks ({completedTasks.length})</h3>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
