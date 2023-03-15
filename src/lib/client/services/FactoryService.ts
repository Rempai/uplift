/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Response } from "../models/Response";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class FactoryService {
  /**
   * Factory to create dummy data
   * @returns Response Successful Response
   * @throws ApiError
   */
  public static factory(): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/factory/",
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
}
