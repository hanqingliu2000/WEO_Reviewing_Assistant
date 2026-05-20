# Work Computer Stack Smoke Test And Compatibility Notes

## Purpose

This document records the minimum work-computer tests for the selected frontend stack. The goal is to understand whether reviewer/developer machines can install, build, or run the planned local app.

Primary stack under test:

- Node.js
- npm
- React + Vite + TypeScript
- Tailwind / shadcn-compatible CSS tooling
- ECharts
- TanStack Table
- Zustand
- localhost browser access

Future packaging candidates:

- Electron
- Tauri

## Current Result

Test date:

```text
2026-05-20
```

Observed versions:

```text
Node version: v24.15.0
npm version: 11.21.1
Git version: 2.54.0.windows.1
```

Confirmed:

- Node is available.
- npm is available.
- Git is available.
- npm package installation works.
- React can install.
- Vite/TypeScript can install.
- ECharts can install.
- TanStack Table can install.
- Zustand can install.

Blocked:

- `npx --yes vite --version`
- `npm exec -- vite --version`
- `npm run` scripts that execute the local Vite binary

Observed error:

```text
Access denied / IT policy popup when executing Vite binary.
```

Interpretation:

- Package installation is not the main blocker.
- Runtime/build execution of package-provided binaries is the blocker.
- The work computer is currently not viable for normal Vite development unless IT approves local package binary execution.

## Important Deployment Implication

Reviewer machines do not necessarily need to build the frontend.

Preferred separation:

```text
Build machine
  npm install
  npm run build
  produce frontend/dist

Reviewer work computer
  run Flask
  Flask serves prebuilt frontend/dist
  browser opens localhost
```

Frontend build is needed when frontend code changes. It is not needed for every data refresh, country submission, or validation result update.

## Remaining Tests

### Plain Local HTML

Test whether the browser can open a local HTML file with JavaScript and `localStorage`.

Expected answer:

- Can local file open?
- Does JavaScript run?
- Does `localStorage` persist after refresh?

### Plain Node Localhost

Test whether a simple Node HTTP server can run without npm package binaries:

```bash
node -e "require('http').createServer((req,res)=>res.end('local ok')).listen(5173,'127.0.0.1',()=>console.log('http://127.0.0.1:5173'))"
```

Expected answer:

- Can the server start?
- Can the browser open `http://127.0.0.1:5173`?
- Is there a firewall or IT policy popup?

### Flask Localhost

Test whether Flask can run locally and serve a simple route.

Expected answer:

- Can Python run?
- Can Flask install or is it already available?
- Can Flask bind to localhost?
- Can the browser open the Flask URL?

### Prebuilt Static Frontend

Build a tiny Vite app on an unrestricted machine and copy `dist/` to the work computer.

Test:

- direct `dist/index.html` open,
- Flask serving `dist/`,
- JavaScript bundle loading,
- localStorage behavior.

## IT Questions

Ask IT whether one of these paths is available:

- approval for project-local `node_modules/.bin/vite`,
- internal approved build machine,
- approved CI runner,
- internal npm registry or package mirror,
- approved static hosting,
- approved Python/Flask runtime,
- approved desktop packaging process.

Suggested framing:

```text
Reviewer machines do not need to run npm or Vite. We need one approved environment to build static frontend files from React/Vite source, and reviewer machines need an approved way to run Flask or open the served local app.
```

## Current Recommendation

Do not change the frontend stack yet.

Proceed with React/Vite development on an unrestricted machine. Treat work computers as runtime targets until IT clarifies approved build and deployment paths.
