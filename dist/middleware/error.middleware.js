"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_router_1 = require("../routers/auth.router");
// static pages
const notFoundPage = ['404: Not Found', `<p>404: Page not Found</p>`];
const unauthorizedErrorPage = ['401: Unauthorized', `<p>401: Unauthorized</p>`];
const internalErrorPage = ['500: Internal Server Error', `<p>500: Internal Server Error</p>`];
// 404: Not Found
function notFound(req, res) {
    if (req.session === undefined || req.session.user === undefined || req.session.user.role === undefined) {
        res.status(404).send(auth_router_1.pageGenerator(notFoundPage, ''));
    }
    else {
        res.status(404).send(auth_router_1.pageGenerator(notFoundPage, req.session.user));
    }
}
exports.notFound = notFound;
// 500: Internal Server Error
function internalError(req, res) {
    if (req.session === undefined || req.session.user === undefined || req.session.user.role === undefined) {
        res.status(500).send(auth_router_1.pageGenerator(internalErrorPage, ''));
    }
    else {
        res.status(500).send(auth_router_1.pageGenerator(internalErrorPage, req.session.user));
    }
}
exports.internalError = internalError;
// 401: Unauthorized
function unauthorizedError(req, res) {
    if (req.session === undefined || req.session.user === undefined || req.session.user.role === undefined) {
        res.status(401).send(auth_router_1.pageGenerator(unauthorizedErrorPage, ''));
    }
    else {
        res.status(401).send(auth_router_1.pageGenerator(unauthorizedErrorPage, req.session.user));
    }
}
exports.unauthorizedError = unauthorizedError;
//# sourceMappingURL=error.middleware.js.map