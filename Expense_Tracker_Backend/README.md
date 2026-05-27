# Expense Tracker Backend

## Description
A RESTful backend application built using Spring Boot that allows users to manage expenses and categories. The system supports CRUD operations with proper layered architecture, DTO usage, and global exception handling.

## Tech Stack
- Java
- Spring Boot
- Spring Data JPA
- MySQL
- Maven

## Features
- User management
- Expense CRUD operations
- Category management
- DTO-based request & response handling
- Global exception handling
- Layered architecture (Controller → Service → Repository → Entity)
- MySQL database integration

## How to Run the Project

### 1. Prerequisites
- Java 17+
- Maven
- MySQL
- Git

---


### 2. Clone the Repository
```bash
git clone https://github.com/Komal0902Yadav/Expense-Tracker-Backend.git
cd Expense-Tracker-Backend
```

### 3. Create Database in MySQL
```sql
CREATE DATABASE expense_tracker;
```

### 4. application.properties Configuration
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker
spring.datasource.username=root
spring.datasource.password=Yash@2012
spring.jpa.hibernate.ddl-auto=update
```

### 5. Run Command
```bash
mvn spring-boot:run
```

### 6. Application runs at:
`http://localhost:8081`


