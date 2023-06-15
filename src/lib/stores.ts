import { writable } from "svelte/store";

interface message {
  id: number;
  msg: string;
}

export const passageName = writable<string>("");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validation = writable<Array<any>>([]);
export const emotion = writable<number>(100);
export const errors = writable<Array<message>>([]);
