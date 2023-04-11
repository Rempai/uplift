/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PassageCreate = {
  passage: string;
  content: string;
  branch?: string;
  continueButton?: boolean;
  speaker?: string;
  emotion?: number;
  attributeId?: number;
  rideId: number;
};
