/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AchievementCreate } from "../models/AchievementCreate";
import type { AchievementRead } from "../models/AchievementRead";
import type { AchievementUpdate } from "../models/AchievementUpdate";
import type { Response } from "../models/Response";
import type { UserAchievementCreate } from "../models/UserAchievementCreate";
import type { UserCreate } from "../models/UserCreate";
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
   * @param limit
   * @param offset
   * @returns UserRead Successful Response
   * @throws ApiError
   */
  public static getUsers(limit?: number, offset?: number): CancelablePromise<Array<UserRead>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/user/users/",
      query: {
        limit: limit,
        offset: offset,
      },
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
        401: `Unauthorized`,
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
        401: `Unauthorized`,
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
        401: `Unauthorized`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Post User
   * @param requestBody
   * @returns Response Created Resource
   * @throws ApiError
   */
  public static postUser(requestBody: UserCreate): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/user/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get Achievements
   * @param userId
   * @param limit
   * @param offset
   * @returns AchievementRead Successful Response
   * @throws ApiError
   */
  public static getAchievements(
    userId?: number,
    limit?: number,
    offset?: number
  ): CancelablePromise<Array<AchievementRead>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/user/achievement/achievements/",
      query: {
        userId: userId,
        limit: limit,
        offset: offset,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get Achievement By Id
   * @param id
   * @returns AchievementRead Successful Response
   * @throws ApiError
   */
  public static getAchievementById(id: number): CancelablePromise<AchievementRead> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/user/achievement/{id}/",
      path: {
        id: id,
      },
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Delete Achievement
   * @param id
   * @returns Response Successful Response
   * @throws ApiError
   */
  public static deleteAchievement(id: number): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/user/achievement/{id}/",
      path: {
        id: id,
      },
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Update Achievement
   * @param id
   * @param requestBody
   * @returns AchievementUpdate Successful Response
   * @throws ApiError
   */
  public static updateAchievement(
    id: number,
    requestBody: AchievementUpdate
  ): CancelablePromise<AchievementUpdate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/user/achievement/{id}/",
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Post Achievement
   * @param requestBody
   * @returns Response Created Resource
   * @throws ApiError
   */
  public static postAchievement(requestBody: AchievementCreate): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/user/achievement/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Post UserAchievement
   * @param requestBody
   * @returns Response Created Resource
   * @throws ApiError
   */
  public static postUserAchievement(
    requestBody: UserAchievementCreate
  ): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/user/user_achievement/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        500: `Internal Server Error`,
      },
    });
  }
}
