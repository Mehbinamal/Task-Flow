const { signUp, updateProfile, updatePassword } = require("../Controller/AuthController");
const { validateSignUp, verifyToken } = require("../Middlewear/AuthMiddlewear");
const express = require('express');

const router = express.Router();

router.post("/signup", validateSignUp, signUp);
router.put("/update-profile", verifyToken, updateProfile);
router.put("/update-password", verifyToken, updatePassword);

module.exports = router;