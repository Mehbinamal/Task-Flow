
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, Trash2, Clock, RefreshCw } from 'lucide-react';
import { Routine, Task } from '@/types/task';
import { TaskForm } from './TaskForm';

interface RoutineBuilderProps {
  routines: Routine[];
  setRoutines: (routines: Routine[]) => void;
  onApplyRoutine: (routine: Routine) => void;
}

export const RoutineBuilder = ({ routines, setRoutines, onApplyRoutine }: RoutineBuilderProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineDescription, setNewRoutineDescription] = useState('');
  const [routineTasks, setRoutineTasks] = useState<Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const createRoutine = () => {
    if (!newRoutineName.trim()) return;

    const newRoutine: Routine = {
      id: crypto.randomUUID(),
      name: newRoutineName,
      description: newRoutineDescription,
      tasks: routineTasks,
      createdAt: new Date(),
    };

    setRoutines([...routines, newRoutine]);
    resetForm();
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingRoutine(null);
    setNewRoutineName('');
    setNewRoutineDescription('');
    setRoutineTasks([]);
    setShowTaskForm(false);
  };

  const deleteRoutine = (routineId: string) => {
    setRoutines(routines.filter(r => r.id !== routineId));
  };

  const addTaskToRoutine = (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const routineTask = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      tags: task.tags,
      estimatedDuration: task.estimatedDuration,
      deadline: task.deadline,
      scheduledTime: task.scheduledTime,
    };
    setRoutineTasks([...routineTasks, routineTask]);
    setShowTaskForm(false);
  };

  const removeTaskFromRoutine = (index: number) => {
    setRoutineTasks(routineTasks.filter((_, i) => i !== index));
  };

  const getTotalDuration = (tasks: any[]) => {
    return tasks.reduce((total, task) => total + task.estimatedDuration, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Routine Builder</h2>
          <p className="text-gray-600 mt-1">Create reusable task routines for your day</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Routine
        </Button>
      </div>

      {isCreating && (
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader>
            <CardTitle className="text-purple-900">Create New Routine</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Routine name (e.g., Morning Routine)"
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                className="mb-3"
              />
              <Input
                placeholder="Description (optional)"
                value={newRoutineDescription}
                onChange={(e) => setNewRoutineDescription(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Tasks in Routine</h4>
                <Button
                  size="sm"
                  onClick={() => setShowTaskForm(true)}
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Task
                </Button>
              </div>

              {routineTasks.length > 0 && (
                <div className="space-y-2 mb-4">
                  {routineTasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <span className="font-medium">{task.title}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {task.estimatedDuration}min
                          </Badge>
                          <Badge className={`text-xs ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeTaskFromRoutine(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="text-sm text-gray-600 mt-2">
                    Total duration: {getTotalDuration(routineTasks)} minutes
                  </div>
                </div>
              )}

              {showTaskForm && (
                <div className="border rounded-lg p-4 bg-white">
                  <TaskForm
                    onSubmit={addTaskToRoutine}
                    onCancel={() => setShowTaskForm(false)}
                  />
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <Button onClick={createRoutine} disabled={!newRoutineName.trim()}>
                Create Routine
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routines.map((routine) => (
          <Card key={routine.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{routine.name}</CardTitle>
                  {routine.description && (
                    <p className="text-sm text-gray-600 mt-1">{routine.description}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteRoutine(routine.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{routine.tasks.length} tasks</span>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{getTotalDuration(routine.tasks)}min</span>
                  </div>
                </div>

                <div className="space-y-1">
                  {routine.tasks.slice(0, 3).map((task, index) => (
                    <div key={index} className="text-sm text-gray-700 truncate">
                      • {task.title}
                    </div>
                  ))}
                  {routine.tasks.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{routine.tasks.length - 3} more tasks
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => onApplyRoutine(routine)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Apply to Today
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {routines.length === 0 && !isCreating && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-dashed border-2 border-purple-200">
          <CardContent className="p-8 text-center">
            <RefreshCw className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No routines yet</h3>
            <p className="text-gray-600 mb-4">Create your first routine to automate your daily planning!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
