const passportSetup = require("../config/passportSetup");
const User = require("../models/user");
const Language = require("../models/language");
const Job = require("../models/job");

exports.getLogin = (req, res) => {
    res.render("user/login");
}

exports.getSignup = (req, res) => {
    res.render("user/signup");
}

exports.getIndex = async (req, res) => {
    res.redirect("/jobs");
}

exports.postCreateProfile = async (req, res) => {
    const selectedLanguagesArray = splitStringToArray(req.body.languages);
    const user = await User.findById(req.user.id);
    user.first_name = capitalizeFirstLetter(req.body.userFirstName);
    user.last_name = capitalizeFirstLetter(req.body.userLastName);
    user.experience = req.body.userExperience;
    user.language = selectedLanguagesArray;
    user.profile_completed = true;
    await user.save();
    res.redirect("/jobs");
}

exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    const languages = await Language.find();
    const userLanguagesString = user.language.join();
    res.render("user/profile", {
        title: "Profile",
        user: user,
        languages,
        userLanguagesString
    });
}

exports.postEditProfile = async (req, res) => {
    const selectedLanguagesArray = splitStringToArray(req.body.languages);
    const user = await User.findById(req.user.id);
    user.first_name = capitalizeFirstLetter(req.body.userFirstName);
    user.last_name = capitalizeFirstLetter(req.body.userLastName);
    user.experience = req.body.userExperience;
    user.language = selectedLanguagesArray;
    await user.save();
    res.redirect("/jobs");
}

exports.getJobs = async (req, res) => {
    const user = await User.findById(req.user.id);
    const languages = await Language.find();
    const jobs = await Job.find().populate("company_id");
    const matchingRates = [];
    jobs.forEach(job => {
        matchingRates.push(makeMatchingRates(user, job));
    })
    res.render("user/jobs", {
        title: "Jobs",
        pageTitle: "Programming Jobs",
        view: "viewJobs",
        user,
        languages,
        jobs,
        matchingRates
    });
}

exports.postFilterJobs = async (req, res) => {
    console.log(req.body);
    let body = req.body;
    const user = req.user;
    let minSalary = +body.minSalary;
    const matchingRates = [];
    const languages = await Language.find();
    if (Object.keys(body).length === 1) {
        if (!minSalary) return res.redirect("/");
        const jobs = await Job.find().where("min_salary").gt(minSalary);
        jobs.forEach(job => {
            matchingRates.push(makeMatchingRates(user, job));
        })
        return res.render("user/jobs", {
            title: "Jobs",
            pageTitle: "Programming Jobs",
            view: "viewJobs",
            user,
            languages,
            jobs,
            matchingRates
        })
    }

    let selectedLanguages = Object.keys(body);
    let indexOfMinSalary = selectedLanguages.indexOf("minSalary");
    if (indexOfMinSalary !== -1) selectedLanguages.splice(indexOfMinSalary, 1);
    const jobs = await Job
        .find({ "language": { "$in": selectedLanguages } })
        .where("min_salary").gt(minSalary);
    console.log(jobs);
    jobs.forEach(job => {
        matchingRates.push(makeMatchingRates(user, job));
    })
    res.render("user/jobs", {
        title: "Jobs",
        pageTitle: "Programming Jobs",
        view: "viewJobs",
        user,
        languages,
        jobs,
        matchingRates
    })
}

exports.postSaveJob = async (req, res) => {
    const jobId = req.params.id;
    const user = await User.findById(req.user.id);
    const exists = user.saved_jobs.includes(jobId);
    if (!exists) {
        user.saved_jobs.push(jobId);
        await user.save();
    }
    res.redirect("/jobs");
}

exports.getJobInfo = async (req, res) => {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate("company_id");
    res.render("user/job-info", {
        title: "Job Information",
        user: req.user,
        job
    });
}

exports.postApplyJob = async (req, res) => {
    const jobId = req.params.id;
    const userId = req.user.id;
    const job = await Job.findById(jobId);
    if (job.applicant.includes(userId)) {
        res.redirect("/jobs");
        return;
    }
    job.applicant.push(userId);
    await job.save();
    const user = await User.findById(userId);
    user.applied_jobs.push(jobId);
    await user.save();
    res.redirect("/jobs");
}

exports.getSavedJobs = async (req, res) => {
    const user = req.user;
    const languages = await Language.find();
    const matchingRates = [];
    const jobs = await Job.find({ "_id": { $in: user.saved_jobs } });
    console.log(user.saved_jobs);
    // console.log(jobs);
    jobs.forEach(job => {
        matchingRates.push(makeMatchingRates(user, job));
    })
    res.render("user/jobs", {
        title: "Saved Jobs",
        pageTitle: "Saved Jobs",
        view: "viewSavedJobs",
        jobs,
        user,
        languages,
        matchingRates
    })
}

exports.postDeleteSavedJob = async (req, res) => {
    const user = await User.findById(req.user.id);
    const jobId = req.params.jobId;
    removeElementByValue(user.saved_jobs, jobId);
    await user.save();
    res.redirect("/saved-jobs");
}

exports.postSearchJob = async (req, res) => {
    const user = req.user;
    const searchTerm = req.body.searchTerm;
    const languages = await Language.find();
    const jobs = await Job.find({ "job_title": { $regex: searchTerm, $options: "i" } });
    const matchingRates = [];
    jobs.forEach(job => {
        matchingRates.push(makeMatchingRates(user, job));
    })
    res.render("user/jobs", {
        title: "Search Jobs",
        pageTitle: `${searchTerm} Related Programming Jobs`,
        view: "viewJobs",
        user,
        jobs,
        languages,
        matchingRates
    });
}

exports.getLogout = (req, res) => {
    req.logout((err) => {
        if (err) return err;
        res.redirect("/login");
    })
}

exports.postSignup = passportSetup.localSignupAuth;

exports.postLogin = passportSetup.localLoginAuth;

exports.getGoogleLogin = passportSetup.googleAuth;

exports.getGoogleRedirect = passportSetup.googleRedirectAuth;

exports.checkAuth = (req, res, next) => {
    req.user ? next() : res.redirect("/login");
}

exports.checkFirstLogin = async (req, res, next) => {
    const languages = await Language.find();
    req.user.profile_completed ?
        next() :
        res.render("user/create-profile", {
            languages: languages
        });
}

function capitalizeFirstLetter(string) {
    let lowerCaseString = string.toLowerCase();
    return lowerCaseString.charAt(0).toUpperCase() + lowerCaseString.slice(1);
}

function splitStringToArray(string) {
    return string.split(",");
}

function makeMatchingRates(user, job) {
    let matchRate;
    let count = 0;
    for (let i = 0; i < user.language.length; i++) {
        for (let language of job.language) {
            if (user.language[i] === language) {
                count++;
            }
        }
    }
    matchRate = (count / job.language.length) * 100;
    if (matchRate >= 99 && matchRate < 100) {
        return 99;
    }
    return Math.round(matchRate);
}

function removeElementByValue(array, value) {
    const index = array.indexOf(value);
    if (index !== -1) {
        array.splice(index, 1);
    }
}