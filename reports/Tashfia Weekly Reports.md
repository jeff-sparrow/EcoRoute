## Tashfia Tabassum — Weekly Reports
### Week 1–2
i. Goals

Come up with a project idea through discussion with each of our team members. After a discussion session we came up with an idea for the project. We also set up our GitHub repository and determined team roles.

ii. Progress and Issues
What I did

I shared my email and decided how we could communicate with each other. After coming up with the idea I finalized my role as a frontend developer.

What worked

After deciding my role I did research on how I could complete the project as a frontend developer.

What I learned

I learned about brainstorming, building logical ideas, and collaboration.

Where I had trouble

Each team member came with different approaches and logic, so it was sometimes difficult for me to decide.

iii. Goals for next week

Project requirements elicitation. A rough skeleton of the home page was created to visualize the main interface of EcoRoute, which helps map the core project features.

### Week 3
i. Goals

Think about multiple use cases while focusing on planning a route where the user enters a start location and destination, selects a departure or arrival time, and requests route options. Also think about how to handle invalid input, internet connection errors, or unavailable routing or weather data.

ii. Progress and Issues
What I did

I worked on context-aware route planning where the user enters the start and destination locations, and the system suggests eco-friendly routes.

What worked

I discussed with my team members and searched for free API services that could help accomplish this project.

What I learned

Through my research I learned about GTFS routing and ORS (OpenRouteService).

Where I had trouble

I had difficulty understanding GTFS and ORS coordinate systems.

iii. Goals for next week

Research system architectures and software design.
Write the Software Architecture and Design sections of the living document.

### Week 4
i. Goals

Understand the system architecture and my frontend responsibilities. Help document use cases and review the UI structure for route planning.

ii. Progress and Issues
What I did

Reviewed the layered architecture and how the frontend communicates with the backend through REST APIs. Worked on frontend design ideas such as the route map, emission card, and preference toggle components. Helped summarize the use cases for route planning and weather-aware suggestions. Also created use case diagrams.

What worked

The architecture clearly separates frontend, backend, and external APIs, which makes development easier. The component-based React design makes the UI easier to organize and reuse.

What I learned

How layered architecture separates presentation, logic, and data. Also how the frontend communicates with the backend using REST APIs and JSON.

Where I had trouble

Understanding how multiple APIs (routing, weather, and transit) combine in the backend before sending results to the frontend.

iii. Goals for next week

Project implementation and documentation.
Continue understanding the UI and generating design ideas.

### Week 5
i. Goals

Understand the frontend testing setup and tools used in the project. Review how automated testing and CI will work for the frontend.

ii. Progress and Issues
What I did

Reviewed the testing infrastructure for the frontend. Learned how Vitest and React Testing Library are used for automated tests. Checked the current tests such as component rendering tests, loading state tests, and utility validation tests. Reviewed how tests run using GitHub Actions CI.

What worked

Vitest integrates well with the Vite frontend setup. GitHub Actions automatically runs tests when code is pushed or when a pull request is opened.

What I learned

How automated frontend tests are structured using describe() and test() functions. Also how CI pipelines verify that code builds and tests pass automatically.

Where I had trouble

Understanding the full CI workflow configuration and how YAML files control the GitHub Actions pipeline.

iii. Goals for next week

Begin setting up additional frontend tests for new UI components. Practice writing simple component tests using Vitest and React Testing Library.

### Week 6
i. Goals

Understand the frontend testing setup and CI process used in the project.

ii. Progress and Issues
What I did

Reviewed the automated testing setup using Vitest and React Testing Library. Checked existing tests such as component rendering tests, loading state tests, and utility validation tests. Reviewed how GitHub Actions runs tests automatically in the CI pipeline when code is pushed or a pull request is created.

What worked

Vitest works well with the Vite frontend setup. GitHub Actions automatically runs tests and verifies that the project builds correctly.

What I learned

How automated frontend tests help ensure components work correctly. Also how CI pipelines maintain code quality by running tests automatically.

Where I had trouble

Understanding the configuration of GitHub Actions and how the CI workflow is controlled through YAML files.

iii. Goals for next week

Write simple frontend tests for new UI components.
Learn more about improving test coverage for the frontend and continue completing the project.

### Week 7
i. Goals

Understand the beta release workflow and how the frontend communicates with the backend.

ii. Progress and Issues
What I did

Reviewed the implemented end-to-end flow of the EcoRoute beta release. Tested how the frontend sends a POST request to the backend API to retrieve route data. Observed how the returned data (transport mode, travel time, distance, and CO₂ emissions) is displayed in the UI.

What worked

The frontend successfully communicates with the backend API and receives route information. The UI correctly renders the route results returned from the server.

What I learned

How frontend requests interact with backend APIs using HTTP POST requests and how route data flows from the backend to the frontend interface.

Where I had trouble

Understanding the structure of the API response and how the backend processes routing requests.

iii. Goals for next week

Improve the frontend UI for displaying route results. Continue testing the route search feature and handle possible user input errors.

### Week 8
i. Goals

Review feedback from beta testing and identify frontend issues that need improvement. Improve the usability of the EcoRoute interface based on tester comments.

ii. Progress and Issues
What I did

Read the beta testing feedback from the reviewer. Checked UI issues mentioned in the feedback such as layout problems, navigation issues, and search input behavior. Reviewed how the route search feature behaves with different inputs and screen sizes.

What worked

The main idea and functionality of the application were understandable to testers. The route information and environmental focus of the project were positively received.

What I learned

User testing reveals many UI issues that are not obvious during development. Clear documentation and installation instructions are important for users who do not have required tools installed.

Where I had trouble

Some UI issues such as search bar behavior and layout problems .
iii. Goals for next week

Improve UI responsiveness and navigation elements such as adding better navigation options. Work with the team to address beta testing feedback and finalize the project for the final demo.

### Week 9–10
i. Goals

Review beta testing feedback and identify issues affecting the frontend and system behavior. Work with the team to prepare the final project release.

ii. Progress and Issues
What I did

Reviewed issues discovered during beta testing such as route search limitations, UI behavior, and API constraints. Investigated frontend communication with the OpenRouteService (ORS) API for geocoding and location suggestions.  ORS location dataset limitations, and server timeout issues on long-distance routes. 
What worked: 
The system successfully generates routes and returns route information such as distance, travel time, and estimated CO₂ emissions. 

What I learned: 
External APIs can significantly affect system capabilities and limitations. Lower server resources can affect system performance and make it difficult to generate routes for large requests.
Where I had trouble
Some issues such as ORS data limitations and server timeout errors cannot be fully resolved without changing server infrastructure.
iii. Goals for next week (Week 10)

Finalize documentation and ensure the README clearly explains how to run and test the system. Prepare the demo, poster slide, and presentation for the final project submission.
