const express = require("express");
const userController = require("../controllers/user.controller");
const {
    authGuard,
    requireRole,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authGuard);
router.use(requireRole("ADMIN"));


router.get("/me", authGuard, userController.getMe);


router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);

router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

module.exports = router;
