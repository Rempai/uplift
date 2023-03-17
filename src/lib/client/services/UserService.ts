/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Register } from "../models/Register";
import type { Response } from "../models/Response";
import type { UserRead } from "../models/UserRead";
import type { UserUpdate } from "../models/UserUpdate";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class UserService {
  /**
   * Get current logged in user
   * @returns UserRead Successful Response
   * @throws ApiError
   */
  public static getMe(): CancelablePromise<UserRead> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/user/me/",
      errors: {
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get Users
   * @returns UserRead Successful Response
   * @throws ApiError
   */
  public static getUsers(): CancelablePromise<Array<UserRead>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/user/users/",
      errors: {
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get User By Id
   * @param id
   * @returns UserRead Successful Response
   * @throws ApiError
   */
  public static getUserById(id: number): CancelablePromise<UserRead> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/user/{id}/",
      path: {
        id: id,
      },
      errors: {
        401: `Unautorized`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Delete User
   * @param id
   * @returns Response Successful Response
   * @throws ApiError
   */
  public static deleteUser(id: number): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/user/{id}/",
      path: {
        id: id,
      },
      errors: {
        401: `Unautorized`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Update User
   * @param id
   * @param requestBody
   * @returns UserUpdate Successful Response
   * @throws ApiError
   */
  public static updateUser(id: number, requestBody: UserUpdate): CancelablePromise<UserUpdate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/user/{id}/",
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Bad Request`,
        401: `Unautorized`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Post User
   * @param requestBody
   * @returns any Created Resource
   * @throws ApiError
   */
  public static postUser(requestBody: Register): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/user/user/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        401: `Unautorized`,
        500: `Internal Server Error`,
      },
    });
  }
}