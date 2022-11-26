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

exports.getBusiness = (req, res) => {
    res.render("business/business-main");
}

exports.postCreateBusiness = async (req, res, next) => {
    const userId = req.user.id;
    const name = req.body.companyName;
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

exports.checkAuth = (req, res, next) => {
    req.user ? next() : res.redirect("/business/login")
}

exports.checkFirstLogin = (req, res, next) => {
    req.user.profile_completed ? next() : res.render("business/business-create");
}