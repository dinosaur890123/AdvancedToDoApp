'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Settings, Timer, Coffee } from 'lucide-react';
import { Task } from '@/types';
import { storage, PomodoroSession } from '@/lib/storage';

interface PomodoroTimerProps {
  task?: Task;
  onSessionComplete?: (session: PomodoroSession) => void;
}

export function PomodoroTimer({ task, onSessionComplete }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<'work' | 'short-break' | 'long-break'>('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const preferences = storage.getUserPreferences();
  
  const sessionLengths = {
    work: preferences.pomodoroLength * 60,
    'short-break': preferences.shortBreakLength * 60,
    'long-break': preferences.longBreakLength * 60,
  };

  useEffect(() => {
    setTimeLeft(sessionLengths[sessionType]);
  }, [sessionType, sessionLengths]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (timeLeft === 0 && isRunning) {
        handleSessionComplete();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    if (currentSession) {
      const completedSession: PomodoroSession = {
        ...currentSession,
        endTime: new Date(),
        completed: true,
      };
      
      // Save session
      const sessions = storage.getPomodoroSessions();
      storage.savePomodoroSessions([...sessions, completedSession]);
      
      onSessionComplete?.(completedSession);
    }

    // Play notification sound if enabled
    if (preferences.soundEnabled) {
      playNotificationSound();
    }

    // Show browser notification
    if (preferences.notifications && 'Notification' in window) {
      new Notification(`${sessionType} session completed!`, {
        body: sessionType === 'work' ? 'Time for a break!' : 'Ready to focus?',
        icon: '/favicon.ico',
      });
    }

    // Auto-switch to next session type
    if (sessionType === 'work') {
      setSessionsCompleted(prev => prev + 1);
      const nextType = sessionsCompleted % 4 === 3 ? 'long-break' : 'short-break';
      setSessionType(nextType);
    } else {
      setSessionType('work');
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio('/sounds/notification.mp3');
    audio.play().catch(() => {
      // Fallback: use system beep
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
    });
  };

  const startTimer = () => {
    if (!currentSession) {      const newSession: PomodoroSession = {
        id: Date.now().toString(),
        taskId: task?.id || '',
        startTime: new Date(),
        duration: sessionLengths[sessionType] / 60,
        type: sessionType,
        completed: false,
      };
      setCurrentSession(newSession);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionLengths[sessionType]);
    setCurrentSession(null);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionLengths[sessionType]);
    setCurrentSession(null);
    setSessionsCompleted(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((sessionLengths[sessionType] - timeLeft) / sessionLengths[sessionType]) * 100;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto scale-in fade-in">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2 fade-in-down">
          {sessionType === 'work' ? (
            <Timer className="w-6 h-6 text-red-500 mr-2 pulse-subtle" />
          ) : (
            <Coffee className="w-6 h-6 text-green-500 mr-2 pulse-subtle" />
          )}
          <h3 className="text-lg font-semibold capitalize">
            {sessionType.replace('-', ' ')} Session
          </h3>
        </div>
        
        {task && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 fade-in-up">
            Working on: {task.title}
          </p>
        )}
        
        <div className="relative w-32 h-32 mx-auto mb-4 scale-in" style={{ animationDelay: '200ms' }}>
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
              className={`transition-all duration-1000 shimmer ${
                sessionType === 'work' ? 'text-red-500' : 'text-green-500'
              }`}
            />
          </svg>          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold counter-animate">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-2 mb-4 fade-in-up" style={{ animationDelay: '300ms' }}>
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 hover-scale bounce-in"
          >
            <Play className="w-4 h-4 mr-2" />
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 hover-scale pulse"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </button>
        )}
        
        <button
          onClick={stopTimer}
          className="flex items-center px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 hover-scale"
        >
          <Square className="w-4 h-4" />
        </button>
        
        <button
          onClick={resetTimer}
          className="flex items-center px-2 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 hover-scale rotate-on-click"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center px-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover-scale"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="flex justify-center space-x-2 mb-4 fade-in-up" style={{ animationDelay: '400ms' }}>
        {(['work', 'short-break', 'long-break'] as const).map((type, index) => (
          <button
            key={type}
            onClick={() => !isRunning && setSessionType(type)}
            disabled={isRunning}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              sessionType === type
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {type.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Sessions completed today: {sessionsCompleted}
      </div>

      {showSettings && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-semibold mb-2">Timer Settings</h4>
          <div className="space-y-2 text-sm">
            <div>Work: {preferences.pomodoroLength} minutes</div>
            <div>Short Break: {preferences.shortBreakLength} minutes</div>
            <div>Long Break: {preferences.longBreakLength} minutes</div>
          </div>
        </div>
      )}
    </div>
  );
}
