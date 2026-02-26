# EcoRoute – Personalized Low-Impact Commute Planner
**Team Members**  
-  Tashfia Tabassum –  Frontend  
-  Grunwald Jae – Backend & API Integration  
-  Aiden Kitchen – Data Processing & Carbon Calculations  
-  Jeffrey Sparrow – UI/UX & Testing  
## Abstract (Executive Summary)
EcoRoute is a web-based application that helps urban commuters in cities to find the most environmentally friendly way to travel by prioritizing the lowest carbon emissions while still considering time and cost. It combines public transit, walking, biking, and electric vehicle options using open routing APIs and simple personalization. Unlike Google Maps which focuses on speed, EcoRoute puts sustainability first and shows users exactly how much CO₂ they can save per trip — making green choices easy, visible, and rewarding.

---
## 1. Goal

Empower daily commuters to reduce their personal carbon footprint from transportation without major lifestyle changes, especially in densely populated cities with mixed transport options.

## 2. Current Practice & Limitations

Most people use Google Maps, Uber, or local bus apps that optimize for fastest or cheapest routes.  
Current limitations:  
- Carbon emissions are rarely shown or prioritized  
- Multi-modal journeys (bus + walk + bike) are poorly combined  
- No personalization for users who are willing to trade a few minutes for much lower emissions  
- Weather/air quality rarely influences active transport suggestions (walking/biking)

## 3. Novelty

- Carbon emissions as the **primary sorting criterion** (time & cost as secondary filters)  
- Lightweight user preference learning (e.g. tolerance for "green delay")  
- Real-time weather & air quality integration for safe/active transport decisions  
- Simple gamification: personal carbon savings dashboard + badges

## 4. Effects (Who Cares?)

- **Users**: Feel good about measurable impact, build greener habits  
- **Cities/Environment**: Small individual changes → collective emissions reduction  
- **Future potential**: Data insights for urban planners (popular green corridors, bike lane demand)

## 5. Technical Approach

- **Frontend**: React (responsive web – mobile-first)  
- **Backend**: Node.js + Express or Python FastAPI  
- **Database**: PostgreSQL with PostGIS extension (for geospatial queries)  
- **Routing & Maps**: OpenStreetMap + OpenRouteService API (free & good global coverage)  
- **Transit Data**: GTFS static data + real-time where available  
- **External APIs**: OpenWeatherMap (weather & air quality – free tier)  
- **Personalization**: Simple scikit-learn model (clustering/regression) on user history  
- **Deployment**: Vercel (frontend) + Render/Railway (backend)

## 6. Software Architecture

As EcoRoute is a multi-modal routing app, the **Layered Architecture** would probably work best. Because this architecture separates concerns between presentation, application logic, data processing and external services. By applying **Layered Architecture** it's possible to separate the complex data fetching (APIs) from the carbon calculation logic. This approach suits well for a small team. Where each components can build independently by team member.

- **Major Components**:
    - **Frontend (React)**: Handles user input (start/end), map rendering, and the "Carbon Dashboard."
    - **Backend API Server (Node.js/FastAPI)**: Orchestrates calls to OpenRouteService, OpenWeatherMap, and the database.
    - **Carbon Calculation Engine**: A dedicated backend module for calculating estimated carbon emissions for each route based on raw route data.
    - **Database (PostgreSQL + PostGIS)**: Stores user profiles, frequent routes, and cached geospatial data.
    - **External Services**: 
	    - **Route Service** > OpenRouteService.
	    - **Transit Data** > GTFS.
	    - **Air Quality** > OpenWeatherMap.
- **Interfaces**: The Frontend communicates via  **REST API** using **JSON**
    - **Example**: `POST /api/routes` where **JSON** body containing coordinates and **Green Tolerance**.
- **Database Schema**:
    - **Users**: userID, Name, Email, Green_Preference_Score.
    - **Saved Routes**: UserID, Start_Point (Geometry), End_Point (Geometry), Last_CO2_Score.
    - **Trip History**: UserID, Mode, Distance, Carbon_Saved.
