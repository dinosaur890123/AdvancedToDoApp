'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Star, Trophy, Zap } from 'lucide-react';

interface CelebrationProps {
  isVisible: boolean;
  onComplete: () => void;
  type?: 'task' | 'milestone' | 'streak';
  message?: string;
}

export function Celebration({ isVisible, onComplete, type = 'task', message }: CelebrationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
        delay: Math.random() * 0.5
      }));
      setParticles(newParticles);

      // Auto-hide after animation
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'milestone':
        return <Trophy className="w-12 h-12 text-yellow-500" />;
      case 'streak':
        return <Zap className="w-12 h-12 text-purple-500" />;
      default:
        return <Star className="w-12 h-12 text-blue-500" />;
    }
  };

  const getMessage = () => {
    if (message) return message;
    
    switch (type) {
      case 'milestone':
        return 'Milestone achieved! 🎯';
      case 'streak':
        return 'On fire! Keep it up! 🔥';
      default:
        return 'Task completed! 🎉';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      {/* Confetti particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full animate-bounce"
          style={{
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '1.5s'
          }}
        />
      ))}

      {/* Main celebration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-sm mx-4 scale-in bounce-in glass-effect floating soft-glow">
        <div className="text-center">
          <div className="mb-4 breathing">
            {getIcon()}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {getMessage()}
          </h2>
          
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(3)].map((_, i) => (
              <Sparkles 
                key={i}
                className={`w-4 h-4 text-yellow-500 pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Great job! Keep up the momentum! 💪
          </p>
        </div>
      </div>
    </div>
  );
}
