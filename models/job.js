const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    job_title: {
        type: String,
        required: true
    },
    job_description: {
        type: String
    },
    job_requirement: {
        type: String
    },
    min_salary: {
        type: Number
    },
    max_salary: {
        type: Number
    },
    salary_negotiable: {
        type: Boolean
    },
    applicant: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "User"
    },
    language: {
        type: [String],
    },
    company_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Company"
    },
    created_at: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    }
})

module.exports = mongoose.model("Job", jobSchema);