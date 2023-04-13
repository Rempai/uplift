import { do_thing } from "./parser.js";

let do_debug = false;

const args = process.argv.slice(2);
args.forEach((arg) => {
  if (arg == "--debug") {
    do_debug = true;
  }
});
args.forEach((file) => {
  if (!file.startsWith("--")) {
    const returned = do_thing(file, do_debug);
    const returned_errors = returned[0];
    if (do_debug) {
      console.error("errors from file " + file + ": " + returned_errors);
    }
  }
});
