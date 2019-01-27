import express from 'express';
import { pageGenerator } from '../routers/auth.router';
import { authAdminFinanceMiddleware, authAdminMiddleware } from '../middleware/auth.middleware';
import { User } from '../models/user';
import { Role } from '../models/role';
import { notFound } from '../middleware/error.middleware';
// import { seeUsers, seeRoles } from '../query';


// constants
// -- Roles
const admin           = new Role(1, 'Admin'          );
const financeManager  = new Role(2, 'Finance-Manager');
const associate       = new Role(3, 'Associate'      );
// - Users
const peter = new User(1, 'pjacks', 'password', 'Peter', 'Jackson', 'pjacks@projco.com', admin         );
const kyle  = new User(2, 'kholmes',  'password', 'Kyle',  'Holmes',  'kholms@projco.com', financeManager);
const john  = new User(3, 'jsmall',  'password', 'John',  'Small',   'jsmal@projco.com',  associate     );
// arrays
export const Users = [peter, kyle, john];
// Users = seeUsers(); // it does change, shut up lint!
// const Roles = seeRoles();

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
  try {
  const user = Users.find(ele => ele.userId === idParam);
    res.status(200).send(pageGenerator(['users', userTable(user, req.session.user)], req.session.user));
  } catch {
    notFound(req, res);
  }
});

// show all users
userRouter.get('', [authAdminFinanceMiddleware, (req, res) => {
  console.log(Users);
  console.log(Users[1]);
    res.status(200).send(pageGenerator(['users', userTable(Users, req.session.user)], req.session.user));
}]);

// patch user(makes changes)
userRouter.patch('*', [authAdminMiddleware, (req, res) => {
  console.log(req.body.userId);
  const user = Users.find(ele => ele.userId == req.body.userId);
  const index = Users.indexOf(user);
  console.log('got to the patch');
  console.log(req.body.username);
  if (req.body.username !== '') { Users[index].username = req.body.username; }
  if (req.body.password !== '') { Users[index].password = req.body.password; }
  if (req.body.firstName !== '') { Users[index].firstName = req.body.firstName; }
  if (req.body.lastName !== '') { Users[index].lastName = req.body.lastName; }
  if (req.body.email !== '') { Users[index].email = req.body.email; }
  if (req.body.role !== '') {
    switch (req.body.role) {
      case 'admin':
        Users[index].role.role = 'Admin';
      break;
      case 'finance':
        Users[index].role.role = 'Finance-Manager';
      break;
      case 'associate':
        Users[index].role.role = 'Associate';
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
  } else {
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
      <td colspan = "7"><input type="submit"></input></td>
      </tr>
      </form>`;
    } else if (role === 'Finance-Manager') {
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