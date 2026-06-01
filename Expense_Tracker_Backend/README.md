# Expense Tracker Backend

## Description
A robust RESTful backend application built using Spring Boot that allows users to seamlessly manage expenses and categories. Engineered with a clean, layered architecture, the system supports comprehensive CRUD operations while utilizing DTOs for secure data transfer, a global exception handler to ensure predictable, structured error management, and containerization for scalable cloud deployment.

## Tech Stack
- **Language:** Java
- **Framework:** Spring Boot (Spring Data JPA, Spring Security)
- **Database:** MySQL
- **Security:** JWT (JSON Web Tokens)
- **Build Tool:** Maven
- **Containerization:** Docker
- **Deployment:** Cloud Platforms (Render, Aiven)

## Features
- User management (Secure registration and login powered by JWT)
- Expense CRUD operations with input validation
- Category management for dynamic expense classification
- Pagination and sorting for optimized expense data retrieval
- Advanced filtering capabilities (Filter expenses by date, amount, and category)
- DTO-based request & response handling
- Global exception handling
- Layered architecture (Controller → Service → Repository → Entity)
- MySQL database integration optimized with Spring Data JPA analysis
- Comprehensive Unit and Integration testing for API reliability
- Containerization and cloud deployment readiness

## Live Demo
You can access the live deployed full-stack application here: [Expense Tracker Live App](https://expense-tracker-frontend-three-wine.vercel.app/)

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & return JWT token

### Expenses
- `GET /api/expenses` - Retrieve paginated expenses (Supports filtering and sorting)
- `GET /api/expenses/{id}` - Get a specific expense record
- `POST /api/expenses` - Create a new expense record
- `PUT /api/expenses/{id}` - Update an existing expense record
- `DELETE /api/expenses/{id}` - Delete an expense record

### Categories
- `GET /api/categories` - List all expense categories
- `POST /api/categories` - Create a new category

---

## How to Run the Project Locally

### 1. Prerequisites
- Java 17+
- Maven
- MySQL (or Docker)
- Git

### 2. Clone the Repository
```bash
git clone https://github.com/Komal0902Yadav/Expense-Tracker-Backend.git
cd Expense-Tracker-Backend
```

### 3. Create Database in MySQL
```sql
CREATE DATABASE expense_tracker;
```

### 4. Environment Configuration
The application uses environment variables for production/cloud environments, with safe fallbacks configured for local development. Update your local configuration or set your local environment variables to match your system:

```properties
spring.application.name=ExpenseTracker2

# Server Port (Defaults to 8080 if PORT environment variable is not set)
server.port=${PORT:8080}

# Database Configuration (Uses environment variables in production, falls back to local database)
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/expense_tracker}
spring.datasource.username=${DB_USERNAME:YOUR_MYSQL_USERNAME}
spring.datasource.password=${DB_PASSWORD:YOUR_MYSQL_PASSWORD}

# JPA / Hibernate Settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.open-in-view=false
```

### 5. Run Command
```bash
mvn spring-boot:run
```

### 6. API Access
Once started, the backend application will be accessible locally at:
`http://localhost:8080`
