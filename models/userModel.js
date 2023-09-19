const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add the username"],
    },
    email: {
        type: String,
        required: [true, "Please add the user email"],
        unique: [true, "Email already exist !"],
    },
    password: {
        type: String,
        required: [true, "Please enter user password"],
    },
}, {timestamps: true,}
);

module.exports = mongoose.model("Users", userSchema);