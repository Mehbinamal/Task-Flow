import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Square, RotateCcw, Volume2, VolumeX, Lock, Unlock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { VoiceCommands } from '@/components/VoiceCommands';

interface FocusTimerProps {
  onFocusTimeUpdate?: (minutes: number) => void;
}

export const FocusTimer = ({ onFocusTimeUpdate }: FocusTimerProps) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState('25');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [lockMode, setLockMode] = useState(false);
  const [blockedSites] = useState(['facebook.com', 'twitter.com', 'youtube.com', 'reddit.com']);

  const totalSeconds = parseInt(selectedPreset) * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (isActive && minutes === 0 && seconds === 0) {
      // Timer finished
      setIsActive(false);
      setLockMode(false);
      
      if (!isBreak) {
        setSessions(sessions + 1);
        setIsBreak(true);
        setMinutes(5);
        setSeconds(0);
        onFocusTimeUpdate?.(parseInt(selectedPreset));
      } else {
        setIsBreak(false);
        setMinutes(parseInt(selectedPreset));
        setSeconds(0);
      }
      
      if (soundEnabled) {
        console.log('Timer finished!');
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, isBreak, sessions, selectedPreset, soundEnabled, onFocusTimeUpdate]);

  const startTimer = (customDuration?: number) => {
    if (customDuration) {
      setMinutes(customDuration);
      setSeconds(0);
      setSelectedPreset(customDuration.toString());
    }
    setIsActive(true);
    if (lockMode) {
      simulateLockMode();
    }
  };

  const pauseTimer = () => {
    setIsActive(false);
    setLockMode(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setLockMode(false);
    setMinutes(parseInt(selectedPreset));
    setSeconds(0);
  };

  const simulateLockMode = () => {
    if (lockMode && isActive) {
      // Show blocking overlay for demonstration
      console.log('Lock mode activated - blocking distracting sites:', blockedSites);
      // In a real implementation, this would integrate with browser extensions
    }
  };

  const presets = [
    { value: '15', label: '15 minutes' },
    { value: '25', label: '25 minutes (Pomodoro)' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
  ];

  const TimerDisplay = () => (
    <div className={`text-center ${fullscreen ? 'min-h-screen flex flex-col justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white' : ''}`}>
      <div className={`${fullscreen ? 'px-8' : ''}`}>
        <div className={`${fullscreen ? 'text-8xl md:text-9xl' : 'text-6xl md:text-7xl'} font-bold font-mono mb-4 ${
          isBreak ? 'text-green-400' : fullscreen ? 'text-white' : 'text-indigo-600'
        }`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        
        <div className={`${fullscreen ? 'text-2xl mb-8' : 'text-lg mb-6'} ${
          fullscreen ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {isBreak ? 'Break Time' : 'Focus Time'}
        </div>

        <div className={`${fullscreen ? 'w-1/2 mx-auto mb-8' : 'mb-6'}`}>
          <Progress 
            value={progress} 
            className={`h-2 ${fullscreen ? 'h-3' : ''}`}
          />
        </div>

        <div className={`flex justify-center space-x-4 ${fullscreen ? 'mb-8' : 'mb-4'}`}>
          {!isActive ? (
            <Button
              onClick={() => startTimer()}
              size={fullscreen ? "lg" : "default"}
              className={`${fullscreen ? 'text-xl px-8 py-4' : ''} bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg`}
            >
              <Play className={`${fullscreen ? 'w-6 h-6' : 'w-4 h-4'} mr-2`} />
              Start
            </Button>
          ) : (
            <Button
              onClick={pauseTimer}
              size={fullscreen ? "lg" : "default"}
              className={`${fullscreen ? 'text-xl px-8 py-4' : ''} bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg`}
            >
              <Pause className={`${fullscreen ? 'w-6 h-6' : 'w-4 h-4'} mr-2`} />
              Pause
            </Button>
          )}
          
          <Button
            onClick={resetTimer}
            size={fullscreen ? "lg" : "default"}
            variant="outline"
            className={`${fullscreen ? 'text-xl px-8 py-4 border-white text-white hover:bg-white hover:text-black' : ''}`}
          >
            <RotateCcw className={`${fullscreen ? 'w-6 h-6' : 'w-4 h-4'} mr-2`} />
            Reset
          </Button>
        </div>

        {fullscreen && (
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setFullscreen(false)}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black"
            >
              Exit Fullscreen
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white relative">
        {lockMode && (
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Lock Mode Active</span>
          </div>
        )}
        <div className="px-8">
          <div className="text-8xl md:text-9xl font-bold font-mono mb-4 text-white">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          
          <div className="text-2xl mb-8 text-gray-300">
            {isBreak ? 'Break Time' : 'Focus Time'}
          </div>

          <div className="w-1/2 mx-auto mb-8">
            <Progress value={progress} className="h-3" />
          </div>

          <div className="flex justify-center space-x-4 mb-8">
            {!isActive ? (
              <Button
                onClick={() => startTimer()}
                size="lg"
                className="text-xl px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
              >
                <Play className="w-6 h-6 mr-2" />
                Start
              </Button>
            ) : (
              <Button
                onClick={pauseTimer}
                size="lg"
                className="text-xl px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg"
              >
                <Pause className="w-6 h-6 mr-2" />
                Pause
              </Button>
            )}
            
            <Button
              onClick={resetTimer}
              size="lg"
              variant="outline"
              className="text-xl px-8 py-4 border-white text-white hover:bg-white hover:text-black"
            >
              <RotateCcw className="w-6 h-6 mr-2" />
              Reset
            </Button>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setFullscreen(false)}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black"
            >
              Exit Fullscreen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Focus Timer</h2>
          <p className="text-gray-600 mt-1">Stay focused with Pomodoro technique</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-600">{sessions}</div>
          <div className="text-sm text-gray-600">Sessions Today</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-white to-indigo-50/30 border-2 border-indigo-100 relative">
            {lockMode && isActive && (
              <div className="absolute top-3 right-3 flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                <Lock className="w-3 h-3" />
                <span>Locked</span>
              </div>
            )}
            <CardContent className="p-8">
              <div className="text-center">
                <div className="text-6xl md:text-7xl font-bold font-mono mb-4 text-indigo-600">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                
                <div className="text-lg mb-6 text-gray-600">
                  {isBreak ? 'Break Time' : 'Focus Time'}
                </div>

                <div className="mb-6">
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex justify-center space-x-4 mb-4">
                  {!isActive ? (
                    <Button
                      onClick={() => startTimer()}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  ) : (
                    <Button
                      onClick={pauseTimer}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  
                  <Button onClick={resetTimer} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timer Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Timer Duration
                </label>
                <Select 
                  value={selectedPreset} 
                  onValueChange={(value) => {
                    setSelectedPreset(value);
                    setMinutes(parseInt(value));
                    setSeconds(0);
                    setIsActive(false);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {presets.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Sound Notifications</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={soundEnabled ? 'text-indigo-600' : 'text-gray-400'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Lock Mode</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLockMode(!lockMode)}
                  className={lockMode ? 'text-red-600' : 'text-gray-400'}
                >
                  {lockMode ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </Button>
              </div>

              <Button
                onClick={() => setFullscreen(true)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
              >
                <Square className="w-4 h-4 mr-2" />
                Fullscreen Focus
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voice Commands</CardTitle>
            </CardHeader>
            <CardContent>
              <VoiceCommands 
                onStartTimer={startTimer}
                onPauseTimer={pauseTimer}
                onResetTimer={resetTimer}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sessions Today</span>
                  <span className="font-medium text-indigo-600">{sessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Focus Time</span>
                  <span className="font-medium text-indigo-600">{sessions * 25}min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Mode</span>
                  <span className={`font-medium ${isBreak ? 'text-green-600' : 'text-indigo-600'}`}>
                    {isBreak ? 'Break' : 'Focus'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
