"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeUser = exports.UserPayload = void 0;
class UserPayload {
    email;
    sub;
    id;
    role;
}
exports.UserPayload = UserPayload;
class SafeUser {
    id;
    email;
    firstName;
    lastName;
    role;
    createdAt;
    updatedAt;
}
exports.SafeUser = SafeUser;
//# sourceMappingURL=index.js.map