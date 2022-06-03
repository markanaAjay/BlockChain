const mongoose = require("mongoose");

function MongoDB() {}

MongoDB.prototype.initialize = async function () {
  try {
    await mongoose.connect(
      "mongodb+srv://ajay:ajay@cluster0.epbl6.mongodb.net/TransactionData?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connection is established");
  } catch (e) {
    console.log(e);
  }
};

module.exports = new MongoDB();
