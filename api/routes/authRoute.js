const { Router } = require("express");

const AuthController = require("../controllers/authController");

const authController = new AuthController();
const router = Router();

router.post("/auth/login", authController.login);

module.exports = router;
