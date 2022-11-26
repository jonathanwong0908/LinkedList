const express = require("express");
const businessController = require("../controllers/business");

const router = express.Router();

router.get("/login", businessController.getBusinessLogin);

router.get("/signup", businessController.getBusinessSignup);

module.exports = router;