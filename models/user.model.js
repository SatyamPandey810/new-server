const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,

    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true

    },
    email: {
        type: String,
        trim: true,
        sparse: true, // Allows unique constraint while permitting null/undefined
        validate: {
            validator: function (value) {
                // Email is optional, but if provided, it must be valid
                if (value) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                }
                return true;
            },
            message: 'Invalid email format',
        },
    },
    phone: {
        type: String,
        trim: true,
        sparse: true, // Allows unique constraint while permitting null/undefined
        validate: {
            validator: function (value) {
                // Phone is optional, but if provided, it must be valid (example: 10 digits)
                if (value) {
                    return /^\d{10}$/.test(value); // Adjust regex based on your phone format
                }
                return true;
            },
            message: 'Invalid phone number format',
        },
    },
    password: {
        type: String,
        required: true,
        min_length: 8,
        select: false
    },
    dob: {
        type: String,
    },
    profile_image: {
        type: String
    },


    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }



}, { timestamps: true })

const userModel = mongoose.model("user", userSchema)
module.exports = { userModel }