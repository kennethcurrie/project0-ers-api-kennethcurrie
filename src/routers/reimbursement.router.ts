import express from 'express';
import { pageGenerator } from './auth.router';
import { authFinanceMiddleware } from '../middleware/auth.middleware';
import { unauthorizedError } from '../middleware/error.middleware';
import { ReimbursementStatus } from '../models/reimbursement-status';
import { ReimbursementType } from '../models/reimbursement-type';
import { Reimbursement } from '../models/reimbursement';
import { Users } from './user.router';
import bodyParser = require('body-parser');


// constants
// --reimbursementstatus
const pending  = new ReimbursementStatus(1, 'Pending' );
const approved = new ReimbursementStatus(2, 'Approved');
const denied   = new ReimbursementStatus(3, 'Denied'  );
// --reimbursementtype
const lodging = new ReimbursementType(1, 'Lodging');
const travel  = new ReimbursementType(2, 'Travel' );
const food    = new ReimbursementType(3, 'Food'   );
const other   = new ReimbursementType(4, 'Other'  );
// --reimbursement
const shots      = new Reimbursement(1, Users[2], 10, 1546300800, 1546387200, 'Shots',       Users[1], denied,   food   );
const econolodge = new Reimbursement(2, Users[2], 20, 1546387200, 1546473600, 'Econo-Lodge', Users[1], approved, lodging);
const busfare    = new Reimbursement(3, Users[2], 10, 1546473600, 0,          'Bus fare',    Users[1], pending,  travel );
// arrays
const reimbursementstatuses = [pending, approved, denied];
const reimbursementtypes = [lodging, travel, food, other];
const reimbursements = [shots, econolodge, busfare];

// we will assume all routes defined with this router
// start with '/users'
export const reimbursementRouter = express.Router();

// generate root reimbursements page with links based on if Finance-Manager or not.
reimbursementRouter.get('', (req, res) => {
  const role = req.session.user.role.role;
  const id = req.session.user.userId;
  if (role === undefined) {
    unauthorizedError(req, res);
  }
  let body = `<p><a href="/reimbursements/submit">Submit Reimbursements</a></p>`;
  body    += `<p><a href="/reimbursements/author/userId/${id}">My Reimbursements</a></p>`;
  if ( role === 'Finance-Manager') {
    body  += `<p><a href="/reimbursements/author">Reimbursements by User</a></p>`;
    body  += `<p><a href="/reimbursements/status">Reimbursements by Status</a></p>`;
  }
  body += '';
  res.status(200).send(pageGenerator(['Reimbursements', body], req.session.user));
});

// Approve or Deny Reiumbursement
reimbursementRouter.patch('', [authFinanceMiddleware, (req, res) => {
  const patched = reimbursements.find(ele => ele.reimbursementId == req.body.reimbursementId);
  const index = reimbursements.indexOf(patched);
  reimbursements[index].status = reimbursementstatuses.find(ele => ele.status === req.body.status);
  res.redirect(`/reimbursements/r/${req.body.reimbursementId}`);
}]);

// Form for creating reimbursement
reimbursementRouter.get('/submit', (req, res) => {
  const body = `<form action="/reimbursements" method="post"><table><input type="hidden" name="reimbursementid" value="0">
  <tr><td>Description</td><td><input name="description" id="description"></input></td></tr>
  <tr><td>Amount</td><td>$<input name="amount" id="amount" type="number" step=".01" min=".01"></input></td></tr>
  <tr>Type<td>Type</td><td><select name="type">
  <option name="Lodging" selected="true">Lodging</option>
  <option name="Travel">Travel</option>
  <option name="Food">Food</option>
  <option name="Other">Other</option>
  </select></td></tr>
  <tr><td colspan="2"><input type="submit" value="Submit"></input></td></tr>
  <table></form>`;
  res.status(200).send(pageGenerator(['Reimbursements', body], req.session.user));
});

// Submit new reimbursement
reimbursementRouter.post('', (req, res) => {
  const id = req.session.user.userId;
  let reimbursementid = req.body.reimbursementid;
  let type =  other;
  reimbursementtypes.forEach(element => {
    if (req.body.type === element.type) {
      type = element;
    }
  });

  reimbursements.forEach(ele => {
    if (ele.reimbursementId > reimbursementid) {
      reimbursementid = ele.reimbursementId;
    }
  });
  reimbursementid++;

  reimbursements.push(new Reimbursement(reimbursementid, req.session.user, req.body.amount, Math.round((new Date()).getTime() / 1000), 0, req.body.description, Users[2], pending, type));
  res.redirect(`/reimbursements/author/userId/${id}`);
});

// Show all users
reimbursementRouter.get('/author', [authFinanceMiddleware, (req, res) => {
    res.status(200).send(pageGenerator(['Users', userbody()], req.session.user));
}]);

