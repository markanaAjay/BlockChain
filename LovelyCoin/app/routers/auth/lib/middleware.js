const jwt = require("jsonwebtoken");

const middleware = {};

middleware.verifyToken = (req, res, next) => {
    if (!req.headers.authorization)
        return res.reply(messages.unauthorized());

    let sToken = req.headers.authorization.replace("Bearer ", "")

    const decoded = jwt.verify(sToken, process.env.JWT_SECRET);

    if (!req.session.iUserID == decoded.iUserID) {
        return res.reply(messages.unauthorized());
    }

    req.userID = decoded.iUserID;

    next();
}

module.exports = middleware;
