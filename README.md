# Ledger

A modern, client-side web application built with React and TypeScript to manage and track personal expenses. The application operates entirely in the browser using localStorage, ensuring complete data privacy and immediate usability without the need for a backend or database setup.

## Features

- **Transaction Management**: Comprehensive tracking for both **Income** and **Expense** transactions. Complete CRUD operations supported.
- **Custom Currencies**: Built-in support for 10+ global currencies. Switch seamlessly and have your entire dashboard, forms, and PDF exports adapt to your preferred currency.
- **Recurring Transactions**: Automate your finances. Setup recurring rules (Daily, Weekly, Monthly) and let the app generate transactions automatically on the due dates.
- **Dashboard & Analytics**: Interactive Pie and Bar charts visualizing expense distributions, income vs. expense flow, and trends over time.
- **Budget Tracking**: Set monthly budget limits with dynamic progress bars alerting you when your expenses approach the limit.
- **Advanced Filtering**: Search by transaction name, and filter globally by date range (Today, 7 Days, This Month, All Time).
- **Data Portability (Import/Export)**: 
  - **JSON Backup/Restore**: Export your local data securely as a `.json` backup file or import existing ones.
  - **CSV Export**: Export transactions to CSV format for use in spreadsheet software like Excel or Google Sheets.
  - **PDF Reports**: Download beautifully formatted PDF summaries with custom scopes (Income Only, Expense Only, or All Transactions).
- **Modern UI & Navbar**: A clean, fully responsive design featuring a sticky Top Navigation Bar, mobile-friendly dropdowns, and optimized touch targets. Built to work perfectly on any screen size.
- **PWA Support**: Installable as a Progressive Web App (PWA) for desktop and mobile devices, supporting offline functionality.
- **Multi-Language Support (i18n)**: Fully translated into 6 languages (English, Indonesian, Spanish, Japanese, Chinese, Arabic) with automatic language detection.
- **Persistent Local Storage**: Operates entirely client-side. Data is automatically saved to and retrieved from the browser's `localStorage` ensuring absolute privacy.
- **Theming (Light/Dark Mode)**: Supports Light, Dark, and System theme preferences utilizing Tailwind CSS, featuring glassmorphism design principles and smooth transitions.

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
- /src/hooks: Custom React hooks (e.g., useTransactions, useRecurring, useTheme) to manage state and delegate tasks to the service layer.
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