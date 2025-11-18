const authService = require("../services/auth.service");

async function register(req, res, next) {
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

        res.status(201).json({
            success: true,
            data: result.user,
            token: result.token,
        });
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email and password are required",
            });
        }

        const result = await authService.login({ email, password });

        res.json({
            success: true,
            data: result.user,
            token: result.token,
        });
    } catch (err) {
        next(err);
    }
}



module.exports = {
    register,
    login,
    getMe
};
