/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ingeger } from "./ingeger";
import type { PassengerRead } from "./PassengerRead";

export type ReviewedUser = {
  id: ingeger;
  date: string;
  stars: number;
  description: string;
  solution: string;
  linked_score: number;
  passenger: PassengerRead;
};
