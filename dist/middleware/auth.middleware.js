"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_middleware_1 = require("../middleware/error.middleware");
function authAdminMiddleware(req, res, next) {
    const role = req.session.user.role.role;
    if (role === undefined) {
        error_middleware_1.unauthorizedError(req, res);
    }
    else if (role === 'Admin') {
        next();
    }
    else {
        error_middleware_1.unauthorizedError(req, res);
    }
}
exports.authAdminMiddleware = authAdminMiddleware;
function authFinanceMiddleware(req, res, next) {
    const role = req.session.user.role.role;
    if (role === undefined) {
        error_middleware_1.unauthorizedError(req, res);
    }
    else if (role === 'Finance-Manager') {
        next();
    }
    else {
        error_middleware_1.unauthorizedError(req, res);
    }
}
exports.authFinanceMiddleware = authFinanceMiddleware;
function authAdminFinanceMiddleware(req, res, next) {
    const role = req.session.user.role.role;
    if (role === undefined) {
        error_middleware_1.unauthorizedError(req, res);
    }
    else if (role === 'Finance-Manager' || role === 'Admin') {
        next();
    }
    else {
        error_middleware_1.unauthorizedError(req, res);
    }
}
exports.authAdminFinanceMiddleware = authAdminFinanceMiddleware;
//# sourceMappingURL=auth.middleware.js.map