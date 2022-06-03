const express = require("express");
const { User } = require("../../../models/");
const { json } = require("express");
const { findOne } = require("../../../models/lib/transactionData");

const userData = {};

userData.transfer = async (req, res) => {
  try {
    let amount = req.body.nTokens;
    let id = req.body.sUserId;

    if (!amount || !id) {
      return res.status(400).send("Data not found!");
    }

    const findData = await User.findOne({ sUserId: id });
    console.log("Finded Data", findData);
    if (findData) {
      console.log("Find Data", findData);

      const result = await User.findOneAndUpdate(
        { sUserId: id },
        { $set: { nTokens: Number(findData.nTokens) + Number(amount) } }
      );
    } else {
      console.log(amount);
      console.log(id);
      const oData = new User({
        sUserId: id,
        nTokens: amount,
      });

      const result = await oData.save();

      if (!result) {
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
    let account = req.body.account;

    let result = await User.findOne({ sUserId: account });
    console.log(result);

    if (result) {
      let balance = result.nTokens;
      console.log(balance);
      if (balance > 0) {
        return res.status(200).send(`${balance}`);
      }
    } else {
      return res.status(400).send("Data not Found");
    }
  } catch (error) {
    return res.status(400).send("Error Occured");
  }
};

module.exports = { userData };
