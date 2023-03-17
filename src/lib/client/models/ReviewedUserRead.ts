/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReviewRead } from "./ReviewRead";
import type { UserRead } from "./UserRead";

export type ReviewedUserRead = {
  id: number;
  user: UserRead;
  review: ReviewRead;
  date: string;
  userId: number;
  reviewId: number;
};
