# 🏢 Employee Management System (Backend)

A Spring Boot based RESTful backend application for managing employees, roles, attendance, and leave requests.

This project demonstrates backend development using Java, Spring Boot, JPA, and MySQL.

---

## 🚀 Features

- 👤 Create, Update, Delete Employees
- 🔐 Role-Based Access Control (Admin / Manager / Employee)
- 🗓 Leave Request Management
- 📊 Attendance Tracking
- 🗄 Database Integration with MySQL
- 📑 API Documentation using Swagger

---

## 🛠 Tech Stack

- Java 17
- Spring Boot
- Spring Data JPA (Hibernate)
- Spring Security
- MySQL
- Maven
- Swagger (OpenAPI)

---

## 📂 Project Structure

```
src/main/java
 ├── controller
 ├── service
 ├── repository
 ├── entity
 ├── dto
 ├── config
 └── exception
```

---

## ⚙️ How to Run the Project Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

---

### 2️⃣ Setup MySQL Database

Create a database in MySQL:

```sql
CREATE DATABASE emsa;
```

---

### 3️⃣ Configure Database in `application.properties`

Update with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/emsa
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

### 4️⃣ Run the Application

Using Maven:

```bash
mvn clean install
mvn spring-boot:run
```

Or run the main class from IDE.

---

## 🌐 Access the Application

Backend API:
```
http://localhost:8080
```

Swagger UI:
```
http://localhost:8080/swagger-ui/index.html
```

---

## 🔐 Default Roles (If Applicable)

- Admin
- Manager
- Employee

---

## 📈 Future Improvements

- Frontend Integration (React)
- JWT Authentication
- Docker Support
- Cloud Deployment
- CI/CD Pipeline

---

## 👨‍💻 Author

Revanth Tungala  
GitHub: https://github.com/your-username

---

## 📌 Note

This project is developed for learning and demonstration purposes.
