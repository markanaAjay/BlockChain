const { redis } = require('../../utils');
const { User } = require('../../models');

const Socket = function () {};

Socket.prototype.init = function () {
    global.io.origins('*:*');
    global.io.adapter(redis.getAdapter());
    this.setEventListeners();
};

Socket.prototype.setEventListeners = function () {
    global.io.use((socket, next) => this.middleware(socket, next));
    global.io.on('error', (error) => log.console('error in socket :: ', error));
};

Socket.prototype.middleware = function (socket, next) {
    const { authorization } = socket.handshake.query;
    if (!authorization) return next(new Error(messages.unauthorized().message));

    const decodedToken = _.decodeToken(authorization);
    if (!decodedToken) return next(new Error(messages.unauthorized().message));

    const query = { _id: decodedToken._id };
    const project = {
        eUserType: true,
        eStatus: true,
        isMobileVerified: true,
        sRootSocket: true,
        sToken: true,
        sMobile: true,
        nChips: true,
    };
    User.findOne(query, project, (error, user) => {
        if (error) return next(new Error(messages.server_error(), error.toString()));
        if (!user) return next(new Error(messages.unauthorized().message));
        if (user.sRootSocket) global.io.to(user.sRootSocket).emit('resLogout', { message: 'You are logged in from another device.' });
        if (!user.isMobileVerified) return next(new Error(messages.unauthorized().message));
        if (user.eStatus === 'n') return next(new Error(messages.blocked('Account').message));
        if (user.eStatus === 'd') return next(new Error(messages.deleted('Account').message));
        if (user.sToken !== authorization) return next(new Error(messages.unauthorized().message));
        socket.user = { iUserId: user._id.toString() };
        User.updateOne(query, { $set: { sRootSocket: socket.id } }, _.errorCallback);
        if (process.env.NODE_ENV !== 'prod') log.green('Root connected', socket.user.iUserId, 'with ', socket.id);

        next();
    }).lean();
};

module.exports = new Socket();
