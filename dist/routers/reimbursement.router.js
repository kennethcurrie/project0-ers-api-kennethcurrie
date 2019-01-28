"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = require("./auth.router");
const auth_middleware_1 = require("../middleware/auth.middleware");
const error_middleware_1 = require("../middleware/error.middleware");
const reimbursement_status_1 = require("../models/reimbursement-status");
const reimbursement_type_1 = require("../models/reimbursement-type");
const reimbursement_1 = require("../models/reimbursement");
const user_router_1 = require("./user.router");
// constants
// --reimbursementstatus
const pending = new reimbursement_status_1.ReimbursementStatus(1, 'Pending');
const approved = new reimbursement_status_1.ReimbursementStatus(2, 'Approved');
const denied = new reimbursement_status_1.ReimbursementStatus(3, 'Denied');
// --reimbursementtype
const lodging = new reimbursement_type_1.ReimbursementType(1, 'Lodging');
const travel = new reimbursement_type_1.ReimbursementType(2, 'Travel');
const food = new reimbursement_type_1.ReimbursementType(3, 'Food');
const other = new reimbursement_type_1.ReimbursementType(4, 'Other');
// --reimbursement
const shots = new reimbursement_1.Reimbursement(1, user_router_1.Users[2], 10, 1546300800, 1546387200, 'Shots', user_router_1.Users[1], denied, food);
const econolodge = new reimbursement_1.Reimbursement(2, user_router_1.Users[2], 20, 1546387200, 1546473600, 'Econo-Lodge', user_router_1.Users[1], approved, lodging);
const busfare = new reimbursement_1.Reimbursement(3, user_router_1.Users[2], 10, 1546473600, 0, 'Bus fare', user_router_1.Users[1], pending, travel);
// arrays
const reimbursementstatuses = [pending, approved, denied];
const reimbursementtypes = [lodging, travel, food, other];
const reimbursements = [shots, econolodge, busfare];
// we will assume all routes defined with this router
// start with '/users'
exports.reimbursementRouter = express_1.default.Router();
// generate base reimbursements page with links based on if Finance-Manager or not.
exports.reimbursementRouter.get('', (req, res) => {
    const role = req.session.user.role.role;
    const id = req.session.user.userId;
    if (role === undefined) {
        error_middleware_1.unauthorizedError(req, res);
    }
    let body = `<p><a href="/reimbursements/submit">Submit Reimbursements</a></p>`;
    body += `<p><a href="/reimbursements/author/userId/${id}">My Reimbursements</a></p>`;
    if (role === 'Finance-Manager') {
        body += `<p><a href="/reimbursements/author">Reimbursements by User</a></p>`;
        body += `<p><a href="/reimbursements/status">Reimbursements by status</a></p>`;
    }
    body += '';
    res.status(200).send(auth_router_1.pageGenerator(['Reimbursements', body], req.session.user));
});
// form for creating reimbursement
exports.reimbursementRouter.get('/submit', (req, res) => {
    const body = `<form action="" method="post"><table><input type="hidden" name="reimbursementid" value="0">
  <tr><td>Description</td><td><input name="description" id="description"></input></td></tr>
  <tr><td>Amount</td><td>$<input name="amount" id="amount" type="number" step=".01" min=".01"></input></td></tr>
  <tr>Type<td>Type</td><td><select name="type">
  <option name="Lodging" selected="true">Lodging</option>
  <option name="Travel">Travel</option>
  <option name="Food">Food</option>
  <option name="Other">Lodging</option>
  </select></td></tr>
  <tr><td colspan="2"><input type="submit" value="Submit"></input></td></tr>
  <table></form>`;
    res.status(200).send(auth_router_1.pageGenerator(['Reimbursements', body], req.session.user));
});
// form submit
exports.reimbursementRouter.post('/submit', (req, res) => {
    const id = req.session.user.userId;
    let reimbursementid = req.body.reimbursementid;
    let type = other;
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
    reimbursements.push(new reimbursement_1.Reimbursement(reimbursementid, req.session.user, req.body.amount, Math.round((new Date()).getTime() / 1000), 0, req.body.description, user_router_1.Users[2], pending, type));
    res.redirect(`/reimbursements/userId/${id}`);
});
// show all users
exports.reimbursementRouter.get('/author', [auth_middleware_1.authFinanceMiddleware, (req, res) => {
        res.status(200).send(auth_router_1.pageGenerator(['Users', userbody()], req.session.user));
    }]);
