# Ledger

A modern, client-side web application built with React and TypeScript to manage and track personal expenses. The application operates entirely in the browser using localStorage, ensuring complete data privacy and immediate usability without the need for a backend or database setup.

## Features

- Expense Categorization: Separate tracking for Daily Spend (routine expenses) and Big Spend (large or incidental expenses).
- Complete CRUD Operations: Create, read, update, and delete expense entries seamlessly.
- Automatic Calculation: Real-time calculation and display of total expenses for each category.
- Dashboard & Analytics: Interactive Pie and Bar charts visualizing expense distributions and trends over the last 7 days.
- Budget Tracking: Set monthly budget limits with dynamic progress bars alerting you when limits are approached.
- Advanced Filtering: Search by expense name and filter globally by date range (Today, 7 Days, This Month, All Time).
- Data Portability (Backup/Restore): Export your local data securely as a `.json` backup file or import existing ones.
- PDF Export: Download summaries of all expenses or specific categories (Daily/Big spend) as PDF documents.
- PWA Support: Installable as a Progressive Web App (PWA) for desktop and mobile devices, supporting offline functionality.
- Multi-Language Support (i18n): Fully translated into 6 languages (English, Indonesian, Spanish, Japanese, Chinese, Arabic) with automatic language detection.
- Pagination: Built-in pagination for expense lists to manage large datasets efficiently (configured to 5 items per page).
- Persistent Storage: Data is automatically saved to and retrieved from the browser's localStorage, ensuring no data is lost upon page refresh or browser restart.
- Theming (Light/Dark Mode): A responsive, professional UI supporting Light, Dark, and System theme preferences utilizing Tailwind CSS, featuring glassmorphism design principles and smooth animations.

## Tech Stack

- Framework: React 18 (setup via Vite)
- Language: TypeScript
- Styling: Tailwind CSS
- Charts & PDF: Recharts, jsPDF, jspdf-autotable
- Internationalization: i18next, react-i18next
- PWA & Build Tools: vite-plugin-pwa, Vite Manual Chunks
- Icons: Lucide React
- State Management & Storage: React Hooks combined with standard Web Storage API (localStorage)

## Architecture Overview

The project follows a clean, layered architecture adhering to SOLID, DRY, and KISS principles:

- /src/constants: Centralized application configuration and constants.
- /src/types: TypeScript interfaces and type definitions.
- /src/utils: Pure utility functions for local storage operations, input validation, and data formatting.
- /src/services: Core business logic separated from the UI layer.
- /src/hooks: Custom React hooks (e.g., useSpendItems) to manage state and delegate tasks to the service layer.
- /src/components: Modular and reusable presentation components (Forms, Lists, Cards).

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Navigate to the project directory:
   ```bash
   cd ledger
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit the local URL provided in the terminal (usually http://localhost:5173).

### Building for Production

To create a production-ready build, run:

```bash
npm run build
```

This will compile the TypeScript code and bundle the application into the `dist` directory.