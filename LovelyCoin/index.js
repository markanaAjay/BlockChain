require('./env');
require('./globals');
// const { redis } = require('./app/utils');

const {MongoDB} = require("./app/utils/");
const Connection = require('./app/routers');
// const socket = require('./app/sockets');

MongoDB.initialize();
// redis.initialize();
Connection.initialize();
// socket.initialize(router.httpServer);
