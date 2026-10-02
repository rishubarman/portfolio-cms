# Portfolio CMS

A full-stack personal portfolio website with a custom-built Content Management System (CMS), REST API, admin dashboard, authentication, PostgreSQL database, media uploads, and contact email notifications.

The entire application is maintained in **one GitHub repository**.

---

## 🚀 Overview

Portfolio CMS is a custom full-stack portfolio platform built from scratch.

It combines:

- A public portfolio website
- A custom admin CMS
- Spring Boot REST APIs
- PostgreSQL database
- JWT authentication
- Refresh-token authentication
- Media/file uploads
- Contact form with database storage
- Email notifications
- SEO configuration
- Dynamic content management

The CMS allows portfolio content to be managed without directly modifying frontend source code.

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │   Public Portfolio   │
                         │      Next.js         │
                         └──────────┬───────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌──────────────────────┐
                         │   Spring Boot API    │
                         │    Custom CMS        │
                         └──────────┬───────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
          │ PostgreSQL  │    │ File Upload │    │    Email     │
          │  Database   │    │   Storage   │    │   Service    │
          └─────────────┘    └─────────────┘    └─────────────┘
                                    ▲
                                    │
                         ┌──────────┴───────────┐
                         │     Admin CMS        │
                         │      Next.js         │
                         └──────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Next.js App Router
- ESLint

### Backend

- Java 26
- Spring Boot 4.1.1
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- Jakarta Validation
- Maven

### Database

- PostgreSQL 17

### Authentication

- JWT Access Tokens
- JWT Refresh Tokens
- BCrypt password hashing
- Protected admin APIs
- Automatic token refresh

### Email

- Spring Boot Mail
- SMTP
- Gmail App Password

### Development Tools

- IntelliJ IDEA
- Git
- GitHub
- PostgreSQL
- Maven
- npm

---

## ✨ Features

### Public Portfolio

- Home
- About
- Skills
- Services
- Experience
- Projects
- Testimonials
- Blog
- Blog details
- Contact form
- Responsive layout
- SEO metadata

### Custom CMS

Admin dashboard with management pages for:

- About
- Skills
- Projects
- Blogs
- Experience
- Testimonials
- Services
- Contacts
- Media

### Authentication

- Admin login
- JWT access token
- Refresh token
- Automatic frontend token refresh
- Protected CMS routes
- Logout functionality

### Contact System

The contact form follows this flow:

```text
Portfolio Contact Form
        ↓
Spring Boot API
        ↓
PostgreSQL
        ↓
Email Notification
```

Submitted contact messages are stored in PostgreSQL and an email notification is sent to the configured administrator email.

### Media

- Image upload
- File storage
- Public upload URLs
- Media management through the CMS

---

## 📂 Project Structure

```text
portfolio-cms/
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── admin/
│   │       │   ├── about/
│   │       │   ├── blogs/
│   │       │   ├── contacts/
│   │       │   ├── experience/
│   │       │   ├── media/
│   │       │   ├── projects/
│   │       │   ├── services/
│   │       │   ├── skills/
│   │       │   ├── testimonials/
│   │       │   ├── login/
│   │       │   └── page.tsx
│   │       │
│   │       ├── blog/
│   │       │   └── [slug]/
│   │       │
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── robots.ts
│   │       └── sitemap.ts
│   │
│   ├── lib/
│   │   └── api.ts
│   ├── public/
│   ├── .env.local
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/rishubarman/portfoliocms/
│       │       ├── about/
│       │       ├── auth/
│       │       ├── blog/
│       │       ├── common/
│       │       ├── config/
│       │       ├── contact/
│       │       ├── experience/
│       │       ├── jwt/
│       │       ├── media/
│       │       ├── project/
│       │       ├── service/
│       │       ├── skill/
│       │       ├── testimonial/
│       │       └── user/
│       │
│       └── resources/
│           └── application.properties
│
├── uploads/
├── pom.xml
├── README.md
└── .gitignore
```

