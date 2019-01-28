"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db = require('../query');
exports.dbTestRouter = express_1.default.Router();
exports.dbTestRouter.get('/roles', db.getRoles);
exports.dbTestRouter.get('/users', db.getUsers);
exports.dbTestRouter.get('/rstatus', db.getReimbursementStatus);
exports.dbTestRouter.get('/rtype', db.getReimbursementType);
exports.dbTestRouter.get('/r', db.getReimbursement);
//# sourceMappingURL=dbtest.router.js.map