Portfolio CMS

A full-stack personal portfolio website with a custom-built Content
Management System (CMS), REST API, admin dashboard, authentication,
PostgreSQL database, media uploads, and contact email notifications.

The entire application is maintained in one GitHub repository.

🚀 Overview

Portfolio CMS is a custom full-stack portfolio platform built from
scratch.

It combines:

A public portfolio website

A custom admin CMS

Spring Boot REST APIs

PostgreSQL database

JWT authentication

Refresh-token authentication

Media/file uploads

Contact form with database storage

Email notifications

SEO configuration

Dynamic content management

The CMS allows portfolio content to be managed without directly
modifying frontend source code.

🏗️ Architecture

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

🛠️ Tech Stack

Frontend

Next.js 16

React

TypeScript

Tailwind CSS

Next.js App Router

ESLint

Backend

Java 26

Spring Boot 4.1.1

Spring Security

Spring Data JPA

Hibernate

JWT

Jakarta Validation

Maven

Database

PostgreSQL 17

Authentication

JWT Access Tokens

JWT Refresh Tokens

BCrypt password hashing

Protected admin APIs

Automatic token refresh

Email

Spring Boot Mail

SMTP

Gmail App Password

Development Tools

IntelliJ IDEA

Git

GitHub

PostgreSQL

Maven

npm

✨ Features

Public Portfolio

Home

About

Skills

Services

Experience

Projects

Testimonials

Blog

Blog details

Contact form

Responsive layout

SEO metadata

Custom CMS

Admin dashboard with management pages for:

About

Skills

Projects

Blogs

Experience

Testimonials

Services

Contacts

Media

Authentication

Admin login

JWT access token

Refresh token

Automatic frontend token refresh

Protected CMS routes

Logout functionality

Contact System

The contact form follows this flow:

Portfolio Contact Form
↓
Spring Boot API
↓
PostgreSQL
↓
Email Notification

Submitted contact messages are stored in PostgreSQL and an email
notification is sent to the configured administrator email.

Media

Image upload

File storage

Public upload URLs

Media management through the CMS

📂 Project Structure

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
│   │       ├── blog/
│   │       │   └── [slug]/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── robots.ts
│   │       └── sitemap.ts
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
│       └── resources/
│           └── application.properties
│
├── uploads/
├── pom.xml
├── README.md
└── .gitignore

🔐 Authentication

The admin CMS uses JWT-based authentication.

Login

POST /api/auth/login

Request:

{
"email": "admin@portfolio.com",
"password": "your-password"
}

Response:

{
"token": "access-token",
"refreshToken": "refresh-token"
}

Refresh Token

POST /api/auth/refresh

Request:

{
"refreshToken": "your-refresh-token"
}

Protected requests use:

Authorization: Bearer <access-token>

🌐 REST API

Area

Endpoints

Health

GET /api/health

Auth

POST /api/auth/login, POST /api/auth/refresh

About

GET/POST /api/about, PUT/DELETE /api/about/{id}

Skills

GET/POST /api/skills, PUT/DELETE /api/skills/{id}

Projects

GET/POST /api/projects, PUT/DELETE /api/projects/{id}

Blogs

GET/POST /api/blogs, GET /api/blogs/slug/{slug}, PUT/DELETE /api/blogs/{id}

Experience

GET/POST /api/experience, PUT/DELETE /api/experience/{id}

Testimonials

GET/POST /api/testimonials, PUT/DELETE /api/testimonials/{id}

Services

GET/POST /api/services, PUT/DELETE /api/services/{id}

Contact

POST/GET /api/contacts, PUT/DELETE /api/contacts/{id}

Media

POST /api/upload/image

🗄️ Database

The application uses PostgreSQL.

Main entities:

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

⚙️ Environment Variables

Backend

JWT_SECRET
MAIL_USERNAME
MAIL_PASSWORD

Example:

JWT_SECRET=your-base64-secret
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

Frontend

Create:

frontend/.env.local

NEXT_PUBLIC_API_URL=http://localhost:8080