---

## 🔐 Authentication

The admin CMS uses JWT-based authentication.

### Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "admin@portfolio.com",
  "password": "your-password"
}
```

Response:

```json
{
  "token": "access-token",
  "refreshToken": "refresh-token"
}
```

### Refresh Token

```http
POST /api/auth/refresh
```

Request:

```json
{
  "refreshToken": "your-refresh-token"
}
```

Protected requests use:

```http
Authorization: Bearer <access-token>
```

---

## 🌐 REST API

### Health

```http
GET /api/health
```

### Authentication

```http
POST /api/auth/login
POST /api/auth/refresh
```

### About

```http
GET    /api/about
POST   /api/about
PUT    /api/about/{id}
DELETE /api/about/{id}
```

### Skills

```http
GET    /api/skills
POST   /api/skills
PUT    /api/skills/{id}
DELETE /api/skills/{id}
```

### Projects

```http
GET    /api/projects
POST   /api/projects
PUT    /api/projects/{id}
DELETE /api/projects/{id}
```

### Blogs

```http
GET    /api/blogs
GET    /api/blogs/slug/{slug}
POST   /api/blogs
PUT    /api/blogs/{id}
DELETE /api/blogs/{id}
```

### Experience

```http
GET    /api/experience
POST   /api/experience
PUT    /api/experience/{id}
DELETE /api/experience/{id}
```

### Testimonials

```http
GET    /api/testimonials
POST   /api/testimonials
PUT    /api/testimonials/{id}
DELETE /api/testimonials/{id}
```

### Services

```http
GET    /api/services
POST   /api/services
PUT    /api/services/{id}
DELETE /api/services/{id}
```

### Contact

```http
POST   /api/contacts
GET    /api/contacts
PUT    /api/contacts/{id}
DELETE /api/contacts/{id}
```

### Media

```http
POST /api/upload/image
```

---

## 🗄️ Database

The application uses PostgreSQL.

Main entities:

```text
users
about
skills
projects
blogs
experience
testimonials
services
contacts
media
```

---

## ⚙️ Environment Variables

### Backend

```text
JWT_SECRET
MAIL_USERNAME
MAIL_PASSWORD
```

Example:

```text
JWT_SECRET=your-base64-secret
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

These values should **never be committed to GitHub**.

### Frontend

Create:

```text
frontend/.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 🚀 Local Development

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd portfolio-cms
```

### 2. Configure PostgreSQL

Create the database:

```sql
CREATE DATABASE portfolio_cms;
```

Configure the database in:

```text
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/portfolio_cms
spring.datasource.username=your-username
spring.datasource.password=
```

### 3. Configure Environment Variables

Configure:

```text
JWT_SECRET
MAIL_USERNAME
MAIL_PASSWORD
```

### 4. Start the Backend

From the project root:

```bash
./mvnw spring-boot:run
```

Or run `PortfolioCmsApplication` from IntelliJ IDEA.

Backend:

```text
http://localhost:8080
```

### 5. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

## 👨‍💻 Admin CMS

Admin dashboard:

```text
http://localhost:3000/admin
```

The CMS provides management interfaces for:

- About
- Skills
- Projects
- Blogs
- Experience
- Testimonials
- Services
- Contacts
- Media

Admin authentication is handled through JWT access and refresh tokens.

---

## 📧 Contact Email System

When a visitor submits the contact form:

```text
Visitor
   ↓
Contact Form
   ↓
POST /api/contacts
   ↓
PostgreSQL
   ↓
Email Notification
```

The message is stored in PostgreSQL and an email notification is sent to the configured administrator email.

---

## 🖼️ Media Uploads

The CMS supports image uploads.

Uploaded files are stored in:

```text
uploads/
```

Uploaded files are exposed through:

```text
/uploads/**
```

---

## 🔒 Security

The application includes:

