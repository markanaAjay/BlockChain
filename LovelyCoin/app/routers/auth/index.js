const authRouter = require("express").Router();
const { authControllers } = require("./lib/controllers");
const middleware = require("./lib/middleware");

authRouter.post("/signup", authControllers.signup);
authRouter.post("/signin", authControllers.signin);
//router.post("/signout", middleware.verifyToken, controllers.signout);

module.exports = { authRouter };
