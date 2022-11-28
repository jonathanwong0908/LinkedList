const passportSetup = require("../config/passportSetup");
const User = require("../models/user");
const Company = require("../models/company");
const Language = require("../models/language");
const Job = require("../models/job");

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
    const companyName = capitalizeFirstLetter(req.body.companyName);
    const description = req.body.companyDescription;
    const company = await Company.findOne({ name: companyName });
    // console.log(company);

    if (company !== null) {
        return res.render("business/business-create");
    }
    const newCompany = new Company({ user_id: userId, name: companyName, description });
    await newCompany.save();
    const user = await User.findById(userId);
    user.profile_completed = true;
    user.save();
    res.redirect("/business");
}

exports.getNewJob = async (req, res) => {
    const user = req.user
    const company = await Company.findOne({ user: user.id });
    const languages = await Language.find();
    res.render("business/business-new-job", {
        title: "New Job",
        user: user,
        company: company,
        languages: languages
    })
}

exports.postCreateJob = async (req, res) => {
    console.log(req.body.languages);
    const company = await Company.findOne({ user_id: req.user.id });
    let salaryNegotiable = false;
    if (req.body.salaryNegotiable === "on") {
        salaryNegotiable = true;
    }
    const selectedLanguagesArray = splitStringToArray(req.body.languages);
    const newJob = await new Job({
        job_title: req.body.jobTitle,
        job_description: req.body.jobDescription,
        job_requirement: req.body.jobRequirement,
        min_salary: req.body.minSalary,
        max_salary: req.body.maxSalary,
        salary_negotiable: salaryNegotiable,
        company_id: company.id
    })
    newJob.language = selectedLanguagesArray;
    console.log(newJob);
    await newJob.save();
    res.redirect("/business/new-job");
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

function splitStringToArray(string) {
    return string.split(",");
}