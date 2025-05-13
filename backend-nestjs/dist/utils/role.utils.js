"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAnyRole = hasAnyRole;
function hasAnyRole(user, allowedRoles) {
    return user.role?.some(role => allowedRoles.includes(role));
}
//# sourceMappingURL=role.utils.js.map