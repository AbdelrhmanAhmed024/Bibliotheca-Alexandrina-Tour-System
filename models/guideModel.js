const mongoose = require("mongoose");
const User = require("./userModel");

const guideSchema = new mongoose.Schema({
    yearsOfExperience: {
        type: Number,
        require: true,
        message: "Years of experience is required"
    },
    languages: [{
        type: String,
        required: true,
        message: "Language is required"
    }],
    specialization: {
        type: String, // e.g. "History", "Adventure", "Nature"
        required: true,
        message: "Specialization is required"
    }
});

const Guide = User.discriminator('Guide', guideSchema);

module.exports = Guide;
