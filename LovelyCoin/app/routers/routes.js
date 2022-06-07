const express = require("express");
const app = express();
const { aRouter } = require("./user/");
const { arouter } = require("./admin/");
const { authRouter } = require("./auth");

const router = express.Router();

router.use("/user", aRouter);
router.use("/admin", arouter);
router.use("/auth", authRouter);

module.exports = { router };
