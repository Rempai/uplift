/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RideRead } from "./RideRead";

export type ReviewRead = {
  id: number;
  date: string;
  ride: RideRead;
  stars: number;
  description: string;
  solution: string;
  linkedScore: number;
  rideId: number;
};
