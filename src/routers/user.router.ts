import express from 'express';
import { pageGenerator } from '../routers/auth.router';
import { authMiddleware } from '../middleware/auth.middleware';
import { User } from '../models/user';
import { Role } from '../models/role';

// constants
const admin = new Role('1', 'Admin');
const associate = new Role('2', 'Associate');
const peter = new User(1, 'peter', 'password', 'Peter', 'Jackson', 'pjacks@projco.com', admin);
const kyle = new User(2, 'kyle', 'password', 'Kyle', 'Holmes', 'kholms@projco.com', associate);
const users = [
  peter,
  kyle
];

// we will assume all routes defined with this router
// start with '/users'
export const userRouter = express.Router();

// /users - find all
userRouter.get('*', [
authMiddleware,
(req, res, next) => {
  next();
}]);

// change ?id=# to /#
userRouter.get('', (req, res, next) => {
  console.log(req.params);
  if (req.query.id === undefined) {
    next();
  }
  res.redirect('/users/' + req.query.id);
  next();
});

// show one user based on ID
userRouter.get('/:id', (req, res) => {
  console.log('getByID');
  console.log(req.params);
  const idParam = +req.params.id; // convert to number
  const user = users.find(ele => ele.userId === idParam);
  res.status(200).send(pageGenerator(['users', userTable(user)], req.session.user.role));
});

// show all users
userRouter.get('', (req, res) => {
    res.status(200).send(pageGenerator(['users', userTable(users)], req.session.user.role));
});

function userTable(users) {
  let data = '';
  if (users.constructor == Array) {
    data += `<form action="users" method="get">Select user by ID: <input type="number" name="id"><input type="submit"></form>`;
  }
  data += `<Table><tr>
  <td>ID</td>
  <td>Name</td>
  <td>Email</td>
  </tr>`;
  if (users.constructor == Array) {
    users.forEach(element => {
      data += `<tr>
      <td><a href="/users/${element.userId}">${element.userId}</a></td>
      <td><a href="/users/${element.userId}">${element.firstName} ${element.lastName}</a></td>
      <td><a href="mailto:${element.email}">${element.email}</a></td>
      </tr>`;
    });
  } else {
    data += `<tr>
    <td><a href="/users/${users.userId}">${users.userId}</a></td>
    <td><a href="/users/${users.userId}">${users.firstName} ${users.lastName}</a></td>
    <td><a href="mailto:${users.email}">${users.email}</a></td>
    </tr>`;
  }
  data += '</table>';
  return data;
}