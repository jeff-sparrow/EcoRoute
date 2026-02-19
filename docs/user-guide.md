# <center>EcoRoute – User Guide</center>
## 1. Overview
EcoRoute is a web-based application which helps urban commuters choose the most environmentally friendly way to travel. Traditional navigation apps prioritize speed, EcoRoute ranks routes based on **lowest carbon emissions**.

EcoRoute allows users to:
-  Compare multiple transportation options.**(in progress)**  
-  View estimated CO₂ emissions for each route. **(in progress)**
-  Choose greener options based on personal preference. **(in progress)**

## 2. Requirements
To use EcoRoute locally, ensure you have:
-  **Node.js** (v18 or later recommended).
-  **npm** (comes with Node.js).
-  **Modern web browser** (Chrome, Edge, Firefox).

## 3. Installation Instructions
Follow these steps to install EcoRoute locally:

### Step 1: Clone Repository
```
git clone https://github.com/jeff-sparrow/EcoRoute.git
cd EcoRoute
```
### Step 2: Navigate to Frontend
```
cd client
```
### Step 3: Install Dependencies
```
npm install
```
## 4: Run App
> After installation, start the development server
```
npm run dev
```
> You should see output like:<br> Local: `http://localhost:5173/`

Open the provided url in your browser.

## 5: How to use EcoRoute
### Step 1: Enter Location
-  Enter **Start Location**
-  Enter **End Location**

### Step 2: Click **Search**
System will generate route options ranked by lowest carbon emissions.
### Step 3: Review Route Options
Each route displays:
-  Transport Mode(e.g. Bus, Bike, Car).
-  Estimated travel time.
-  Estimated CO<sub>2</sub> emissions.

### Step 4: Select Route
After review route information, user decide which commute best matches with their sustainability goals.

## 6. Features (In Progress)
### Frontend
- Route search interface
- Mock route results display
- Basic carbon emission comparison
- Responsive layout (mobile-first design)

### Backend 
- Backend routing API integration
- Real-time transit data (GTFS)
- Weather and air quality integration
- Multi-modal optimization
- Carbon savings dashboard

## 7. Report Bugs
1. Go to GitHub repository.
2. Click on **Issues**.
3. Create a new issue including:
    - Steps to reproduce.
    - Expected (behavior).
    - Actual (behavior).
    - Screenshot (if applicable).
    - Browser and Operating System.

**Example**
```
Title: Route result not displaying after search

Steps:
1. Enter start location
2. Enter destination
3. Click search
4. No results appear

Expected: Route options display
Actual: Page remains blank
```
## 8. Known Limitation
- Backend integration **(in progress)**.
- Real-time transit (GTFS) data **(in progress)**.
- Weather and air quality integration **(in progress)**.
- Carbon values mock data for MVP testing **(in progress)**.
- Mobile layout improvements **(in progress)**.

## 9. Troubleshooting
**Issue**: npm command not recognized
To ensure **Node.js** is properly installed
```
node -v
npm -v
```
If not installed<br>

- [Visit Official Node.js Website](https://nodejs.org/en)
- Download the LTS (Long Term Support) version. This version is stable and recommended for most users.

**Issue**: Port 5173 already in use
```
npm run dev -- --port 3000
```
**Issue**: On Windows OS
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system. For
more information, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.
At line:1 char:1
+ npm create vite@latest client
+ ~~~
    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess

```
Open Powershell as administrator
```
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

```

 # <center>Thank you for using EchoRoute</center>
