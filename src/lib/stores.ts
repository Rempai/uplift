import { writable } from "svelte/store";

export const passage_name = writable<string>("");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validation = writable<Array<any>>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