// Show all Statuses
reimbursementRouter.get('/status', [authFinanceMiddleware, (req, res) => {
  res.status(200).send(pageGenerator(['Users', statusbody()], req.session.user));
}]);

// get reimbursements by User
reimbursementRouter.get('/author/userId/:id', (req, res) => {
  if (req.params.id == req.session.user.userId || req.session.user.role.role === 'Finance-Manager') {
    const userReimbursements = [];
    reimbursements.forEach(element => {
      if (element.author.userId === +req.params.id) {
        userReimbursements.push(element);
      }
    });
    res.status(200).send(pageGenerator(['Reimbursements', reimbursementbody(userReimbursements, req.session.user.role, false)], req.session.user));
  } else {
    unauthorizedError(req, res);
  }
});

// Get reimbursements by status
reimbursementRouter.get('/status/:statusId', [authFinanceMiddleware, (req, res) => {
  const userReimbursements = [];
  reimbursements.forEach(element => {
    if (element.status.statusId == req.params.statusId) {
      userReimbursements.push(element);
    }
  });
  res.status(200).send(pageGenerator(['Reimbursements', reimbursementbody(userReimbursements, req.session.user.role, false)], req.session.user));
}]);

// Get specific reimbursement
reimbursementRouter.get('/r/:id', [authFinanceMiddleware, (req, res) => {const userReimbursements = [];
  reimbursements.forEach(element => {
    if (element.reimbursementId == req.params.id) {
      userReimbursements.push(element);
    }
  });
  res.status(200).send(pageGenerator(['Reimbursements', reimbursementbody(userReimbursements, req.session.user.role, true)], req.session.user));
}]);

// Turn reimbursements array into a table
function reimbursementbody(filteredReimbursements, role, form) {
  let body = `<form action="/reimbursements/" method="post">
  <input type="hidden" name="_method" value="patch">
  <table><tr>
  <td>ID</td>
  <td>Author</td>
  <td>Amount</td>
  <td>Submitted</td>
  <td>Resolved</td>
  <td>Description</td>
  <td>Resolver</td>
  <td>Status</td>
  <td>Type</td>`;
  body += `</tr>`;
  if (filteredReimbursements.length === 0)  {
    body += '<tr><td colspan="9">No Reimbursements</td></tr>';
  } else {
    filteredReimbursements.forEach(ele => {
      const author = ele.author.firstName + ' ' + ele.author.lastName;
      const  dateSubmitted = new Date(ele.dateSubmitted * 1000).toLocaleDateString('en-US');
      let dateResolved;
      if (ele.dateResolved === 0) {
        dateResolved = '';
      } else {
        dateResolved = new Date(ele.dateResolved * 1000).toLocaleDateString('en-US');
      }
      const resolver = ele.resolver.firstName + ' ' + ele.resolver.lastName;
      if (role.role === 'Finance-Manager') {
        body += `<td><a href="/reimbursements/r/${ele.reimbursementId}"><input name="reimbursementId" type="hidden" value="${ele.reimbursementId}">${ele.reimbursementId}</input></a></td>`;
      } else {
        body += `<td>${ele.reimbursementId}</td>`;
      }
      body += `
      <td>${author}</td>
      <td>\$${ele.amount}</td>
      <td>${dateSubmitted}</td>
      <td>${dateResolved}</td>
      <td>${ele.description}</td>
      <td>${resolver}</td>`;
      if (form && ele.status.status === 'Pending') {
        body += `<td><select name="status">
        <option value="Pending" selected="true">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Denied">Denied</option>
        </select></td>
        <td>${ele.type.type}</td></tr>
        <td colspan = "9"><input type="submit" value="Update"></input></td>`;
      } else {
        body += `<td>${ele.status.status}</td>
        <td>${ele.type.type}</td></tr>`;
      }
    });
  }
  body += '</table></form>';
  return body;
}

// Show all users
function userbody() {
  let body = `<table><tr>
  <td>ID</td>
  <td>Username</td>
  <td>Password</td>
  <td colspan="2">Name</td>
  <td>Email</td>
  <td>Role</td>
  </tr>`;
  Users.forEach(element => {
    body += `<tr>
    <td><a href="/reimbursements/author/userId/${element.userId}">${element.userId}</a></td>
    <td>${element.username}</td>
    <td>********</td>
    <td>${element.firstName}</td>
    <td>${element.lastName}</td>
    <td><a href="mailto:${element.email}">${element.email}</a></td>
    <td>${element.role.role}</td>
    </tr>`;
  });
  body += `</td>
  </tr>
  </table>`;
  return body;
}

// Show all statuses
function statusbody() {
  let body = `<table><tr>
  <td>ID</td>
  <td>Status</td>
  </tr>`;
  reimbursementstatuses.forEach(element => {
    body += `<tr>
    <td><a href="/reimbursements/status/${element.statusId}">${element.statusId}</a></td>
    <td>${element.status}</td>
    </tr>`;
  });
  body += `</td>
  </tr>
  </table>`;
  return body;
}