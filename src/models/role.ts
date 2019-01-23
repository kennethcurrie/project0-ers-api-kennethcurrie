export class Role {
    roleId: number; // primary key
    role: string; // not null, unique

    constructor(roleId, role) {
        this.roleId = roleId;
        this.role = role;
    }
}