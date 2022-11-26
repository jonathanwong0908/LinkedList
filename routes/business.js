const express = require("express");
const businessController = require("../controllers/business");
const checkAuth = require("../controllers/business").checkAuth;

const router = express.Router();

router.get("/", checkAuth, businessController.getBusiness);

router.get("/login", businessController.getBusinessLogin);

router.post("/login", businessController.postBusinessLogin);

router.get("/signup", businessController.getBusinessSignup);

router.post("/signup", businessController.postBusinessSignup);

module.exports = router;