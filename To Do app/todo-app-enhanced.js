// Enhanced Todo App JavaScript
class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.templates = this.loadTemplates();
        this.settings = this.loadSettings();
        this.categories = [
            { id: 'work', name: 'Work', color: '#3b82f6', icon: '💼' },
            { id: 'personal', name: 'Personal', color: '#10b981', icon: '🏠' },
            { id: 'shopping', name: 'Shopping', color: '#f59e0b', icon: '🛒' },
            { id: 'health', name: 'Health', color: '#ef4444', icon: '🏥' },
            { id: 'learning', name: 'Learning', color: '#8b5cf6', icon: '📚' }
        ];
        this.currentFilter = {
            search: '',
            status: 'all',
            priority: '',
            category: ''
        };
        this.editingTask = null;
        this.editingTemplate = null;
        this.currentPomodoroTask = null;
        this.pomodoroTimer = null;
        this.pomodoroState = {
            isRunning: false,
            timeLeft: 25 * 60, // 25 minutes in seconds
            isBreak: false,
            session: 0
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.populateCategories();
        this.renderTasks();
        this.updateStats();
        this.initTheme();
        this.setupKeyboardShortcuts();
        this.loadDefaultTemplates();
        
        // Initialize Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }
    }
    
    setupEventListeners() {
        // Existing event listeners
        document.getElementById('add-task').addEventListener('click', () => this.openModal());
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancel-task').addEventListener('click', () => this.closeModal());
        document.getElementById('task-form').addEventListener('submit', (e) => this.handleTaskSubmit(e));
        
        // Search and filters
        document.getElementById('search').addEventListener('input', (e) => {
            this.currentFilter.search = e.target.value;
            this.renderTasks();
        });
        
        document.getElementById('filter-status').addEventListener('change', (e) => {
            this.currentFilter.status = e.target.value;
            this.renderTasks();
        });
        
        document.getElementById('filter-priority').addEventListener('change', (e) => {
            this.currentFilter.priority = e.target.value;
            this.renderTasks();
        });
        
        // Theme and sidebar
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('toggle-sidebar').addEventListener('click', () => this.toggleSidebar());
        
        // New feature buttons
        document.getElementById('templates-btn').addEventListener('click', () => this.openTemplatesModal());
        document.getElementById('pomodoro-btn').addEventListener('click', () => this.openPomodoroModal());
        document.getElementById('settings-btn').addEventListener('click', () => this.openSettingsModal());
        
        // Templates modal
        document.getElementById('close-templates-modal').addEventListener('click', () => this.closeTemplatesModal());
        document.getElementById('add-template-btn').addEventListener('click', () => this.addCurrentTaskAsTemplate());
        
        // Pomodoro modal
        document.getElementById('close-pomodoro-modal').addEventListener('click', () => this.closePomodoroModal());
        document.getElementById('timer-start').addEventListener('click', () => this.startPomodoro());
        document.getElementById('timer-pause').addEventListener('click', () => this.pausePomodoro());
        document.getElementById('timer-reset').addEventListener('click', () => this.resetPomodoro());
        
        // Settings modal
        document.getElementById('close-settings-modal').addEventListener('click', () => this.closeSettingsModal());
        document.getElementById('setting-sound').addEventListener('change', (e) => this.updateSetting('sound', e.target.checked));
        document.getElementById('setting-notifications').addEventListener('change', (e) => this.updateSetting('notifications', e.target.checked));
        document.getElementById('setting-animations').addEventListener('change', (e) => this.updateSetting('animations', e.target.checked));
        
        // Data management
        document.getElementById('export-data').addEventListener('click', () => this.exportData());
        document.getElementById('import-data').addEventListener('click', () => this.importData());
        document.getElementById('clear-data').addEventListener('click', () => this.clearAllData());
        document.getElementById('import-file-input').addEventListener('change', (e) => this.handleFileImport(e));
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N: New task
            if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !e.shiftKey) {
                e.preventDefault();
                this.openModal();
            }
            
            // Ctrl/Cmd + Shift + T: Templates
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.openTemplatesModal();
            }
            
            // Ctrl/Cmd + Shift + P: Pomodoro
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.openPomodoroModal();
            }
            
            // Escape: Close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            
            // Ctrl/Cmd + /: Focus search
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                document.getElementById('search').focus();
            }
        });
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Load/Save functions
    loadTasks() {
        const saved = localStorage.getItem('todo-app-tasks');
        if (saved) {
            return JSON.parse(saved).map(task => ({
                ...task,
                createdAt: new Date(task.createdAt),
                updatedAt: new Date(task.updatedAt),
                dueDate: task.dueDate ? new Date(task.dueDate) : null
            }));
        }
        return [];
    }
    
    saveTasks() {
        localStorage.setItem('todo-app-tasks', JSON.stringify(this.tasks));
    }
    
    loadTemplates() {
        const saved = localStorage.getItem('todo-app-templates');
        if (saved) {
            return JSON.parse(saved).map(template => ({
                ...template,
                createdAt: new Date(template.createdAt)
            }));
        }
        return [];
    }
    
    saveTemplates() {
        localStorage.setItem('todo-app-templates', JSON.stringify(this.templates));
    }
    
    loadSettings() {
        const saved = localStorage.getItem('todo-app-settings');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            sound: false,
            notifications: false,
            animations: true
        };
    }
    
    saveSettings() {
        localStorage.setItem('todo-app-settings', JSON.stringify(this.settings));
    }
    
    loadDefaultTemplates() {
        if (this.templates.length === 0) {
            const defaultTemplates = [
                {
                    id: this.generateId(),
                    name: 'Daily Standup',
                    title: 'Attend daily standup meeting',
                    description: 'Share yesterday\'s progress, today\'s plan, and blockers',
                    priority: 'medium',
                    category: 'work',
                    tags: ['meeting', 'standup', 'team'],
                    estimate: 30,
                    createdAt: new Date()
                },
                {
                    id: this.generateId(),
                    name: 'Code Review',
                    title: 'Review pull request',
                    description: 'Review code changes and provide feedback',
                    priority: 'high',
                    category: 'work',
                    tags: ['code', 'review', 'development'],
                    estimate: 60,
                    createdAt: new Date()
                },
                {
                    id: this.generateId(),
                    name: 'Weekly Grocery Shopping',
                    title: 'Buy groceries for the week',
                    description: 'Plan meals and buy necessary ingredients',
                    priority: 'medium',
                    category: 'shopping',
                    tags: ['groceries', 'weekly', 'food'],
                    estimate: 90,
                    createdAt: new Date()
                }
            ];
            this.templates = defaultTemplates;
            this.saveTemplates();
        }
    }
    
    // Task management
    addTask(taskData) {
        const task = {
            id: this.generateId(),
            title: taskData.title,
            description: taskData.description || '',
            priority: taskData.priority,
            category: taskData.category,
            dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
            tags: taskData.tags ? taskData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
            completed: false,
            estimate: taskData.estimate ? parseInt(taskData.estimate) : null,
            actualTime: 0,
            notes: taskData.notes || '',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        
        if (this.settings.animations) {
            this.showNotification('Task created successfully!', 'success');
        }
    }
    
    updateTask(id, updates) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            const wasCompleted = this.tasks[taskIndex].completed;
            this.tasks[taskIndex] = {
                ...this.tasks[taskIndex],
                ...updates,
                updatedAt: new Date()
            };
            
            // Show celebration if task was just completed
            if (!wasCompleted && updates.completed && this.settings.animations) {
                this.showCelebration();
            }
            
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }
    
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        
        if (this.settings.animations) {
            this.showNotification('Task deleted', 'info');
        }
    }
    
    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            this.updateTask(id, { completed: !task.completed });
        }
    }
    
    // UI Rendering
    populateCategories() {
        const categoriesContainer = document.getElementById('categories');
        const categorySelect = document.getElementById('task-category');
        
        // Clear existing content
        categoriesContainer.innerHTML = '';
        categorySelect.innerHTML = '';
        
        // Add "All Tasks" button
        const allTasksButton = document.createElement('button');
        allTasksButton.className = 'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors bg-blue-100 text-blue-700';
        allTasksButton.innerHTML = '📋 All Tasks';
        allTasksButton.addEventListener('click', () => {
            this.currentFilter.category = '';
            this.renderTasks();
            this.updateCategorySelection();
        });
        categoriesContainer.appendChild(allTasksButton);
        
        // Add category buttons and select options
        this.categories.forEach(category => {
            // Sidebar button
            const button = document.createElement('button');
            button.className = 'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700';
            button.innerHTML = `<span class="mr-2">${category.icon}</span>${category.name}`;
            button.addEventListener('click', () => {
                this.currentFilter.category = category.id;
                this.renderTasks();
                this.updateCategorySelection();
            });
            categoriesContainer.appendChild(button);
            
            // Form select option
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = `${category.icon} ${category.name}`;
            categorySelect.appendChild(option);
        });
    }
    
    updateCategorySelection() {
        const buttons = document.querySelectorAll('#categories button');
        buttons.forEach((button, index) => {
            if (index === 0 && !this.currentFilter.category) {
                button.className = 'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
            } else if (index > 0 && this.categories[index - 1].id === this.currentFilter.category) {
                button.className = 'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
            } else {
                button.className = 'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700';
            }
        });
    }
    
    filterTasks() {
        return this.tasks.filter(task => {
            // Search filter
            if (this.currentFilter.search) {
                const searchLower = this.currentFilter.search.toLowerCase();
                const matchesSearch = task.title.toLowerCase().includes(searchLower) ||
                                    task.description.toLowerCase().includes(searchLower) ||
                                    task.notes.toLowerCase().includes(searchLower) ||
                                    task.tags.some(tag => tag.toLowerCase().includes(searchLower));
                if (!matchesSearch) return false;
            }
            
            // Status filter
            switch (this.currentFilter.status) {
                case 'active':
                    if (task.completed) return false;
                    break;
                case 'completed':
                    if (!task.completed) return false;
                    break;
                case 'overdue':
                    if (!task.dueDate || task.dueDate >= new Date() || task.completed) return false;
                    break;
            }
            
            // Priority filter
            if (this.currentFilter.priority && task.priority !== this.currentFilter.priority) {
                return false;
            }
            
            // Category filter
            if (this.currentFilter.category && task.category !== this.currentFilter.category) {
                return false;
            }
            
            return true;
        });
    }
    
    renderTasks() {
        const taskList = document.getElementById('task-list');
        const filteredTasks = this.filterTasks();
        
        if (filteredTasks.length === 0) {
            taskList.innerHTML = `
                <div class="text-center py-12">
                    <div class="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <span class="text-4xl">📝</span>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks found</h3>
                    <p class="text-gray-600 dark:text-gray-400">Get started by creating your first task!</p>
                </div>
            `;
            return;
        }
        
        // Sort tasks by priority and due date
        filteredTasks.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            if (a.priority !== b.priority) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            return 0;
        });
        
        taskList.innerHTML = filteredTasks.map(task => this.renderTask(task)).join('');
        
        // Add event listeners to task items
        filteredTasks.forEach(task => {
            document.getElementById(`toggle-${task.id}`).addEventListener('click', () => this.toggleTask(task.id));
            document.getElementById(`edit-${task.id}`).addEventListener('click', () => this.editTask(task));
            document.getElementById(`delete-${task.id}`).addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this task?')) {
                    this.deleteTask(task.id);
                }
            });
            
            if (document.getElementById(`pomodoro-${task.id}`)) {
                document.getElementById(`pomodoro-${task.id}`).addEventListener('click', () => this.startPomodoroForTask(task));
            }
        });
        
        // Re-initialize icons
        if (window.lucide) {
            lucide.createIcons();
        }
    }
    
    renderTask(task) {
        const category = this.categories.find(c => c.id === task.category);
        const priorityClass = `priority-${task.priority}`;
        const completedClass = task.completed ? 'task-completed' : '';
        const animationClass = this.settings.animations ? 'fade-in' : '';
        
        let dueDateHtml = '';
        if (task.dueDate) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const taskDate = new Date(task.dueDate.getFullYear(), task.dueDate.getMonth(), task.dueDate.getDate());
            
            const isOverdue = taskDate < today && !task.completed;
            const isToday = taskDate.getTime() === today.getTime();
            const isTomorrow = taskDate.getTime() === today.getTime() + 24 * 60 * 60 * 1000;
            
            let dateClass = 'text-gray-600 dark:text-gray-400';
            let dateText = task.dueDate.toLocaleDateString();
            let icon = 'calendar';
            
            if (isOverdue) {
                dateClass = 'text-red-600';
                dateText = 'Overdue';
                icon = 'alert-triangle';
            } else if (isToday) {
                dateClass = 'text-orange-600';
                dateText = 'Due today';
                icon = 'clock';
            } else if (isTomorrow) {
                dateClass = 'text-blue-600';
                dateText = 'Due tomorrow';
                icon = 'calendar';
            }
            
            dueDateHtml = `
                <div class="flex items-center space-x-1 ${dateClass}">
                    <i data-lucide="${icon}" class="h-4 w-4"></i>
                    <span>${dateText}</span>
                </div>
            `;
        }
        
        const tagsHtml = task.tags.length > 0 ? `
            <div class="flex items-center space-x-1">
                <i data-lucide="tag" class="h-4 w-4 text-gray-400"></i>
                <span class="text-gray-600 dark:text-gray-400">${task.tags.slice(0, 2).join(', ')}${task.tags.length > 2 ? ` +${task.tags.length - 2}` : ''}</span>
            </div>
        ` : '';
        
        const estimateHtml = task.estimate ? `
            <div class="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <i data-lucide="clock" class="h-4 w-4"></i>
                <span>${task.estimate}min</span>
            </div>
        ` : '';
        
        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200 ${completedClass} ${priorityClass} ${animationClass}">
                <div class="flex items-start space-x-3">
                    <button id="toggle-${task.id}" class="mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400'}">
                        ${task.completed ? '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>' : ''}
                    </button>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <h3 class="text-lg font-medium text-gray-900 dark:text-white ${task.completed ? 'line-through opacity-60' : ''}">${task.title}</h3>
                                ${task.description ? `<p class="mt-1 text-sm text-gray-600 dark:text-gray-400 ${task.completed ? 'line-through opacity-60' : ''}">${task.description}</p>` : ''}
                                ${task.notes ? `<p class="mt-1 text-xs text-gray-500 dark:text-gray-500 italic">${task.notes}</p>` : ''}
                            </div>
                            <div class="flex items-center space-x-2 ml-4">
                                ${!task.completed ? `<button id="pomodoro-${task.id}" class="p-2 text-gray-400 hover:text-green-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" title="Start Pomodoro">
                                    <i data-lucide="timer" class="h-4 w-4"></i>
                                </button>` : ''}
                                <button id="edit-${task.id}" class="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" title="Edit task">
                                    <i data-lucide="edit" class="h-4 w-4"></i>
                                </button>
                                <button id="delete-${task.id}" class="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" title="Delete task">
                                    <i data-lucide="trash-2" class="h-4 w-4"></i>
                                </button>
                            </div>
                        </div>
                        <div class="mt-3 flex items-center flex-wrap gap-4 text-sm">
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${this.getPriorityColor(task.priority)}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                            ${category ? `<div class="flex items-center space-x-1"><span>${category.icon}</span><span class="text-gray-600 dark:text-gray-400">${category.name}</span></div>` : ''}
                            ${dueDateHtml}
                            ${estimateHtml}
                            ${tagsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getPriorityColor(priority) {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900';
            case 'medium': return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900';
            case 'low': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900';
            default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900';
        }
    }
    
    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const activeTasks = totalTasks - completedTasks;
        const overdueTasks = this.tasks.filter(task => {
            if (!task.dueDate || task.completed) return false;
            const today = new Date();
            const taskDate = new Date(task.dueDate.getFullYear(), task.dueDate.getMonth(), task.dueDate.getDate());
            const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            return taskDate < todayDate;
        }).length;
        const dueTodayTasks = this.tasks.filter(task => {
            if (!task.dueDate || task.completed) return false;
            const today = new Date();
            return task.dueDate.toDateString() === today.toDateString();
        }).length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        const statsContainer = document.getElementById('stats');
        statsContainer.innerHTML = `
            <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div class="p-2 rounded-md text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-400">
                        <i data-lucide="list" class="h-5 w-5"></i>
                    </div>
                    <div>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white">${totalTasks}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div class="p-2 rounded-md text-purple-600 bg-purple-50 dark:bg-purple-900 dark:text-purple-400">
                        <i data-lucide="play" class="h-5 w-5"></i>
                    </div>
                    <div>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white">${activeTasks}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Active</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div class="p-2 rounded-md text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-400">
                        <i data-lucide="check-circle" class="h-5 w-5"></i>
                    </div>
                    <div>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white">${completedTasks}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Done</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div class="p-2 rounded-md text-orange-600 bg-orange-50 dark:bg-orange-900 dark:text-orange-400">
                        <i data-lucide="clock" class="h-5 w-5"></i>
                    </div>
                    <div>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white">${dueTodayTasks}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Due Today</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div class="p-2 rounded-md text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-400">
                        <i data-lucide="alert-triangle" class="h-5 w-5"></i>
                    </div>
                    <div>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-white">${overdueTasks}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
                    </div>
                </div>
            </div>
            ${totalTasks > 0 ? `
                <div class="mt-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Completion Progress</span>
                        <span class="text-sm text-gray-600 dark:text-gray-400">${completionRate}%</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div class="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500" style="width: ${completionRate}%"></div>
                    </div>
                </div>
            ` : ''}
        `;
        
        // Re-initialize icons for the new content
        if (window.lucide) {
            lucide.createIcons();
        }
    }
    
    // Modal management
    openModal(task = null) {
        this.editingTask = task;
        const modal = document.getElementById('task-modal');
        const form = document.getElementById('task-form');
        const title = document.getElementById('modal-title');
        
        title.textContent = task ? 'Edit Task' : 'Add New Task';
        
        if (task) {
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-description').value = task.description;
            document.getElementById('task-priority').value = task.priority;
            document.getElementById('task-category').value = task.category;
            document.getElementById('task-due-date').value = task.dueDate ? task.dueDate.toISOString().split('T')[0] : '';
            document.getElementById('task-tags').value = task.tags.join(', ');
            document.getElementById('task-estimate').value = task.estimate || '';
            document.getElementById('task-notes').value = task.notes || '';
        } else {
            form.reset();
            document.getElementById('task-priority').value = 'medium';
            document.getElementById('task-category').value = this.categories[0]?.id || '';
        }
        
        modal.classList.remove('hidden');
        document.getElementById('task-title').focus();
    }
    
    closeModal() {
        document.getElementById('task-modal').classList.add('hidden');
        document.getElementById('task-form').reset();
        this.editingTask = null;
    }
    
    editTask(task) {
        this.openModal(task);
    }
    
    handleTaskSubmit(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('task-title').value.trim(),
            description: document.getElementById('task-description').value.trim(),
            priority: document.getElementById('task-priority').value,
            category: document.getElementById('task-category').value,
            dueDate: document.getElementById('task-due-date').value,
            tags: document.getElementById('task-tags').value,
            estimate: document.getElementById('task-estimate').value,
            notes: document.getElementById('task-notes').value.trim()
        };
        
        if (!formData.title) {
            alert('Please enter a task title');
            return;
        }
        
        if (this.editingTask) {
            this.updateTask(this.editingTask.id, {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                category: formData.category,
                dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
                estimate: formData.estimate ? parseInt(formData.estimate) : null,
                notes: formData.notes
            });
        } else {
            this.addTask(formData);
        }
        
        this.closeModal();
    }
    
    // Templates functionality
    openTemplatesModal() {
        document.getElementById('templates-modal').classList.remove('hidden');
        this.renderTemplates();
    }
    
    closeTemplatesModal() {
        document.getElementById('templates-modal').classList.add('hidden');
    }
    
    renderTemplates() {
        const templatesList = document.getElementById('templates-list');
        
        if (this.templates.length === 0) {
            templatesList.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-gray-600 dark:text-gray-400">No templates yet. Create tasks and save them as templates!</p>
                </div>
            `;
            return;
        }
        
        templatesList.innerHTML = this.templates.map(template => `
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-900 dark:text-white">${template.name}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${template.title}</p>
                        <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                            <span class="px-2 py-1 rounded-full ${this.getPriorityColor(template.priority)}">${template.priority}</span>
                            <span>${this.categories.find(c => c.id === template.category)?.name || 'Unknown'}</span>
                            ${template.estimate ? `<span>${template.estimate}min</span>` : ''}
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="todoApp.createTaskFromTemplate('${template.id}')" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors">
                            Use
                        </button>
                        <button onclick="todoApp.deleteTemplate('${template.id}')" class="p-1 text-gray-400 hover:text-red-600 rounded-md">
                            <i data-lucide="trash-2" class="h-4 w-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        if (window.lucide) {
            lucide.createIcons();
        }
    }
    
    addCurrentTaskAsTemplate() {
        if (!this.editingTask) {
            alert('Please edit a task first to save it as a template');
            return;
        }
        
        const templateName = prompt('Enter a name for this template:');
        if (!templateName) return;
        
        const template = {
            id: this.generateId(),
            name: templateName,
            title: this.editingTask.title,
            description: this.editingTask.description,
            priority: this.editingTask.priority,
            category: this.editingTask.category,
            tags: [...this.editingTask.tags],
            estimate: this.editingTask.estimate,
            createdAt: new Date()
        };
        
        this.templates.push(template);
        this.saveTemplates();
        this.renderTemplates();
        
        if (this.settings.animations) {
            this.showNotification('Template saved!', 'success');
        }
    }
    
    createTaskFromTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) return;
        
        const task = {
            id: this.generateId(),
            title: template.title,
            description: template.description || '',
            priority: template.priority,
            category: template.category,
            tags: [...template.tags],
            estimate: template.estimate,
            completed: false,
            actualTime: 0,
            notes: '',
            dueDate: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.closeTemplatesModal();
        
        if (this.settings.animations) {
            this.showNotification('Task created from template!', 'success');
        }
    }
    
    deleteTemplate(templateId) {
        if (confirm('Are you sure you want to delete this template?')) {
            this.templates = this.templates.filter(t => t.id !== templateId);
            this.saveTemplates();
            this.renderTemplates();
        }
    }
    
    // Pomodoro Timer functionality
    openPomodoroModal() {
        document.getElementById('pomodoro-modal').classList.remove('hidden');
        this.updateTimerDisplay();
        this.updatePomodoroTaskDisplay();
    }
    
    closePomodoroModal() {
        document.getElementById('pomodoro-modal').classList.add('hidden');
    }
    
    startPomodoroForTask(task) {
        this.currentPomodoroTask = task;
        this.openPomodoroModal();
    }
    
    startPomodoro() {
        if (this.pomodoroState.isRunning) return;
        
        this.pomodoroState.isRunning = true;
        document.getElementById('timer-start').classList.add('hidden');
        document.getElementById('timer-pause').classList.remove('hidden');
        
        this.pomodoroTimer = setInterval(() => {
            this.pomodoroState.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.pomodoroState.timeLeft <= 0) {
                this.finishPomodoroSession();
            }
        }, 1000);
    }
    
    pausePomodoro() {
        this.pomodoroState.isRunning = false;
        clearInterval(this.pomodoroTimer);
        document.getElementById('timer-start').classList.remove('hidden');
        document.getElementById('timer-pause').classList.add('hidden');
    }
    
    resetPomodoro() {
        this.pausePomodoro();
        this.pomodoroState.timeLeft = this.pomodoroState.isBreak ? 5 * 60 : 25 * 60;
        this.pomodoroState.isBreak = false;
        this.pomodoroState.session = 0;
        this.updateTimerDisplay();
        this.updatePomodoroTaskDisplay();
    }
    
    finishPomodoroSession() {
        this.pausePomodoro();
        
        if (this.pomodoroState.isBreak) {
            // Break is over, start new work session
            this.pomodoroState.isBreak = false;
            this.pomodoroState.timeLeft = 25 * 60;
            this.pomodoroState.session++;
        } else {
            // Work session is over, start break
            if (this.currentPomodoroTask) {
                const currentTime = this.currentPomodoroTask.actualTime || 0;
                this.updateTask(this.currentPomodoroTask.id, { actualTime: currentTime + 25 });
            }
            
            this.pomodoroState.isBreak = true;
            this.pomodoroState.timeLeft = this.pomodoroState.session % 4 === 3 ? 15 * 60 : 5 * 60; // Long break every 4 sessions
        }
        
        this.updateTimerDisplay();
        this.playNotificationSound();
        
        if (this.settings.notifications && Notification.permission === 'granted') {
            new Notification('Pomodoro Timer', {
                body: this.pomodoroState.isBreak ? 'Time for a break!' : 'Break is over, time to work!',
                icon: '/favicon.ico'
            });
        }
        
        if (this.settings.animations) {
            this.showCelebration();
        }
    }
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.pomodoroState.timeLeft / 60);
        const seconds = this.pomodoroState.timeLeft % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('timer-display').textContent = display;
        document.getElementById('timer-session').textContent = this.pomodoroState.isBreak ? 
            (this.pomodoroState.session % 4 === 3 ? 'Long Break' : 'Break Time') : 
            'Work Session';
    }
    
    updatePomodoroTaskDisplay() {
        const display = document.getElementById('current-task-display');
        if (this.currentPomodoroTask) {
            display.textContent = `Working on: ${this.currentPomodoroTask.title}`;
        } else {
            display.textContent = 'No task selected';
        }
    }
    
    // Settings functionality
    openSettingsModal() {
        document.getElementById('settings-modal').classList.remove('hidden');
        
        // Load current settings into form
        document.getElementById('setting-sound').checked = this.settings.sound;
        document.getElementById('setting-notifications').checked = this.settings.notifications;
        document.getElementById('setting-animations').checked = this.settings.animations;
        
        // Request notification permission if needed
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    closeSettingsModal() {
        document.getElementById('settings-modal').classList.add('hidden');
    }
    
    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }
    
    // Data management
    exportData() {
        const data = {
            tasks: this.tasks,
            templates: this.templates,
            settings: this.settings,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `todo-app-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        if (this.settings.animations) {
            this.showNotification('Data exported successfully!', 'success');
        }
    }
    
    importData() {
        document.getElementById('import-file-input').click();
    }
    
    handleFileImport(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.tasks) {
                    // Convert date strings back to Date objects
                    this.tasks = data.tasks.map(task => ({
                        ...task,
                        createdAt: new Date(task.createdAt),
                        updatedAt: new Date(task.updatedAt),
                        dueDate: task.dueDate ? new Date(task.dueDate) : null
                    }));
                    this.saveTasks();
                }
                
                if (data.templates) {
                    this.templates = data.templates.map(template => ({
                        ...template,
                        createdAt: new Date(template.createdAt)
                    }));
                    this.saveTemplates();
                }
                
                if (data.settings) {
                    this.settings = { ...this.settings, ...data.settings };
                    this.saveSettings();
                }
                
                this.renderTasks();
                this.updateStats();
                this.closeSettingsModal();
                
                if (this.settings.animations) {
                    this.showNotification('Data imported successfully!', 'success');
                }
                
            } catch (error) {
                alert('Error importing data: Invalid file format');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
        
        // Clear the input
        e.target.value = '';
    }
    
    clearAllData() {
        if (confirm('Are you sure you want to delete all tasks and data? This action cannot be undone!')) {
            if (confirm('This will permanently delete everything. Are you absolutely sure?')) {
                this.tasks = [];
                this.templates = [];
                this.settings = {
                    sound: false,
                    notifications: false,
                    animations: true
                };
                
                localStorage.removeItem('todo-app-tasks');
                localStorage.removeItem('todo-app-templates');
                localStorage.removeItem('todo-app-settings');
                
                this.renderTasks();
                this.updateStats();
                this.closeSettingsModal();
                
                if (this.settings.animations) {
                    this.showNotification('All data cleared', 'info');
                }
            }
        }
    }
    
    // Utility functions
    closeAllModals() {
        document.getElementById('task-modal').classList.add('hidden');
        document.getElementById('templates-modal').classList.add('hidden');
        document.getElementById('pomodoro-modal').classList.add('hidden');
        document.getElementById('settings-modal').classList.add('hidden');
    }
    
    showNotification(message, type = 'info') {
        // Simple toast notification
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
        } ${this.settings.animations ? 'slide-in' : ''}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    showCelebration() {
        if (!this.settings.animations) return;
        
        const celebration = document.getElementById('celebration-modal');
        celebration.classList.remove('hidden');
        
        setTimeout(() => {
            celebration.classList.add('hidden');
        }, 1000);
        
        this.playNotificationSound();
    }
    
    playNotificationSound() {
        if (!this.settings.sound) return;
        
        // Create a simple beep sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
    
    // Theme management
    initTheme() {
        const savedTheme = localStorage.getItem('todo-app-theme') || 'light';
        this.applyTheme(savedTheme);
    }
    
    toggleTheme() {
        const currentTheme = localStorage.getItem('todo-app-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        localStorage.setItem('todo-app-theme', newTheme);
    }
    
    applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.getElementById('theme-toggle').innerHTML = '<i data-lucide="moon" class="h-5 w-5"></i>';
        } else {
            document.documentElement.classList.remove('dark');
            document.getElementById('theme-toggle').innerHTML = '<i data-lucide="sun" class="h-5 w-5"></i>';
        }
        
        // Re-initialize icons
        if (window.lucide) {
            lucide.createIcons();
        }
    }
    
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('hidden');
    }
}

// Global variable to access app instance
let todoApp;

// Theme switching logic
function applyThemeSetting(theme) {
    if (theme === 'material3') {
        document.body.setAttribute('data-theme', 'material3');
    } else {
        document.body.removeAttribute('data-theme');
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    todoApp = new TodoApp();
    // Theme select in settings
    const themeSelect = document.getElementById('setting-theme');
    if (themeSelect) {
        // Load saved theme
        const savedTheme = localStorage.getItem('todo-app-theme-style') || 'modern';
        themeSelect.value = savedTheme;
        applyThemeSetting(savedTheme);
        themeSelect.addEventListener('change', (e) => {
            const theme = e.target.value;
            localStorage.setItem('todo-app-theme-style', theme);
            applyThemeSetting(theme);
        });
    } else {
        applyThemeSetting('modern');
    }
});
