/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ReviewRead = {
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
  stars: number;
  description: string;
  solution: string;
  linked_score: number;
  rideId: number;
};
