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

const app = new App({
  target: document.getElementById("app"),
});

export default app;
