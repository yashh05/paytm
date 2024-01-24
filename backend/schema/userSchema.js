const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        minLength: 3,
        maxLength: 30,
        lowercase: true
    },
    firstname: {
        type: String,
        require: true,
        trim: true,
        lowercase: true
    },
    lastname: {
        type: String,
        require: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        minLength: 3,
        require: true,
    },
})

const User = mongoose.model('User', userSchema);

module.exports = User
