import { User } from "src/users/entities/user.entity";

export function hasAnyRole(user: User, allowedRoles: string[]): boolean {
  return user.role?.some(role => allowedRoles.includes(role));
}