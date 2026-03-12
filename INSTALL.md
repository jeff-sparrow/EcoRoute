# EcoRoute – Installation Guide

## 1. Overview

EcoRoute is a web-based navigation application that helps users choose environmentally friendly routes between two locations.

This document explains how to **access and run the EcoRoute application**.

---

# 2. Live Application (Recommended)

The easiest way to use EcoRoute is through the deployed application.

Frontend URL:

```
https://eco-client-sandy.vercel.app/
```

Users can access the application directly using a modern web browser.

Supported browsers:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari

No installation is required for normal users.

---
## Login Credentials For Test
- test@testmail.com
- testpass
# 3. Running the Application Locally

Developers or advanced users may run the application locally.

## Prerequisites

Install the following software before running EcoRoute:

* Node.js (v18 or later)
* npm (comes with Node.js)
* Git

Verify installation:

```
node -v
npm -v
git --version
```

---

# 4. Clone the Repository

```
git clone https://github.com/jeff-sparrow/EcoRoute.git
cd EcoRoute
```

---

# 5. Navigate to Frontend

```
cd client
```

---

# 6. Install Dependencies

Install all required packages listed in `package.json`.

```
npm install
```

---

# 7. Environment Configuration

EcoRoute uses environment variables to connect to external services such as routing APIs and backend services.

Create a `.env` file inside the **client** directory.

Example:

```
client/.env
```

Add the following configuration:

```
VITE_ORS_API_KEY= Register to get API_KEY https://account.heigit.org/signup
VITE_BACKEND_URL=https://ecoserver-3v5x.onrender.com
```

### Environment Variables

| Variable         | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| VITE_ORS_API_KEY | API key for OpenRouteService used to generate routes         |
| VITE_BACKEND_URL | Backend server URL used for route storage and authentication |

---

# 8. Start Development Server

Run the following command:

```
npm run dev
```

The application will start at:

```
http://localhost:5173
```

Open the URL in your browser to use EcoRoute.

---

# 9. Changing Development Port

The development server port can be changed in the **vite.config.ts** file.

Example configuration:

```
export default defineConfig({
  server: {
    port: 3000
  }
})
```

After changing the port, restart the development server:

```
npm run dev
```

The application will then run on:

```
http://localhost:3000
```

---

# 10. Available Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| npm run dev     | Start development server |
| npm run build   | Build production version |
| npm run preview | Preview production build |
| npm run lint    | Run ESLint code checks   |

---

# 11. Project Dependencies

Main libraries used in this project:

* React
* TypeScript
* Vite
* Material UI
* React Router
* React Query
* Zustand
* Axios
* Leaflet

These dependencies are automatically installed using:

```
npm install
```

---

# 12. Troubleshooting

## Port Already in Use

If port `5173` is already in use:

```
npm run dev -- --port 3000
```

---

## Node Not Recognized

Check Node installation:

```
node -v
npm -v
```

If Node is not installed, download it from:

```
https://nodejs.org/
```

Install the **LTS version**.

---

# 13. Support

If you encounter issues:

1. Visit the GitHub repository
2. Open the **Issues** tab
3. Create a new issue describing the problem

Repository:

```
https://github.com/jeff-sparrow/EcoRoute
```
