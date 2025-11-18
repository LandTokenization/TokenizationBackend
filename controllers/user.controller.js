// controllers/user.controller.js
const User = require("../models/user.model");
const authService = require("../services/auth.service");

async function createUser(req, res, next) {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "name, email and password are required",
            });
        }

        const result = await authService.register({
            name,
            email,
            password,
            role,
        });

        return res.status(201).json({
            success: true,
            data: result.user,
            token: result.token,
        });
    } catch (err) {
        next(err);
    }
}

// READ ALL
async function getUsers(req, res, next) {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        return res.json({
            success: true,
            data: users,
        });
    } catch (err) {
        next(err);
    }
}

// READ ONE
async function getUserById(req, res, next) {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
}

// UPDATE
async function updateUser(req, res, next) {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        // we do NOT allow password change here (do a separate endpoint later)
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (role) updates.role = role;

        const user = await User.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
}

// DELETE
async function deleteUser(req, res, next) {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.json({
            success: true,
            message: "User deleted",
        });
    } catch (err) {
        next(err);
    }
}

// returns the currently authenticated user
async function getMe(req, res, next) {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getMe
};
