//routes/books.js
//Express router for all /api/books endpoints
//Handles CRUD operations for book listings
//Authentication is required for POST, PUT, and DELETE routes
//All database operations are delegated to data.books.js

import { Router } from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../data/books.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBook } from "../utils/validation.js";

const router = Router();

/**
 * GET /api/books
 * Returns all book listings in the database
 * Public - no authentication required
 */
router.get("/", async (req, res) => {
  const books = await getAllBooks();
  res.json(books);
});

/**
 * GET /api/books/:id
 * Returns a single book listing by its MongoDB _id
 * Public - no authentication required
 * Responds with 404 if no book is found with the given _id
 */
router.get("/:id", async (req, res) => {
  const book = await getBookById(req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

/**
 * POST /api/books
 * Creates a new book listing
 * Protected- requires the user to be logged in
 * Validates the request body before inserting
 * Attaches the logged-in user's id as sellerId on the new document
 * Reponds with 400 if validation fails,201 with insertedId on success
 */
router.post("/", requireAuth, async (req, res) => {
  const err = validateBook(req.body);
  if (err) return res.status(400).json({ error: err });
  const result = await createBook({
    ...req.body,
    sellerId: req.user._id.toString(),
  });
  res.status(201).json({ insertedId: result.insertedId });
});

/**
 * PUT /api/books/:id
 * Updates an existing book listing by its MongoDB _id
 * Protected - requires the user to be logging in
 * Reponds with 404 if the book does not exist
 * Responds with 403 if the logged-in user is not the seller
 * Responds with 200 and a comfirmation message on success
 */
router.put("/:id", requireAuth, async (req, res) => {
  const book = await getBookById(req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  if (book.sellerId !== req.user._id.toString())
    return res.status(403).json({ error: "Forbidden" });
  await updateBook(req.params.id, req.body);
  res.json({ message: "Book updated" });
});

/**
 * DELETE /api/books/:id
 * Deletes a book listing by its MongoDB _id
 * Protected - requires the user to be logged in
 * Responds with 404 if the book does not exist
 * Responds with 403 if the logged in user is not the seller
 * Responds with 200 and a confirmation message on success
 */
router.delete("/:id", requireAuth, async (req, res) => {
  const book = await getBookById(req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  if (book.sellerId !== req.user._id.toString())
    return res.status(403).json({ error: "Forbidden" });
  await deleteBook(req.params.id);
  res.json({ message: "Book deleted" });
});

export default router;
