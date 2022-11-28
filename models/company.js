const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: {
        type: String
    },
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    description: {
        type: String
    }
})

module.exports = mongoose.model("Company", companySchema);