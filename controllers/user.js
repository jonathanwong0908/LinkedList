const passportSetup = require("../config/passportSetup");
const User = require("../models/user");
const Language = require("../models/language");
const job = require("../models/job");

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
    const jobs = await job.find().populate("company_id");
    const matchingRates = [];
    jobs.forEach(job => {
        matchingRates.push(makeMatchingRates(user, job));
    })
    console.log(jobs);
    console.log(matchingRates);
    res.render("user/jobs", {
        title: "Jobs",
        user,
        languages,
        jobs,
        matchingRates
    });
}

exports.postFilterJobs = async (req, res) => {
    console.log(req.body);
    res.redirect("/");
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