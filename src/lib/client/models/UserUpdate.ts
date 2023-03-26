/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserUpdate = {
  password?: string;
  newPassword?: string;
  repeatPassword?: string;
  username?: string;
  role?: UserUpdate.role;
  isActive?: boolean;
};

export namespace UserUpdate {
  export enum role {
    ADMIN = "Admin",
    USER = "User",
  }
}
