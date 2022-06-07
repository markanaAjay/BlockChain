const { User } = require("../../../models");

const controllers = {};

controllers.getBalance = async (req, res) => {
  try {
    console.log(req.body);
    let sAccount = req.body.userAccount;
    console.log(sAccount);

    let oResult = await User.findOne({ sUserId: sAccount.toLowerCase() });
    console.log(oResult);
    if (oResult || oResult.nTokens > 0) {
      let nBalance = oResult.nTokens;
      console.log(nBalance);
      return res.status(200).send(`${nBalance}`);
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
    let sAccount = req.body.userAccount;
    console.log(sAccount);

    let oResult = await User.findOneAndUpdate(
      { sUserId: sAccount.toLowerCase() },
      { $set: { nTokens: 0 } }
    );
    let oResult2 = await User.findOne({ sUserId: sAccount.toLowerCase() });

    console.log(oResult2);
    console.log(oResult);
    if (oResult || oResult.nTokens > 0) {
      let nBalance = oResult.nTokens;
      console.log(nBalance);
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
