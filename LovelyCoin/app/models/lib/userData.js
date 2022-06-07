const mongoose = require("mongoose");

const UserData = new mongoose.Schema({
  sUserId: {
    type: String,
    required: true,
  },
  sUserName: {
    type: String,
    require: true,
  },
  sPassword: {
    type: String,
    required: true,
  },
});

// const User = mongoose.model("User", TokenData);

module.exports = mongoose.model("UserData", UserData);
