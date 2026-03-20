# Second-Shelf

**Authors:** David Ahn and Alison Avery  

**Course:** Project 3 – Node + Express + Mongo + React  

**License:** MIT  

---

# Project Description

Second-Shelf is a full stack web application to help users buy, sell, and review used books within a community-driven marketplace. Many students and readers accumulate books they no longer need, while others look for affordable options. This platform connects both groups and enhances decision-making through community reviews.

The application focuses on:

## Book Marketplace Management

Users can create, update, and delete book listings. Each listing includes structured attributes such as title, author, condition, price, and description. Users can browse listings, view details, and manage their own listings independently.

## Review & Rating System

Users can leave ratings and written reviews for books. These reviews help other users evaluate listings before purchasing or reading. The system aggregates ratings to provide average scores and improve discoverability.

By combining structured CRUD operations with community feedback, the system creates a practical and scalable book exchange platform.

The application is built using:

- **Node.js + Express** (REST backend)
- **MongoDB (Official Node Driver)**
- **React (Vite + Hooks)**
- **Bootstrap + Modular CSS**
- **Passport.js (Authentication)**

---

# System Goals

The primary goals of this system are:

1. Provide full CRUD functionality for book listings.
2. Provide full CRUD functionality for user reviews.
3. Implement secure user authentication using Passport.
4. Allow users to manage their own listings and reviews.
5. Provide rating-based insights for better decision making.
6. Maintain clean separation between frontend, backend, and database layers.

---

## User Personas

Emma — The Budget Reader  
A college student who loves reading but cannot afford to buy new books regularly. She wants to browse affordable used books.

Marcus — The Book Collector  
Enjoys finding older or rare editions. He values organized catalogs and detailed descriptions of book condition.

Nina — The Community Reviewer  
Likes sharing opinions about books she has read and helping others decide whether a book is worth reading.

---

## User Stories

### Book Listings (Books)

- As a user, I want to browse a catalog of used books, so I can discover books that are available for sale.
- As a user, I want to view detailed information about a book listing, including title, author, price, condition, and description, so I can decide whether the book interests me.
- As a user, I want to add a new book listing, so I can sell or share books I no longer need.
- As a user, I want to edit or remove my book listings, so I can update the information if the book is sold or the price changes.

### Reviews (Reviews)

- As a user, I want to leave a rating and review for a book, so I can share my experience with other readers.
- As a user, I want to see reviews and ratings on each book’s page, so I can evaluate the book before deciding to purchase or read it.
- As a user, I want to edit or delete my reviews, so I can update my feedback if my opinion changes.
- As a user, I want to view books sorted by highest rating, so I can easily discover highly recommended books.

### Authentication (Users)

- As a user, I want to register an account so I can access features.
- As a user, I want to log in securely so my data is protected.
- As a user, I want to log out so I can safely exit the system.
- As a user, I want only my own listings and reviews to be editable by me.

---

# Data Model Design

## users Collection

Each user document contains:

- `_id` (ObjectId)
- `name` (String)
- `email` (String)
- `passwordHash` (String)
- `createdAt` (Date)

Design considerations:

- Passwords are hashed using bcrypt.
- Email is used for authentication.
- No sensitive data is exposed.

---

## books Collection

Each book document contains:

- `_id` (ObjectId)
- `title` (String)
- `author` (String)
- `price` (Number)
- `condition` ("Like New" | "Good" | "Fair" | "Poor")
- `description` (String)
- `sellerId` (String)
- `createdAt` (Date)

Design considerations:

- Seller ID links listings to users.
- Structured condition values ensure consistency.
- Price stored as number for sorting/filtering.

---

## reviews Collection

Each review document contains:

- `_id` (ObjectId)
- `bookId` (ObjectId)
- `userId` (String)
- `userName` (String)
- `rating` (Number 1–5)
- `reviewText` (String)
- `createdAt` (Date)
- `updatedAt` (Date)

Design considerations:

- Reviews are tied to both users and books.
- Ratings allow aggregation (average score).
- Updated timestamp supports edit tracking.

---

# API Design

## Authentication

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| POST   | /api/auth/register   | Register new user        |
| POST   | /api/auth/login      | Login user               |
| POST   | /api/auth/logout     | Logout user              |
| GET    | /api/auth/me         | Get current user session |

---

## Books

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| GET    | /api/books       | Retrieve all books    |
| GET    | /api/books/:id   | Retrieve single book  |
| POST   | /api/books       | Create book listing   |
| PUT    | /api/books/:id   | Update listing        |
| DELETE | /api/books/:id   | Delete listing        |

---

## Reviews

| Method | Endpoint                        | Description                |
| ------ | ------------------------------- | -------------------------- |
| GET    | /api/reviews/book/:bookId       | Get reviews for a book     |
| POST   | /api/reviews                   | Create review              |
| PUT    | /api/reviews/:id               | Update review              |
| DELETE | /api/reviews/:id               | Delete review              |

---

# System Design (Architecture)

The application follows a **3-tier architecture**:

### Client Layer

- React (Hooks)
- Component-based structure
- React Router for navigation
- Fetch API for AJAX requests

---

### Server Layer

- Node.js runtime
- Express REST API
- Route modules:
  - `/auth`
  - `/books`
  - `/reviews`
- Middleware for authentication

---

### Database Layer

- MongoDB (Node Driver)
- Collections:
  - `users`
  - `books`
  - `reviews`

All CRUD operations are handled through the backend.

---

# Design Mockups

## System Architecture Wireframe

![Architecture](docs/wireframe.png)

## Frontend Layout

![Frontend](docs/frontend-wire.png)

---

# UI Layout Description

### Navigation (Header)

- Home
- Sell a Book
- My Listings
- Login/Register or Logout

---

### Home Page

- Grid of book listings
- Each card shows:
  - title
  - author
  - price
  - condition

---

### Book Details Page

- Full book information
- Average rating display
- Review list
- Review form (if logged in)

---

### Add/Edit Book Page

- Form to create or update listings
- Input fields for all book attributes

---

### My Listings Page

- Displays books created by the logged-in user
- Allows edit/delete actions

---

# Local Development Environment

MongoDB can run locally using:

```bash
mongodb://localhost:27017
```

Or Docker:

```bash
docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
```

---

## Architectural Justification

The system design ensures:

- Full CRUD functionality across multiple collections
- Secure authentication with Passport
- separation of frontend, backend, and database
- No Mongoose, Axios, or CORS
- Scalable and modular architecture

---

## License

MIT License