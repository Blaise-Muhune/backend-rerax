const express = require("express");
const router = express.Router();
const User = require("../types/userModel"); // Import your Mongoose User model or schema
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// GET all users
router.get("/", (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error retrieving users" });
    });
});

// GET all users
router.get("/:id", (req, res) => {
  const userId = req.params.id;
  User.find(userId)
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error retrieving users" });
    });
});

// GET a single user cart cart
router.get("/cartitems/:id", (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found at cart" });
      }
      res.json(user.cart);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error retrieving cart" });
    });
});

// GET a single user wishlist
router.get("/wishlistitems/:id", (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found at wishlist" });
      }
      res.json(user.wishlistItems);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error retrieving wishlists" });
    });
});

// POST a new user
router.post("/signup", async (req, res) => {
  const { firstName, lastName, password, email } = req.body;

  // Check if the firstname or email is already taken
  const existingUser = await User.findOne({ $or: [{ email }] });
  if (existingUser) {
    return res.status(400).json({ message: "email already taken" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user document
  const newUser = new User({
    firstName,
    lastName,
    password: hashedPassword,
    email,
  });

  // Save the new user to the database
  await newUser.save();

  res.json({
    message:
      "Sign-up successful" +
      `email: ${email}` +
      `Password: ${newUser.password}`,
    userId: newUser._id,
    uer: existingUser,
  });
});

// PUT/update a user
router.put("/:id", (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  User.findByIdAndUpdate(
    userId,
    { $set: { wishlistItems: userData.wishlist, cart: userData.cart } },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user.cart);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error updating user" + error });
    });
});

router.put("/updatesizecart/:id", (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  User.findByIdAndUpdate(
    userId,
    { $set: { "cart.$[outer].size.$[inner]": userData.updateWithThis } },
    {
      arrayFilters: [
        { "outer.id": userData.outerId },
        { "inner.label": userData.innerId },
      ],
    },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error updating user" });
    });
});

router.put("/addFirstsizecart/:id", (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  User.findByIdAndUpdate(
    userId,
    {
      $push: { "cart.$[outer].size": userData.updateWithThis },
    },
    { arrayFilters: [{ "outer.id": userData.outerId }] },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user.cart);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error updating user" });
    });
});

//delete all items from cart
router.delete("/deleteallitemsfromcart/:id", (req, res) => {
  const userId = req.params.id;
  User.findByIdAndUpdate(userId, { $set: { cart: [] } })
    .then(() => {
      res.json({ message: "items deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error deleting items" });
    });
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      message: "Authentication failed, account may not exist",
    });
  }

  // Compare the entered password with the stored password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ message: "Authentication failed, wrong password" });
  }

  // Generate a JWT token
  const token = jwt.sign(
    { email: user.email, userId: user._id },
    "secret_string",
    { expiresIn: "1h" }
  );
  return res.status(200).json({
    token: token,
    expiresIn: 3600,
    userID: user._id,
    user: user,
  });
});

// DELETE a user
router.delete("/:id", (req, res) => {
  const userId = req.params.id;
  User.findByIdAndDelete(userId)
    .then(() => {
      res.json({ message: "User deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error deleting user" });
    });
});

module.exports = router;
