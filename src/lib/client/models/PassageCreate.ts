/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PassageCreate = {
  passage_name: string;
  content: string;
  branch_name?: string;
  continue_button?: boolean;
  speaker?: string;
  trunk?: boolean;
  attributeId?: number;
  rideId: number;
};