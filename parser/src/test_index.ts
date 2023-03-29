import { readdirSync, statSync } from "fs";

import { do_thing } from "./parser";

//must be run from the root directory
var test_results: Array<[String, boolean]> = []; //contains whether output was expected (eg, a failed test on a file marked as "fail" would be true, since we expect it to fail)

function checkDir(directory) {
  const files_in_dir = readdirSync(directory);
  files_in_dir.forEach((file) => {
    if (statSync(directory + "/" + file).isDirectory()) {
      console.log("checking directory " + directory + "/" + file);
      checkDir(directory + "/" + file);
    } else {
      if (file.startsWith("fail") || file.startsWith("pass")) {
        console.log("\x1b[39;49mchecking file " + file);
        const returned_errors = do_thing(directory + "/" + file);
        console.log("\x1b[39;49merrors from file " + file + ": " + returned_errors);
        if (file.startsWith("fail")) {
          test_results.push([file, returned_errors != 0]);
        } else if (file.startsWith("pass")) {
          test_results.push([file, returned_errors == 0]);
        }
      }
    }
  });
}

checkDir("./test");

var nofail = true;
test_results.forEach((result) => {
  console.log("\x1b[39;49mtest " + result[0] + " " + (result[1] ? "succeeded" : "\x1b[91mfailed"));
  if (result[1] == false) {
    nofail = false;
  }
});

if (nofail) {
  console.log("\x1b[39;49mtests all gave the right outcome");
} else {
  console.log("\x1b[39;49mone or more tests gave the wrong outcome");
}
