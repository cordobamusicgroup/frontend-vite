# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `pnpm run dev` - Start development server with React Router dev mode
- `pnpm run build` - Build production version with React Router
- `pnpm run lint` - Run ESLint on TypeScript files
- `pnpm run preview` - Build and preview the production version

### Package Management
- Uses `pnpm` as package manager (required version: 10.6.0+)
- `pnpm install` - Install dependencies

## Project Architecture

### Core Technology Stack
- **React 19** with TypeScript for UI components
- **React Router v7** for client-side routing (SSR: false)
- **Material-UI v7** with styled-components for theming
- **React Query (TanStack Query)** for server state management
- **Zustand** for client state management
- **React Hook Form** with Yup/Zod for form validation
- **Axios** for HTTP requests
- **Vite** for build tooling
- **Cloudflare Workers** deployment target

### Project Structure
- `src/` - Main source directory with `@/` path alias
- `src/components/` - Reusable UI components (atoms, molecules, organisms)
- `src/modules/` - Feature-based modules (auth, admin, user, portal)
- `src/stores/` - Zustand state management stores
- `src/hooks/` - Custom React hooks
- `src/routes/` - Routing configuration and route protection
- `src/lib/` - Utility functions and helpers
- `src/constants/` - Application constants and enums

### Module Architecture
The app follows a feature-based modular structure:

#### Authentication (`src/modules/auth/`)
- Handles login, password reset, and session management
- Uses JWT tokens with automatic refresh mechanism
- AuthProvider context wraps the entire app for global auth state

#### User Features (`src/modules/user/`)
- **Financial**: Payments operations, reports viewing, balances
- **Distribution**: DMB submission quality control
- **Account Settings**: Profile management, payment information

#### Admin Features (`src/modules/admin/`)
- **Clients**: CRUD operations for client management
- **Labels**: CRUD operations for music labels
- **Users**: User administration and role management
- **Financial Reports**: Unlinked reports management

### State Management Pattern
- **Zustand stores** for client state (auth, user data, notifications, loading states)
- **React Query** for server state caching and synchronization
- **AuthProvider** centralizes authentication logic and token refresh

### Routing Architecture
- File-based routing with React Router v7
- Role-based route protection using `RoleProtectedRoute`
- Nested layouts: `RootLayout` > `BackofficeLayout`/`AuthLayout`
- Route definitions in `src/routes.ts` with TypeScript configuration

### Component Architecture
- **Atomic Design**: atoms, molecules, organisms structure
- **Layout Components**: RootLayout wraps global providers (QueryClient, Auth, Theme)
- **Form Components**: React Hook Form integration with Material-UI
- **Table Components**: AG-Grid integration for data tables

### Key Patterns
- Custom hooks for API requests (`useApiRequest`)
- Centralized error handling and notifications
- Form validation with Yup schemas
- TypeScript path aliases (`@/` for `src/`)
- Cookie-based token storage with automatic refresh

### Configuration Notes
- TypeScript strict mode enabled with additional safety checks
- ESLint configured for React hooks and TypeScript
- Vite with React SWC for fast builds
- Material-UI theme customization in `src/theme.ts`