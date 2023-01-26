import "./app.css";
import App from "./App.svelte";

// TODO: delete this
export type report = {
  main_problem: string;
  parties_involved: string;
  main_cause: string;
  bravery: number;
  perseverance: number;
  integrity: number;
  enthusiasm: number;
};

export interface journalAnswer {
  marked_problem: string;
  marked_involved: string;
  marked_cause: string;
}

const app = new App({
  target: document.getElementById("app"),
});

export default app;
