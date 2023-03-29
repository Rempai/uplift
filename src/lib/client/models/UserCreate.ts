/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserCreate = {
  password: string;
  repeatPassword?: string;
  username: string;
  role?: UserCreate.role;
  isActive?: boolean;
};

export namespace UserCreate {
  export enum role {
    ADMIN = "Admin",
    WRITER = "Writer",
    USER = "User",
  }
}
