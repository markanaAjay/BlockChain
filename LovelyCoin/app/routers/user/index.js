const express = require("express");
const aRouter = express.Router();
const { userData } = require("./lib/controllers");

aRouter.post("/transfer", userData.transfer);
aRouter.post("/checkBalance", userData.getBalance);

module.exports = { aRouter };
