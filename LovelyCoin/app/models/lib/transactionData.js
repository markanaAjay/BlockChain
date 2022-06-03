const mongoose = require("mongoose");

const TokenData = new mongoose.Schema({
  sUserId: {
    type: String,
    required: true,
  },
  nTokens: {
    type: Number,
    require: true,
  },
});

// const User = mongoose.model("User", TokenData);

module.exports = mongoose.model("User", TokenData);
