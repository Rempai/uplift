/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttributeCreate } from "../models/AttributeCreate";
import type { AttributeRead } from "../models/AttributeRead";
import type { AttributeUpdate } from "../models/AttributeUpdate";
import type { PassageBulk } from "../models/PassageBulk";
import type { PassageCreate } from "../models/PassageCreate";
import type { PassageRead } from "../models/PassageRead";
import type { PassageUpdate } from "../models/PassageUpdate";
import type { Response } from "../models/Response";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class PassageHandlingService {
  /**
   * Get Passages
   * @param passageName
   * @param rideId
   * @param all
   * @param limit
   * @param offset
   * @returns PassageRead Successful Response
   * @throws ApiError
   */
  public static getPassages(
    passageName?: string,
    rideId?: number,
    all?: string,
    limit?: number,
    offset?: number
  ): CancelablePromise<Array<PassageRead>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/passage_handler/passages/",
      query: {
        passageName: passageName,
        rideId: rideId,
        all: all,
        limit: limit,
        offset: offset,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get Passage By Id
   * @param id
   * @returns PassageRead Successful Response
   * @throws ApiError
   */
  public static getPassageById(id: number): CancelablePromise<PassageRead> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/passage_handler/passage/{id}/",
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
   * Delete Passage
   * @param id
   * @returns Response Successful Response
   * @throws ApiError
   */
  public static deletePassage(id: number): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/passage_handler/passage/{id}/",
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
   * Update Passage
   * @param id
   * @param requestBody
   * @returns PassageUpdate Successful Response
   * @throws ApiError
   */
  public static updatePassage(
    id: number,
    requestBody: PassageUpdate
  ): CancelablePromise<PassageUpdate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/passage_handler/passage/{id}/",
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
   * Post Passage
   * @param requestBody
   * @returns Response Created Resource
   * @throws ApiError
   */
  public static postPassage(requestBody: PassageCreate): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/passage_handler/passage/",
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
   * Get Attributes
   * @param limit
   * @param offset
   * @returns AttributeRead Successful Response
   * @throws ApiError
   */
  public static getAttributes(
    limit?: number,
    offset?: number
  ): CancelablePromise<Array<AttributeRead>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/passage_handler/attributes/",
      query: {
        limit: limit,
        offset: offset,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get Attribute By Id
   * @param id
   * @returns AttributeRead Successful Response
   * @throws ApiError
   */
  public static getAttributeById(id: number): CancelablePromise<AttributeRead> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/passage_handler/attribute/{id}/",
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
   * Delete Attribute
   * @param id
   * @returns Response Successful Response
   * @throws ApiError
   */
  public static deleteAttribute(id: number): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/passage_handler/attribute/{id}/",
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
   * Update Attribute
   * @param id
   * @param requestBody
   * @returns AttributeUpdate Successful Response
   * @throws ApiError
   */
  public static updateAttribute(
    id: number,
    requestBody: AttributeUpdate
  ): CancelablePromise<AttributeUpdate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/passage_handler/attribute/{id}/",
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
   * Post Attribute
   * @param requestBody
   * @returns Response Created Resource
   * @throws ApiError
   */
  public static postAttribute(requestBody: AttributeCreate): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/passage_handler/attribute/",
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
   * Post Passage Bulk
   * @param requestBody
   * @returns Response Created Resource
   * @throws ApiError
   */
  public static postPassageBulk(requestBody: PassageBulk): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/passage_handler/passage_bulk/",
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
