/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessToken } from "../models/AccessToken";
import type { Body_Auth_login_for_access_token } from "../models/Body_Auth_login_for_access_token";
import type { RefreshToken } from "../models/RefreshToken";
import type { Register } from "../models/Register";
import type { Token } from "../models/Token";
import type { UserRead } from "../models/UserRead";
import type { UserUpdate } from "../models/UserUpdate";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class AuthService {
  /**
   * Get Logs
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getLogs(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/auth/get_logs/",
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
      url: "/api/auth/token/",
      formData: formData,
      mediaType: "application/x-www-form-urlencoded",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Refresh
   * @param requestBody
   * @returns AccessToken Successful Response
   * @throws ApiError
   */
  public static refresh(requestBody: RefreshToken): CancelablePromise<AccessToken> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/auth/refresh/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
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
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Logout
   * @returns any Successful Response
   * @throws ApiError
   */
  public static logout(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/auth/logout/",
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
      url: "/api/auth/user/me/",
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
      url: "/api/auth/users/",
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
      url: "/api/auth/user/{id}/",
      path: {
        id: id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete User
   * @param id
   * @returns void
   * @throws ApiError
   */
  public static deleteUser(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/auth/user/{id}/",
      path: {
        id: id,
      },
      errors: {
        422: `Validation Error`,
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
      url: "/api/auth/user/{id}/",
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
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
      url: "/api/auth/user/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
