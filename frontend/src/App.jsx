import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { fetchCurrentUser, logoutUser } from "./api/auth.js";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AddBook from "./pages/AddBook/AddBook.jsx";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import BookDetails from "./pages/BookDetails/BookDetails.jsx";
import MyListings from "./pages/MyListings/MyListings.jsx";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchCurrentUser();
        setUser(data.user || null);
      } catch (error) {
        console.error(error);
        setUser(null);
      }
    }

    loadUser();
  }, []);

  async function handleLogout() {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  }

  function handleLogin(userData) {
    setUser(userData);
  }

  return (
    <BrowserRouter>
      <Header user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/books/:id" element={<BookDetails user={user} />} />
        <Route path="/my-listings" element={<MyListings user={user} />} />
        <Route path="/add" element={<AddBook user={user} />} />
        <Route path="/edit/:id" element={<AddBook user={user} />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

{/* Peer Review Comments

First of all, this is a really nice project idea. A used book marketplace for students is super practical and the UI is clean.

- In BookDetails.jsx, the dynamic import with try/catch for the reviews API is a smart way to handle module independence. The book page still works fine even if reviews are unavailable.

- Good job using a separate data access layer (data/books.js, data/reviews.js) to keep all the MongoDB operations out of the route handlers. It really kept things organized.

Small suggestions:

- In routes/books.js, the GET /sorted/rating endpoint queries the database 
directly with getDb() instead of going through the data layer like every other route does. Moving that into data/books.js would keep things consistent and avoid duplicating the db access pattern.

- One more thing I would say is that right now the home page jumps straight into the book grid, so a new user doesn't really know what the site is about until they start clicking around. Adding a small landing section or hero banner explaining what Second-Shelf is and how to get started would make the first visit a lot smoother.

- It looks like a user can leave a review on their own listing — there's no check inthe POST /api/reviews route or on the frontend to prevent that. Might be worth adding a quick sellerId check so sellers can't rate their own books. */}

