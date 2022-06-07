const express = require("express");
const { UserData } = require("../../../models/");
const bcrypt = require("bcryptjs");
const { json } = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const validators = require("./validators");

const authControllers = {};

authControllers.signup = async (req, res) => {
  let aRequiredFields = [];

  if (!req.body.sUserName) aRequiredFields.push("Name");

  if (!req.body.sPassword) aRequiredFields.push("Password");

  if (aRequiredFields.length)
    return res.status(400).json({
      message: "Required Fields: " + aRequiredFields.join(", "),
    });

  if (!validators.validatePassword(req.body.sPassword))
    return res.status(400).json({
      message: "Invalid Password Pattern",
    });

  let oUserData = {
    sUserName: req.body.sUserName,
    sPassword: req.body.sPassword,
  };
  console.log(oUserData);

  let sUserId = await bcrypt.hash(req.body.sUserName, 8);
  console.log(sUserId);
  if (!sUserId) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }

  let oUsersData = await UserData.findOne({ sUserName: req.body.sUserName });
  console.log(oUserData);
  if (oUsersData) {
    console.log("Data is available");
    return res.status(400).json({
      message: "UserName is Available",
    });
  } else {
    await bcrypt.hash(req.body.sPassword, 8, async (err, hash) => {
      if (err) {
        return res.status(500).send("Error");
      } else {
        const oUser = new UserData({
          sUserId: sUserId,
          sUserName: req.body.sUserName,
          sPassword: hash,
        });
        console.log("oUser : ", oUser);
        await oUser.save().then((result, err) => {
          console.log("oResult : ", result);
          return res.status(200).json({
            message: "You are registered",
            data: oUser,
          });
        });
      }
    });
  }
};

authControllers.signin = async (req, res) => {
  let aRequiredFields = [];

  if (!req.body.sUserName) aRequiredFields.push("Name");

  if (!req.body.sPassword) aRequiredFields.push("Password");

  if (aRequiredFields.length)
    return res.status(400).json({
      message: "Required Fields: " + aRequiredFields.join(", "),
    });

  var oResult = await UserData.find({ sUserName: req.body.sUserName });
  if (oResult.length < 1) {
    return res.status(401).json({
      message: "user does not exist",
    });
  }
  bcrypt.compare(
    req.body.sPassword,
    oResult[0].sPassword,
    async (err, result) => {
      if (!result) {
        return res.status(401).json({
          message: "Wrong Password",
        });
      }

      if (result) {
        const sToken = await jwt.sign(
          {
            sUserName: oResult[0].sUserName,
          },
          "LUSD",
          {
            expiresIn: "24h",
          }
        );
        console.log(sToken);

        return res.status(200).json({
          message: "You are loggedin",
          token: sToken,
        });
        //return res.reply(messages.successfully("You are loggedin"),sToken)
      }
    }
  );
};

module.exports = { authControllers };
