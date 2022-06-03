const express = require("express");
const rRouter = express.Router();
const { oControllers } = require("./lib/controllers");

rRouter.get("/transfer", oControllers.transfer);

rRouter.get("/adminPage", oControllers.admin);

module.exports = { rRouter };
