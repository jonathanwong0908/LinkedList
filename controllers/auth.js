const passportSetup = require("../config/passportSetup");

exports.getLogin = (req, res) => {
    res.render("./auth/login");
}

exports.getSignup = (req, res) => {
    res.render("./auth/signup");
}

exports.postSignup = passportSetup.localSignupAuth;

exports.postLogin = passportSetup.localLoginAuth;

exports.getGoogleLogin = passportSetup.googleAuth;

exports.getGoogleRedirect = passportSetup.googleRedirectAuth;


