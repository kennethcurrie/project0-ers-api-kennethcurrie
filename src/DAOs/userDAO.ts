import { User } from '../models/user';
import { Role } from '../models/role';
import { SessionFactory } from '../util/session-factory';

// dirty, but better than death by pool
const query = `select
"user".userid,
"user".username,
"user"."password",
"user".firstname,
"user".lastname,
"user".email,
"role".roleid,
"role"."role"
from
"user"
join
"role" on "user"."role" = "role".roleid`;

export class UserDAO {

    // gets all users
    public async getAllUsers(): Promise<User[]> {
        const client = await SessionFactory.getConnectionPool().connect();
        const result = await client.query(`${query} order by userid`);
        const user = result.rows;
        const userData = [];
        user.forEach(u => {
            userData.push(new User(
                u.userid,
                u.username,
                u.password,
                u.firstname,
                u.lastname,
                u.email,
                new Role(u.roleid, u.role)
            ));
        });
        client.release();
        return userData;
    }

    // get a user when provided an ID
    public async getUserById(userid: number): Promise<User[]> {
        const client = await SessionFactory.getConnectionPool().connect();
        const result = await client.query(`${query} where userid = ${userid} order by userid`);
        const user = result.rows;
        const userData = [];
        user.forEach(u => {
            userData.push(new User(
                u.userid,
                u.username,
                u.password,
                u.firstname,
                u.lastname,
                u.email,
                new Role(u.roleid, u.role)
            ));
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
        await client.query(`UPDATE "user" set ${query} WHERE userid = ${reqBody.userId};`);
        client.release();
    }
}