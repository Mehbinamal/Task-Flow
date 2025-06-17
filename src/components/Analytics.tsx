
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Clock, Target, Calendar, Heart } from 'lucide-react';
import { Task, MoodEntry } from '@/types/task';
import { format, isToday, isYesterday, startOfWeek, endOfWeek, isWithinInterval, isSameDay } from 'date-fns';

interface AnalyticsProps {
  tasks: Task[];
  moodEntries?: MoodEntry[];
}

export const Analytics = ({ tasks, moodEntries = [] }: AnalyticsProps) => {
  const completedTasks = tasks.filter(task => task.completed);
  const todayTasks = tasks.filter(task => 
    task.createdAt && isToday(task.createdAt)
  );
  const todayCompleted = todayTasks.filter(task => task.completed);
  
  const thisWeekTasks = tasks.filter(task => 
    task.createdAt && isWithinInterval(task.createdAt, {
      start: startOfWeek(new Date()),
      end: endOfWeek(new Date())
    })
  );
  const thisWeekCompleted = thisWeekTasks.filter(task => task.completed);

  const totalEstimatedTime = tasks.reduce((acc, task) => acc + task.estimatedDuration, 0);
  const completedEstimatedTime = completedTasks.reduce((acc, task) => acc + task.estimatedDuration, 0);

  const todayCompletionRate = todayTasks.length > 0 ? (todayCompleted.length / todayTasks.length) * 100 : 0;
  const weeklyCompletionRate = thisWeekTasks.length > 0 ? (thisWeekCompleted.length / thisWeekTasks.length) * 100 : 0;
  const overallCompletionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  const priorityStats = {
    high: {
      total: tasks.filter(t => t.priority === 'high').length,
      completed: completedTasks.filter(t => t.priority === 'high').length,
    },
    medium: {
      total: tasks.filter(t => t.priority === 'medium').length,
      completed: completedTasks.filter(t => t.priority === 'medium').length,
    },
    low: {
      total: tasks.filter(t => t.priority === 'low').length,
      completed: completedTasks.filter(t => t.priority === 'low').length,
    },
  };

  const tagStats = tasks.reduce((acc, task) => {
    task.tags.forEach(tag => {
      if (!acc[tag]) {
        acc[tag] = { total: 0, completed: 0 };
      }
      acc[tag].total++;
      if (task.completed) {
        acc[tag].completed++;
      }
    });
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  // Mood analytics
  const moodProductivityCorrelation = (() => {
    if (moodEntries.length === 0) return null;

    const moodToNumber = (mood: MoodEntry['mood']) => {
      const map = { 'very-sad': 1, 'sad': 2, 'neutral': 3, 'happy': 4, 'very-happy': 5 };
      return map[mood];
    };

    const correlationData = moodEntries.map(entry => {
      const dayTasks = tasks.filter(task => 
        task.createdAt && isSameDay(task.createdAt, entry.date)
      );
      const completedTasks = dayTasks.filter(task => task.completed).length;
      const productivity = dayTasks.length > 0 ? (completedTasks / dayTasks.length) * 100 : 0;
      
      return {
        mood: moodToNumber(entry.mood),
        productivity
      };
    }).filter(data => data.productivity > 0);

    if (correlationData.length < 2) return null;

    const avgMood = correlationData.reduce((sum, data) => sum + data.mood, 0) / correlationData.length;
    const avgProductivity = correlationData.reduce((sum, data) => sum + data.productivity, 0) / correlationData.length;

    const numerator = correlationData.reduce((sum, data) => 
      sum + (data.mood - avgMood) * (data.productivity - avgProductivity), 0
    );
    const denominator = Math.sqrt(
      correlationData.reduce((sum, data) => sum + Math.pow(data.mood - avgMood, 2), 0) *
      correlationData.reduce((sum, data) => sum + Math.pow(data.productivity - avgProductivity, 2), 0)
    );

    return denominator !== 0 ? (numerator / denominator) * 100 : 0;
  })();

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "indigo" }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: any;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg bg-${color}-100`}>
            <Icon className={`w-5 h-5 text-${color}-600`} />
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-600">{title}</div>
        <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600 mt-1">Track your productivity and progress</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Progress"
          value={`${Math.round(todayCompletionRate)}%`}
          subtitle={`${todayCompleted.length}/${todayTasks.length} tasks completed`}
          icon={Target}
          color="green"
        />
        <StatCard
          title="Weekly Progress"
          value={`${Math.round(weeklyCompletionRate)}%`}
          subtitle={`${thisWeekCompleted.length}/${thisWeekTasks.length} tasks completed`}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Total Completed"
          value={completedTasks.length}
          subtitle={`Out of ${tasks.length} total tasks`}
          icon={BarChart3}
          color="purple"
        />
        <StatCard
          title="Focus Time"
          value={`${Math.round(completedEstimatedTime / 60)}h`}
          subtitle={`${completedEstimatedTime} minutes completed`}
          icon={Clock}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Completion Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Today</span>
                <span>{Math.round(todayCompletionRate)}%</span>
              </div>
              <Progress value={todayCompletionRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>This Week</span>
                <span>{Math.round(weeklyCompletionRate)}%</span>
              </div>
              <Progress value={weeklyCompletionRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall</span>
                <span>{Math.round(overallCompletionRate)}%</span>
              </div>
              <Progress value={overallCompletionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Mood-Productivity Correlation */}
        {moodProductivityCorrelation !== null && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Mood & Productivity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  moodProductivityCorrelation > 50 ? 'text-green-600' :
                  moodProductivityCorrelation > 0 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {Math.abs(moodProductivityCorrelation).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {moodProductivityCorrelation > 0 ? 'Positive' : 'Negative'} Correlation
                </div>
                <Badge className={
                  moodProductivityCorrelation > 50 ? 'bg-green-100 text-green-800' :
                  moodProductivityCorrelation > 0 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {moodProductivityCorrelation > 50 ? 'Strong positive link' :
                   moodProductivityCorrelation > 0 ? 'Weak positive link' :
                   'Mood affects productivity'}
                </Badge>
              </div>
              <div className="text-xs text-gray-500 text-center">
                Based on {moodEntries.length} mood entries
              </div>
            </CardContent>
          </Card>
        )}

        {/* Priority Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Priority Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(priorityStats).map(([priority, stats]) => {
              const rate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
              const colorMap = {
                high: 'red',
                medium: 'yellow',
                low: 'green',
              };
              const color = colorMap[priority as keyof typeof colorMap];
              
              return (
                <div key={priority}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
                      <span className="text-sm font-medium capitalize">{priority} Priority</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {stats.completed}/{stats.total} ({Math.round(rate)}%)
                    </span>
                  </div>
                  <Progress value={rate} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Tags Performance */}
      {Object.keys(tagStats).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Category Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(tagStats)
                .sort((a, b) => b[1].total - a[1].total)
                .slice(0, 6)
                .map(([tag, stats]) => {
                  const rate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
                  return (
                    <div key={tag} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{tag}</Badge>
                        <span className="text-sm font-medium">{Math.round(rate)}%</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {stats.completed}/{stats.total} completed
                      </div>
                      <Progress value={rate} className="h-1" />
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {tasks.length === 0 && (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-dashed border-2 border-indigo-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data yet</h3>
            <p className="text-gray-600 mb-4">Complete some tasks to see your analytics!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
