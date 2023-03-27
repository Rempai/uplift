/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AttributeRead } from "./AttributeRead";
import type { RideRead } from "./RideRead";

export type PassageRead = {
  id: number;
  ride: RideRead;
  attribute: AttributeRead;
  passage: string;
  content: string;
  branch: string;
  continueButton: boolean;
  speaker: string;
  trunk: boolean;
  attributeId: number;
  rideId: number;
};
