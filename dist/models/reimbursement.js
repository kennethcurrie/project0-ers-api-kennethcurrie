"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Reimbursement {
    constructor(reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type) {
        this.reimbursementId = reimbursementId;
        this.author = author;
        this.amount = amount;
        this.dateSubmitted = dateSubmitted;
        this.dateResolved = dateResolved;
        this.description = description;
        this.resolver = resolver;
        this.status = status;
        this.type = type;
    }
}
exports.Reimbursement = Reimbursement;
//# sourceMappingURL=reimbursement.js.map