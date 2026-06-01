# Expense Tracker Frontend

## Description
A modern, responsive, and intuitive web application user interface built using React, designed to provide users with a seamless financial tracking experience. The frontend interacts with a secure Spring Boot REST API to handle user authentication, dynamic expense management, and interactive data visualization while maintaining clean state management and input validation.

## Tech Stack
- **Languages:** HTML5, CSS3, JavaScript
- **Framework:** React
- **Routing:** React Router DOM
- **API Client:** Axios
- **Build Tool:** Vite

## Features
- **User Authentication:** Secure registration and login interfaces seamlessly connected to JWT-backed API endpoints.
- **Dynamic Expense Management:** Intuitive dashboard for viewing, creating, and updating financial records with interactive row actions.
- **Advanced Sorting & Filtering:** Instant UI updates allowing users to sort records by date or amount and filter data on demand.
- **Analytics Dashboard:** Visual representation of financial summaries featuring interactive category breakdown charts and multi-month spending trend graphs.
- **Component-Driven Design:** Built using a modular component design strategy for clear separation of layouts, navigation bars, and explicit page views.
- **Seamless API Integration:** Centralized API client utilizing Axios to manage network requests, authentication tokens, and server communications.

## Live Demo
You can access the live deployed client application here: [Expense Tracker Web App](https://expense-tracker-frontend-three-wine.vercel.app/)

---

## How to Run the Project Locally

### 1. Prerequisites
- Node.js (v18+)
- npm
- Git

### 2. Clone the Repository
```bash
git clone https://github.com/Komal0902Yadav/Expense-Tracker-Backend.git
cd expense_tracker_frontend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Configuration
Create a `.env` file in the root of this frontend directory by copying the provided example template:
```bash
cp .env.example .env
```

### 5. Run Command
```bash
npm run dev
```

### 6. Local Access
Once running, the application will be accessible at:
`http://localhost:5173`
