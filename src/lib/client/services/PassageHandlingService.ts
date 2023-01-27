/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttributeCreate } from '../models/AttributeCreate';
import type { AttributeRead } from '../models/AttributeRead';
import type { AttributeUpdate } from '../models/AttributeUpdate';
import type { Body_PassageHandling_post_passage } from '../models/Body_PassageHandling_post_passage';
import type { PassageRead } from '../models/PassageRead';
import type { PassageUpdate } from '../models/PassageUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PassageHandlingService {

  /**
   * Get Passages
   * @param passageName
   * @param passengerId
   * @returns PassageRead Successful Response
   * @throws ApiError
   */
  public static getPassages(
    passageName?: string,
    passengerId?: string,
  ): CancelablePromise<Array<PassageRead>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/passage_handler/passages/',
      query: {
        'passage_name': passageName,
        'passenger_id': passengerId,
      },
    });
  }

  /**
   * Get Passage By Id
   * @param id
   * @returns PassageRead Successful Response
   * @throws ApiError
   */
  public static getPassageById(
    id: number,
  ): CancelablePromise<PassageRead> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/passage_handler/passage/{id}/',
      path: {
        'id': id,
      },
    });
  }

  /**
   * Delete Passage
   * @param id
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deletePassage(
    id: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/passage_handler/passage/{id}/',
      path: {
        'id': id,
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
    requestBody: PassageUpdate,
  ): CancelablePromise<PassageUpdate> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/passage_handler/passage/{id}/',
      path: {
        'id': id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * Post Passage
   * @param formData
   * @returns any Successful Response
   * @throws ApiError
   */
  public static postPassage(
    formData: Body_PassageHandling_post_passage,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/passage_handler/passage/',
      formData: formData,
      mediaType: 'multipart/form-data',
    });
  }

  /**
   * Get Attributes
   * @returns AttributeRead Successful Response
   * @throws ApiError
   */
  public static getAttributes(): CancelablePromise<Array<AttributeRead>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/passage_handler/attributes/',
    });
  }

  /**
   * Get Attribute By Id
   * @param id
   * @returns AttributeRead Successful Response
   * @throws ApiError
   */
  public static getAttributeById(
    id: number,
  ): CancelablePromise<AttributeRead> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/passage_handler/attribute/{id}/',
      path: {
        'id': id,
      },
    });
  }

  /**
   * Delete Attribute
   * @param id
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteAttribute(
    id: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/passage_handler/attribute/{id}/',
      path: {
        'id': id,
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
    requestBody: AttributeUpdate,
  ): CancelablePromise<AttributeUpdate> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/passage_handler/attribute/{id}/',
      path: {
        'id': id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * Post Attribute
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static postAttribute(
    requestBody: AttributeCreate,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/passage_handler/attribute/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

}
