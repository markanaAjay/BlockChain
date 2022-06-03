const express = require("express");
const app = express();
const { aRouter } = require("./user/");
const { arouter } = require("./admin/");

const router = express.Router();

router.use("/user", aRouter);
router.use("/admin", arouter);

module.exports = { router };
