"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./models/user");
const role_1 = require("./models/role");
const pool = require('./data').pool;
// role table
const getRoles = (req, res) => {
    pool.query('SELECT * FROM "role"', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};
function seeRoles() {
    return __awaiter(this, void 0, void 0, function* () {
        const Roles = [];
        console.log('pool start');
        yield pool.query('SELECT * FROM "role"', (error, results) => {
            console.log('rolecheck');
            if (error) {
                console.log(error);
                throw error;
            }
            console.log(results);
            results.forEach(element => {
                const role = new role_1.Role(element.roleid, element.role);
                console.log(element);
                Roles.push(role);
                console.log(role);
            });
        });
        console.log('outside pool');
        return Roles;
    });
}
exports.seeRoles = seeRoles;
// user table
const getUsers = (req, res) => {
    pool.query('SELECT * FROM "user"', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};
function seeUsers() {
    const Users = seeUser().then;
    if (Users === undefined || Users === {}) {
        return [new user_1.User(0, 'error', 'error', 'error', 'error', 'error', new role_1.Role(0, 'error'))];
    }
    return Users;
}
exports.seeUsers = seeUsers;
function seeUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const Users = [];
        const Roles = [];
        console.log('pool start');
        yield pool.query('SELECT * FROM "user"', (error, results) => {
            console.log('usercheck');
            if (error) {
                console.log(error);
                throw error;
            }
            console.log(results);
            results.forEach(element => {
                let role = new role_1.Role(0, '');
                try {
                    role = Roles.find(ele => ele.roleId == element.role);
                }
                catch (_a) {
                    role = Roles.find(ele => ele.roleId == 3);
                }
                console.log(element);
                const user = new user_1.User(element.userid, element.username, element.password, element.firstname, element.lastname, element.email, role);
                console.log(user);
                Users.push(user);
            });
        });
        console.log('outside pool');
        return Users;
    });
}
exports.seeUser = seeUser;
// reimbursementstatus table
const getReimbursementStatus = (req, res) => {
    pool.query('SELECT * FROM reimbursementstatus', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};
// reimbursementtype table
const getReimbursementType = (req, res) => {
    pool.query('SELECT * FROM reimbursementtype', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};
// reimbursement table
const getReimbursement = (req, res) => {
    pool.query('SELECT * FROM reimbursement', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};
//# sourceMappingURL=query.js.map