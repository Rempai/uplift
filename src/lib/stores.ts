import { writable } from "svelte/store";

export const passageName = writable<string>("");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validation = writable<Array<any>>([]);
export const emotion = writable<number>(100);
