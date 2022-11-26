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
        unique: true,
        lowercase: true
    },
    password: {
        type: String
    },
    google_id: {
        type: String
    }
})

module.exports = mongoose.model("User", userSchema);