import express from 'express';
import { pageGenerator } from './auth.router';
import { authFinanceMiddleware } from '../middleware/auth.middleware';
import { unauthorizedError } from '../middleware/error.middleware';
import { ReimbursementStatus } from '../models/reimbursement-status';
import { ReimbursementType } from '../models/reimbursement-type';
import { Reimbursement } from '../models/reimbursement';
import { Users } from './user.router';


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
const reimbursements = [shots, econolodge, busfare];

// we will assume all routes defined with this router
// start with '/users'
export const reimbursementRouter = express.Router();

// generate base reimbursements page with links based on if Finance-Manager or not.
reimbursementRouter.get('', (req, res) => {
  const role = req.session.user.role.role;
  const id = req.session.user.userId;
  if (role === undefined) {
    unauthorizedError(req, res);
  }
  let body = `<p><a href="/submit">Submit Reimbursements</a></p>`;
  body    += `<p><a href="/userId/${id}">My Reimbursements</a></p>`;
  if ( role === 'Finance-Manager') {
    body  += `<p><a href="/userId">Reimbursements by user</a></p>`;
    body  += `<p><a href="/status">Reimbursements by status</a></p>`;
  }
  body += '';
  res.status(200).send(pageGenerator(['Reimbursements', body], req.session.user));
});

reimbursementRouter.get('submit', (req, res) => {
  const body = `<form><table><input type="hidden" name="_method" value="patch">
  <tr><td></td><td></td></tr>
  <table></form>`;
  res.status(200).send(pageGenerator(['Reimbursements', body], req.session.user));
});