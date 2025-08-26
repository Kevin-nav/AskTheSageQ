# GEMINI.md

## Project Overview

This is a Next.js project bootstrapped with `create-next-app`. It is a web dashboard application for administrative purposes, built with TypeScript, Tailwind CSS, and a rich set of UI components from Radix UI and `lucide-react`. The dashboard features data visualization using `recharts`, and it is designed to be responsive and accessible.

The application is structured with a main landing page and a comprehensive admin section. The admin dashboard is equipped with a versatile data table, a collapsible sidebar, and various UI components for managing and monitoring data. The project also includes custom hooks for handling asynchronous operations and security, indicating a focus on robustness and reliability.

## Building and Running

To get the development environment running, use the following commands:

```bash
npm install
npm run dev
```

This will start the development server, typically on `http://localhost:3000`.

Other available scripts:

*   `npm run build`: Creates a production build of the application. Note that the build process is configured to ignore ESLint and TypeScript errors.
*   `npm run start`: Starts a production server.
*   `npm run lint`: Lints the codebase for errors and style issues.

## Key Components & UI

*   **`AdminDataTable`**: A reusable and feature-rich data table component that supports pagination, sorting, searching, and various states (empty, loading, error). It is a central piece of the admin dashboard.
*   **`Sidebar`**: A highly customizable and responsive sidebar component with collapsible states, mobile support, and keyboard shortcuts. It provides the main navigation for the application.
*   **UI Components**: The project utilizes a wide range of UI components from `components/ui`, likely based on `shadcn/ui`. These components ensure a consistent and modern user interface.

## Custom Hooks & Client-Side Logic

*   **`useAsyncOperation`**: A custom hook for managing asynchronous operations. It includes features like automatic retries, error handling, and loading state management, which helps in building a resilient UI.
*   **`useSecurity`**: A hook that provides essential security features, including CSRF token generation, session management, and input validation utilities. This indicates a proactive approach to security.
*   **`useNetworkStatus`**: A utility hook to monitor the user's network connectivity and adapt the application's behavior accordingly.

## Development Conventions

*   **Styling**: The project uses Tailwind CSS for utility-first styling. Custom styles are defined in `app/globals.css`.
*   **Components**: The project follows a component-based architecture. Reusable UI components are located in the `components/` directory.
*   **State Management**: The application likely uses React's built-in state management (useState, useReducer, Context API), supplemented by custom hooks for managing component-level and cross-component state.
*   **Linting**: The project is configured with ESLint for code quality and consistency, as indicated by the `next lint` script in `package.json`.
*   **Path Aliases**: The project uses the `@/*` path alias for cleaner and more maintainable imports.