/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserUpdate = {
  old_password?: string;
  new_password?: string;
  confirm_password?: string;
  username?: string;
  role?: UserUpdate.role;
  is_active?: boolean;
};

export namespace UserUpdate {
  export enum role {
    ADMIN = "Admin",
    USER = "User",
  }
}