// get reimbursements by User
exports.reimbursementRouter.get('/author/userId/:id', (req, res) => {
    if (req.params.id == req.session.user.userId || req.session.user.role.role === 'Finance-Manager') {
        const userReimbursements = [];
        reimbursements.forEach(element => {
            if (element.author.userId == req.params.id) {
                userReimbursements.push(element);
            }
        });
        res.status(200).send(auth_router_1.pageGenerator(['Reimbursements', reimbursementbody(userReimbursements, req.session.user.role, false)], req.session.user));
    }
    else {
        error_middleware_1.unauthorizedError(req, res);
    }
});
// get reimbursements by status
exports.reimbursementRouter.get('/status/:statusId', [auth_middleware_1.authFinanceMiddleware, (req, res) => {
        const userReimbursements = [];
        reimbursements.forEach(element => {
            if (element.status.statusId == req.params.statusId) {
                userReimbursements.push(element);
            }
        });
        res.status(200).send(auth_router_1.pageGenerator(['Reimbursements', reimbursementbody(userReimbursements, req.session.user.role, false)], req.session.user));
    }]);
// get specific reimbursement
exports.reimbursementRouter.get('/r/:id', [auth_middleware_1.authFinanceMiddleware, (req, res) => {
        const userReimbursements = [];
        reimbursements.forEach(element => {
            if (element.reimbursementId == req.params.id) {
                userReimbursements.push(element);
            }
        });
        res.status(200).send(auth_router_1.pageGenerator(['Reimbursements', reimbursementbody(userReimbursements, req.session.user.role, true)], req.session.user));
    }]);
function reimbursementbody(filteredReimbursements, role, form) {
    let body = '';
    console.log(form);
    if (form) {
        body += '<form action="/reimbursements/" method="post"><input type="hidden" name="_method" value="patch">';
    }
    body = `<table><tr>
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
    if (filteredReimbursements.length === 0) {
        body += '<tr><td colspan="9">No Reimbursements</td></tr>';
    }
    else {
        filteredReimbursements.forEach(ele => {
            const author = ele.author.firstName + ' ' + ele.author.lastName;
            const dateSubmitted = new Date(ele.dateSubmitted * 1000).toLocaleDateString('en-US');
            let dateResolved;
            if (ele.dateResolved === 0) {
                dateResolved = '';
            }
            else {
                dateResolved = new Date(ele.dateResolved * 1000).toLocaleDateString('en-US');
            }
            const resolver = ele.resolver.firstName + ' ' + ele.resolver.lastName;
            if (role.role = 'Finance-Manager') {
                body += `<td><a href="/reimbursements/r/${ele.reimbursementId}">${ele.reimbursementId}</a></td>`;
            }
            else {
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
                body += `<td><select name="role">
        <option value="Pending" selected="true">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Denied">Denied</option>
        </select></td>
        <td>${ele.type.type}</td></tr>
        <td colspan = "9"><input type="submit" value="Update"></input></td>`;
            }
            else {
                body += `<td>${ele.status.status}</td>
        <td>${ele.type.type}</td></tr>`;
            }
        });
    }
    body += '</table>';
    if (form) {
        body += '</form>';
    }
    console.log(body);
    return body;
}
// show all users with links to their reimbursements
function userbody() {
    let body = `<Table><tr>
  <td>ID</td>
  <td>Username</td>
  <td>Password</td>
  <td colspan="2">Name</td>
  <td>Email</td>
  <td>Role</td>
  </tr>`;
    user_router_1.Users.forEach(element => {
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
    body += `</select></td>
  </tr>
  </table>`;
    return body;
}
//# sourceMappingURL=reimbursement.router.js.map