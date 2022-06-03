const validators = require("./validators");
const { User } = require("../../../models");

const jwt = require("jsonwebtoken");

const controllers = {};

controllers.signup = async (req, res) => {

    let aRequiredFields = [];

    if (!req.body.sEmail)
        aRequiredFields.push("Email ID");

    if (!req.body.sName)
        aRequiredFields.push("Name");

    if (!req.body.sPassword)
        aRequiredFields.push("Password");

    if (aRequiredFields.length)
        return res.status(400).json({
            message: "Required Fields: " + aRequiredFields.join(", ")
        });

    if (!validators.isEmailValid(req.body.sEmail))
        return res.status(400).json({
            message: "Invalid Email ID"
        });

    let oUser = new User({
        sName: req.body.sName,
        sEmail: req.body.sEmail,
        sPassword: req.body.sPassword
    });
    await oUser.save();

    return res.status(200).json({
        message: "User Created Successfully"
    });
};

controllers.signin = async (req, res) => {
    let aRequiredFields = [];

    if (!req.body.sEmail)
        aRequiredFields.push("Email ID");

    if (!req.body.sPassword)
        aRequiredFields.push("Password");

    if (aRequiredFields.length)
        return res.status(400).json({
            message: "Required Fields: " + aRequiredFields.join(", ")
        });

    let oUser = await User.findOne({
        sEmail: req.body.sEmail,
        sPassword: req.body.sPassword
    });

    if (!oUser)
        return res.reply(messages.wrong_credentials())

    // Create token
    const token = jwt.sign(
        { sEmail: oUser.sEmail, iUserID: oUser._id },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );

    req.session["iUserID"] = oUser._id;
    req.session["sName"] = oUser.sName;

    return res.reply(messages.successfully("Login"), {
        sUserName: oUser.sName,
        token
    });
}

controllers.signout = async (req, res) => {
    if (!req.userID) return res.reply(messages.unauthorized());

    return res.reply(messages.successfully("user logout"));
}

module.exports = controllers;
