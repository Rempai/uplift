/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AttributeRead } from "./AttributeRead";
import type { RideRead } from "./RideRead";

export type PassageRead = {
  id: number;
  ride: RideRead;
  attribute: AttributeRead;
  passage_name: string;
  content: string;
  branch_name: string;
  continue_button: boolean;
  speaker: string;
  trunk: boolean;
  attributeId: number;
  rideId: number;
};