Never commit secrets or passwords to GitHub.

🚀 Local Development

1. Clone

git clone <your-github-repository-url>
cd portfolio-cms

2. Database

CREATE DATABASE portfolio_cms;

Configure:

src/main/resources/application.properties

3. Backend

./mvnw spring-boot:run

Backend:

http://localhost:8080

4. Frontend

cd frontend
npm install
npm run dev

Frontend:

http://localhost:3000

👨‍💻 Admin CMS

Admin dashboard:

http://localhost:3000/admin

Management sections:

About

Skills

Projects

Blogs

Experience

Testimonials

Services

Contacts

Media

📧 Contact Email System

Visitor
↓
Contact Form
↓
POST /api/contacts
↓
PostgreSQL
↓
Email Notification

The message is stored in PostgreSQL and an email notification is sent to
the configured administrator email.

🖼️ Media Uploads

Uploaded files are stored in:

uploads/

They are exposed through:

/uploads/**

🔒 Security

The application includes:

Spring Security

JWT authentication

Refresh tokens

BCrypt password hashing

Protected admin APIs

Public read-only portfolio APIs

Protected CMS modification APIs

Environment variables for sensitive credentials

CORS configuration

Request validation

File upload size limits

🔎 SEO

The Next.js frontend includes:

Page title

Meta description

Keywords

Author metadata

Robots configuration

Sitemap

/robots.txt
/sitemap.xml

The final production domain should be configured before deployment.

🧪 Testing & Verification

Backend Health

GET /api/health

Expected:

{
"application": "Portfolio CMS",
"message": "Backend is running successfully",
"status": "UP"
}

Authentication

Verified:

Admin login

Access token generation

Refresh token generation

Access token refresh

Protected API access

Logout

Login after logout

Contact System

Verified:

Contact form submission

Database storage

Email notification

Successful frontend response

Frontend

Verified:

Next.js production build

TypeScript compilation

Admin routes

Public portfolio routes

API integration

🏗️ Build

Backend

./mvnw clean package

Output:

target/

Frontend

cd frontend
npm run build

Production start:

npm start

🌍 Deployment

The application can be deployed using separate hosting services for the
frontend, backend, and PostgreSQL database while maintaining a single
GitHub repository.

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

Before deployment:

Configure production environment variables.

Configure the production PostgreSQL database.

Configure the production frontend API URL.

Configure production CORS.

Configure SMTP credentials.

Configure the final domain in SEO files.

Use a secure JWT secret.

Configure persistent media storage if required.

Disable development-only configuration.

📈 Project Goals

This project demonstrates practical full-stack software engineering
skills:

Java

Spring Boot

REST API development

Spring Security

JWT authentication

PostgreSQL

JPA/Hibernate

React/Next.js

TypeScript

Tailwind CSS

CRUD development

CMS development

File upload handling

Email integration

SEO

Git/GitHub

Full-stack architecture

📌 Project Highlights

Full-Stack Application

Frontend, backend, database, authentication, CMS, and email
functionality are combined into one complete application.

Custom CMS

The CMS was developed specifically for the portfolio instead of using an
external CMS platform.

REST Architecture

The frontend communicates with the Spring Boot backend through REST
APIs.

Secure Authentication

The admin panel uses JWT access tokens and refresh tokens for
authenticated operations.

Dynamic Content

Portfolio content can be managed through the CMS and retrieved
dynamically by the public website.

📁 Repository Structure

The complete application is maintained in one Git repository:

portfolio-cms/
│
├── frontend/
├── src/
├── uploads/
├── pom.xml
├── README.md
└── .gitignore

👤 Author

Rishu Barman

B.Tech Computer Science & Engineering

Aspiring Java Developer focused on:

Java

Spring Boot

Backend Development

REST APIs

PostgreSQL

Software Engineering

📜 License

This project is created for personal portfolio and educational purposes.

⭐ Acknowledgements

Built from scratch using modern full-stack technologies with a focus on
practical backend development, custom CMS architecture, authentication,
database integration, and production-oriented application design.