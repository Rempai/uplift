import { writable } from "svelte/store";

interface message {
  id: number;
  msg: string;
}

import type { jwtObject } from "@/lib/jwtParser";

export const parsedJWT = writable<jwtObject>();
export const passageName = writable<string>("");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validation = writable<Array<any>>([]);
export const emotion = writable<number>(100);
export const errors = writable<Array<message>>([]);
export const previousEmotion = writable<number>(100);
export const expression = writable<string>("normal");
export const rendered = writable<boolean>(false);
export const rideQuit = writable<boolean>(false);
export const finishedPassageRender = writable<boolean>(false);
export const tutorialElements = writable<any>();
export const tutorialImageElements = writable<any>();
