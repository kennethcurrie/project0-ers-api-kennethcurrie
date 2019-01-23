import express from 'express';
import { pageGenerator } from '../routers/auth.router';
import { authFinanceMiddleware } from '../middleware/auth.middleware';
import { User } from '../models/user';
import { Role } from '../models/role';

// constants
const admin = new Role('1', 'Admin');
const financeManager  = new Role('2', 'Finance-Manager');
const associate = new Role('3', 'Associate');
const peter = new User(1, 'peter', 'password', 'Peter', 'Jackson', 'pjacks@projco.com', admin);
const kyle = new User(2, 'kyle', 'password', 'Kyle', 'Holmes', 'kholms@projco.com', financeManager);
const john = new User(3, 'John', 'password', 'john', 'Small', 'jsmal@projco.com', associate);
const users = [
  peter,
  kyle,
  john
];

// we will assume all routes defined with this router
// start with '/users'
export const userRouter = express.Router();

// /users - find all
userRouter.get('*', [
authFinanceMiddleware,
(req, res, next) => {
  next();
}]);

// show one user based on ID
userRouter.get('/:id', (req, res) => {
  console.log('getByID');
  console.log(req.params);
  const idParam = +req.params.id; // convert to number
  const user = users.find(ele => ele.userId === idParam);
  res.status(200).send(pageGenerator(['users', userTable(user, req.session.user.role)], req.session.user.role));
});

// show all users
userRouter.get('', (req, res) => {
    res.status(200).send(pageGenerator(['users', userTable(users, req.session.user.role)], req.session.user.role));
});

// patch user
userRouter.post('*', (req, res) => {
  console.log('patch, I guess');
  res.status(200).send(pageGenerator(['users', userTable(users, req.session.user.role)], req.session.user.role));
});

// change ?id=# to /#
userRouter.get('', (req, res, next) => {
  console.log(req.params);
  if (req.query.id === undefined) {
    next();
  }
  res.redirect('' + req.query.id);
  next();
});

function userTable(users, role) {
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
  } else {
    data += `<form action="" method="post">
    <tr>
    <td><input name="userId" type="hidden" value="${users.userId}">&nbsp;</input></td>
    <td><input name="username" value="${users.username}"></input></td>
    <td><input name="password" value=""></input></td>
    <td><input name="firstName" value="${users.firstName}"></input></td>
    <td><input name="lastName" value="${users.lastName}"></input></td>
    <td><input name="email" value="${users.email}"></input></td>
    <td><select name="role">`;
    switch (users.role.role) {
      case 'admin':
        data += `<option value="admin" selected="true">admin</option>
        <option value="finance">finance</option>
        <option value="associate">associate</option>`;
      break;
      case 'finance-manager':
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
    <td colspan = "7"><input type="submit"></input></td>
    </tr>
    </form>`;
  }
  data += '</table>';
  return data;
}