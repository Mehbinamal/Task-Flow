const { admin } = require("../model/db");

// Middleware to validate signup request body
const validateSignUp = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match." });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
    }

    // Password length validation
    if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    next();
};

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.split(" ")[1]; // Bearer <token>
  
    if (!token) return res.status(401).json({ error: "Token missing" });
  
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      req.uid = decoded.uid;
      next();
    } catch (err) {
      console.error("Token verification failed:", err);
      res.status(401).json({ error: "Unauthorized" });
    }
  };

module.exports = {
    validateSignUp,
    verifyToken
}