- Spring Security
- JWT authentication
- Refresh tokens
- BCrypt password hashing
- Protected admin APIs
- Public read-only portfolio APIs
- Protected CMS modification APIs
- Environment variables for sensitive credentials
- CORS configuration
- Request validation
- File upload size limits

Sensitive values such as JWT secrets and email credentials are not stored directly in the source code.

---

## 🔎 SEO

The Next.js frontend includes SEO configuration.

The application provides:

- Page title
- Meta description
- Keywords
- Author metadata
- Robots configuration
- Sitemap

### Robots

```text
/robots.txt
```

### Sitemap

```text
/sitemap.xml
```

The final production domain should be configured in the SEO files before deployment.

---

## 🧪 Testing & Verification

The main application flows have been tested during development.

### Backend Health

```http
GET /api/health
```

Expected response:

```json
{
  "application": "Portfolio CMS",
  "message": "Backend is running successfully",
  "status": "UP"
}
```

### Authentication

Verified:

- Admin login
- Access token generation
- Refresh token generation
- Access token refresh
- Protected API access
- Logout
- Login after logout

### Contact System

Verified:

- Contact form submission
- Database storage
- Email notification
- Successful frontend response

### Frontend

Verified:

- Next.js production build
- TypeScript compilation
- Admin routes
- Public portfolio routes
- API integration

---

## 🏗️ Build

### Backend

```bash
./mvnw clean package
```

The generated JAR file will be available under:

```text
target/
```

### Frontend

```bash
cd frontend
npm run build
```

To start the production frontend:

```bash
npm start
```

---

## 🌍 Deployment

The application can be deployed using separate hosting services for the frontend, backend, and PostgreSQL database while maintaining a single GitHub repository.

Typical deployment architecture:

```text
                         Internet
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       Next.js Frontend            Spring Boot Backend
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                       PostgreSQL
```

### Production Configuration

Before deployment:

- Configure production environment variables.
- Configure the production PostgreSQL database.
- Configure the production frontend API URL.
- Configure production CORS.
- Configure SMTP credentials.
- Configure the final domain in SEO files.
- Use a secure JWT secret.
- Configure persistent media storage if required by the hosting platform.
- Disable development-only configuration.

---

## 📈 Project Goals

The project was developed to demonstrate practical full-stack software engineering skills, including:

- Java development
- Spring Boot
- REST API development
- Spring Security
- JWT authentication
- PostgreSQL
- JPA/Hibernate
- React/Next.js
- TypeScript
- Tailwind CSS
- CRUD application development
- CMS development
- File upload handling
- Email integration
- SEO
- Git/GitHub
- Full-stack application architecture

---

## 📌 Project Highlights

### Full-Stack Application

The project combines frontend, backend, database, authentication, CMS, and external email functionality into a complete application.

### Custom CMS

The CMS was developed specifically for the portfolio rather than relying on an external CMS platform.

### REST Architecture

The frontend communicates with the Spring Boot backend through REST APIs.

### Secure Authentication

The admin panel uses JWT access tokens and refresh tokens for authenticated operations.

### Dynamic Content

Portfolio content can be managed through the CMS and retrieved dynamically by the public website.

---

## 📁 Repository Structure

The complete project is maintained in a single Git repository:

```text
portfolio-cms/
│
├── frontend/
├── src/
├── uploads/
├── pom.xml
├── README.md
└── .gitignore
```

This allows the complete application to be version-controlled and maintained from one repository.

---

## 👤 Author

**Rishu Barman**

B.Tech Computer Science & Engineering

Aspiring Java Developer focused on:

- Java
- Spring Boot
- Backend Development
- REST APIs
- PostgreSQL
- Software Engineering

---

## 📜 License

This project is created for personal portfolio and educational purposes.

---

## ⭐ Acknowledgements

Built from scratch using modern full-stack technologies with a focus on practical backend development, custom CMS architecture, authentication, database integration, and production-oriented application design.
