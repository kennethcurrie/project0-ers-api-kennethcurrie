import { Reimbursement } from '../models/reimbursement';
import { UserDAO } from './userDAO';
import { ReimbursementStatusDAO } from './reimbursementstatusDAO';
import { ReimbursementTypeDAO } from './reimbursementtypeDAO';
import { SessionFactory } from '../util/session-factory';

const users = new UserDAO();
const types = new ReimbursementTypeDAO();
const statuses = new ReimbursementStatusDAO();

export class ReimbursementDAO {

    // gets all reimbursements
    public async getReimbursementsById(id: number): Promise<Reimbursement[]> {
        const pool = SessionFactory.getConnectionPool();
        const client = await pool.connect();
        const result = await client.query(`SELECT * from reimbursement where reimbursementid = ${id}`);
        const reimbursement = result.rows;
        const reimbursementData = [];
        await types.getAllReimbursementTypes().then(async function (reiType) {
            await statuses.getAllReimbursementStatuses().then(async function (reiStatus) {
                await users.getAllUsers().then(function (u) {
                    reimbursement.forEach(rei => {
                        reimbursementData.push(new Reimbursement(
                            rei.reimbursementid,
                            u.find(ele => ele.userId === rei.author),
                            rei.amount,
                            rei.dateSubmitted,
                            rei.dateResolved,
                            rei.description,
                            rei.resolver,
                            reiStatus.find(ele => ele.statusId === rei.status),
                            reiType.find(ele => ele.typeId === rei.type)
                        ));
                    });
                });
            });
        });
        client.release();
        return reimbursementData;
    }

    // get all reimbusements that match provided status
    public async getReimbursementsByStatus(status_id: number): Promise<Reimbursement[]> {
        const pool = SessionFactory.getConnectionPool();
        const client = await pool.connect();
        const result = await client.query(`SELECT * from reimbursement where status = ${status_id}`);
        const reimbursement = result.rows;
        const reimbursementData = [];
        await types.getAllReimbursementTypes().then(async function (reiType) {
            await statuses.getAllReimbursementStatuses().then(async function (reiStatus) {
                await users.getAllUsers().then(function (u) {
                    reimbursement.forEach(rei => {
                        reimbursementData.push(new Reimbursement(
                            rei.reimbursementid,
                            u.find(ele => ele.userId === rei.author),
                            rei.amount,
                            rei.dateSubmitted,
                            rei.dateResolved,
                            rei.description,
                            rei.resolver,
                            reiStatus.find(ele => ele.statusId === rei.status),
                            reiType.find(ele => ele.typeId === rei.type)
                        ));
                    });
                });
            });
        });
        client.release();
        return reimbursementData;
    }

    //  get all reimbursements that match author(user) id
    public async getReimbursementsByUserId(user_id: number): Promise<Reimbursement[]> {
        const client = await SessionFactory.getConnectionPool().connect();
        const result = await client.query(`SELECT * from reimbursement where author = ${user_id}`);
        const reimbursement = result.rows;
        const reimbursementData = [];
        await types.getAllReimbursementTypes().then(async function (reiType) {
            await statuses.getAllReimbursementStatuses().then(async function (reiStatus) {
                await users.getAllUsers().then(function (u) {
                    reimbursement.forEach(rei => {
                        reimbursementData.push(new Reimbursement(
                            rei.reimbursementid,
                            u.find(ele => ele.userId === rei.author),
                            rei.amount,
                            rei.dateSubmitted,
                            rei.dateResolved,
                            rei.description,
                            rei.resolver,
                            reiStatus.find(ele => ele.statusId === rei.status),
                            reiType.find(ele => ele.typeId === rei.type)
                        ));
                    });
                });
            });
        });
        client.release();
        return reimbursementData;
    }

    // insert new reimbursement into table
    public static async addReimbursements(
        author: number,         amount: number,
        dateSubmitted: number,  description: string,
        type: number
    ) {
        const client = await SessionFactory.getConnectionPool().connect();
        const text = `INSERT INTO reimbursement (
            author,             amount,
            dateSubmitted,      dateResolved,
            description,        resolver,
            status,             "type"
        ) VALUES (
            ${author},          ${amount},
            ${dateSubmitted},   0,
            '${description}',   2,
            1,                  ${type}
        );`;
        try {
            const res = await client.query(text);
            client.close();
        } catch (err) {
            console.log(err.stack);
        }
    }

    // update reimbursement
    public static async updateReimbursement(status, reimbursementId): Promise<any> {
        const client = await SessionFactory.getConnectionPool().connect();
        await client.query(`UPDATE reimbursement set status=${status} WHERE reimbursementid = ${reimbursementId};`);
        client.release();
    }
}