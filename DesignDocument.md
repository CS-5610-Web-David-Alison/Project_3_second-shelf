# Second-Shelf
### Design Document

**Authors:** Alison Avery and David Ahn
**Course:** Project 3 – Node + Express + MongoDB + React
**License:** MIT

---

## Project Description

Second-Shelf is a full stack e-commerce platform designed to help readers discover, buy, and sell used books. Many readers accumulate books they no longer need while simultaneously searching for affordable copies of titles they want. Second-Shelf addresses both sides of this exchange in a single platform.

The application separates two core concerns:

**Book Marketplace Engine**
Users can create, browse, edit, and delete book listings. Each listing includes structured attributes such as title, author, price, condition, and availability. This module functions independently as a complete used book catalog and listing platform, without requiring the review system.

**Review and Rating Engine**
Users can leave ratings and written reviews on any book, edit or delete their own reviews, and browse books sorted by community rating. This module functions independently as a book review platform without requiring the marketplace features.

By combining a structured marketplace with community-driven review data, Second-Shelf helps readers make confident purchasing decisions while giving used books a second life.

The application is built using:

- Node.js + Express (REST backend)
- MongoDB (Official Node.js Driver)
- React 18 with Hooks (client-side rendering)
- Vite (frontend build tool)
- Passport.js + express-session (authentication)

---

## Usability Improvements (Project 4 Update)

Based on usability testing with multiple participants and applying established design principles such as visual hierarchy, consistency, accessibility, and feedback, key improvements were implemented to enhance user experience.

### 1. Keyboard Accessibility (REQUIRED)
- All interactive elements such as buttons, links, forms are accessible through keyboard navigation.
- Users can navigate through the application with the **Tab key**.
- Visible focus indicators were added to improve usability for keyboard users.
- Modals support keyboard interactions:
  - `Escape` closes modals
  - Focus is moved into the modal when opened

---

### 2. Focus Management
- Focus is managed using `useEffect` and `useRef`.
- After navigation or modal opening, focus is directed to the most relevant element such as page heading or modal container.
- Focus returns to the triggering element when modals are closed.

---

### 3. Visual Hierarchy and Layout Improvements
- Improved spacing and alignment across all pages using consistent margins and layout structure.
- Clear separation between sections using headings and grouping.
- Consistent use of typography and color to emphasize important elements such as Book titles, Prices, and Call to action buttons

---

### 4. Color Contrast and Accessibility (WCAG Compliance)
- Updated color palette.
- Ensured all text elements meet a minimum contrast ratio.
- Improved readability for Navigation buttons, Ratings, and  Review text
- Verified using **Lighthouse** or **Axe DevTools**.

---

### 5. Semantic HTML and Accessibility Enhancements
- Added proper semantic landmarks
- Structured heading hierarchy (`h1 → h2 → h3`)
- Removed incorrect heading usage in non-content areas 
- Added `aria` attributes for modals and interactive components.

---

### 6. User Feedback Improvements
- Added clear feedback messages for user actions:
  - Review creation, editing, and deletion
  - Book creation and updates
- Error messages are displayed when actions fail.
- Success messages confirm completed actions.

---

### 7. Modal-Based User Flows
- Implemented accessible modal dialogs for Logout confirmation and Login prompts when accessing restricted pages.
- Modals improve clarity and prevent accidental actions.

---

### 8. Improved Discoverability
- Added clear call to action buttons such as “Sell a Book” and “Log in to continue”
- Improved navigation clarity and reduced confusion for users.

---

### 9. Sorting UX Improvements
- Clarified sorting functionality:
  - Updated button label to **“Sort by Highest Rating”**
  - Toggle switches between default and sorted views
- Reduced confusion observed during usability testing.

---

### 10. Visual Design Enhancements (Images)
- Added book images to listings to improve visual engagement.
- Improves scanning and recognition of content.
- Enhances overall aesthetic and usability.

---

## System Goals

The primary goals of this system are:

