
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Moon, CheckCircle, Clock, TrendingUp, Lightbulb } from 'lucide-react';
import { Task, DaySummary } from '@/types/task';
import { format } from 'date-fns';

interface NightSummaryProps {
  tasks: Task[];
  focusTimeToday: number;
  completedBreaks: number;
  onPlanTomorrow?: () => void;
}

export const NightSummary = ({ 
  tasks, 
  focusTimeToday, 
  completedBreaks, 
  onPlanTomorrow 
}: NightSummaryProps) => {
  const summary: DaySummary = useMemo(() => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Get top category
    const categoryCount: { [key: string]: number } = {};
    tasks.forEach(task => {
      task.tags.forEach(tag => {
        categoryCount[tag] = (categoryCount[tag] || 0) + 1;
      });
    });
    
    const topCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'General';

    // Generate suggestions
    const suggestions: string[] = [];
    const uncompletedTasks = tasks.filter(t => !t.completed);
    const overdueTasks = tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && !t.completed);
    
    if (completionRate < 50) {
      suggestions.push('Try breaking down large tasks into smaller, manageable chunks');
    }
    
    if (overdueTasks.length > 0) {
      suggestions.push('Prioritize overdue tasks first tomorrow');
    }
    
    if (focusTimeToday < 60) {
      suggestions.push('Consider using the focus timer more to improve concentration');
    }
    
    if (completedBreaks < 3) {
      suggestions.push('Take more wellness breaks to maintain energy levels');
    }
    
    if (uncompletedTasks.length > 0) {
      const highPriorityUncompleted = uncompletedTasks.filter(t => t.priority === 'high');
      if (highPriorityUncompleted.length > 0) {
        suggestions.push('Focus on high-priority tasks first thing tomorrow');
      }
    }

    return {
      date: new Date(),
      completedTasks,
      totalTasks,
      focusTime: focusTimeToday,
      completionRate,
      topCategory,
      suggestions
    };
  }, [tasks, focusTimeToday, completedBreaks]);

  // Filter uncompleted tasks to avoid showing multiple instances of recurring tasks
  const uncompletedTasksForTomorrow = useMemo(() => {
    const uncompletedTasks = tasks.filter(t => !t.completed);
    const recurringTemplateIds = new Set();
    
    return uncompletedTasks.filter(task => {
      // Always include non-recurring tasks
      if (!task.parentRecurringId && !task.isRecurring) {
        return true;
      }
      
      // For recurring task templates, include them
      if (task.isRecurring) {
        return true;
      }
      
      // For recurring task instances, only include if we haven't seen the template yet
      if (task.parentRecurringId) {
        if (!recurringTemplateIds.has(task.parentRecurringId)) {
          // Find the parent template to show instead
          const parentTemplate = tasks.find(t => t.id === task.parentRecurringId);
          if (parentTemplate) {
            recurringTemplateIds.add(task.parentRecurringId);
            return false; // Don't include the instance, we'll show the template
          }
        }
        return false; // Don't include additional instances
      }
      
      return true;
    });
  }, [tasks]);

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 bg-green-100';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCompletionMessage = (rate: number) => {
    if (rate >= 90) return '🎉 Excellent work today!';
    if (rate >= 70) return '👍 Great job today!';
    if (rate >= 50) return '👌 Good progress today!';
    return '💪 Tomorrow is a new opportunity!';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Moon className="w-8 h-8 mr-3 text-indigo-600" />
            Night Summary
          </h2>
          <p className="text-gray-600 mt-1">{format(summary.date, 'EEEE, MMMM d, yyyy')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Completion Overview */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-indigo-600" />
              Task Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${getCompletionRateColor(summary.completionRate).split(' ')[0]}`}>
                {Math.round(summary.completionRate)}%
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {summary.completedTasks} of {summary.totalTasks} tasks completed
              </div>
              <Badge className={getCompletionRateColor(summary.completionRate)}>
                {getCompletionMessage(summary.completionRate)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Focus Time */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Clock className="w-5 h-5 mr-2 text-green-600" />
              Focus Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.floor(summary.focusTime / 60)}h {summary.focusTime % 60}m
              </div>
              <div className="text-sm text-gray-600 mb-3">
                Deep work sessions
              </div>
              <Badge className="bg-green-100 text-green-800">
                {completedBreaks} wellness breaks
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Top Category */}
        <Card className="bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
              Top Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {summary.topCategory}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                Most worked on today
              </div>
              <Badge className="bg-orange-100 text-orange-800">
                Primary focus
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completed Tasks Summary */}
      {summary.completedTasks > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Accomplishments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tasks.filter(t => t.completed).map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900 truncate block">
                      {task.title}
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {task.estimatedDuration}min
                      </Badge>
                      {task.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions for Tomorrow */}
      {summary.suggestions.length > 0 && (
        <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-yellow-800">
              <Lightbulb className="w-5 h-5 mr-2" />
              Suggestions for Tomorrow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {summary.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
            
            {onPlanTomorrow && (
              <Button
                onClick={onPlanTomorrow}
                className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
              >
                Plan Tomorrow
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Uncompleted Tasks */}
      {uncompletedTasksForTomorrow.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Carry Forward to Tomorrow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uncompletedTasksForTomorrow.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">{task.title}</span>
                    <div className="flex items-center space-x-2 mt-1">
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
                      {task.isRecurring && (
                        <Badge variant="outline" className="text-xs text-purple-600">
                          Recurring
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {uncompletedTasksForTomorrow.length > 5 && (
                <div className="text-sm text-gray-500 text-center">
                  +{uncompletedTasksForTomorrow.length - 5} more tasks
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
