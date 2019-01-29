import { User } from '../models/user';
import { SessionFactory } from '../util/session-factory';
import { RoleDAO } from './roleDAO';

const roles = new RoleDAO();

export class UserDAO {

    // gets all users
    public async getAllUsers(): Promise<User[]> {
        const client = await SessionFactory.getConnectionPool().connect();
        const result = await client.query('SELECT * from "user"');
        const user = result.rows;
        const userData = [];
        await roles.getAllRoles().then(function (r) {
            user.forEach(u => {
                userData.push(new User(
                    u.userid,
                    u.username,
                    u.password,
                    u.firstname,
                    u.lastname,
                    u.email,
                    r.find(ele => ele.roleId === u.role)
                ));
            });
        });
        client.release();
        return userData;
    }

    // get a user when provided an ID
    public async getUserById(userid: number): Promise<User[]> {
        const client = await SessionFactory.getConnectionPool().connect();
        const result = await client.query(`SELECT * from "user" where userId = ${userid}`);
        const user = result.rows;
        const userData = [];
        await roles.getAllRoles().then(function (r) {
            user.forEach(u => {
                userData.push(new User(
                    u.userid,
                    u.username,
                    u.password,
                    u.firstname,
                    u.lastname,
                    u.email,
                    r.find(ele => ele.roleId === u.role)
                ));
            });
        });
        client.release();
        return userData;
    }

    // update a user
    public static async updateUser(reqBody): Promise<any> {
        const client = await SessionFactory.getConnectionPool().connect();
        let query = '';
        if (reqBody.username !== '') { query += `username = '${reqBody.username}' `; }
        if (query !== '' && reqBody.password !== '') { query += ', '; }
        if (reqBody.password !== '') { query += `"password" = '${reqBody.password}' `; }
        if (query !== '' && reqBody.firstName !== '') { query += ', '; }
        if (reqBody.firstName !== '') { query += `firstname = '${reqBody.firstName}' `; }
        if (query !== '' && reqBody.lastName !== '') { query += ', '; }
        if (reqBody.lastName !== '') { query += `"lastname" = '${reqBody.lastName}' `; }
        if (query !== '' && reqBody.role !== '') { query += ', '; }
        if (reqBody.role !== '') { query += `"role" = '${reqBody.role}' `; }
        console.log(`UPDATE "user" set ${query} WHERE userid = ${reqBody.userId};`);
        await client.query(`UPDATE "user" set ${query} WHERE userid = ${reqBody.userId};`);
        client.release();
    }
}