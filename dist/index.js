"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const auth_router_1 = require("./routers/auth.router");
const user_router_1 = require("./routers/user.router");
const reimbursement_router_1 = require("./routers/reimbursement.router");
const error_middleware_1 = require("./middleware/error.middleware");
exports.port = 8080;
const methodOverride = require('method-override');
const app = express_1.default();
app.use('/', express_1.default.static(__dirname + '/public/'));
// set up body parser to convert json body to js object and attach to req
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// change method to patch when needed.
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
// create logging middleware
app.use((req, res, next) => {
    console.log(`request was made with url: ${req.path}
  and method: ${req.method}`);
    next(); // will pass the request on to search for the next piece of middleware
});
// set up express to attach sessions
const sess = {
    secret: '8675309',
    cookie: { secure: false },
    resave: false,
    saveUninitialized: false
};
// create session
app.use(express_session_1.default(sess));
// routers
app.use('/', auth_router_1.authRouter);
app.use('/users', user_router_1.userRouter);
app.use('/reimbursements', reimbursement_router_1.reimbursementRouter);
// error middleware
app.use(function (req, res) {
    error_middleware_1.notFound(req, res);
});
app.use(function (error, req, res, next) {
    error_middleware_1.internalError(req, res);
});
app.listen(exports.port);
console.log(`application started on port: ${exports.port}`);
//# sourceMappingURL=index.js.map