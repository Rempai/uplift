import { writable } from "svelte/store";

export const passageName = writable<string>("");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validation = writable<Array<any>>([]);
export const emotion = writable<number>(100);
export const previousEmotion = writable<number>(100);
export const expression = writable<string>("normal");
export const rendered = writable<boolean>(false);
export const rideQuit = writable<boolean>(false);
export const finishedPassageRender = writable<boolean>(false);
