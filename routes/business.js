const express = require("express");
const businessController = require("../controllers/business");

const router = express.Router();

router.get("/",
    businessController.checkAuth,
    businessController.checkFirstLogin,
    businessController.getBusiness
);

router.get("/login", businessController.getBusinessLogin);

router.post("/login", businessController.postBusinessLogin);

router.get("/signup", businessController.getBusinessSignup);

router.post("/signup", businessController.postBusinessSignup);

router.post("/create-business",
    businessController.checkAuth,
    businessController.postCreateBusiness
);

router.get("/logout", businessController.getLogout);

router.get("/new-job",
    businessController.checkAuth,
    businessController.getNewJob
);

router.post("/create-job", businessController.checkAuth, businessController.postCreateJob);

router.get("/dashboard", businessController.checkAuth, businessController.getCompanyDashBoard);

module.exports = router;