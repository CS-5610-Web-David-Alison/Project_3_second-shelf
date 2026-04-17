# Second-Shelf

A community marketplace for discovering and reviewing used books.

## Author 

David Ahn 

## Class Link
This project was completed as part of:
Web Development CS5610 (Spring 2026) Professor John Guerra Northeastern University

[(https://johnguerra.co/classes/webDevelopment_online_spring_2026/)]

## Design Documentation
Design Document:
[DesignDocument.md](DesignDocument.md)

## Demo
Public Deployment:
[https://project-4-second-shelf.onrender.com/]

GitHub Repository:
[https://github.com/CS-5610-Web-David-Alison/Project_3_second-shelf/tree/David_Ahn_Project_4_Usability_Update]

Application Walkthrough:
[https://youtu.be/3CvYk5Oe7SY]

Google Slides Presentation:
[https://docs.google.com/presentation/d/1QRzHVsBQ5N1guxiJ5P5ptqNMpx_RePCZPZXjvOEQnpo/edit?usp=sharing]


# Project Objective

Second-Shelf is a full stack web application to help users buy, sell, and review used books within a marketplace. Many students and readers have books they no longer need, or are looking for affordable options. This platform connects both groups and enhances decision making through community reviews.

The platform is built with two independent modules:

- **Book Marketplace Engine** — handles listing and browsing books, including full CRUD operations on the Books collection. 

- **Review and Rating Engine** — enables readers to rate and review books, including full CRUD operations on the Reviews collection. 

By combining structured CRUD operations with community feedback, the system creates a practical and scalable book exchange platform.

The primary goals of this system are:

1. Provide full CRUD functionality for book listings.
2. Provide full CRUD functionality for user reviews.
3. Implement secure user authentication using Passport.
4. Allow users to manage their own listings and reviews.
5. Provide rating-based insights for better decision making.
6. Maintain clean separation between frontend, backend, and database layers.

Each module is fully independent — the app continues to function if either module is disabled. Together they demonstrate a complete full stack application using Node.js, Express, React with Hooks, and MongoDB.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (client-side rendering, Hooks) |
| Backend | Node.js + Express |
| Database | MongoDB (native Node.js driver) |
| Auth | Passport.js (local strategy) + express-session |
| Build tool | Vite |

---

## Screenshots

### Home Pages
![Home page](screenshots/home.png)
![User home page](screenshots/loggedInHome.png)

### Login and Register Pages
![Login Page](screenshots/login.png)
![Register Page](screenshots/register.png)

### Book Pages
![Sell a book page](screenshots/register.png)
![Book information page showing reveiw form](screenshots/bookPage.png)
![My listings page](screenshots/myListings.png)

---
## Usage

| Action | How |
|--------|-----|
| Browse books | Visit the home page — all listings are shown in a grid |
| View a listing | Click any book card to see full details and reviews |
| Log in | Click "Log In" in the header and enter your credentials |
| Sell a book | Log in, then click "Sell a Book" in the header |
| Edit / delete a listing | Log in as the seller and visit the listing's detail page |
| Leave a review | Log in and scroll to the reviews section on any listing page |
---

## Instructions to Build

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- [MongoDB](https://www.mongodb.com) — local installation or a free [Atlas](https://www.mongodb.com/atlas) cluster
- [Git](https://git-scm.com)

Check your versions:
```bash
node -v
npm -v
git -v
```

---

### 1. Clone the repository

```bash
git clone https://github.com/CS-5610-Web-David-Alison/Project_3_second-shelf
cd second-shelf
```

---

### 2. Set up the backend

```bash
cd backend
npm install
```

Create your environment file:
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=second_shelf
SESSION_SECRET=your_secret_key
PORT=3000
```

---

### 3. Seed the database

```bash
npm run seed
```

Expected output:
```
Seeded 1000 books, 1000 reviews, and 5 users.
```

> Test accounts: usernames `emma_reads`, `marcus_collects`, `bookworm99`, `pageturner`, `literarylife` — all with password `password123`

---

### 4. Start the backend

```bash
npm run dev
```

Expected output:
```
Connected to MongoDB
Server running on http://localhost:3000
```

Leave this terminal running.

---

### 5. Set up and start the frontend

Open a **new terminal tab**, then:

```bash
cd frontend
npm install
npm run dev
```

Expected output:
```
VITE ready in Xms
➜ Local: http://localhost:5173/
```

---

### 6. Open the app

Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## Project Structure

```
second-shelf/
  backend/          # Node.js + Express API
    config/         # MongoDB connection and Passport setup
    data/           # Database access layer (one file per collection)
    middleware/     # Auth middleware
    routes/         # Express route handlers
    scripts/        # Database seed script
    utils/          # Input validation helpers
  frontend/         # React client-side app
    src/
      api/          # Fetch calls to the backend API
      components/   # Reusable UI components (each with its own CSS file)
      pages/        # Page-level components
```

---

## License

This project is licensed under the [MIT License](./LICENSE).