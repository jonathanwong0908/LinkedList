const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        lowercase: true,
        unique: true
    },
    password: {
        type: String
    },
    google_id: {
        type: String
    },
    user_type: {
        type: String
    },
    profile_completed: {
        type: Boolean,
        default: false
    },
    language: {
        type: [String]
    },
    experience: {
        type: String
    },
    saved_jobs: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Job"
    },
    applied_jobs: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Job"
    },
    rejected_jobs: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Job"
    },
    created_at: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    }
})

module.exports = mongoose.model("User", userSchema);