import express from 'express';
import { pageGenerator } from '../routers/auth.router';
import { authAdminFinanceMiddleware, authAdminMiddleware } from '../middleware/auth.middleware';
import { User } from '../models/user';
import { Role } from '../models/role';

// constants
const admin = new Role('1', 'Admin');
const financeManager  = new Role('2', 'Finance-Manager');
const associate = new Role('3', 'Associate');
const peter = new User(1, 'peter', 'password', 'Peter', 'Jackson', 'pjacks@projco.com', admin);
const kyle = new User(2, 'kyle', 'password', 'Kyle', 'Holmes', 'kholms@projco.com', financeManager);
const john = new User(3, 'John', 'password', 'john', 'Small', 'jsmal@projco.com', associate);
// changing variables
let users = [];
users = [peter, kyle, john]; // it does change, shut up lint!

// we will assume all routes defined with this router
// start with '/users'
export const userRouter = express.Router();

// change ?id=# to /#
userRouter.get('', (req, res, next) => {
  if (req.query.id === undefined) {
    next();
  }
  res.redirect('users/' + req.query.id);
});

// show one user based on ID
userRouter.get('/:id', (req, res) => {
  const idParam = +req.params.id; // convert to number
  const user = users.find(ele => ele.userId === idParam);
  res.status(200).send(pageGenerator(['users', userTable(user, req.session.user.role, req.session.user.id)], req.session.user.role, req.session.user.id));
});

// show all users
userRouter.get('', [authAdminFinanceMiddleware, (req, res) => {
    res.status(200).send(pageGenerator(['users', userTable(users, req.session.user.role, req.session.user.id)], req.session.user.role, req.session.user.id));
}]);

// patch user(makes changes)
userRouter.patch('*', [authAdminMiddleware, (req, res) => {
  console.log(req.body.userId);
  const user = users.find(ele => ele.userId == req.body.userId);
  const index = users.indexOf(user);
  console.log('got to the patch');
  console.log(req.body.username);
  if (req.body.username !== '') { users[index].setUsername(req.body.username); }
  if (req.body.password !== '') { users[index].password = req.body.password; }
  if (req.body.firstName !== '') { users[index].firstName = req.body.firstName; }
  if (req.body.lastName !== '') { users[index].lastName = req.body.lastName; }
  if (req.body.email !== '') { users[index].email = req.body.email; }
  if (req.body.role !== '') {
    switch (req.body.role) {
      case 'admin':
        users[index].role = admin;
      break;
      case 'finance':
        users[index].role = financeManager;
      break;
      case 'associate':
        users[index].role = associate;
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
function userTable(users, role, id) {
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
    if (role === 'admin') {
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
      <td colspan = "7"><input type="submit"></input></td>
      </tr>
      </form>`;
    } else if (role === 'finance-manager') {
      data += `<form action="" method="post">
      <input type="hidden" name="_method" value="patch">
      <tr>
      <td>${users.userId}</td>
      <td>${users.username}</td>
      <td>********</td>
      <td>${users.firstName}</td>
      <td>${users.lastName}</td>
      <td>${users.email}</td>
      <td>${users.role.role}</td>`;
    } else if (users.userId === id) {
      data += `<form action="" method="post">
      <input type="hidden" name="_method" value="patch">
      <tr>
      <td>${users.userId}</td>
      <td>${users.username}</td>
      <td>********</td>
      <td>${users.firstName}</td>
      <td>${users.lastName}</td>
      <td>${users.email}</td>
      <td>${users.role.role}</td>`;
    } else {
      data += `<td colspan="7">401:Unauthorized</td>`;
    }
  }
  data += '</table>';
  return data;
}