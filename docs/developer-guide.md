# <center>EcoRoute – Developer Guide</center>
<details>
  <summary><h3>Frontend Dev Guide<h3></summary>

## Project Overview
The frontend web application built using:
- React 19
- TypeScript
- Vite
- Material UI (MUI)
- React Router
- React Query
- Zustand
- Axios
- Leaflet

Currently, the project is in its initial setup state with default Vite configuration and folder structure. Feature implementation has not started yet.

---
## Prerequisite
Before running this project, ensure you have:
-  **Node.js** (v18 or later recommended).
-  **npm** (comes with Node.js).
- Git.

```
node -v
npm -v
```
## Installation
### Clone Repository
```
git clone https://github.com/jeff-sparrow/EcoRoute.git
cd EcoRoute
```
### Navigate to Frontend directory
```
cd client
```
### Install Dependencies
> Dependencies are defined in `package.json`.
```
npm install
```
### Run Development server
```
npm run dev
```
App will run at `http://localhost:5173/`

## Available Scripts
- `npm run dev` <br> Start development server using Vite.
- `npm run build` <br> Build project for production.
- `npm run preview` <br> Previews the production build.
- `npm run lint` <br> Run ESLint to check code quality.

## Project Structure
```
client/
│
├── public/              # Static files
├── src/
│   ├── assets/          # Images, icons, static resources
│   ├── components/      # Reusable UI components
│   ├── pages/           # Application pages
│   ├── services/        # API call and external services
│   ├── App.tsx          # Root component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
│
├── index.html           # Main HTML file
├── package.json         # Project configuration and dependencie
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration

```
## State Management (In Progress)
- **Zustand** for global state management.
- **React Query** for server state management and API caching.<br>

## Routing (In Progress)
Routing will be handled inside `App.tsx`.

## API Integration (In Progress)
- Axios installed for HTTP requests.
- API call and external services should implement inside
```
src/services/
```
## Map Integration (In Progress)
- Leaflet and React-Leaflet are installed.

## UI Framework
- Material UI (MUI) used for UI components.

## Current Status
- **Project Status**: Initial Setup Complete
- **Feature Implementation**: Not Started

> <center><h3>Guide will updated as development progresses.</h3></center>
</details>