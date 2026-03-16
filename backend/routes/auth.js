// ////Temp for routes

// import express from "express";
// import passport from "passport";

// import { createUser, getAllUsers } from "../data/users.js";

// const router = express.Router();

// // register
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const user = await createUser({ name, email, password });

//     res.status(201).json({
//       message: "User created",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to register user" });
//   }
// });

// // login
// router.post("/login", passport.authenticate("local"), (req, res) => {
//   res.json({
//     message: "Login successful",
//     user: req.user,
//   });
// });

// // logout
// router.post("/logout", (req, res, next) => {
//   req.logout((err) => {
//     if (err) return next(err);

//     res.json({ message: "Logged out" });
//   });
// });

// // current user
// router.get("/me", (req, res) => {
//   res.json({
//     authenticated: req.isAuthenticated(),
//     user: req.user || null,
//   });
// });

// // debug
// router.get("/users", (_req, res) => {
//   res.json(getAllUsers());
// });

// export default router;

import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../data/users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required",
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await createUser({
      name,
      email,
      passwordHash,
    });

    return res.status(201).json({
      message: "User created",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to register user",
    });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).json({
        error: info.message || "Login failed",
      });
    }

    return req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      return res.json({
        message: "Login successful",
        user,
      });
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    return res.json({ message: "Logged out" });
  });
});

router.get("/me", (req, res) => {
  return res.json({
    authenticated: req.isAuthenticated(),
    user: req.user || null,
  });
});

export default router;
