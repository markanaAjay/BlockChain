const router = require('express').Router();
const controllers = require('./lib/controllers');
const middleware = require("./lib/middleware");

router.post('/signup', controllers.signup); // This is for an example
router.post("/signin", controllers.signin);
router.post("/signout", middleware.verifyToken, controllers.signout);

module.exports = router;
