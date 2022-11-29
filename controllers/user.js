const passportSetup = require("../config/passportSetup");
const User = require("../models/user");
const Language = require("../models/language");

exports.getLogin = (req, res) => {
    res.render("user/login");
}

exports.getSignup = (req, res) => {
    res.render("user/signup");
}

exports.getIndex = (req, res) => {
    res.render("user/jobs");
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
    res.render("user/jobs", {
        title: "Jobs",
        user
    });
}

exports.getLogout = (req, res) => {
    req.logout((err) => {
        if (err) return err;
        res.redirect("user/login");
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