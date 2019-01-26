import express from 'express';
const db = require ('../query');


export const dbTestRouter = express.Router();

dbTestRouter.get('/roles', db.getRoles);
dbTestRouter.get('/users', db.getUsers);
dbTestRouter.get('/rstatus', db.getReimbursementStatus);
dbTestRouter.get('/rtype', db.getReimbursementType);
dbTestRouter.get('/r', db.getReimbursement);