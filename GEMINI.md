# Project Overview: orders-cake

A full-stack cake ordering and management system, likely designed for an educational context (based on terms like Degree, Department, Teacher, and Student). The project consists of a Node.js/Express backend and a React/Vite frontend.

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database ORM:** Sequelize (with MySQL)
- **Authentication:** Passport.js (Local & JWT strategies)
- **Logging:** Winston & Morgan
- **Security:** Helmet, Express Rate Limit, CORS
- **File Uploads:** Multer

### Frontend
- **Framework:** React 18 (Vite)
- **State Management:** Redux Toolkit
- **UI Library:** Material UI (MUI)
- **Routing:** React Router DOM v6
- **Data Fetching:** Axios
- **Charts:** Chart.js with react-chartjs-2
- **Notifications:** SweetAlert2

## Project Structure

### Backend (`/Backend`)
- `server.js`: Application entry point, middleware configuration, and route initialization.
- `configs/`: Database and Passport configurations.
- `controllers/`: Logic for handling API requests (Auth, Cake, Order, User, etc.).
- `models/`: Sequelize models and database associations (`index.js`).
- `routers/`: Express route definitions.
- `helpers/`: Utility functions (validation, error handling, logging, user auto-creation).
- `Images/`: Static storage for uploaded user images.

### Frontend (`/Frontend`)
- `src/main.jsx`: Application entry point.
- `src/App.jsx`: Main routing configuration.
- `src/components/`: Reusable UI components organized by feature (Auth, SuperAdmin, Teacher, Common).
- `src/pages/`: Page-level components for different roles and views.
- `src/slices/`: Redux Toolkit slices for state management.
- `src/services/`: API service layer using Axios.
- `src/store/`: Redux store configuration.
- `src/Layout/`: Common layouts (e.g., MainLayout with Sidebar and Header).

## Building and Running

### Prerequisites
- Node.js (v16+ recommended)
- MySQL Database

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `config.env` file in the `Backend` directory with the following keys:
   - `PORT`: (Default: 8080)
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
   - `JWT_SECRET`
   - `ALLOWED_ORIGINS`: (e.g., http://localhost:5173)
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application should be available at `http://localhost:5173`.

## Development Conventions

- **API Versioning:** Routes are prefixed with `/api` (e.g., `/api/auth`, `/api/users`).
- **Error Handling:** Centralized error handling middleware in `Backend/server.js`.
- **Logging:** Use the Winston logger helper for backend logs.
- **State Management:** Use Redux Toolkit slices for global state (Auth, Orders, etc.).
- **Styling:** Primarily Material UI with some custom CSS and FlexBetween utility.
- **Code Style:** ESLint is configured for the frontend. Follow existing patterns in controllers and components.
