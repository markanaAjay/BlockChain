const express = require("express");
const rRouter = express.Router();
const { oControllers } = require("./lib/controllers");

rRouter.get("/transfer", oControllers.transfer);

rRouter.get("/adminPage", oControllers.admin);

rRouter.get("/signup", oControllers.signup);

rRouter.get("/signin", oControllers.signin);

module.exports = { rRouter };
