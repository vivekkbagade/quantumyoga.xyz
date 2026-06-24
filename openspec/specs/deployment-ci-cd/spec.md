# Deployment & CI/CD Specification

## Overview
This specification details the deployment architecture, configuration parameters, and CI/CD automated pipeline for the Quantum Yoga platform. It covers local dev server behavior, production Express configurations, PM2 process management, and GitHub Actions workflow execution.

---

## Deployment Architecture

### 1. Environments
*   **Local Development:** Vite dev server proxying backend requests to local Express middlewares (CORS-free integration testing).
*   **Production VM:** Node.js Express server running under PM2 serving Vite-compiled static assets and handling production database / integration APIs.

### 2. Process Flow & CI/CD Orchestration
```
Developer Push to Git
  ├── GitHub Actions CI Job (ubuntu-latest)
  │     ├── Install npm dependencies (npm ci)
  │     ├── Run test verification (npm test)
  │     └── Compile Vite static bundle (npm run build)
  └── GitHub Actions CD Job
        ├── Transfer production bundle via SCP
        └── SSH VM commands:
              ├── Safely check/initialize db.json template
              ├── Clean up old PM2 processes
              ├── Install production dependencies
              └── Restart PM2 app (quantum-yoga)
```

---

## Capabilities & Implementation Details

### 1. Build Compilation
*   **Assets Target Directory:** `dist/` containing optimized JS modules, CSS styling stylesheets, and hashed image assets.
*   **Vite Configurations:** Defined in [vite.config.js](file:///d:/QuantumYogaWebsite/vite.config.js).

### 2. VM Deployment & SSH Authentication
*   **Secrets Dependency:**
    *   `VM_SSH_IP`: VM Server public hostname/IP.
    *   `VM_SSH_USER`: SSH login username.
    *   `VM_SSH_KEY`: Secure private SSH credential.
    *   `VM_DEPLOY_PATH`: Absolute destination path.
*   **Artifacts Package Content:** `dist/`, `server.js`, `package.json`, `package-lock.json`, `ecosystem.config.cjs`, client assets (`app.js`, `data.js`, `index.css`, `index.html`, image assets).

### 3. Database State Persistence
*   **Handling `db.json`:** To preserve database updates on the VM, the raw `db.json` file is transferred as `db.json.template` and initialized only if no active `db.json` file is present.

### 4. PM2 Process Manager Configuration
*   Managed via [ecosystem.config.cjs](file:///d:/QuantumYogaWebsite/ecosystem.config.cjs).
*   **Process Name:** `quantum-yoga`
*   **Script Target:** `server.js`
*   **Process Monitoring:** Configured for auto-restart, production flag, log integration, and automatic memory limit restarts (1GB limit).
