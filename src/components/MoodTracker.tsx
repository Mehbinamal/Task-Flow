
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { 
  Smile, 
  Frown, 
  Meh, 
  Heart, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Zap,
  Battery,
  BatteryLow
} from 'lucide-react';
import { MoodEntry, Task } from '@/types/task';
import { format, isToday, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface MoodTrackerProps {
  moodEntries: MoodEntry[];
  setMoodEntries: (entries: MoodEntry[]) => void;
  tasks: Task[];
}

const moodOptions = [
  { value: 'very-happy', label: 'Amazing', icon: Heart, color: 'text-green-500', bg: 'bg-green-100' },
  { value: 'happy', label: 'Good', icon: Smile, color: 'text-green-400', bg: 'bg-green-50' },
  { value: 'neutral', label: 'Okay', icon: Meh, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { value: 'sad', label: 'Low', icon: Frown, color: 'text-orange-500', bg: 'bg-orange-100' },
  { value: 'very-sad', label: 'Rough', icon: Frown, color: 'text-red-500', bg: 'bg-red-100' },
] as const;

const energyOptions = [
  { value: 'high', label: 'High Energy', icon: Zap, color: 'text-green-500' },
  { value: 'medium', label: 'Medium Energy', icon: Battery, color: 'text-yellow-500' },
  { value: 'low', label: 'Low Energy', icon: BatteryLow, color: 'text-red-500' },
] as const;

export const MoodTracker = ({ moodEntries, setMoodEntries, tasks }: MoodTrackerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood'] | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<MoodEntry['energy'] | null>(null);
  const [notes, setNotes] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const todayEntry = moodEntries.find(entry => isToday(entry.date));
  const selectedDateEntry = moodEntries.find(entry => isSameDay(entry.date, selectedDate));

  const handleMoodSubmit = () => {
    if (!selectedMood || !selectedEnergy) return;

    const newEntry: MoodEntry = {
      id: crypto.randomUUID(),
      date: selectedDate,
      mood: selectedMood,
      energy: selectedEnergy,
      notes: notes.trim() || undefined,
      createdAt: new Date(),
    };

    const updatedEntries = moodEntries.filter(entry => !isSameDay(entry.date, selectedDate));
    setMoodEntries([...updatedEntries, newEntry]);
    
    // Reset form if it's for today
    if (isToday(selectedDate)) {
      setSelectedMood(null);
      setSelectedEnergy(null);
      setNotes('');
    }
  };

  const moodAnalytics = useMemo(() => {
    if (moodEntries.length === 0) return null;

    const moodToNumber = (mood: MoodEntry['mood']) => {
      const map = { 'very-sad': 1, 'sad': 2, 'neutral': 3, 'happy': 4, 'very-happy': 5 };
      return map[mood];
    };

    const productivityByDate = moodEntries.map(entry => {
      const dayTasks = tasks.filter(task => 
        task.createdAt && isSameDay(task.createdAt, entry.date)
      );
      const completedTasks = dayTasks.filter(task => task.completed).length;
      const productivity = dayTasks.length > 0 ? (completedTasks / dayTasks.length) * 100 : 0;
      
      return {
        date: entry.date,
        mood: moodToNumber(entry.mood),
        productivity,
        energy: entry.energy
      };
    });

    const averageMood = productivityByDate.reduce((sum, day) => sum + day.mood, 0) / productivityByDate.length;
    
    // Calculate correlation between mood and productivity
    const avgProductivity = productivityByDate.reduce((sum, day) => sum + day.productivity, 0) / productivityByDate.length;
    let correlation = 0;
    
    if (productivityByDate.length > 1) {
      const numerator = productivityByDate.reduce((sum, day) => 
        sum + (day.mood - averageMood) * (day.productivity - avgProductivity), 0
      );
      const denominator = Math.sqrt(
        productivityByDate.reduce((sum, day) => sum + Math.pow(day.mood - averageMood, 2), 0) *
        productivityByDate.reduce((sum, day) => sum + Math.pow(day.productivity - avgProductivity, 2), 0)
      );
      correlation = denominator !== 0 ? numerator / denominator : 0;
    }

    return {
      averageMood,
      correlation: correlation * 100,
      trends: productivityByDate.slice(-7),
      totalEntries: moodEntries.length
    };
  }, [moodEntries, tasks]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Heart className="w-8 h-8 mr-3 text-pink-600" />
            Mood Tracking
          </h2>
          <p className="text-gray-600 mt-1">Track your daily mood and see how it affects your productivity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Mood Entry */}
        <Card className="bg-gradient-to-br from-pink-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>How are you feeling?</span>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {format(selectedDate, 'MMM d')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setShowCalendar(false);
                        // Load existing entry for selected date
                        const existingEntry = moodEntries.find(entry => isSameDay(entry.date, date));
                        if (existingEntry) {
                          setSelectedMood(existingEntry.mood);
                          setSelectedEnergy(existingEntry.energy);
                          setNotes(existingEntry.notes || '');
                        } else {
                          setSelectedMood(null);
                          setSelectedEnergy(null);
                          setNotes('');
                        }
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mood Selection */}
            <div>
              <h4 className="text-sm font-medium mb-3">Mood</h4>
              <div className="grid grid-cols-5 gap-2">
                {moodOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setSelectedMood(option.value)}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all flex flex-col items-center space-y-1",
                        selectedMood === option.value
                          ? `border-gray-400 ${option.bg}`
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <Icon className={cn("w-6 h-6", option.color)} />
                      <span className="text-xs font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Energy Level */}
            <div>
              <h4 className="text-sm font-medium mb-3">Energy Level</h4>
              <div className="grid grid-cols-3 gap-2">
                {energyOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setSelectedEnergy(option.value)}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all flex flex-col items-center space-y-1",
                        selectedEnergy === option.value
                          ? "border-gray-400 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", option.color)} />
                      <span className="text-xs font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h4 className="text-sm font-medium mb-2">Notes (optional)</h4>
              <Textarea
                placeholder="How are you feeling today? Any specific thoughts?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <Button 
              onClick={handleMoodSubmit}
              disabled={!selectedMood || !selectedEnergy}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {selectedDateEntry ? 'Update Entry' : 'Save Entry'}
            </Button>

            {selectedDateEntry && (
              <div className="text-sm text-gray-600 text-center">
                Last updated: {format(selectedDateEntry.createdAt, 'h:mm a')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mood Analytics */}
        {moodAnalytics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Mood & Productivity Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {moodAnalytics.averageMood.toFixed(1)}/5
                  </div>
                  <div className="text-sm text-gray-600">Average Mood</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.abs(moodAnalytics.correlation).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {moodAnalytics.correlation > 0 ? 'Positive' : 'Negative'} Correlation
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Recent Trend</h4>
                <div className="space-y-2">
                  {moodAnalytics.trends.slice(-5).map((day, index) => {
                    const moodOption = moodOptions.find(opt => 
                      moodOptions.findIndex(o => o.value === 
                        Object.entries({ 'very-sad': 1, 'sad': 2, 'neutral': 3, 'happy': 4, 'very-happy': 5 })
                          .find(([_, num]) => num === day.mood)?.[0]
                      ) === moodOptions.findIndex(o => o.value === opt.value)
                    );
                    const Icon = moodOption?.icon || Meh;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <Icon className={cn("w-4 h-4", moodOption?.color)} />
                          <span className="text-sm">{format(day.date, 'MMM d')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-600">
                            {day.productivity.toFixed(0)}% productive
                          </span>
                          <Progress value={day.productivity} className="w-16 h-2" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center">
                {moodAnalytics.totalEntries} mood entries recorded
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Entries */}
      {moodEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Mood Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {moodEntries
                .slice()
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .slice(0, 6)
                .map((entry) => {
                  const moodOption = moodOptions.find(opt => opt.value === entry.mood);
                  const energyOption = energyOptions.find(opt => opt.value === entry.energy);
                  const Icon = moodOption?.icon || Meh;
                  const EnergyIcon = energyOption?.icon || Battery;
                  
                  return (
                    <div key={entry.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {format(entry.date, 'MMM d, yyyy')}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Icon className={cn("w-4 h-4", moodOption?.color)} />
                          <EnergyIcon className={cn("w-4 h-4", energyOption?.color)} />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {moodOption?.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {energyOption?.label}
                        </Badge>
                      </div>
                      {entry.notes && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
