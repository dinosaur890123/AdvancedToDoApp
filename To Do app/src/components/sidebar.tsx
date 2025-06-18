'use client';

import { Category } from '@/types';
import { X, Plus, Home, Briefcase, ShoppingCart, Heart, BookOpen } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect: (category?: string) => void;
  onAddCategory: (category: Category) => void;
}

export function Sidebar({ 
  isOpen, 
  onClose, 
  categories, 
  selectedCategory, 
  onCategorySelect,
  onAddCategory 
}: SidebarProps) {
  return (
    <>      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden fade-in"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out slide-in-left
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden fade-in-down">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover-scale transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 fade-in-up">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Categories
          </h3>
          
          <div className="space-y-2">
            <button
              onClick={() => onCategorySelect(undefined)}
              className={`
                w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover-lift
                ${!selectedCategory 
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 scale-in' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              📋 All Tasks
            </button>
            
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`
                  w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover-lift fade-in-up
                  ${selectedCategory === category.id
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 scale-in' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
