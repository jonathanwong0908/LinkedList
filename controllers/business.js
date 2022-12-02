const passportSetup = require("../config/passportSetup");
const User = require("../models/user");
const Company = require("../models/company");
const Language = require("../models/language");
const Job = require("../models/job");
const { remove } = require("../models/user");

exports.postBusinessSignup = passportSetup.businessSignupAuth;

exports.postBusinessLogin = passportSetup.businessLoginAuth;

exports.getBusinessLogin = (req, res) => {
    res.render("business/business-login");
}

exports.getBusinessSignup = (req, res) => {
    res.render("business/business-signup");
}

exports.getBusiness = async (req, res) => {
    const company = await Company.findOne({ user_id: req.user.id });
    const jobs = await Job.find({ company_id: company.id });
    res.render("business/business-dashboard", {
        title: `${company.name} Jobs`,
        pageTitle: `${company.name} Jobs`,
        view: "businessDashboard",
        user: req.user,
        company: company,
        jobs: jobs
    });
}

exports.postCreateBusiness = async (req, res) => {
    const userId = req.user.id;
    const companyName = capitalizeFirstLetter(req.body.companyName);
    const description = req.body.companyDescription;
    const company = await Company.findOne({ name: companyName });

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

exports.getBusinessProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    const company = await Company.findOne({ user_id: req.user.id });
    res.render("business/business-profile", {
        title: `${company.name} Profile`,
        pageTitle: "Edit company profile",
        view: "editCompanyProfile",
        user: user,
        company: company
    });
}

exports.postEditBusiness = async (req, res) => {
    const company = await Company.findById(req.params.id);
    company.name = capitalizeFirstLetter(req.body.companyName);
    company.description = req.body.companyDescription;
    await company.save();
    res.redirect("/business");
}

exports.getNewJob = async (req, res) => {
    const user = req.user;
    const company = await Company.findOne({ user_id: user.id });
    const languages = await Language.find();
    res.render("business/business-new-job", {
        title: "New Job",
        user: user,
        company: company,
        languages: languages
    })
}

exports.postCreateJob = async (req, res) => {
    const company = await Company.findOne({ user_id: req.user.id });
    let salaryNegotiable = false;
    if (req.body.salaryNegotiable === "on") {
        salaryNegotiable = true;
    }
    const selectedLanguagesArray = splitStringToArray(req.body.languages);
    const newJob = new Job({
        job_title: req.body.jobTitle,
        job_description: req.body.jobDescription,
        job_requirement: req.body.jobRequirement,
        min_salary: req.body.minSalary,
        max_salary: req.body.maxSalary,
        salary_negotiable: salaryNegotiable,
        company_id: company.id
    })
    newJob.language = selectedLanguagesArray;
    await newJob.save();
    res.redirect("/business");
}

exports.getEditJob = async (req, res) => {
    const user = await User.findById(req.user.id);
    const company = await Company.findOne({ user_id: user.id });
    const job = await Job.findById(req.params.id);
    const languages = await Language.find();
    const jobLanguageString = job.language.join();
    res.render("business/business-edit-job", {
        title: "Edit job",
        user: user,
        company: company,
        job: job,
        languages: languages,
        jobLanguageString: jobLanguageString
    })
}

exports.postEditJob = async (req, res) => {
    let salaryNegotiable = false;
    if (req.body.salaryNegotiable === "on") {
        salaryNegotiable = true;
    }
    const job = await Job.findById(req.params.id);
    const selectedLanguagesArray = splitStringToArray(req.body.languages);
    job.job_title = req.body.jobTitle;
    job.job_description = req.body.jobDescription;
    job.job_requirement = req.body.jobRequirement;
    job.min_salary = req.body.minSalary;
    job.max_salary = req.body.maxSalary;
    job.salary_negotiable = salaryNegotiable;
    job.language = selectedLanguagesArray;
    await job.save();
    res.redirect("/business");
}

exports.postDeleteJob = async (req, res) => {
    await Job.findByIdAndDelete(req.params.id);
    res.redirect("/business")
}

exports.getViewApplicants = async (req, res) => {
    const user = req.user;
    const company = await Company.findOne({ user_id: user.id });
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId).populate("applicant");
    const matchingRates = [];
    job.applicant.forEach(applicant => {
        matchingRates.push(makeMatchingRates(applicant, job))
    })
    res.render("business/business-dashboard", {
        title: "View Applicants",
        pageTitle: `${job.job_title} Applicants`,
        view: "viewApplicants",
        user,
        company,
        job,
        matchingRates
    })
}

exports.postDeleteApplicant = async (req, res) => {
    const applicantId = req.params.userId;
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    const applicant = await User.findById(applicantId);
    removeElementByValue(job.applicant, applicantId);
    removeElementByValue(applicant.applied_jobs, jobId);
    applicant.rejected_jobs.push(jobId);
    await job.save();
    await applicant.save();
    res.redirect(`/business/view-applicants/${jobId}`)
}

exports.getViewApplicant = async (req, res) => {
    const user = req.user;
    const jobId = req.params.jobId;
    const applicantId = req.params.applicantId;
    const applicant = await User.findById(applicantId);
    const company = await Company.findOne({ user_id: user.id });
    const job = await Job.findById(jobId);
    res.render("business/business-profile", {
        title: "View Applicant",
        pageTitle: `${applicant.first_name} ${applicant.last_name}`,
        view: "viewApplicant",
        user,
        company,
        applicant,
        job
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