/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PassageRead = {
  id: number;
  ride: {
    id: number;
    passenger: {
      id: number;
      name: string;
      icon: string;
    };
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
  attribute: {
    id: number;
    color: string;
    font_size: string;
    font_family: string;
  };
  passage_name: string;
  content: string;
  branch_name: string;
  continue_button: boolean;
  speaker: string;
  trunk: boolean;
  attributeId: number;
  rideId: number;
};
