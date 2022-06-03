const { User } = require("../../../models");

const controllers = {};

controllers.getBalance = async (req, res) => {
  try {
    console.log(req.body);
    let account = req.body.userAccount;
    console.log(account);

    let result = await User.findOne({ sUserId: account.toLowerCase() });
    console.log(result);
    if (result || result.nTokens > 0) {
      let balance = result.nTokens;
      console.log(balance);
      return res.status(200).send(`${balance}`);
    } else {
      return res.status(400).send("Account not found");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error occured!");
  }
};

controllers.delete = async (req, res) => {
  try {
    console.log(req.body);
    let account = req.body.userAccount;
    console.log(account);

    let result = await User.findOneAndUpdate({ sUserId: account.toLowerCase()},{$set:{nTokens : 0}});
    let result2 = await User.findOne({ sUserId: account.toLowerCase() });

    console.log(result2);
    console.log(result);
    if (result || result.nTokens > 0) {
      let balance = result.nTokens;
      console.log(balance);
      let deleteData = await User({
      })
      return res.status(200).send("Data Deleted");
    } else {
      return res.status(400).send("Account not found");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error occured!");
  }
};

module.exports = controllers;
