const express = require("express");
const passport = require("passport");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.postSignup);

router.get("/google", authController.getGoogleLogin);

router.get("/google/redirect", authController.getGoogleRedirect);

module.exports = router;