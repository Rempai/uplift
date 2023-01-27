/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessToken } from "../models/AccessToken";
import type { Body_Auth_login_for_access_token } from "../models/Body_Auth_login_for_access_token";
import type { Register } from "../models/Register";
import type { Token } from "../models/Token";
import type { UserRead } from "../models/UserRead";
import type { UserUpdate } from "../models/UserUpdate";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class AuthService {
  /**
   * Refresh
   * @returns AccessToken Successful Response
   * @throws ApiError
   */
  public static refresh(): CancelablePromise<AccessToken> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/auth/refresh/",
    });
  }

  /**
   * Login For Access Token
   * @param formData
   * @returns Token Successful Response
   * @throws ApiError
   */
  public static loginForAccessToken(
    formData: Body_Auth_login_for_access_token
  ): CancelablePromise<Token> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/auth/login/",
      formData: formData,
      mediaType: "application/x-www-form-urlencoded",
    });
  }

  /**
   * Register User
   * @param requestBody
   * @returns Token Successful Response
   * @throws ApiError
   */
  public static registerUser(requestBody: Register): CancelablePromise<Token> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/auth/register/",
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * Get Me
   * @returns UserRead Successful Response
   * @throws ApiError
   */
  public static getMe(): CancelablePromise<UserRead> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/user/me/",
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
    });
  }

  /**
   * Delete User
   * @param id
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteUser(id: number): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/user/{id}/",
      path: {
        id: id,
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
    });
  }

  /**
   * Post User
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static postUser(requestBody: Register): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/user/user/",
      body: requestBody,
      mediaType: "application/json",
    });
  }
}
