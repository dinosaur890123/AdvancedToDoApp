'use client';

import { useState } from 'react';
import { Plus, Edit3, Trash2, Copy, FileText } from 'lucide-react';
import { TaskTemplate, Category, Task } from '@/types';
import { storage } from '@/lib/storage';

interface TaskTemplatesProps {
  templates: TaskTemplate[];
  categories: Category[];
  onTemplatesChange: (templates: TaskTemplate[]) => void;
  onCreateFromTemplate: (template: TaskTemplate) => void;
  onClose: () => void;
}

export function TaskTemplates({
  templates,
  categories,
  onTemplatesChange,
  onCreateFromTemplate,
  onClose,
}: TaskTemplatesProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | null>(null);  const [formData, setFormData] = useState<{
    name: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
    tags: string;
    estimate: string;
  }>({
    name: '',
    title: '',
    description: '',
    priority: 'medium',
    category: categories[0]?.name || '',
    tags: '',
    estimate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      const templateData: TaskTemplate = {
      id: editingTemplate?.id || Date.now().toString(),
      name: formData.name,
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      estimate: formData.estimate ? parseInt(formData.estimate) : undefined,
      createdAt: editingTemplate?.createdAt || new Date(),
    };

    const updatedTemplates = editingTemplate
      ? templates.map(t => t.id === editingTemplate.id ? templateData : t)
      : [...templates, templateData];

    onTemplatesChange(updatedTemplates);
    storage.saveTemplates(updatedTemplates);
    
    setIsFormOpen(false);
    setEditingTemplate(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      description: '',
      priority: 'medium',
      category: categories[0]?.name || '',
      tags: '',
      estimate: '',
    });
  };

  const editTemplate = (template: TaskTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      title: template.title,
      description: template.description || '',
      priority: template.priority,
      category: template.category,
      tags: template.tags.join(', '),
      estimate: template.estimate?.toString() || '',
    });
    setIsFormOpen(true);
  };

  const deleteTemplate = (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      const updatedTemplates = templates.filter(t => t.id !== id);
      onTemplatesChange(updatedTemplates);
      storage.saveTemplates(updatedTemplates);
    }
  };
  const duplicateTemplate = (template: TaskTemplate) => {
    const duplicate: TaskTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
    };
    
    const updatedTemplates = [...templates, duplicate];
    onTemplatesChange(updatedTemplates);
    storage.saveTemplates(updatedTemplates);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden scale-in slide-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 fade-in-down">
          <h2 className="text-xl font-semibold">Task Templates</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover-scale transition-all duration-200 rotate-on-hover"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {!isFormOpen ? (
            <>
              <div className="flex justify-between items-center mb-6 fade-in-up">
                <p className="text-gray-600 dark:text-gray-400">
                  Create reusable templates for common tasks
                </p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover-scale bounce-in"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Template
                </button>
              </div>

              {templates.length === 0 ? (
                <div className="text-center py-12 fade-in-up" style={{ animationDelay: '200ms' }}>
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4 pulse-subtle" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No templates yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Create your first template to speed up task creation
                  </p>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Create Template
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {template.name}
                        </h3>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => editTemplate(template)}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            title="Edit template"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => duplicateTemplate(template)}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            title="Duplicate template"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTemplate(template.id)}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Delete template"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {template.title}
                      </p>
                      
                      {template.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-3 line-clamp-2">
                          {template.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            template.priority === 'high'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : template.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {template.priority}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {template.category}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => onCreateFromTemplate(template)}
                          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Use Template
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-medium mb-4">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Weekly Review"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Complete weekly review"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Task description..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Estimate (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.estimate}
                    onChange={(e) => setFormData({ ...formData, estimate: e.target.value })}
                    placeholder="30"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editingTemplate ? 'Update Template' : 'Create Template'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingTemplate(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
