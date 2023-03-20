/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PassengerRead } from "./PassengerRead";

export type RideRead = {
  id: number;
  passenger: PassengerRead;
  from_location: string;
  to_location: string;
  time: number;
  main_problem: string;
  parties_involved: string;
  main_cause: string;
  bravery: number;
  perseverance: number;
  integrity: number;
  enthusiasm: number;
  passengerId: number;
};
