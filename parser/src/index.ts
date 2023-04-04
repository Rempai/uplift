import { do_thing } from "./parser.js";

const args = process.argv.slice(2);
args.forEach((file) => {
  const returned = do_thing(file);
  const returned_errors = returned[0];
  console.log("errors from file " + file + ": " + returned_errors);
});
