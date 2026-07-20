# AGENT.md - Project Maintenance & Architecture Guide

Welcome to the **rclone-webui-angular** project! This repository contains an Angular-based Web UI for managing [rclone](https://rclone.org/) remote control endpoints (`rclone rcd`).

---

## 1. Project Overview

- **Name**: `rclone-webui-angular`
- **Current Framework Version**: Angular 22 (Upgraded from v16, using Standalone Component & API Architecture)
- **Primary Purpose**: Managing rclone remotes, backends, file exploration, job transfers, mounts, cron jobs, and serve instances via rclone's HTTP Remote Control API (`rclone rcd`).
- **Core Technology Stack**:
  - **Framework**: Angular 22 (Standalone APIs / RxJS)
  - **UI Library**: Angular Material 22 & CDK
  - **HTTP Communication**: Angular `HttpClient` interacting with `rclone` RC API
  - **Testing**: Vitest + jsdom (Migrated from Karma/Jasmine)
  - **Linting & Formatting**: ESLint, Prettier

---

## 2. Project Directory Structure

```
rclone-webui-angular/
├── docs/                      # Documentation assets & guides
├── src/
│   ├── app/
│   │   ├── cores/             # Core singletons and fundamental infrastructure
│   │   │   ├── not-found/     # 404 handler
│   │   │   ├── remote-control/# Rclone RC connection & communication services
│   │   │   └── storage/       # Local storage abstraction
│   │   ├── features/          # Feature standalone components & routes
│   │   │   ├── connection/    # Remote connection editor, list, and routes
│   │   │   ├── dashboard/     # Status dashboard & summary
│   │   │   └── functions/     # Rclone operations & sub-routes
│   │   │       ├── backend/   # Backend / remote management & routes
│   │   │       ├── cron/      # Scheduled tasks
│   │   │       ├── explorer/  # File browser / transfers
│   │   │       ├── job/       # Async job monitoring
│   │   │       ├── mount/     # Remote mount management
│   │   │       └── serve/     # Serve protocol management
│   │   ├── shared/            # Shared pipes, directives, and utility components
│   │   ├── app.config.ts      # Global application providers
│   │   └── app.routes.ts      # Global standalone application routes
│   ├── assets/                # Static assets & icons
│   ├── environments/          # Build environment configs
│   ├── locale/                # i18n translation files
│   ├── index.html
│   ├── main.ts                # Application standalone bootstrap
│   └── styles.scss            # Global styling
├── angular.json               # Angular CLI configuration
├── package.json               # Project dependencies and npm scripts
├── tsconfig.json              # TypeScript compilation configuration
└── vitest.config.ts           # Vitest testing configuration
```

---

## 3. Core Architecture & Key Services

1. **`RemoteControlService` (`src/app/cores/remote-control/remote-control.service.ts`)**:
   - Central HTTP gateway for invoking rclone `rc` endpoints (`/rc/...` or operation routes like `operations/list`).
   - Responsible for setting basic HTTP authorization headers and parsing response payloads.
2. **`ConnectionService` (`src/app/cores/remote-control/connection.service.ts`)**:
   - Manages active and stored rclone connection credentials in local storage (`StorageService`).
3. **Features Breakdown**:
   - **Backend**: List, inspect, create, and delete rclone remotes/backends.
   - **Explorer**: Navigate remote file systems, download/upload, copy/move files.
   - **Job**: Track running rclone asynchronous tasks and execution stats.
   - **Mount / Serve / Cron**: Interact with `mount/mount`, `serve/...`, and scheduled tasks.

---

## 4. Development Workflow & Scripts

- **Install Dependencies**: `npm install`
- **Start Dev Server** (Angular only): `npm run start:angular`
- **Start Dev Server with Local Rclone**: `npm run start` (starts rclone rcd on port 5572 and ng serve)
- **Build Applications**:
  - `npm run build:standalone` - Standalone web build
  - `npm run build:embed` - Embedded rclone GUI build
  - `npm run build:native` - Native wrapper build
- **Linting & Formatting**:
  - `npm run lint` (runs ESLint & Prettier checks)
  - `npm run lint:eslint`
  - `npm run lint:prettier`
- **Testing**: `npm run test` (Runs tests via Vitest)

---

## 5. Completed Modernization & Refactoring Milestones

1. ✅ **Error Handling Architecture Upgrade**:
   - Removed custom Rust-like `Result<R, E>` (`src/app/shared/result.ts`).
   - Standardized on native JavaScript `Error` throwing, `async/await try-catch`, and RxJS error handling.
   - Fixed multiple components (`connection`, `dashboard`, `backend`, `explorer`, `job`) to properly catch promise rejections and present errors via `MatSnackBar` notifications rather than letting them fail silently.
2. ✅ **Framework & Dependencies Upgrade**:
   - Upgraded Angular from v16 -> v17 -> v18 -> v19 -> **v22 (latest stable)**.
   - Upgraded `@angular/material` and `@angular/cdk` to v22.
   - Upgraded typescript to 6.0+ and eslint to 9.21+.
   - Cleaned up `.npmrc` by removing `legacy-peer-deps=true` and resolving all peer dependency conflicts.
3. ✅ **Full Standalone API Migration**:
   - Migrated all components to standalone components.
   - Eliminated `AppModule`, `AppRoutingModule`, and all feature/routing `*.module.ts` files (21 NgModules removed in total).
   - Replaced routing with modern `provideRouter()` in [app.config.ts](file:///home/yu/rclone-webui-angular/src/app/app.config.ts) and defined lazy-loaded standalone routing configurations using `Routes` in `*.routes.ts` files.
4. ✅ **Vitest Test Suite Migration**:
   - Migrated testing framework from Karma/Jasmine to Vitest, successfully running all 129 tests in headless mode.

---

## 6. Future Architecture & Feature Plan

1. **New Control Flow Syntax Migration**:
   - Migrate Angular templates from `*ngIf` and `*ngFor` to Angular native `@if` and `@for` control flow block syntax for improved performance and readability.
2. **Global Error Interceptor / Toast Service**:
   - Create a global `ErrorHandler` / HTTP Interceptor to catch unhandled errors gracefully and display unified error toasts.
3. **Reactive State with Signals**:
   - Migrate core state (such as connection status and remote list) to Angular Signals for fine-grained reactivity.
