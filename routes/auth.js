const express = require("express");
const authController = require("../controllers/auth");
const checkAuth = require("../controllers/auth").checkAuth;

const router = express.Router();

router.get("/login", checkAuth, authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.postSignup);

router.get("/google", authController.getGoogleLogin);

router.get("/google/redirect", authController.getGoogleRedirect);

router.get("/logout", authController.getLogout);

module.exports = router;