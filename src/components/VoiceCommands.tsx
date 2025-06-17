
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceCommandsProps {
  onStartTimer: (duration?: number) => void;
  onPauseTimer: () => void;
  onResetTimer: () => void;
  isListening?: boolean;
}

export const VoiceCommands = ({ 
  onStartTimer, 
  onPauseTimer, 
  onResetTimer,
  isListening: externalListening 
}: VoiceCommandsProps) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    let recognition: any = null;

    if (isListening) {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('Voice recognition started');
      };

      recognition.onresult = (event: any) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        setLastCommand(command);
        processVoiceCommand(command);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening, isSupported]);

  const processVoiceCommand = (command: string) => {
    console.log('Processing voice command:', command);

    // Start timer commands
    if (command.includes('start timer') || command.includes('begin timer')) {
      // Check for duration in command
      const durationMatch = command.match(/(\d+)\s*(minute|minutes|min)/);
      const duration = durationMatch ? parseInt(durationMatch[1]) : undefined;
      onStartTimer(duration);
      speak('Timer started');
      return;
    }

    // Pomodoro specific
    if (command.includes('start pomodoro') || command.includes('pomodoro')) {
      onStartTimer(25);
      speak('Pomodoro timer started for 25 minutes');
      return;
    }

    // Pause commands
    if (command.includes('pause timer') || command.includes('pause') || command.includes('stop timer')) {
      onPauseTimer();
      speak('Timer paused');
      return;
    }

    // Reset commands
    if (command.includes('reset timer') || command.includes('reset')) {
      onResetTimer();
      speak('Timer reset');
      return;
    }

    // Duration-specific commands
    const timeMatches = [
      { pattern: /fifteen minutes?|15 minutes?/, duration: 15 },
      { pattern: /twenty five minutes?|25 minutes?/, duration: 25 },
      { pattern: /thirty minutes?|30 minutes?/, duration: 30 },
      { pattern: /forty five minutes?|45 minutes?/, duration: 45 },
      { pattern: /one hour|1 hour|sixty minutes?|60 minutes?/, duration: 60 },
    ];

    for (const timeMatch of timeMatches) {
      if (timeMatch.pattern.test(command)) {
        onStartTimer(timeMatch.duration);
        speak(`Timer started for ${timeMatch.duration} minutes`);
        return;
      }
    }

    // If no command matched, provide feedback
    speak('Command not recognized. Try saying "start timer", "pause timer", or "reset timer"');
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Voice commands not supported in this browser</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Voice Commands</h4>
        <Button
          onClick={toggleListening}
          variant={isListening ? "default" : "outline"}
          size="sm"
          className={isListening ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" : ""}
        >
          {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </Button>
      </div>

      {isListening && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-800">Listening...</span>
          </div>
          <p className="text-xs text-blue-600">
            Try saying: "Start timer", "Start 25 minutes", "Pause timer", "Reset timer"
          </p>
        </div>
      )}

      {lastCommand && (
        <div className="p-2 bg-gray-50 rounded border">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-600">Last command:</span>
            <Badge variant="outline" className="text-xs">
              "{lastCommand}"
            </Badge>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700">Available Commands:</h5>
        <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
          <div>• "Start timer" or "Begin timer"</div>
          <div>• "Start pomodoro" (25 minutes)</div>
          <div>• "Start [number] minutes"</div>
          <div>• "Pause timer" or "Stop timer"</div>
          <div>• "Reset timer"</div>
        </div>
      </div>
    </div>
  );
};

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}
