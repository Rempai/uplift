/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PassengerCreate } from '../models/PassengerCreate';
import type { PassengerRead } from '../models/PassengerRead';
import type { PassengerUpdate } from '../models/PassengerUpdate';
import type { ReviewCreate } from '../models/ReviewCreate';
import type { ReviewedUser } from '../models/ReviewedUser';
import type { ReviewedUserCreate } from '../models/ReviewedUserCreate';
import type { ReviewRead } from '../models/ReviewRead';
import type { ReviewUpdate } from '../models/ReviewUpdate';
import type { RideCreate } from '../models/RideCreate';
import type { RideRead } from '../models/RideRead';
import type { RideUpdate } from '../models/RideUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CharactersService {

  /**
   * Get Passengers
   * @returns PassengerRead Successful Response
   * @throws ApiError
   */
  public static getPassengers(): CancelablePromise<Array<PassengerRead>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/character/passengers/',
    });
  }

  /**
   * Get Passenger By Id
   * @param id
   * @returns PassengerRead Successful Response
   * @throws ApiError
   */
  public static getPassengerById(
    id: number,
  ): CancelablePromise<PassengerRead> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/character/passenger/{id}/',
      path: {
        'id': id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Passenger
   * @param id
   * @returns void
   * @throws ApiError
   */
  public static deletePassenger(
    id: number,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/character/passenger/{id}/',
      path: {
        'id': id,
      },
      errors: {
        422: `Validation Error`,
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
    requestBody: PassengerUpdate,
  ): CancelablePromise<PassengerUpdate> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/character/passenger/{id}/',
      path: {
        'id': id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Post Passenger
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static postPassenger(
    requestBody: PassengerCreate,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/character/passenger/',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Rides
   * @param userId
   * @returns RideRead Successful Response
   * @throws ApiError
   */
  public static getRides(
    userId?: number,
  ): CancelablePromise<Array<RideRead>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/character/rides/',
      query: {
        'user_id': userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Ride By Id
   * @param id
   * @returns RideRead Successful Response
   * @throws ApiError
   */
  public static getRideById(
    id: number,
  ): CancelablePromise<RideRead> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/character/ride/{id}/',
      path: {
        'id': id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Ride
   * @param id
   * @returns void
   * @throws ApiError
   */
  public static deleteRide(
    id: number,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/character/ride/{id}/',
      path: {
        'id': id,
      },
      errors: {
        422: `Validation Error`,
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
  public static updateRide(
    id: number,
    requestBody: RideUpdate,
  ): CancelablePromise<RideUpdate> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/character/ride/{id}/',
      path: {
        'id': id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Post Ride
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static postRide(
    requestBody: RideCreate,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/character/ride/',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Reviews
   * @param userId
   * @param rideId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getReviews(
    userId?: number,
    rideId?: number,
  ): CancelablePromise<Array<(ReviewRead | ReviewedUser)>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/character/reviews/',
      query: {
        'user_id': userId,
        'ride_id': rideId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Review By Id
   * @param id
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getReviewById(
    id: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/character/review/{id}/',
      path: {
        'id': id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Review
   * @param id
   * @returns void
   * @throws ApiError
   */
  public static deleteReview(
    id: number,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/character/review/{id}/',
      path: {
        'id': id,
      },
      errors: {
        422: `Validation Error`,
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
    requestBody: ReviewUpdate,
  ): CancelablePromise<ReviewUpdate> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/character/review/{id}/',
      path: {
        'id': id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Post Review
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static postReview(
    requestBody: ReviewCreate,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/character/review/',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Post Reviewed User
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static postReviewedUser(
    requestBody: ReviewedUserCreate,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/character/reviewed_user/',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
