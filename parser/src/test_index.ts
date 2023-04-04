import { readdirSync, statSync, readFileSync } from "fs";

import { do_thing } from "./parser.js";

//must be run from the root directory
const test_results: Array<[string, boolean]> = []; //contains whether output was expected (eg, a failed test on a file marked as "fail" would be true, since we expect it to fail)

const jsonIsEqual = function(obj1: any, obj2: any) {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  if(obj1Keys.length !== obj2Keys.length) {
      return false;
  }

  for (let objKey of obj1Keys) {
      if (obj1[objKey] !== obj2[objKey]) {
          if(typeof obj1[objKey] == "object" && typeof obj2[objKey] == "object") {
              if(!jsonIsEqual(obj1[objKey], obj2[objKey])) {
                  return false;
              }
          }
          else {
              return false;
          }
      }
  }

  return true;
};

function checkDir(directory: string) {
  const files_in_dir = readdirSync(directory);
  files_in_dir.forEach((file) => {
    if (statSync(directory + "/" + file).isDirectory()) {
      console.log("checking directory " + directory + "/" + file);
      checkDir(directory + "/" + file);
    } else {
      if (file.startsWith("fail") || file.startsWith("pass")) {
        console.log("\x1b[39;49mchecking file " + file);
        const returned_data = do_thing(directory + "/" + file);
        const returned_errors = returned_data[0];
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

checkDir("./parser/test/parse");

function checkOutput(directory: string) {
  const files_in_dir = readdirSync(directory);
  files_in_dir.forEach((file) => {
    if(file.endsWith(".md")) {
      console.log("checking file " + file);
      const output = do_thing(directory + "/" + file);
      const input_data = readFileSync(directory + "/" + file.substring(0, file.lastIndexOf(".md")) + ".json", "utf-8");
      const generated_json = JSON.parse(output[1]);
      const check_json = JSON.parse(input_data);
      const is_equal = jsonIsEqual(generated_json, check_json);
      test_results.push([file, is_equal]);
    }
  });
}

checkOutput("./parser/test/output")

let nofail = true;
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
