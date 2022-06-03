const controllers = require("./lib/controllers");

const arouter = require("express").Router();

arouter.post("/adminData", controllers.getBalance);
arouter.delete("/deleteData",controllers.delete);

module.exports = { arouter };
