import "dotenv/config";
import { MongoClient } from "mongodb";

const TITLES = [
  "The Great Gatsby",
  "1984",
  "To Kill a Mockingbird",
  "Brave New World",
  "The Catcher in the Rye",
  "Of Mice and Men",
  "Fahrenheit 451",
  "The Hobbit",
  "Harry Potter",
  "The Alchemist",
  "Dune",
  "Ender's Game",
  "Neuromancer",
  "The Road",
  "No Country for Old Men",
];
const AUTHORS = [
  "F. Scott Fitzgerald",
  "George Orwell",
  "Harper Lee",
  "Aldous Huxley",
  "J.D. Salinger",
  "John Steinbeck",
  "Ray Bradbury",
  "J.R.R. Tolkien",
  "J.K. Rowling",
  "Paulo Coelho",
  "Frank Herbert",
  "Orson Scott Card",
  "William Gibson",
  "Cormac McCarthy",
];
const CONDITIONS = ["Like New", "Good", "Fair", "Poor"];
const USERNAMES = [
  "emma_reads",
  "marcus_collects",
  "bookworm99",
  "pageturner",
  "literarylife",
];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

async function seed() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db();

  await db.collection("books").deleteMany({});

  await db.collection("users").deleteMany({});

  // Seed users
  const users = USERNAMES.map((u) => ({
    username: u,
    password: "password123",
    createdAt: new Date(),
  }));
  await db.collection("users").insertMany(users);

  // Seed 1000 books
  const books = Array.from({ length: 1000 }, (_, i) => ({
    title: `${rand(TITLES)} (Vol. ${(i % 10) + 1})`,
    author: rand(AUTHORS),
    price: randFloat(1, 25),
    condition: rand(CONDITIONS),
    description: `A well-loved copy in ${rand(CONDITIONS).toLowerCase()} condition. A great addition to any collection.`,
    available: Math.random() > 0.1,
    sellerId: rand(USERNAMES),
    createdAt: new Date(),
  }));
  const { insertedIds } = await db.collection("books").insertMany(books);

}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
