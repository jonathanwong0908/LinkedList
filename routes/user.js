const express = require("express");
const userController = require("../controllers/user");

const router = express.Router();

router.get("/", userController.checkAuth, userController.getIndex);

router.get("/login", userController.getLogin);

router.post("/login", userController.postLogin);

router.get("/signup", userController.getSignup);

router.post("/signup", userController.postSignup);

router.get("/google", userController.getGoogleLogin);

router.get("/google/redirect", userController.getGoogleRedirect);

router.post("/create-profile", userController.checkAuth, userController.postCreateProfile);

router.get("/profile", userController.checkAuth, userController.getProfile);

router.post("/edit-profile", userController.checkAuth, userController.postEditProfile);

router.get("/jobs", userController.checkAuth, userController.checkFirstLogin, userController.getJobs);

router.post("/filter-jobs", userController.checkAuth, userController.postFilterJobs);

router.post("/save-job/:id", userController.checkAuth, userController.postSaveJob);

router.get("/job-info/:id", userController.checkAuth, userController.getJobInfo);

router.post("/apply-job/:id", userController.checkAuth, userController.postApplyJob);

router.get("/saved-jobs", userController.checkAuth, userController.getSavedJobs);

router.post("/delete-saved-job/:jobId", userController.checkAuth, userController.postDeleteSavedJob);

router.post("/search-job", userController.checkAuth, userController.postSearchJob);

router.get("/logout", userController.getLogout);

module.exports = router;