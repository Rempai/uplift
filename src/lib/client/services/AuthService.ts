/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessToken } from "../models/AccessToken";
import type { Login } from "../models/Login";
import type { Register } from "../models/Register";
import type { Token } from "../models/Token";

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
      errors: {
        401: `Unauthorized`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Login
   * @param formData
   * @returns Token Successful Response
   * @throws ApiError
   */
  public static login(formData: URLSearchParams): CancelablePromise<Token> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/auth/login/",
      body: formData.toString(),
      mediaType: "application/x-www-form-urlencoded",
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Register User
   * @param requestBody
   * @returns Token Successful Response
   * @throws ApiError
   */
  public static register(requestBody: Register): CancelablePromise<Token> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/auth/register/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Bad Request`,
        500: `Internal Server Error`,
      },
    });
  }
}
