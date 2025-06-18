<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is an advanced to-do list application built with Next.js 14, TypeScript, and Tailwind CSS.

## Project Structure

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **State Management**: React hooks with local storage persistence
- **UI Components**: Custom components using Tailwind CSS
- **Icons**: Lucide React icons

## Key Features

- ✅ Task management with CRUD operations
- 🏷️ Categories and tags
- 🎯 Priority levels (low, medium, high)
- 📅 Due dates with overdue detection
- 🔍 Search and filtering
- 📊 Task statistics and progress tracking
- 🌙 Dark/light mode theme switching
- 📱 Responsive design
- 💾 Local storage persistence

## Component Architecture

- **Layout**: Main app layout with theme provider
- **Header**: Navigation, theme toggle, add task button
- **Sidebar**: Category navigation and filtering
- **TaskStats**: Progress overview and metrics
- **FilterBar**: Search, sort, and filter controls
- **TaskList**: List of task items
- **TaskItem**: Individual task display with actions
- **TaskForm**: Modal form for creating/editing tasks

## Development Guidelines

- Use TypeScript for type safety
- Follow React hooks patterns
- Implement responsive design with Tailwind CSS
- Maintain clean component architecture
- Use proper error handling
- Ensure accessibility with semantic HTML
- Optimize for performance and user experience
