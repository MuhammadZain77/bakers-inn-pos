# 🧁 Baker's Inn POS

A modern full-stack Point of Sale (POS) and retail management system designed for bakery operations, with support for product management, sales processing, inventory, branch operations, reporting, and business workflows.

> Built with Next.js, TypeScript, PostgreSQL, Prisma and modern React technologies.

---

## 📌 Overview

Baker's Inn POS is a business-focused web application designed to digitize and streamline day-to-day bakery and retail operations.

The system brings core operational workflows into a centralized platform, allowing authorized users to manage products, process sales, monitor inventory, work across branches, and access business information through a modern responsive interface.

The project was developed with a focus on:

- Maintainable application architecture
- Type-safe development
- Relational database design
- Secure authentication
- Business-oriented workflows
- Responsive user experience
- Reliable data management
- Production-ready deployment

---

## 🎯 Problem Statement

Traditional retail and bakery operations can become difficult to manage when sales, products, inventory and branch-level information are handled through disconnected systems or manual processes.

Baker's Inn POS aims to provide a centralized digital solution where operational data can be managed through a single web application.

The system is designed around the following business requirements:

- Fast point-of-sale operations
- Product and pricing management
- Inventory monitoring
- Branch-aware operations
- Sales tracking
- Business reporting
- Controlled user access
- Reliable database persistence

---

## ✨ Core Features

### 🛒 Point of Sale

- Product-based sales workflow
- Cart management
- Quantity handling
- Pricing calculations
- Order totals
- Checkout workflow
- Sales transaction processing

### 📦 Product Management

- Product catalog
- Product identification
- Product pricing
- Product availability
- Product-related inventory information

### 📊 Inventory Management

- Inventory tracking
- Stock quantity management
- Inventory updates
- Product stock visibility
- Inventory-related business workflows

### 🏢 Branch Management

Designed to support multi-branch retail operations and branch-aware workflows.

Example deployment structure:

- Main Branch
- Sub-branches
- Branch-specific operational data

### 📈 Dashboard & Reporting

The application provides business-oriented views for monitoring operational information such as:

- Sales
- Products
- Inventory
- Branches
- Operational metrics

### 🔐 Authentication & Access Control

The application includes authentication infrastructure for controlling access to protected areas of the system.

---

## 🏗️ Architecture

The project follows a modular Next.js application structure.

┌─────────────────────────────┐
│          User / POS         │
│        Web Interface        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│          Next.js            │
│       App Router            │
├─────────────────────────────┤
│ Pages / Components          │
│ Server Actions              │
│ Application Logic           │
│ Authentication              │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│           Prisma            │
│       ORM / Data Layer      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        PostgreSQL           │
│        Relational DB        │
└─────────────────────────────┘

🛠️ Technology Stack
Frontend
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Lucide React
Backend / Application Layer
Next.js App Router
Server-side application logic
Server Actions
Authentication
Database
PostgreSQL
Prisma ORM
Additional Technologies
NextAuth
Dexie
Recharts
bcrypt
ESLint
TypeScript

The current repository package configuration confirms the use of Next.js 16, React 19, Prisma, PostgreSQL (pg), NextAuth, Dexie, Recharts, Tailwind and related libraries.

📂 Project Structure
bakers-inn-pos/
│
├── actions/
│   └── Application/server actions
│
├── app/
│   ├── Application routes
│   ├── Pages
│   └── Layouts
│
├── components/
│   └── Reusable UI components
│
├── lib/
│   └── Utilities and application logic
│
├── prisma/
│   └── Database schema and database utilities
│
├── public/
│   └── Static assets
│
├── types/
│   └── TypeScript types
│
├── middleware.ts
├── next.config.ts
├── prisma.config.ts
├── package.json
└── README.md


🗄️ Database

The application uses PostgreSQL as its relational database and Prisma as the ORM/data-access layer.

The database layer is responsible for persistent business data including entities related to:

Products
Inventory
Sales
Branches
Users
Operational records

Prisma provides type-safe database access and helps maintain a structured data model.

🔐 Security Considerations

The project is designed with several security considerations:

Authentication for protected application areas
Password hashing
Server-side database access
Environment-based configuration
Sensitive credentials excluded from source control
Type-safe application development

Never commit .env, database credentials, API secrets or production authentication secrets to the repository.

⚙️ Getting Started
Prerequisites

Make sure you have:

Node.js
npm
PostgreSQL
Git

installed on your system.

1. Clone the repository
git clone https://github.com/MuhammadZain77/bakers-inn-pos.git
cd bakers-inn-pos
3. Install dependencies
npm install
3. Configure environment variables

Create a .env or .env.local file according to the application's configuration.

Example:

DATABASE_URL="your_postgresql_connection_string"

NEXTAUTH_SECRET="your_auth_secret"
NEXTAUTH_URL="http://localhost:3000"

Use the actual environment variables required by the current source code. Never publish real credentials.

4. Configure the database

Run the appropriate Prisma commands for your environment.
For example:

npx prisma generate

Then apply your database schema/migrations according to the project's Prisma configuration.

5. Start the development server
npm run dev

Open:

http://localhost:3000

Available Scripts
npm run dev

Starts the development server.

npm run build

Creates a production build.

npm run start

Starts the production server.

npm run lint

Runs linting.

🌐 Live Demo

Production Application:

https://bakers-inn-pos.vercel.app/

📈 Future Improvements

Potential future improvements include:

Advanced sales analytics
Enhanced inventory forecasting
More detailed branch reporting
Improved audit logging
Advanced role-based permissions
Automated reporting
Additional integrations
Improved offline resilience
Expanded business intelligence capabilities

🧠 Engineering Focus

This project demonstrates practical experience in:

Full-stack web development
Next.js application architecture
TypeScript
PostgreSQL database design
Prisma ORM
Authentication
Business application development
Inventory management
POS workflows
Responsive UI development
Production deployment

👨‍💻 Author

Muhammad Zain Chawala
Data Analyst & Web Developer
GitHub: https://github.com/MuhammadZain77
LinkedIn: https://www.linkedin.com/in/mohammad-zain77/