- **Architectural Assumptions**:
  - User have consistent internet access to use EcoRoute.
  - External Service APIs are available and reliable.
  - Calculate approximate Carbon Emission for guidance.
- **Architecture Decision and Alternatives**:
  - **Decision 1**: **Layered Monolith Architecture** (Chosen)
    - **Pros**: Easy for implementation, debugging.
    - **Cons**: Scaling of components independently is limited.
   - **Alternative**: Microservices Architecture
    - **Pros**: Useful for independent scaling.
    - **Cons**: Too much network overhead and complexity. Not suitable for a team of four. Harder to debug.
  - **Decision 2**: REST API for communication with components.
    - **Pros**: Easy to test, simple and widely used.
    - **Cons**: Slightly higher latency.
  - **Alternative**: GraphQL API
    - **Pros**: Provide flexibility on queries for Frontend.
    - **Cons**: Too much complexity and learning curve.

## 7. Software Design

Describe about the internal design of **Major Component** which are identified in **Architecture**.

- **Frontend**:
Use React for frontend and components are organized for reusability.
  - **Components**:
    - **Route Map**: Display route options.
    - **EmissionCard**: For each route shows carbon emission, time and distance.
    - **PreferenceToggle**: User can specify their willingness to trade time for emission.
  - **Services**:
    - **RouteService (API)**
    - **AuthService**
- **Backend**:
All logical modules/classes are organized in backend.
  - **RouteAggregator**: Mergees data from Transit, Walking, and Biking APIs.
  - **CarbonCalculator**: Takes distance/mode as input. Apply emission formula based on input and compute estimated carbon.
  - **WeatherMiddleware**: Checks OpenWeatherMap weather and air quality data before suggesting a bike route.
  - **API Controller**: Handle request validation and format responses for frontend.

## 8. Coding Guidelines
  
Follows industry-standard coding guidelines to ensure consistency and maintainability.

