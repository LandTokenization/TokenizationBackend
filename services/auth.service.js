// services/auth.service.js
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const ALLOWED_ROLES = ["BUYER", "SELLER", "ADMIN"];

function signToken(user) {
    const payload = { id: user._id, role: user.role };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
}

function sanitizeUser(user) {
    const obj = user.toObject();
    delete obj.password;
    return obj;
}

async function register({ name, email, password, role }) {
    const existing = await User.findOne({ email });
    if (existing) {
        const err = new Error("Email already registered");
        err.status = 400;
        throw err;
    }

    const finalRole = ALLOWED_ROLES.includes(role) ? role : "BUYER";

    const user = await User.create({
        name,
        email,
        password,
        role: finalRole,
    });

    const token = signToken(user);

    return {
        user: sanitizeUser(user),
        token,
    };
}

async function login({ email, password }) {
    const user = await User.findOne({ email });

    if (!user) {
        const err = new Error("Invalid email or password");
        err.status = 400;
        throw err;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        const err = new Error("Invalid email or password");
        err.status = 400;
        throw err;
    }

    const token = signToken(user);

    return {
        user: sanitizeUser(user),
        token,
    };
}

module.exports = {
    register,
    login,
};
