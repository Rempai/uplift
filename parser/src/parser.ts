import { generate_output } from "./parser_generate.js"
import { parse_file } from "./parser_file.js"

export class Passage {
  text = "";
  speaker = ""; //full name of character (not a shorthand set with :character)
  attributeID = -1; //attributeID used
  links_to: Array<string> = [];
  original_location = ""; //just for giving the user a line number when an error occurs
  emotion: number = 0;
}
export class Branch {
  name = "";
  root_name = ""; //in case it's a "label", the root_name will be used to put in the passage_name.
  passages: Array<Passage> = [];
  fallthrough: boolean | null = null; //if branch should continue to the next branch (in branches array) when it reaches the end
  requires_linking = true; //if branch should be checked for linking (ending branches don't have this - the rest does)
  original_location = ""; //for error purposes
  finish_number: number = -1;
}

export function do_thing(filename: string, print_debug: boolean): [number, string] {
  let errors = 0;

  const ridedata = { id: -1, name: "" };
  const branches: Array<Branch> = [];
  const characters: Array<[string, string, number]> = []; //first string is the shortcut used in file, second string is the "game" name. third is attributeID

  //any referenced files will be recursively called for parsing by the parse_file function
  errors += parse_file(filename, ridedata, branches, characters, print_debug);
  errors += check_branches(filename, ridedata, branches, print_debug);
  const output: string = generate_output(branches, ridedata, print_debug);
  process.stdout.write(output);
  process.stdout.write("\n");
  return [errors, output];
}



//filename is the filename of the root file
function check_branches(
  filename: string,
  ridedata: { id: number; name: string },
  branches: Array<Branch>,
  print_debug: boolean
): number {
  let errors = 0;

  //log error
  function lerr(location: string, input: any) {
    if (print_debug) {
      console.error("\x1b[91mERROR at location " + location + ": " + input);
      errors += 1;
    }
  }

  //check rideid
  if (ridedata.id == -1) {
    lerr(filename, "rideID wasn't set!");
  }

  //check ridename
  if (ridedata.name == "") {
    lerr(filename, "ride name wasn't set (set with :ridename in root file)");
  }

  //check if all branch links are linking to valid branches
  for (let i = 0; i < branches.length; i++) {
    const branch = branches[i];
    branch.passages.forEach((passage) => {
      passage.links_to.forEach((link) => {
        const linked_branch = branches.find(({ name }) => name === link);
        if (linked_branch == null) {
          lerr(passage.original_location, "linked branch '" + link + "' doesn't exist.");
        }
      });
    });
  }

  //check if last branch has been closed off properly (all other branches were checked when the next branch was made)
  if (branches.slice(-1)[0].fallthrough == null) {
    lerr(
      branches.slice(-1)[0].original_location,
      "last branch hasn't been closed off. did you forget an :end?"
    );
  } else if (branches.slice(-1)[0].fallthrough == true) {
    lerr(
      branches.slice(-1)[0].original_location,
      "last branch has fallthrough applied, but it can't fallthrough because there is no branch following it. (internal error)"
    );
  }

  //check if all branches have been linked to (via jumps or fallthroughs), else give unreachable error
  for (let i = 1; i < branches.length; i++) {
    const branch = branches[i];
    if (branch.name == ridedata.name + "start") {
      continue; //skip starting branch (since it's fine if it's unreachable)
    }
    if (branch.requires_linking == false) {
      continue; //skip checking if the branch doesn't need to be linked to
    }
    if (
      branches.find(({ passages }) =>
        passages.find(({ links_to }) => {
          return links_to.includes(branch.name);
        })
      ) != null
    ) {
      continue;
    }
    if (branches[i - 1].fallthrough == true) {
      continue;
    }
    lerr(
      branch.original_location,
      "branch " +
        branch.name +
        " is not reachable. either add a :fallthrough above it or use a jump statement (using the {displaytext:branch} syntax)."
    );
  }

  //check if there are any branches in the first place
  if (branches.length != 0) {
    //check if start branch has been defined
    if (branches.find(({ name }) => name === ridedata.name + "start") == null) {
      lerr(filename, "no start branch exists");
    }
  } else {
    lerr(filename, "no branches have been defined. you need at least one branch.");
  }
  return errors;
}

