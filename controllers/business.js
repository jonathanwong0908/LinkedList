const passportSetup = require("../config/passportSetup");
const User = require("../models/user");
const Company = require("../models/company");

exports.postBusinessSignup = passportSetup.businessSignupAuth;

exports.postBusinessLogin = passportSetup.businessLoginAuth;

exports.getBusinessLogin = (req, res) => {
    res.render("business/business-login");
}

exports.getBusinessSignup = (req, res) => {
    res.render("business/business-signup");
}

exports.getBusiness = async (req, res) => {
    const company = await Company.findOne({ user: req.user.id });
    res.render("business/business-main", {
        user: req.user,
        company: company
    });
}

exports.postCreateBusiness = async (req, res) => {
    const userId = req.user.id;
    const name = capitalizeFirstLetter(req.body.companyName);
    const description = req.body.companyDescription;
    const company = await Company.findOne({ name: req.body.companyName })
    if (company) {
        return res.render("business/business-create");
    }
    const newCompany = new Company({ user: userId, name, description });
    await newCompany.save();
    const user = await User.findById(userId);
    user.profile_completed = true;
    user.save();
    res.redirect("/business");
}

exports.getNewJob = async (req, res) => {
    const user = req.user
    const company = await Company.findOne({ user: user.id });
    res.render("business/business-new-job", {
        title: "New Job",
        user: user,
        company: company
    })
}

exports.getLogout = (req, res) => {
    req.logout((err) => {
        if (err) return err;
        res.redirect("/business/login");
    })
}

exports.checkAuth = (req, res, next) => {
    req.user ? next() : res.redirect("/business/login")
}

exports.checkFirstLogin = (req, res, next) => {
    req.user.profile_completed ? next() : res.render("business/business-create");
}

function capitalizeFirstLetter(string) {
    let lowerCaseString = string.toLowerCase();
    return lowerCaseString.charAt(0).toUpperCase() + lowerCaseString.slice(1);
}