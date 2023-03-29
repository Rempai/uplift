import { do_thing } from "./parser";

const args = process.argv.slice(2);
args.forEach((file) => {
  const returned_errors = do_thing(file);
  console.log("errors from file " + file + ": " + returned_errors);
});