- **JavaScript (Frontend/Backend)**: [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript). It's the industry standard for **React** and **Node.js**
- **Python (if used for Calculations or services)**: [PEP 8](https://peps.python.org/pep-0008/).
- **Enforcement**: 
  - We will use **ESLint** and **Prettier** to auto-format code on every save.
  - No Pull Request (PR) will be merged on GitHub without a review from another team member to ensure style compliance.

## 9. Process Description (The "Living" Part)

### i. Risk Assessment (Top 5)

|          Risk              | Likelihood | Impact |                                         Mitigation                                    |
|:--------------------------:|:----------:|:------:|---------------------------------------------------------------------------------------|
| API Rate Limits            |   High     | Medium | Implement caching in PostgreSQL to store common route results.                        |
| Data Quality (GTFS)        |   Medium   | High   | Use OpenRouteService as a reliable fallback for static schedules.                     |  
| Carbon Formula Inaccuracy  |   Medium   | Medium | Source carbon factors from verified sources (e.g., EPA or UK Government GHG factors). |
| Mobile UI Responsive issue |   Low      | High   | Use "Mobile First" design and test early on physicaldevices.                          |
| Integration Delay          |   High     | High   | Define API contracts (JSON formats) between Frontend and Backend by Week 4.           |

### ii. Project Schedule (Key Milestones)

- **M1: Architecture Freeze (02/04):** Living document updated.
- **M2: Basic Routing (02/11):** Backend returns a simple route from ORS; Frontend displays it on a map.
- **M3: Carbon Integration (02/18):** Routes are ranked by emissions.
- **M4: MVP Demo (03/02):** Final testing and bug fixes.

|            Milestone         |   Effort (Person-Week)    |                                   Tasks                                  |
|:-----------------------------|:-------------------------:|--------------------------------------------------------------------------|
| Architecture Freeze (Feb/04) |            1              | Living document updated.                                                 |
| Basic Routing (Feb/11)       |            1              | Backend returns a simple route from ORS; Frontend displays it on a map.  | 
| Carbon Integration (Feb/18)  |            1              | Routes are ranked by emissions.                                          | 
| MVP Demo (Mar/02)            |            1              | Final testing and bug fixes.                                             | 

### iii. Team Structure

Team structure remains unchanged. Roles for each team member

| Team Member      | Role                                  |
| -----------------|---------------------------------------|
| Tashfia Tabassum | Frontend (React)                      |
| Grunwald Jae     | Backend & API Integration             |
| Aiden Kitchen    | Data Processing & Carbon Calculations |
| Jeffrey Sparrow  | UI/UX & Testing                       |

### iv. Test Plan

- **Unit Testing**: Test the CarbonCalculator with known distances to ensure it returns the correct CO2 values.
- **System Testing**: Perform an end-to-end search from "Corvallis" to "Portland" and verify the "Carbon Saved" badge appears.
- **Usability Testing**: Jeffrey will lead a session with 3 non-CS students to see if they understand the "Green Delay" preference.
- **Bug Tracking**: Bugs will be tracked with GitHub Issues.
---

### Test Automation Infrastructure

For frontend we uses **Vitest** and **React Testing Library** for automated testing.

Vitest integrates natively with Vite and also supports TypeScript. Moreover React Testing Library was selected because it focuses on testing components from the user's perspective.
Automated tests currently include:

Automated tests currently include:

- Component rendering tests (App)
- Loading state test (Home page)
- Utility validation test (local storage service)
How to add a new test

To ensure consistency across the team, follow these steps to add tests:

File Location: Create a new file in the src/__tests__/ directory or alongside the component being tested.

Naming Convention: Name the file [fileName].test.tsx (for components) or [fileName].test.ts (for logic/utilities).

Structure: * Use describe() to name the component/function.

Use it() or test() to describe the specific behavior being verified.

Local Verification: Run npm run test in your terminal to ensure the test passes locally before committing.

CI Confirmation: Once pushed, check the GitHub Actions tab to ensure the build passes in the CI environment.
---

### Continuous Integration (CI)

We use **GitHub Actions** for our CI service.

Reason to choose GitHub Actions:

- Integrates directly with  GitHub repository
- free for public repositories
- Requires minimal configuration
- Automatically runs on push and pull requests

---

### CI Services Considered

| Service        | Pros | Cons |
|---------------|------|------|
| GitHub Actions | Native GitHub integration, Free, Easy setup | YAML configuration required |
| Travis CI      | Simple setup | Limited free tier |
| CircleCI       | Powerful and fast | More complex configuration |

GitHub Actions selected for its simplicity and direct integration with repository.

---

### CI Triggers

CI pipeline run automatically when:

- Code pushed to the `main` branch
- A pull request is opened and targeting the `main` branch

---

### Tests Executed in CI

Currently the following tests run automatically in CI:

- Unit tests
- Component rendering tests
- Validation tests for utility functions
### v. Documentation

- **User Guide** on how to plan route.
    - [View User Guide](https://github.com/jeff-sparrow/EcoRoute/blob/main/docs/user-guide.md)
- **Developer Guide**  where describing about the system setup and architecture.
    - [View Developer Guide](https://github.com/jeff-sparrow/EcoRoute/blob/main/docs/developer-guide.md)

## 10. Main Risk & Mitigation

**Risk**: Inconsistent quality/availability of public transit real-time data.
**Mitigation**:  
- Primary fallback: OpenRouteService (very reliable for walking/biking/car)  
- Use static GTFS schedules when real-time unavailable  
- Allow users to save & manually correct frequent routes  
- Start with best-effort coverage for 1–2 benchmark cities

## 11. Timeline
- week 1 and 2 Project Planning & Requirements such as Finalize project scope and MVP features ,Define user personas and use cases, Assign clear team roles and responsibilities, Research APIs (routing, transit, weather, emissions data)
- week 3 system design including Design system architecture, Create wireframes for main UI screens route planner, results, dashboard, Define database schema users, trips, routes, Decide carbon calculation assumptions and formulas
- week 4 Frontend & Backend Setup, Set up React project structure (mobile-first), Set up backend server (Express/FastAPI), Configure database and geospatial support, Test basic API connectivity (maps, routing)
- week 5 Implement route search (start to destination) Integrate routing API for walking, biking, transit, Display route options on the frontend, Pass route data from backend to frontend
- week 7 and 8 Personalization & Context Awareness, improve UI/UX based on early testing, Conduct usability testing with sample users, Finalize MVP features
- week 9 Demo and finalize the project and make report
---

## Use Cases (MVP – Must have for core product)

1. Use Case: Plan a Low-Carbon Commute
**Actors**
User (commuter in an urban area) these are primary users
The online application EcoRoute these are secondary users
**Triggers**
When user clicks search interface to plan a trip
**Preconditions**
Users should have access to EcoRoute web app.
Users should have internet access
**Postconditions**
Carbon impact information will be displayed for each route.
The user can be able to select a route to view detailed directions.
The user sees multiple commute routes ranked by lowest carbon emissions.
**Steps to Follow (Success Scenario)**
Start and destination locations are entered by the user.
Time and green choices are chosen by the user.
Route possibilities are generated by the system.
The system determines and prioritizes routes based on CO2 emissions.
Route results are shown by the system.
For details, the user chooses a route.
**Expectation and extension**
Invalid input prompts correction.
Internet issue connection prevents search.
Routing data unavailable shows error message.
Expectation could be user chooses a saved location. Routes re-rank based on preferences or weather.


2. Use Case: Plan a route with context-aware weather suggestions
- **Actors**
User (commuter in an urban area) these are primary users
The online application EcoRoute these are secondary users
- **Triggers**
When a user performs a route search and current weather/air quality data may affect travel modes along route.
- **Preconditions**
Users should have access to EcoRoute web app.
Users should have internet access.
EcoRoute has successfully generated route options.
- **Postconditions**
EcoRoute adjusts route recommendations based on current/forecast weather/air quality conditions.
A context-aware warning is displayed to the user about conditions along route.
Route ranking may shift based on conditions/modes of travel.
- **Steps to Follow (Success Scenario)**
User enters start and destination.
User may optionally select departure or arrival time.
EcoRoute queries weather and air quality data for conditions at specified location and time.
EcoRoute applies context based rules to generate tailored route recommendations.
EcoRoute displays context-aware route results with context-aware weather/AQI warnings, as applicable.
User selects preferred route.
- **Expectation and extension**
Invalid input prompts correction.
Internet issue connection prevents search.
Routing or weather/AQI data unavailable shows error message.

3. Use Case: Multi-modal route support(Aiden)
- **Actors**
User (commuter in an urban area)
The online application EcoRoute
- **Triggers**
When a user clicks seaarch interface
- **Preconditions**
Users should have access to EcoRoute web app.
Users should have internet access.
User has a bike selected as an available option.
There is no weather or condition impeding bike travel.
- **Postconditions**
Route displays the multi-modal route that includes bike and bus.
- **Steps to Follow (Success Scenario)**
Start and destination is selected by the user that partially has a bus in the route.
Green choices and a time that coincides with a bus is selected.
- **Extension**
User selects conditions that creates a route that either only starts or ends with bicycling.
- **Exceptions**
Invalid input prompts correction.
Internet issue connection prevents search.
Routing data unavailable shows error message.

## Nonfunctional Requirements
1. **Performance and Latency (performance)**
- The system shall return route recommendations within 3 seconds of the user submitting their destination.

2. **Mobile-First (usability)**
- The system shall adhere to mobile-first design.

3. **Reliability and Availability (Reliability)**
- The system must have an uptime of at least 97%.

## External Requirements
1. The system shall rely on external APIs such as OpenRouteService, GTFS, OpenWeatherMap for routing, transit, and weather data. The application must comply with usage limits and licensing terms of all third-party APIs for credibility. The system should be deployable on standard cloud platforms and run on modern web browsers.

## Stretch Goals (If time permits – in priority order)

1. **Personalized Green Preference Learning**  
   - Adapt suggestions based on user’s past choices (ML lite)  

2. **Social / Gamification Features**  
   - Weekly friend leaderboard for carbon saved  
   - Shareable green-trip badges  

3. **Calendar Integration**  
   - Suggest green routes for upcoming events  

4. **Offline Route Caching**  
   - Basic offline support for common trips


