import { User } from './models/user';
import { Role } from './models/role';
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
export async function seeRoles() {
    const Roles: Role[] = <Role[]>[];
    console.log('pool start');
    await pool.query('SELECT * FROM "role"', (error, results) => {
        console.log('rolecheck');
        if (error) {
            console.log(error);
            throw error;
        }
        console.log(results);
        results.forEach(element => {
            const role = new Role(element.roleid, element.role);
            console.log(element);
            Roles.push(role);
            console.log(role);
        });
    });
    console.log('outside pool');
    return Roles as Role[];
}

// user table
const getUsers = (req, res) => {
    pool.query('SELECT * FROM "user"', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};
export function seeUsers() {
    const Users = seeUser().then;
    if (Users === undefined || Users === {}) {
        return [new User(0, 'error', 'error', 'error', 'error', 'error', new Role(0, 'error'))];
    }
    return Users;
}
export async function seeUser() {
    const Users: User[] = <User[]>[];
    const Roles: Role[] = <Role[]>[];
    console.log('pool start');
    await pool.query('SELECT * FROM "user"', (error, results) => {
        console.log('usercheck');
        if (error) {
            console.log(error);
            throw error;
        }
        console.log(results);
        results.forEach(element => {
            let role = new Role(0, '');
            try {
                role = Roles.find(ele => ele.roleId == element.role);
            } catch {
                role = Roles.find(ele => ele.roleId == 3);
            }
            console.log(element);
            const user = new User(element.userid, element.username, element.password, element.firstname, element.lastname, element.email, role);
            console.log(user);
            Users.push(user);
        });
    });
    console.log('outside pool');
    return Users as User[];
}

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