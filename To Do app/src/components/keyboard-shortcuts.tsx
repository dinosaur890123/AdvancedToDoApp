'use client';

import { useState } from 'react';
import { HelpCircle, X, Keyboard } from 'lucide-react';

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'Ctrl + N', description: 'Add new task' },
    { key: 'Ctrl + A', description: 'Select all tasks' },
    { key: 'Ctrl + Enter', description: 'Complete selected tasks' },
    { key: 'Delete', description: 'Delete selected tasks' },
    { key: 'Escape', description: 'Close modal or clear selection' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
        title="Keyboard shortcuts"
      >
        <Keyboard className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full slide-in shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Keyboard className="h-5 w-5 mr-2" />
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{shortcut.description}</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-sm font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 Tip: You can use these shortcuts to work faster with your tasks!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
