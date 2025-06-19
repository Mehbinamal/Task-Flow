const { signUp } = require("../Controller/AuthController");
const { validateSignUp } = require("../Middlewear/AuthMiddlewear");
const express = require('express');

const router = express.Router();

router.post("/signup", validateSignUp, signUp);


module.exports = router;