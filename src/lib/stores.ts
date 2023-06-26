import { writable } from "svelte/store";
import type { jwtObject } from "@/lib/jwtParser";

interface message {
  id: number;
  msg: string;
}

export const parsedJWT = writable<jwtObject>();
export const passageName = writable<string>("");
export const emotion = writable<number>(100);
export const errors = writable<Array<message>>([]);
export const previousEmotion = writable<number>(100);
export const expression = writable<string>("normal");
export const rendered = writable<boolean>(false);
export const rideQuit = writable<boolean>(false);
export const finishedPassageRender = writable<boolean>(false);
export const tutorialElements = writable<any>();
export const tutorialImageElements = writable<any>();
