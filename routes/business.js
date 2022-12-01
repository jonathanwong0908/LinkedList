const express = require("express");
const businessController = require("../controllers/business");

const router = express.Router();

router.get("/",
    businessController.checkAuth, businessController.checkFirstLogin, businessController.getBusiness);

router.get("/login", businessController.getBusinessLogin);

router.post("/login", businessController.postBusinessLogin);

router.get("/signup", businessController.getBusinessSignup);

router.post("/signup", businessController.postBusinessSignup);

router.post("/create-business", businessController.checkAuth, businessController.postCreateBusiness);

router.get("/profile", businessController.checkAuth, businessController.getBusinessProfile);

router.post("/edit-profile/:id", businessController.checkAuth, businessController.postEditBusiness);

router.get("/new-job", businessController.checkAuth, businessController.getNewJob);

router.post("/create-job", businessController.checkAuth, businessController.postCreateJob);

router.get("/edit-job/:id", businessController.checkAuth, businessController.getEditJob);

router.post("/edit-job/:id", businessController.checkAuth, businessController.postEditJob);

router.post("/delete-job/:id", businessController.checkAuth, businessController.postDeleteJob);

router.get("/view-applicants/:jobId/", businessController.checkAuth, businessController.getViewApplicants);

router.post("/delete-applicant/:jobId/:userId", businessController.checkAuth, businessController.postDeleteApplicant);

router.get("/view-applicant/:jobId/:applicantId", businessController.checkAuth, businessController.getViewApplicant);

router.get("/logout", businessController.getLogout);
module.exports = router;