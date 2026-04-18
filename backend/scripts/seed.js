import "dotenv/config";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

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

const USERS = [
  { name: "Emma", email: "emma@example.com" },
  { name: "Marcus", email: "marcus@example.com" },
  { name: "Nina", email: "nina@example.com" },
  { name: "Allison", email: "allison@example.com" },
  { name: "David", email: "david@example.com" },
];

const BOOK_IMAGES = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVU3F0ghKN83Mv-wB7GCJWyWA4Ql6JiZ_k5A&s",
  "https://i1.pickpik.com/photos/940/488/984/book-cover-hardcover-knowledge-preview.jpg",
  "https://unrulyguides.com/wp-content/uploads/2011/12/generic-cover.jpg",
  "https://d827xgdhgqbnd.cloudfront.net/wp-content/uploads/2016/04/09121712/book-cover-placeholder.png",
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

  const db = client.db(process.env.MONGO_DB_NAME || "second_shelf");

  await db.collection("books").deleteMany({});
  await db.collection("users").deleteMany({});

  const passwordHash = await bcrypt.hash("password123", 10);

  const users = USERS.map((user) => ({
    name: user.name,
    email: user.email,
    passwordHash,
    createdAt: new Date(),
  }));

  const userInsertResult = await db.collection("users").insertMany(users);
  const insertedUserIds = Object.values(userInsertResult.insertedIds);

  const books = Array.from({ length: 1000 }, (_, i) => ({
    title: `${rand(TITLES)} (Vol. ${(i % 10) + 1})`,
    author: rand(AUTHORS),
    price: randFloat(1, 25),
    condition: rand(CONDITIONS),
    description: `A well-loved copy in ${rand(CONDITIONS).toLowerCase()} condition. A great addition to any collection.`,
    imageUrl: rand(BOOK_IMAGES),
    available: Math.random() > 0.1,
    sellerId: rand(insertedUserIds).toString(),
    createdAt: new Date(),
  }));

  await db.collection("books").insertMany(books);

  console.log("seeded completed with 1000 books and 5 users");
  await client.close();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
