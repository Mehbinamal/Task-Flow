import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Eye, Droplets, Wind, Activity, Play, CheckCircle } from 'lucide-react';
import { WellnessBreak, MoodEntry, Task } from '@/types/task';
import { MoodTracker } from '@/components/MoodTracker';

const wellnessBreaks: WellnessBreak[] = [
  {
    id: '1',
    title: 'Neck & Shoulder Stretch',
    description: 'Gently roll your shoulders and stretch your neck from side to side',
    duration: 2,
    category: 'stretching'
  },
  {
    id: '2',
    title: 'Hydration Break',
    description: 'Drink a glass of water and take 5 deep breaths',
    duration: 1,
    category: 'hydration'
  },
  {
    id: '3',
    title: '4-7-8 Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8. Repeat 3 times',
    duration: 3,
    category: 'breathing'
  },
  {
    id: '4',
    title: '20-20-20 Rule',
    description: 'Look at something 20 feet away for 20 seconds',
    duration: 1,
    category: 'eyes'
  },
  {
    id: '5',
    title: 'Desk Push-ups',
    description: 'Do 10 push-ups against your desk',
    duration: 2,
    category: 'movement'
  },
  {
    id: '6',
    title: 'Spinal Twist',
    description: 'Sit tall and gently twist your spine left and right',
    duration: 2,
    category: 'stretching'
  },
  {
    id: '7',
    title: 'Deep Breathing',
    description: 'Take 10 slow, deep breaths focusing on your exhale',
    duration: 3,
    category: 'breathing'
  },
  {
    id: '8',
    title: 'Calf Raises',
    description: 'Stand and do 15 calf raises to improve circulation',
    duration: 1,
    category: 'movement'
  }
];

interface WellnessBreaksProps {
  onBreakComplete?: (breakItem: WellnessBreak) => void;
  moodEntries: MoodEntry[];
  setMoodEntries: (entries: MoodEntry[]) => void;
  tasks: Task[];
}

export const WellnessBreaks = ({ onBreakComplete, moodEntries, setMoodEntries, tasks }: WellnessBreaksProps) => {
  const [activeBreak, setActiveBreak] = useState<WellnessBreak | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completedBreaks, setCompletedBreaks] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (activeBreak) {
        setCompletedBreaks([...completedBreaks, activeBreak.id]);
        onBreakComplete?.(activeBreak);
      }
      setActiveBreak(null);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, activeBreak, completedBreaks, onBreakComplete]);

  const startBreak = (breakItem: WellnessBreak) => {
    setActiveBreak(breakItem);
    setTimeLeft(breakItem.duration * 60);
    setIsActive(true);
  };

  const stopBreak = () => {
    setIsActive(false);
    setActiveBreak(null);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'stretching': return <Activity className="w-4 h-4" />;
      case 'hydration': return <Droplets className="w-4 h-4" />;
      case 'breathing': return <Wind className="w-4 h-4" />;
      case 'eyes': return <Eye className="w-4 h-4" />;
      case 'movement': return <Heart className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'stretching': return 'bg-blue-100 text-blue-800';
      case 'hydration': return 'bg-cyan-100 text-cyan-800';
      case 'breathing': return 'bg-green-100 text-green-800';
      case 'eyes': return 'bg-purple-100 text-purple-800';
      case 'movement': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (activeBreak) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {getCategoryIcon(activeBreak.category)}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{activeBreak.title}</h3>
              <p className="text-gray-600 text-lg">{activeBreak.description}</p>
            </div>

            <div className="text-6xl font-mono font-bold text-green-600 mb-6">
              {formatTime(timeLeft)}
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={stopBreak}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                Stop Break
              </Button>
              <Button
                onClick={() => {
                  setIsActive(false);
                  setActiveBreak(null);
                  setTimeLeft(0);
                  if (activeBreak) {
                    setCompletedBreaks([...completedBreaks, activeBreak.id]);
                    onBreakComplete?.(activeBreak);
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Wellness & Mood</h2>
          <p className="text-gray-600 mt-1">Take care of your physical and mental well-being</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">{completedBreaks.length}</div>
          <div className="text-sm text-gray-600">Breaks Today</div>
        </div>
      </div>

      <Tabs defaultValue="breaks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="breaks">Wellness Breaks</TabsTrigger>
          <TabsTrigger value="mood">Mood Tracking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="breaks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wellnessBreaks.map((breakItem) => {
              const isCompleted = completedBreaks.includes(breakItem.id);
              
              return (
                <Card 
                  key={breakItem.id} 
                  className={`hover:shadow-lg transition-all ${
                    isCompleted ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg ${getCategoryColor(breakItem.category)}`}>
                          {getCategoryIcon(breakItem.category)}
                        </div>
                        {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {breakItem.duration}min
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{breakItem.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{breakItem.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryColor(breakItem.category)}>
                        {breakItem.category}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => startBreak(breakItem)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="mood" className="space-y-4">
          <MoodTracker 
            moodEntries={moodEntries}
            setMoodEntries={setMoodEntries}
            tasks={tasks}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
