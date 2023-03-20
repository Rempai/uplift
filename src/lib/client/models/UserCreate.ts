/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserCreate = {
  password: string;
  username: string;
  role?: UserCreate.role;
  is_active?: boolean;
};

export namespace UserCreate {
  export enum role {
    ADMIN = "Admin",
    USER = "User",
  }
}
