/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PassengerRead } from "./PassengerRead";

export type RideRead = {
  id: number;
  passenger: PassengerRead;
  fromLocation: string;
  toLocation: string;
  time: number;
  mainProblem: string;
  partiesInvolved: string;
  mainCause: string;
  bravery: number;
  perseverance: number;
  integrity: number;
  enthusiasm: number;
  passengerId?: number;
};
