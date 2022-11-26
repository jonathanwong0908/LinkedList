const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Company", companySchema);