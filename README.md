# INSA HR (INSA Human Resources Management)

INSA HR is a full-stack HR management system built with a Java Spring Boot backend and a Next.js + React frontend. It provides modules for employee profiles, recruitment, leave management, transfers, separations, document management, and authority delegation.

## Repository structure (key folders)
- backend/employee_management — Java Spring Boot backend (Maven)
- frontend — Next.js React frontend

## Quick start

Prerequisites:
- React.js 18+ and npm
- Java 17+ and Maven
- Oracle (or your configured DB) — configure backend DB in application properties

Frontend (development)
1. Install dependencies:
   npm install
   (run in the [frontend](/frontend) folder)
2. Run dev server:
   npm run dev
3. Open: http://localhost:3000

Backend (development)
1. From backend/employee_management:
   ./mvnw spring-boot:run
2. Backend default API: http://localhost:8080

Note: Frontend uses the backend API at http://localhost:8080 by default (see API usages in the frontend).

## Build for production

Frontend
- npm run build
- npm run start

Backend
- mvn package
- java -jar target/employee_management-*.jar

## Authentication & API
- Frontend calls use an auth wrapper (see imports like `authFetch` across modules).
- Configure any required environment variables or tokens in the frontend `.env` or Next.js config as needed.

## Developer notes
- UI pages are under `frontend/src/app/hr-module/*`.
- Reusable components live in `frontend/src/app/hr-module/`.
- Follow the role checks in the sidebar (`Sidebar`) for access control patterns used in the app.

## Contributing
- Fork -> branch -> PR.
- Keep frontend linting and run unit tests (if added) before PR.

## Troubleshooting
- If frontend cannot reach backend, ensure backend is running at http://localhost:8080 and CORS is configured.
- For file upload issues check `HRDocumentController` and frontend `Upload` component.


