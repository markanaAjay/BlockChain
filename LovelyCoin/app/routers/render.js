const express = require("express");
const renderRouter = express.Router();
const {rRouter} = require("./userRender/");

renderRouter.use("/",rRouter);

module.exports= {renderRouter};