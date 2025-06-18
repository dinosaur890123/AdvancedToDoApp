'use client';

import { useState } from 'react';
import { Download, Upload, Trash2, FileText, AlertTriangle } from 'lucide-react';
import { storage } from '@/lib/storage';

interface DataManagementProps {
  onClose: () => void;
  onDataImported: () => void;
}

export function DataManagement({ onClose, onDataImported }: DataManagementProps) {
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExport = () => {
    try {
      const data = storage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `todo-app-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export data. Please try again.');
    }
  };

  const handleImport = () => {
    setImportError('');
    
    if (!importData.trim()) {
      setImportError('Please paste the backup data');
      return;
    }

    try {
      const success = storage.importData(importData);
      if (success) {
        alert('Data imported successfully!');
        onDataImported();
        onClose();
      } else {
        setImportError('Invalid backup data format');
      }
    } catch (error) {
      setImportError('Failed to import data. Please check the format.');
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    storage.clearAllData();
    alert('All data has been cleared.');
    onDataImported();
    onClose();
    setShowClearConfirm(false);
  };

  const getDataStats = () => {
    const tasks = storage.getTasks();
    const categories = storage.getCategories();
    const templates = storage.getTemplates();
    const sessions = storage.getPomodoroSessions();

    return {
      tasks: tasks.length,
      categories: categories.length,
      templates: templates.length,
      sessions: sessions.length,
    };
  };

  const stats = getDataStats();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl scale-in slide-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 fade-in-down">
          <h2 className="text-xl font-semibold">Data Management</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover-scale transition-all duration-200 rotate-on-hover"
          >
            ✕
          </button>
        </div>        <div className="p-6 space-y-6">
          {/* Current Data Stats */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 fade-in-up" style={{ animationDelay: '100ms' }}>
            <h3 className="font-medium mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Current Data Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="text-2xl font-bold text-blue-500 counter-animate">{stats.tasks}</div>
                <div className="text-gray-600 dark:text-gray-400">Tasks</div>
              </div>
              <div className="text-center fade-in-up" style={{ animationDelay: '250ms' }}>
                <div className="text-2xl font-bold text-green-500 counter-animate">{stats.categories}</div>
                <div className="text-gray-600 dark:text-gray-400">Categories</div>
              </div>
              <div className="text-center fade-in-up" style={{ animationDelay: '300ms' }}>
                <div className="text-2xl font-bold text-purple-500 counter-animate">{stats.templates}</div>
                <div className="text-gray-600 dark:text-gray-400">Templates</div>
              </div>
              <div className="text-center fade-in-up" style={{ animationDelay: '350ms' }}>
                <div className="text-2xl font-bold text-orange-500 counter-animate">{stats.sessions}</div>
                <div className="text-gray-600 dark:text-gray-400">Pomodoro Sessions</div>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover-lift transition-all duration-200 fade-in-up" style={{ animationDelay: '400ms' }}>
            <h3 className="font-medium mb-2 flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Export Data
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Download a backup of all your tasks, categories, templates, and settings.
            </p>
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover-scale"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Backup
            </button>
          </div>

          {/* Import Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Import Data
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Restore data from a previously exported backup file.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Choose backup file:
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    dark:file:bg-blue-900 dark:file:text-blue-200
                    hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Or paste backup data:
                </label>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste your exported backup data here..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-sm font-mono"
                />
              </div>
              
              {importError && (
                <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {importError}
                </div>
              )}
              
              <button
                onClick={handleImport}
                disabled={!importData.trim()}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </button>
            </div>
          </div>

          {/* Clear Data Section */}
          <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-950">
            <h3 className="font-medium mb-2 flex items-center text-red-700 dark:text-red-300">
              <Trash2 className="w-5 h-5 mr-2" />
              Clear All Data
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">
              Permanently delete all tasks, categories, templates, and settings. This action cannot be undone.
            </p>
            
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center text-red-700 dark:text-red-300 font-medium">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Are you sure? This will delete everything!
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleClearData}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Yes, Delete Everything
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
