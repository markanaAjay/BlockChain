const express = require("express");

const oControllers = {};

oControllers.transfer = (req, res) => {
  return res.render("user/transfer");
};

oControllers.admin = (req, res) => {
  return res.render("admin/adminPage");
};

oControllers.signup = (req, res) => {
  return res.render("auth/signup");
};

oControllers.signin = (req, res) => {
  return res.render("auth/signin");
};

module.exports = { oControllers };
