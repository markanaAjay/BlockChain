const express = require("express");

const oControllers = {};

oControllers.transfer = (req, res) => {
  return res.render("user/transfer");
};

oControllers.admin = (req, res) => {
  return res.render("admin/adminPage");
};

module.exports = { oControllers };
