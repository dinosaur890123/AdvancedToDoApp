# Advanced Todo Application

A modern, feature-rich todo application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- ✅ **Task Management**: Create, edit, delete, and mark tasks as complete
- 🏷️ **Categories & Tags**: Organize tasks with customizable categories and tags
- 🎯 **Priority Levels**: Set task priorities (low, medium, high) with visual indicators
- 📅 **Due Dates**: Set due dates with overdue and today indicators
- 🔍 **Search & Filter**: Advanced filtering by status, category, priority, and search
- 📊 **Statistics**: Track progress with completion rates and task metrics
- 🌙 **Dark Mode**: Toggle between light, dark, and system themes
- 📱 **Responsive**: Fully responsive design for all devices
- 💾 **Local Storage**: Automatic data persistence in browser storage

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Data Persistence**: Local Storage

## Project Structure

```
src/
├── app/                # Next.js app directory
│   ├── globals.css     # Global styles and Tailwind imports
│   ├── layout.tsx      # Root layout with theme provider
│   └── page.tsx        # Main application page
├── components/         # React components
│   ├── filter-bar.tsx  # Search and filtering controls
│   ├── header.tsx      # Application header
│   ├── sidebar.tsx     # Category navigation
│   ├── task-form.tsx   # Task creation/editing form
│   ├── task-item.tsx   # Individual task component
│   ├── task-list.tsx   # Task list container
│   ├── task-stats.tsx  # Statistics display
│   └── theme-provider.tsx # Theme context provider
├── lib/                # Utility functions
│   ├── storage.ts      # Local storage operations
│   └── utils.ts        # Helper functions
└── types/              # TypeScript type definitions
    └── index.ts        # Application types
```

## Usage

### Creating Tasks

1. Click the "Add Task" button in the header
2. Fill in the task details:
   - **Title**: Required task name
   - **Description**: Optional task description
   - **Priority**: Low, Medium, or High
   - **Category**: Select from predefined categories
   - **Due Date**: Optional deadline
   - **Tags**: Comma-separated tags

### Managing Tasks

- **Complete**: Click the checkbox to mark as complete
- **Edit**: Click the edit icon to modify task details
- **Delete**: Click the delete icon to remove the task

### Filtering and Search

- **Search**: Use the search bar to find tasks by title, description, or tags
- **Filter by Status**: All, Active, Completed, or Overdue
- **Filter by Category**: Select specific categories
- **Filter by Priority**: Filter by priority level
- **Sort**: Sort by due date, priority, creation date, or title

### Categories

Default categories include:
- 💼 Work
- 🏠 Personal
- 🛒 Shopping
- 🏥 Health
- 📚 Learning

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
