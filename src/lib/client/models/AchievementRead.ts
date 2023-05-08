/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserRead } from "./UserRead";

export type AchievementRead = {
  id: number;
  user?: UserRead;
  name: string;
  description: string;
  icon: string;
};
