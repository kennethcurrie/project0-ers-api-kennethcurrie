"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = require("../routers/auth.router");
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_1 = require("../models/user");
const role_1 = require("../models/role");
const error_middleware_1 = require("../middleware/error.middleware");
// import { seeUsers, seeRoles } from '../query';
// constants
// -- Roles
const admin = new role_1.Role(1, 'Admin');
const financeManager = new role_1.Role(2, 'Finance-Manager');
const associate = new role_1.Role(3, 'Associate');
// - Users
const peter = new user_1.User(1, 'pjacks', 'password', 'Peter', 'Jackson', 'pjacks@projco.com', admin);
const kyle = new user_1.User(2, 'kholmes', 'password', 'Kyle', 'Holmes', 'kholms@projco.com', financeManager);
const john = new user_1.User(3, 'jsmall', 'password', 'John', 'Small', 'jsmal@projco.com', associate);
// arrays
exports.Users = [peter, kyle, john];
// Users = seeUsers(); // it does change, shut up lint!
// const Roles = seeRoles();
// we will assume all routes defined with this router
// start with '/users'
exports.userRouter = express_1.default.Router();
// change ?id=# to /#
exports.userRouter.get('', (req, res, next) => {
    if (req.query.id === undefined) {
        next();
    }
    res.redirect('users/' + req.query.id);
});
// show one user based on ID
exports.userRouter.get('/:id', (req, res) => {
    const idParam = +req.params.id; // convert to number
    try {
        const user = exports.Users.find(ele => ele.userId === idParam);
        res.status(200).send(auth_router_1.pageGenerator(['users', userTable(user, req.session.user)], req.session.user));
    }
    catch (_a) {
        error_middleware_1.notFound(req, res);
    }
});
// show all users
exports.userRouter.get('', [auth_middleware_1.authAdminFinanceMiddleware, (req, res) => {
        console.log(exports.Users);
        console.log(exports.Users[1]);
        res.status(200).send(auth_router_1.pageGenerator(['users', userTable(exports.Users, req.session.user)], req.session.user));
    }]);
// patch user(makes changes)
exports.userRouter.patch('*', [auth_middleware_1.authAdminMiddleware, (req, res) => {
        console.log(req.body.userId);
        const user = exports.Users.find(ele => ele.userId == req.body.userId);
        const index = exports.Users.indexOf(user);
        console.log('got to the patch');
        console.log(req.body.username);
        if (req.body.username !== '') {
            exports.Users[index].username = req.body.username;
        }
        if (req.body.password !== '') {
            exports.Users[index].password = req.body.password;
        }
        if (req.body.firstName !== '') {
            exports.Users[index].firstName = req.body.firstName;
        }
        if (req.body.lastName !== '') {
            exports.Users[index].lastName = req.body.lastName;
        }
        if (req.body.email !== '') {
            exports.Users[index].email = req.body.email;
        }
        if (req.body.role !== '') {
            switch (req.body.role) {
                case 'admin':
                    exports.Users[index].role.role = 'Admin';
                    break;
                case 'finance':
                    exports.Users[index].role.role = 'Finance-Manager';
                    break;
                case 'associate':
                    exports.Users[index].role.role = 'Associate';
                    break;
                default:
                    console.log('problem with form');
                    break;
            }
            console.log('account type set');
        }
        console.log(user.userId);
        res.redirect('/users');
    }]);
// create content  for users and users/#
function userTable(users, user) {
    const id = user.userId;
    const role = user.role.role;
    let data = '';
    if (users.constructor == Array) {
        data += `<form action="users" method="patch">Select user by ID: <input type="number" name="id"><input type="submit"></form>`;
    }
    data += `<Table><tr>
  <td>ID</td>
  <td>Username</td>
  <td>Password</td>
  <td colspan="2">Name</td>
  <td>Email</td>
  <td>Role</td>
  </tr>`;
    if (users.constructor == Array) {
        users.forEach(element => {
            data += `<tr>
      <td><a href="/users/${element.userId}">${element.userId}</a></td>
      <td>${element.username}</td>
      <td>********</td>
      <td>${element.firstName}</td>
      <td>${element.lastName}</td>
      <td><a href="mailto:${element.email}">${element.email}</a></td>
      <td>${element.role.role}</td>
      </tr>`;
        });
    }
    else {
        if (role === 'Admin') {
            data += `<form action="" method="post">
      <input type="hidden" name="_method" value="patch">
      <tr>
      <td><input name="userId" type="hidden" value="${users.userId}">${users.userId}</input></td>
      <td><input name="username" value="${users.username}"></input></td>
      <td><input name="password" value=""></input></td>
      <td><input name="firstName" value="${users.firstName}"></input></td>
      <td><input name="lastName" value="${users.lastName}"></input></td>
      <td><input name="email" value="${users.email}"></input></td>
      <td><select name="role">`;
            switch (users.role.role) {
                case 'Admin':
                    data += `<option value="admin" selected="true">admin</option>
          <option value="finance">finance</option>
          <option value="associate">associate</option>`;
                    break;
                case 'Finance-manager':
                    data += `<option value="admin">admin</option>
          <option value="finance-manager" selected="true">finance-manager</option>
          <option value="associate">associate</option>`;
                    break;
                default:
                    data += `<option value="admin">admin</option>
          <option value="finance">finance</option>
          <option value="associate" selected="true">associate</option>`;
                    break;
            }
            data += `</select></td>
      </tr>
      <tr>
      <td colspan = "7"><input type="submit" value="Update"></input></td>
      </tr>
      </form>`;
        }
        else if (role === 'Finance-Manager') {
            data += `<tr>
      <td>${users.userId}</td>
      <td>${users.username}</td>
      <td>********</td>
      <td>${users.firstName}</td>
      <td>${users.lastName}</td>
      <td>${users.email}</td>
      <td>${users.role.role}</td>`;
        }
        else if (users.userId === id) {
            data += `<tr>
      <td>${users.userId}</td>
      <td>${users.username}</td>
      <td>********</td>
      <td>${users.firstName}</td>
      <td>${users.lastName}</td>
      <td>${users.email}</td>
      <td>${users.role.role}</td>`;
        }
        else {
            data += `<td colspan="7">401:Unauthorized</td>`;
        }
    }
    data += '</table>';
    return data;
}
//# sourceMappingURL=user.router.js.map