const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/user");
const Company = require("../models/company");
const bcrypt = require("bcrypt");

// local signup
passport.use("local-signup", new LocalStrategy({
    usernameField: "email"
}, async (email, password, done) => {
    let user = await User.findOne({ email });
    if (user) {
        return done(null, false);
    }
    const hash = await bcrypt.hash(password, 10);
    let newUser = new User({ email, password: hash });
    await newUser.save();
    return done(null, newUser);
}))

// business signup
passport.use("business-signup", new LocalStrategy({
    usernameField: "email"
}, async (email, password, done) => {
    let company = await Company.findOne({ email });
    if (company) {
        return done(null, false);
    }
    const hash = await bcrypt.hash(password, 10);
    let newCompany = new Company({ email, password: hash });
    await newCompany.save();
    return done(null, newCompany);
}))

// local login
passport.use("local-login", new LocalStrategy({
    usernameField: "email"
}, async (email, password, done) => {
    const user = await User.findOne({ email });
    if (!user) {
        return done(null, false);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? done(null, user) : done(null, false);
}))

// business login
passport.use("business-login", new LocalStrategy({
    usernameField: "email"
}, async (email, password, done) => {
    const company = await Company.findOne({ email });
    if (!company) {
        return done(null, false);
    }
    const isMatch = await bcrypt.compare(password, company.password);
    return isMatch ? done(null, company) : done(null, false);
}))

// google
passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/redirect"
}, async (accessToken, refreshToken, profile, done) => {
    const google_id = profile.id;
    const email = profile.emails[0].value;
    const first_name = profile.name.givenName;
    const last_name = profile.name.familyName;
    const user = await User.findOne({ google_id });
    console.log(user);
    if (!user) {
        const newUser = new User({
            email, google_id, first_name, last_name
        });
        await newUser.save();
        return done(null, newUser);
    } else {
        return done(null, user);
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    const user = await User.findOne({ id });
    return user ? done(null, user) : done(null, false);
})

exports.localSignupAuth = passport.authenticate("local-signup", {
    successRedirect: "/auth/login",
    failureMessage: "/signup"
})

exports.localLoginAuth = passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/auth/login"
})

exports.googleAuth = passport.authenticate("google", {
    scope: ["email", "profile"]
})

exports.googleRedirectAuth = passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/auth/login"
})

exports.businessSignupAuth = passport.authenticate("business-signup", {
    successRedirect: "/business/login",
    failureRedirect: "/business/signup"
})

exports.businessLogin = passport.authenticate("business-login", {
    successRedirect: "/",
    failureRedirect: "/business/login"
})