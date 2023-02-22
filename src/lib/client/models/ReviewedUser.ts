/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PassengerRead } from "./PassengerRead";

export type ReviewedUser = {
  id: number;
  date: string;
  stars: number;
  description: string;
  solution: string;
  linked_score: number;
  passenger: PassengerRead;
};
