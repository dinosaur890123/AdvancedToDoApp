// Todo App JavaScript
class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
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
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.populateCategories();
        this.renderTasks();
        this.updateStats();
        this.initTheme();
        
        // Initialize Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }
    }
    
    setupEventListeners() {
        // Add task button
        document.getElementById('add-task').addEventListener('click', () => this.openModal());
        
        // Modal close buttons
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancel-task').addEventListener('click', () => this.closeModal());
        
        // Task form submission
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
        
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        
        // Sidebar toggle
        document.getElementById('toggle-sidebar').addEventListener('click', () => this.toggleSidebar());
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
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
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }
    
    updateTask(id, updates) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = {
                ...this.tasks[taskIndex],
                ...updates,
                updatedAt: new Date()
            };
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
    }
    
    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            this.updateTask(id, { completed: !task.completed });
        }
    }
    
    populateCategories() {
        const categoriesContainer = document.getElementById('categories');
        const categorySelect = document.getElementById('task-category');
        
        // Populate sidebar categories
        const allTasksButton = document.createElement('button');
        allTasksButton.className = 'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors bg-blue-100 text-blue-700';
        allTasksButton.innerHTML = '📋 All Tasks';
        allTasksButton.addEventListener('click', () => {
            this.currentFilter.category = '';
            this.renderTasks();
            this.updateCategorySelection();
        });
        categoriesContainer.appendChild(allTasksButton);
        
        this.categories.forEach(category => {
            // Sidebar button
            const button = document.createElement('button');
            button.className = 'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100';
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
                button.className = 'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors bg-blue-100 text-blue-700';
            } else if (index > 0 && this.categories[index - 1].id === this.currentFilter.category) {
                button.className = 'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors bg-blue-100 text-blue-700';
            } else {
                button.className = 'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100';
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
                    <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span class="text-4xl">📝</span>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                    <p class="text-gray-600">Get started by creating your first task!</p>
                </div>
            `;
            return;
        }
        
        taskList.innerHTML = filteredTasks.map(task => this.renderTask(task)).join('');
        
        // Add event listeners to task items
        filteredTasks.forEach(task => {
            document.getElementById(`toggle-${task.id}`).addEventListener('click', () => this.toggleTask(task.id));
            document.getElementById(`edit-${task.id}`).addEventListener('click', () => this.editTask(task));
            document.getElementById(`delete-${task.id}`).addEventListener('click', () => this.deleteTask(task.id));
        });
    }
    
    renderTask(task) {
        const category = this.categories.find(c => c.id === task.category);
        const priorityClass = `priority-${task.priority}`;
        const completedClass = task.completed ? 'task-completed' : '';
        
        let dueDateHtml = '';
        if (task.dueDate) {
            const isOverdue = task.dueDate < new Date() && !task.completed;
            const isToday = task.dueDate.toDateString() === new Date().toDateString();
            const dateClass = isOverdue ? 'text-red-600' : isToday ? 'text-orange-600' : 'text-gray-600';
            const dateText = isOverdue ? 'Overdue' : isToday ? 'Due today' : task.dueDate.toLocaleDateString();
            dueDateHtml = `
                <div class="flex items-center space-x-1 ${dateClass}">
                    <i data-lucide="${isOverdue ? 'alert-triangle' : 'calendar'}" class="h-4 w-4"></i>
                    <span>${dateText}</span>
                </div>
            `;
        }
        
        const tagsHtml = task.tags.length > 0 ? `
            <div class="flex items-center space-x-1">
                <i data-lucide="tag" class="h-4 w-4 text-gray-400"></i>
                <span class="text-gray-600">${task.tags.slice(0, 2).join(', ')}${task.tags.length > 2 ? ` +${task.tags.length - 2}` : ''}</span>
            </div>
        ` : '';
        
        return `
            <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 ${completedClass} ${priorityClass}">
                <div class="flex items-start space-x-3">
                    <button id="toggle-${task.id}" class="mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 hover:border-blue-500'}">
                        ${task.completed ? '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>' : ''}
                    </button>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <h3 class="text-lg font-medium text-gray-900 ${task.completed ? 'line-through opacity-60' : ''}">${task.title}</h3>
                                ${task.description ? `<p class="mt-1 text-sm text-gray-600 ${task.completed ? 'line-through opacity-60' : ''}">${task.description}</p>` : ''}
                            </div>
                            <div class="flex items-center space-x-2 ml-4">
                                <button id="edit-${task.id}" class="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100" title="Edit task">
                                    <i data-lucide="edit" class="h-4 w-4"></i>
                                </button>
                                <button id="delete-${task.id}" class="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100" title="Delete task">
                                    <i data-lucide="trash-2" class="h-4 w-4"></i>
                                </button>
                            </div>
                        </div>
                        <div class="mt-3 flex items-center space-x-4 text-sm">
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${this.getPriorityColor(task.priority)}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                            ${category ? `<div class="flex items-center space-x-1"><span>${category.icon}</span><span class="text-gray-600">${category.name}</span></div>` : ''}
                            ${dueDateHtml}
                            ${tagsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getPriorityColor(priority) {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50';
            case 'medium': return 'text-yellow-600 bg-yellow-50';
            case 'low': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    }
    
    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const overdueTasks = this.tasks.filter(task => task.dueDate && task.dueDate < new Date() && !task.completed).length;
        const dueTodayTasks = this.tasks.filter(task => task.dueDate && task.dueDate.toDateString() === new Date().toDateString() && !task.completed).length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        const statsContainer = document.getElementById('stats');
        statsContainer.innerHTML = `
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <div class="p-2 rounded-md text-blue-600 bg-blue-50">
                        <i data-lucide="calendar" class="h-5 w-5"></i>
                    </div>
                    <div>
                        <p class="text-2xl font-semibold text-gray-900">${totalTasks}</p>
                        <p class="text-sm text-gray-600">Total Tasks</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <div class="p-2 rounded-md text-green-600 bg-green-50">
                        <i data-lucide="check-circle" class="h-5 w-5"></i>
                    </div>
                    <div>
                        <p class="text-2xl font-semibold text-gray-900">${completedTasks}</p>
                        <p class="text-sm text-gray-600">Completed</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <div class="p-2 rounded-md text-orange-600 bg-orange-50">
                        <i data-lucide="clock" class="h-5 w-5"></i>
                    </div>
                    <div>
                        <p class="text-2xl font-semibold text-gray-900">${dueTodayTasks}</p>
                        <p class="text-sm text-gray-600">Due Today</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <div class="p-2 rounded-md text-red-600 bg-red-50">
                        <i data-lucide="alert-triangle" class="h-5 w-5"></i>
                    </div>
                    <div>
                        <p class="text-2xl font-semibold text-gray-900">${overdueTasks}</p>
                        <p class="text-sm text-gray-600">Overdue</p>
                    </div>
                </div>
            </div>
            ${totalTasks > 0 ? `
                <div class="mt-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Progress</span>
                        <span class="text-sm text-gray-600">${completionRate}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: ${completionRate}%"></div>
                    </div>
                </div>
            ` : ''}
        `;
        
        // Re-initialize icons for the new content
        if (window.lucide) {
            lucide.createIcons();
        }
    }
    
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
        } else {
            form.reset();
            document.getElementById('task-priority').value = 'medium';
            document.getElementById('task-category').value = this.categories[0]?.id || '';
        }
        
        modal.classList.remove('hidden');
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
            tags: document.getElementById('task-tags').value
        };
        
        if (!formData.title) return;
        
        if (this.editingTask) {
            this.updateTask(this.editingTask.id, {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                category: formData.category,
                dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
            });
        } else {
            this.addTask(formData);
        }
        
        this.closeModal();
    }
    
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

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
