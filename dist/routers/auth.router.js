"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_router_1 = require("./user.router");
const error_middleware_1 = require("../middleware/error.middleware");
// static pages
const loginPage = ['Login Page', `<p>Please login</p>
<div id="login">
<form method="post" action="/login">
<p>Username:<br/><input type="text" name="username" id="username" value=""></p>
<p>Password<br/><input type="password" name="password" id="password" value="">
<p>&nbsp;</p>
<p><input type="submit" value="Login"></p>
</form>
</div>`];
const homePage = ['Home', `<p>Welcome</p>`];
// menus -  contains links not unique to user types
const associateMenu = [
    ['Reimbursements', '/reimbursements']
];
const financeMenu = [
    ['Reimbursements', '/reimbursements'],
    ['Users', '/users']
];
const adminMenu = [
    ['Reimbursements', '/reimbursements'],
    ['Users', '/users']
];
exports.authRouter = express_1.default.Router();
// response from login form
exports.authRouter.post('/login', (req, res) => {
    let passed = false;
    user_router_1.Users.forEach(element => {
        if (req.body.username === element.username && req.body.password === element.password) {
            req.session.user = element;
            passed = true;
        }
    });
    if (passed) {
        res.redirect('/');
    }
    else {
        console.log('login failed');
        error_middleware_1.unauthorizedError(req, res);
    }
});
// present login if not logged in
exports.authRouter.get('/', (req, res) => {
    if (req.session.user === undefined) {
        res.status(200).send(pageGenerator(loginPage, ''));
    }
    else {
        res.status(200).send(pageGenerator(homePage, req.session.user));
    }
});
// redirect to home
exports.authRouter.get('/login', (req, res) => {
    res.redirect('/');
});
exports.authRouter.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        // cannot access session here
    });
    res.redirect('/');
});
// create page body using template
function pageGenerator(vars, user) {
    const title = vars[0];
    const body = vars[1];
    let id = '';
    let role = '';
    if (user !== '') {
        role = user.role.role;
        id = user.userId;
    }
    let html = `<html>
  <head>
  <title>Project 0 App - ${title}</title>
  <link rel="stylesheet" type="text/css" href="/css/style.css">
  </head>
  <body>
  <div id="main">
  <nav>
  <ul id="menu" >
  `;
    switch (role) {
        case 'Admin':
            html += menuGenerator(adminMenu, id);
            break;
        case 'Finance-Manager':
            html += menuGenerator(financeMenu, id);
            break;
        case 'Associate':
            html += menuGenerator(associateMenu, id);
            break;
        default:
            break;
    }
    html += `</ul>
  </nav>
  <div id="primary">
  ${body}
  </div>
  <footer>Project 0<br/>Kenneth Currie</footer>
  </div>
  </body>
  </html>`;
    return html;
}
exports.pageGenerator = pageGenerator;
// create page menu based on user role
function menuGenerator(items, id) {
    let menu = ``;
    menu += `<li><a href="/">Home</a></li>`;
    items.forEach(element => {
        menu += `<li><a href="${element[1]}">${element[0]}</a></li>`;
    });
    if (id !== '') {
        menu += `<li><a href="/users/${id}">Profile</a></li>`;
        menu += `<li><a href="/logout">Logout</a></li>`;
    }
    return menu;
}
//# sourceMappingURL=auth.router.js.map