- Provide clean, independent CRUD management for book listings.
- Provide clean, independent CRUD management for reviews and ratings.
- Maintain separation of concerns between the marketplace and review modules.
- Deliver a responsive, client-side rendered React frontend using Hooks throughout.
- Ensure each module degrades gracefully if the other is unavailable.

---


## User Personas

**Emma — The Budget Reader**
Emma is a college student who loves reading but cannot afford to buy new books regularly. She wants to quickly browse affordable used listings and filter by price and condition before committing to a purchase.

**Marcus — The Book Collector**
Marcus enjoys finding older or rare editions and values detailed condition descriptions and organized catalogs. He wants to list books from his collection with accurate descriptions and fair prices.

**Nina — The Community Reviewer**
Nina has strong opinions about the books she reads and enjoys helping others decide whether a book is worth reading. She wants to leave detailed reviews, update her opinions over time, and discover highly-rated books from the community.

---

## User Stories

### Alison Avery — Book Marketplace Engine (Books Collection)

- As a user, I want to browse a catalog of used books, so I can discover books that are available for sale.
- As a user, I want to view detailed information about a book listing including title, author, price, condition, and description, so I can decide whether the book interests me.
- As a user, I want to add a new book listing, so I can sell or share books I no longer need.
- As a user, I want to edit or remove my book listings, so I can update the information if the book is sold or the price changes.
- As a user, I want to search listings by title or author, so I can quickly find what I am looking for.

**Independent value:** This module functions as a complete used book catalog and listing platform without the review system.

### David Ahn — Review and Rating Engine (Reviews Collection)

- As a user, I want to leave a rating and review for a book, so I can share my experience with other readers.
- As a user, I want to see reviews and ratings on each book's page, so I can evaluate the book before deciding to purchase or read it.
- As a user, I want to edit or delete my reviews, so I can update my feedback if my opinion changes.
- As a user, I want to view books sorted by highest rating, so I can easily discover highly recommended books.

**Independent value:** This module functions as a book review platform where users can rate and discuss books without the marketplace features.

---

## Data Model Design

### books Collection

Each book document contains:

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | MongoDB document identifier |
| `title` | String | Book title |
| `author` | String | Book author |
| `price` | Number | Listing price in USD |
| `condition` | String | One of: `Like New`, `Good`, `Fair`, `Poor` |
| `description` | String | Optional seller description |
| `available` | Boolean | Whether the listing is still active |
| `sellerId` | String | Username of the seller |
| `createdAt` | Date | Listing creation timestamp |

**Design considerations:**
- `sellerId` links a listing to the seller without a foreign key join, keeping the module self-contained.
- `available` allows soft-removal of sold listings without deleting historical data.
- `condition` is constrained to four values and validated server-side.

### reviews Collection

Each review document contains:

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | MongoDB document identifier |
| `bookId` | String | The `_id` of the book being reviewed |
| `userId` | String | The `_id` of the reviewing user |
| `username` | String | Display name of the reviewer |
| `rating` | Number | Integer from 1 to 5 |
| `body` | String | Optional written review text |
| `createdAt` | Date | Review creation timestamp |

**Design considerations:**
- `bookId` is the shared identifier across both modules — the only point of coupling.
- `username` is stored directly on the review to avoid a user lookup on every read.
- No derived scores are stored; average ratings are computed at read time.

### users Collection

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | MongoDB document identifier |
| `username` | String | Unique username |
| `password` | String | Hashed password |
| `createdAt` | Date | Account creation timestamp |

---

## API Design

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user account |
| POST | `/api/auth/login` | Log in with username and password |
| POST | `/api/auth/logout` | End the current session |
| GET | `/api/auth/me` | Return the currently logged-in user |

### Books (Alison Avery)

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| GET | `/api/books` | Retrieve all book listings | No |
| GET | `/api/books/:id` | Retrieve a single listing by id | No |
| POST | `/api/books` | Create a new listing | Yes |
| PUT | `/api/books/:id` | Update a listing (owner only) | Yes |
| DELETE | `/api/books/:id` | Delete a listing (owner only) | Yes |

