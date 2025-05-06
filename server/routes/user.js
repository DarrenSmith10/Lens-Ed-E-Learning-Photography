const router = require("express").Router();
const { User , Enrollment } = require("../models");
const { signToken, authMiddleware} = require("../utils/auth");

// Get current authenticated user
router.get("/me",authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] }, // Exclude password from response
    });

    if (!user) return res.status(401).json({ message: "Token expired" });

    return res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enroll user in a course
router.post("/enroll",authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.body;
    
    // Check if user exists
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(401).json({ message: "Token expired" });

    await Enrollment.create({
      student_id: req.user.id,
      course_id: courseId,
      enrolled_at: new Date(),
    });

    res.status(200).json({ message: "Successfully enrolled in the course" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single user by ID
router.get("/:id", async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!userData) {
      return res.status(404).json({ message: "No user found with this ID" });
    }

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all users
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const bcrypt = require('bcrypt'); // adding bcrypt to hash passwords
// CREATE a new user (sign-up)
router.post("/", async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Debugging

    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hashing the password
    
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword, // ✅ Hashed!
    });

    const token = signToken(newUser);
    res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});

// UPDATE a user's information
router.put("/:id",authMiddleware, async (req, res) => {
  try {
    const userData = await User.update(req.body, {
      where: { id: req.params.id },
    });

    if (!userData[0]) {
      return res.status(404).json({ message: "No user found with this ID" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN a user
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user || !(await user.checkPassword(req.body.password))) {
      return res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
    }

    const token = signToken(user);
    res.status(200).json({ token, user: { id: user.id, name: user.name } });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});

// LOGOUT a user (optional, since JWTs are stateless)
router.post("/logout", (req, res) => {
  res.status(204).end();
});

module.exports = router;