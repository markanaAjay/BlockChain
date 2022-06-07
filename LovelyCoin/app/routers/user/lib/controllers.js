const express = require("express");
const { User } = require("../../../models/");
const { json } = require("express");
const { findOne } = require("../../../models/lib/transactionData");

const userData = {};

userData.transfer = async (req, res) => {
  try {
    let nAmount = req.body.nTokens;
    let sId = req.body.sUserId;

    if (!nAmount || !sId) {
      return res.status(400).send("Data not found!");
    }

    const oFindData = await User.findOne({ sUserId: sId });
    console.log("Finded Data", oFindData);
    if (oFindData) {
      console.log("Find Data", oFindData);

      const oUpdatedData = await User.findOneAndUpdate(
        { sUserId: sId },
        { $set: { nTokens: Number(oFindData.nTokens) + Number(nAmount) } }
      );
    } else {
      console.log(nAmount);
      console.log(sId);
      const oData = new User({
        sUserId: sId,
        nTokens: nAmount,
      });

      const oResult = await oData.save();

      if (!oResult) {
        return res.status(400).send("Error in Transaction..");
      } else {
        return res.status(200).send("Transaction is Done");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

userData.getBalance = async (req, res) => {
  try {
    let sAccount = req.body.account;

    let oResult = await User.findOne({ sUserId: sAccount });
    console.log("oResult : ", oResult);

    if (oResult) {
      let nBalance = oResult.nTokens;
      console.log("NBalance:", nBalance);
      if (nBalance > 0) {
        return res.status(200).send(`${nBalance}`);
      }
    } else {
      return res.status(400).send("Data not Found");
    }
  } catch (error) {
    return res.status(400).send("Error Occured");
  }
};

module.exports = { userData };