### Reviews (David Ahn)

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| GET | `/api/reviews/:bookId` | Retrieve all reviews for a book | No |
| GET | `/api/reviews/top-rated` | Retrieve books sorted by average rating | No |
| POST | `/api/reviews` | Submit a new review | Yes |
| PUT | `/api/reviews/:id` | Update a review (author only) | Yes |
| DELETE | `/api/reviews/:id` | Delete a review (author only) | Yes |

---

## Architecture

The application follows a clear 3-Tier Architecture:

**Client Layer**
- React 18 with Hooks (no class components)
- Client-side rendering via Vite
- Fetch API for all backend communication (no axios)
- Each component in its own file with a matching CSS file
- React Router for client-side page navigation
- Accessibility enhancements including focus management and keyboard navigation
- Global styling improvements to maintain visual consistency and contrast compliance

**Server Layer**
- Node.js runtime with Express
- Route modules separated by domain: `/api/auth`, `/api/books`, `/api/reviews`
- Data access layer separated from route handlers (`data/books.js`, `data/reviews.js`)
- Passport.js local strategy for session-based authentication
- Input validation in `utils/validation.js` before any database operation

**Database Layer**
- MongoDB using the official Node.js driver (no Mongoose)
- Three collections: `books`, `reviews`, `users`
- The `books` and `reviews` modules are independently operable
- The only shared identifier between modules is `bookId`

---

# Design Mockups

## System Architecture Wireframe

![Architecture](screenshots/wireframe.png)

## Frontend Layout

![Frontend](screenshots/frontend-wire-1.png)

![Frontend](screenshots/frontend-wire-2.png)

![Frontend](screenshots/frontend-wire-3.png)

---

## UI Layout

The interface is divided into the following views:

**Home Page (`/`)**
- Hero section with page heading and real-time search bar
- Responsive grid of BookCard components
- Each card shows title, author, condition badge, price, and a link to the detail page
- Sorting toggle with clear labeling (“Sort by Highest Rating”)
- Improved visual hierarchy and spacing for better readability

**Book Detail Page (`/books/:id`)**
- Full listing information: title, author, price, condition badge, average rating, description
- Edit and Delete controls visible only to the listing's owner
- Community reviews list with star ratings and written feedback
- Review submission form visible only to logged-in users
- Degrades gracefully if the Reviews module is unavailable
- Accessible review interactions with inline feedback messages
- Improved rating visibility with accessible contrast-compliant styling

**Add / Edit Listing Page (`/add`, `/edit/:id`)**
- Single reusable form component handles both create and edit modes
- Pre-populates fields from the existing listing when editing
- Redirects to the listing detail page on successful submission

**Header (all pages)**
- Site logo linking to the home page
- Navigation links: Browse, Sell a Book (when logged in)
- Login/logout controls with accessible modal dialogs
- Logout includes a confirmation modal to prevent accidental actions
- Login prompts are shown via modal when accessing restricted pages

---

## Module Independence

Each module is designed to be independently operable:

- The **Books module** loads and functions fully without the Reviews module. The BookDetails page uses a dynamic import for the reviews API wrapped in a try/catch — if the module is absent or the endpoint is unreachable, the listing page renders completely without the reviews section.
- The **Reviews module** stores `bookId` as a plain string reference rather than a relational join, so it can operate against any book identifier without requiring the Books module to be active.

---

## File Structure

```
second-shelf/
  backend/
    config/         # MongoDB connection, Passport setup
    data/           # Database access layer (one file per collection)
    middleware/     # Auth middleware
    routes/         # Express route handlers
    scripts/        # Database seed script (1000 books, 1000 reviews, 5 users)
    utils/          # Input validation helpers
  frontend/
    src/
      api/          # Fetch wrappers for each backend endpoint group
      components/   # Reusable UI components (BookCard, BookForm, ReviewList, etc.)
      pages/        # Page-level components (Home, BookDetails, AddBook)
```

---

## License

MIT License — see [LICENSE](./LICENSE) for full text.
