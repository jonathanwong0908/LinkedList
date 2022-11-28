const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageURL: {
        type: String
    }
})

module.exports = mongoose.model("Language", languageSchema);