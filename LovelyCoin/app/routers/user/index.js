const express = require("express");
const aRouter = express.Router();
const { userData } = require("./lib/controllers");

aRouter.post("/transfer", userData.transfer);

module.exports = { aRouter };
