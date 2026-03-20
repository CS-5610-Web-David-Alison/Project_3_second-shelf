# Second-Shelf

A full-stack web application built with Node.js, Express, MongoDB (Node Driver), and React (Vite + Hooks) that allows users to buy, sell, and review used books within a community-driven marketplace.

---

## Author

**David Ahn and Alison Avery**

Align Master of Science in Computer Science  
Northeastern University

---

## Course Reference

This project was completed as part of:

**Web Development (Spring 2026)**  
Professor John Guerra  

https://johnguerra.co/classes/webDevelopment_online_spring_2026/

---

## Live Demo

- **Public Deployment:**

  https://project-3-second-shelf.onrender.com/

- **GitHub Repository:**

  https://github.com/CS-5610-Web-David-Alison/Project_3_second-shelf

---

## Design Documentation

**Design Document:**

[DesignDocument.md](./DesignDocument.md)

---

## Demo Video

**Application Walkthrough:**

*(Add your YouTube link here)*

---

## Screenshots

### Home Page
![Home Screenshot](docs/home.png)

### Book Details Page
![Book Details Screenshot](docs/book-details.png)

### Add Book Page
![Add Book Screenshot](docs/add-book.png)

### Reviews Section
![Reviews Screenshot](docs/reviews.png)

---

## System Architecture

This application follows a **3-tier architecture**:

- **Frontend (React + Vite + Hooks)**
- **Backend (Node + Express REST API)**
- **Database (MongoDB using Official Node Driver)**

The Express server:
- serves static React build files (`frontend/dist`)
- exposes REST API endpoints under:
  - `/api/auth`
  - `/api/books`
  - `/api/reviews`

Authentication is handled using **Passport (Local Strategy)** with session-based authentication.

---

## Features

### Authentication (Users Collection)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Features:
- secure password hashing (bcrypt)
- session-based authentication (Passport)
- persistent login via cookies

---

### Books Collection (Full CRUD)

- `GET /api/books`
- `GET /api/books/:id`
- `POST /api/books`
- `PUT /api/books/:id`
- `DELETE /api/books/:id`

Features:
- users can create listings
- only the owner can edit/delete their listings
- includes:
  - title
  - author
  - price
  - condition
  - description
  - sellerId

---

### Reviews Collection (Full CRUD)

- `GET /api/reviews/book/:bookId`
- `POST /api/reviews`
- `PUT /api/reviews/:id`
- `DELETE /api/reviews/:id`

Features:
- users can leave ratings (1–5) and reviews
- users can edit/delete their own reviews
- reviews are tied to books and users
- average rating displayed per book

---

### Additional Features

- View books in a responsive grid
- View detailed book pages
- Leave and manage reviews
- View personal listings ("My Listings")
- Authentication-aware UI (login/register/logout)
- Session-based user state management
- Responsive UI using Bootstrap

---

## Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB (Official Node Driver)
- Passport.js (Local Strategy)
- express-session
- bcrypt

---

### Frontend

- React (Hooks)
- Vite
- React Router
- Fetch API (AJAX)
- Bootstrap
- Component-based CSS

---

### Tooling

- ESLint
- Prettier
- MongoDB Atlas (production)
- Docker (local MongoDB optional)

---

## Instructions to Build & Run Locally

### Clone the Repository

```bash
git clone https://github.com/CS-5610-Web-David-Alison/Project_3_second-shelf.git
cd Project_3_second-shelf
```
---

### Install Dependencies

```bash
cd frontend
npm install

cd ../backend
npm install
```

---

### Environment Variable

Creat a `.env` file inside `/backend`

```bash
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=second_shelf
SESSION_SECRET=your_secret_key
PORT=3000
```
---

### Start MongoDB (Docker)

```bash
docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
```

---

### Run the Application

#### Development Mode

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```
----
#### Production Mode (Full Stack)

```bash
cd frontend
npm run build

cd ../backend
npm start
```

Open:

```bash
http://localhost:3000
```

---


### Database Seeding

Populate the database with 10000+ records:

```bash
cd backend
npm run seed
```



---

## Project Structure

```text
backend/
  config/        → MongoDB + Passport configuration
  data/          → Data access layer (books, users, reviews)
  routes/        → Express routes
  middleware/    → Authentication middleware
  utils/         → Validation helpers
  scripts/       → Seed script
  server.js      → Express entry point

frontend/
  src/
    api/         → Fetch API calls
    components/  → Reusable UI components
    pages/       → Page-level components
  dist/          → Production build
```

---

## Architectural Highlights

- Separation of concerns (routes, data layer, config)
- Session-based authentication with Passport
- MongoDB native driver (no Mongoose)
- Component based React architecture
- RESTful API design
- Server side static hosting of frontend
- Scalable structure for additional features

---

## Future Improvements

- Book search and filtering
- Sorting by highest rating
- Pagination for large datasets
- Image uploads for books
- User profiles
- Notifications system
- Improved UI/UX and accessibility

---

## License

MIT License
