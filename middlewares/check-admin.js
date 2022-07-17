const { message } = require('../utils/message-handler.js');

function isAdmin(req, res, next) {
    const { role } = req.user;
    if (role === "admin") {
        return next();
    }
    const err = new Error();
    err.message = "เฉพาะผู้ดูแลระบบเท่านั้น";
    err.statusCode = 403;
    throw err;
}

function test(req, res, next) {
    console.log('test', req.user);
    return next();
}

module.exports = {
    isAdmin,
    test
}