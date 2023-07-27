const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please tell us your name!'],
    },
    email: {
        type: String,
        require: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: String,
    password: {
        type: String,
        require: [true, 'Please provide a valid password'],
        minlenngth: 8,
        select: false
    },
    passwordConfirm: {
        type: String, require: [true, 'Please confim your password'],
        validate: {
            // This only work on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            }
        },
        message: 'Passwords are not same!'
    }
});

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    return fa;
};


const User = mongoose.model('User', userSchema);
module.exports = User;