const passportSetup = require("../config/passportSetup");

exports.postBusinessSignup = passportSetup.businessSignupAuth;

exports.postBusinessLogin = passportSetup.businessLoginAuth;

exports.getBusinessLogin = (req, res) => {
    res.render("business/business-login");
}

exports.getBusinessSignup = (req, res) => {
    res.render("business/business-signup");
}

exports.getBusiness = (req, res) => {
    console.log(req.user);
    res.render("business/business-main", {
        user: req.user
    })
}

exports.checkAuth = (req, res, next) => {
    return req.user ? next() : res.redirect("/business/login")
}