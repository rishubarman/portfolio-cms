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
          │ PostgreSQL  │    │ File Upload │    │    Email    │
          │  Database   │    │   Storage   │    │   Service   │
          └─────────────┘    └─────────────┘    └─────────────┘
                                    ▲
                                    │
                         ┌──────────┴───────────┐
                         │     Admin CMS        │
                         │      Next.js         │
                         └──────────────────────┘