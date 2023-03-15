/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PassengerCreate } from "../models/PassengerCreate";
import type { PassengerRead } from "../models/PassengerRead";
import type { PassengerUpdate } from "../models/PassengerUpdate";
import type { Response } from "../models/Response";
import type { ReviewCreate } from "../models/ReviewCreate";
import type { ReviewedUserCreate } from "../models/ReviewedUserCreate";
import type { ReviewRead } from "../models/ReviewRead";
import type { ReviewUpdate } from "../models/ReviewUpdate";
import type { RideCreate } from "../models/RideCreate";
import type { RideRead } from "../models/RideRead";
import type { RideUpdate } from "../models/RideUpdate";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class CharactersService {
  /**
   * Get Passengers
   * @returns PassengerRead Successful Response
   * @throws ApiError
   */
  public static getPassengers(): CancelablePromise<Array<PassengerRead>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/character/passengers/",
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get Passenger By Id
   * @param id
   * @returns PassengerRead Successful Response
   * @throws ApiError
   */
  public static getPassengerById(id: number): CancelablePromise<PassengerRead> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/character/passenger/{id}/",
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
   * Delete Passenger
   * @param id
   * @returns Response Successful Response
   * @throws ApiError
   */
  public static deletePassenger(id: number): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/character/passenger/{id}/",
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
   * Update Passenger
   * @param id
   * @param requestBody
   * @returns PassengerUpdate Successful Response
   * @throws ApiError
   */
  public static updatePassenger(
    id: number,
    requestBody: PassengerUpdate
  ): CancelablePromise<PassengerUpdate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/character/passenger/{id}/",
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
   * Post Passenger
   * @param requestBody
   * @returns any Created Resource
   * @throws ApiError
   */
  public static postPassenger(requestBody: PassengerCreate): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/character/passenger/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        401: `Unautorized`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get Rides
   * @param userId
   * @returns RideRead Successful Response
   * @throws ApiError
   */
  public static getRides(userId?: string): CancelablePromise<Array<RideRead>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/character/rides/",
      query: {
        userId: userId,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get Ride By Id
   * @param id
   * @returns RideRead Successful Response
   * @throws ApiError
   */
  public static getRideById(id: number): CancelablePromise<RideRead> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/character/ride/{id}/",
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
   * Delete Ride
   * @param id
   * @returns Response Successful Response
   * @throws ApiError
   */
  public static deleteRide(id: number): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/character/ride/{id}/",
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
   * Update Ride
   * @param id
   * @param requestBody
   * @returns RideUpdate Successful Response
   * @throws ApiError
   */
  public static updateRide(id: number, requestBody: RideUpdate): CancelablePromise<RideUpdate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/character/ride/{id}/",
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
   * Post Ride
   * @param requestBody
   * @returns any Created Resource
   * @throws ApiError
   */
  public static postRide(requestBody: RideCreate): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/character/ride/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        401: `Unautorized`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get Reviews
   * @param userId
   * @param reviewId
   * @returns ReviewRead Successful Response
   * @throws ApiError
   */
  public static getReviews(
    userId?: number,
    reviewId?: number
  ): CancelablePromise<Array<ReviewRead>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/character/reviews/",
      query: {
        userId: userId,
        reviewId: reviewId,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get Review By Id
   * @param id
   * @returns ReviewRead Successful Response
   * @throws ApiError
   */
  public static getReviewById(id: number): CancelablePromise<ReviewRead> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/character/review/{id}/",
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
   * Delete Review
   * @param id
   * @returns Response Successful Response
   * @throws ApiError
   */
  public static deleteReview(id: number): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/character/review/{id}/",
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
   * Update Review
   * @param id
   * @param requestBody
   * @returns ReviewUpdate Successful Response
   * @throws ApiError
   */
  public static updateReview(
    id: number,
    requestBody: ReviewUpdate
  ): CancelablePromise<ReviewUpdate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/character/review/{id}/",
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
   * Post Review
   * @param requestBody
   * @returns any Created Resource
   * @throws ApiError
   */
  public static postReview(requestBody: ReviewCreate): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/character/review/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        401: `Unautorized`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Post ReviewedUser
   * @param requestBody
   * @returns any Created Resource
   * @throws ApiError
   */
  public static postReviewedUser(requestBody: ReviewedUserCreate): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/character/reviewed_user/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        401: `Unautorized`,
        500: `Internal Server Error`,
      },
    });
  }
}
