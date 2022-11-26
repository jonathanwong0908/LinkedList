const passportSetup = require("../config/passportSetup");

exports.getLogin = (req, res) => {
    res.render("./auth/login");
}

exports.getSignup = (req, res) => {
    res.render("./auth/signup");
}

exports.getLogout = (req, res) => {
    req.logout((err) => {
        if (err) return err;
        res.redirect("/auth/login");
    })
}

exports.postSignup = passportSetup.localSignupAuth;

exports.postLogin = passportSetup.localLoginAuth;

exports.getGoogleLogin = passportSetup.googleAuth;

exports.getGoogleRedirect = passportSetup.googleRedirectAuth;

exports.checkAuth = (req, res, next) => {
    req.user ? res.redirect("/auth/login") : next();
}


