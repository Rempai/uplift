/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserRead = {
  id: number;
  username: string;
  role: UserRead.role;
  isActive: boolean;
};

export namespace UserRead {
  export enum role {
    ADMIN = "Admin",
    USER = "User",
  }
}
