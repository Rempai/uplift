import { readFileSync } from "fs";

const num_attributeIDs = 3; //the max attributeID value, before giving an error

class Passage {
  text = "";
  speaker = ""; //full name of character (not a shorthand set with :character)
  attributeID = -1; //attributeID used
  links_to: Array<string> = [];
  original_location: string = ""; //just for giving the user a line number when an error occurs
}
class Branch {
  name = "";
  root_name = ""; //in case it's a "label", the root_name will be used to put in the passage_name.
  passages: Array<Passage> = [];
  fallthrough: boolean | null = null; //if branch should continue to the next branch (in branches array) when it reaches the end
  original_location: string = ""; //for error purposes
}

export function do_thing(filename: string): number {
  let errors = 0;

  const rideid = { rideid: -1 };
  const branches: Array<Branch> = [];
  const characters: Array<[string, string, number]> = []; //first string is the shortcut used in file, second string is the "game" name. third is attributeID

  //any referenced files will be recursively called for parsing by the parse_file function
  errors += parse_file(filename, rideid, branches, characters);
  errors += check_branches(filename, rideid, branches, characters);
  generate_output(branches, rideid);
  return errors;
}

export function parse_file(
  filename: string,
  rideid: { rideid: number },
  branches: Array<Branch>,
  characters: Array<[string, string, number]>
): number {
  let errors = 0;
  let default_character = -1; //index to characters array, defines what character should be used when the line doesn't begin with "charname;"

  //log verbose
  function lverb(input: any) {
    //console.log("\x1b[39;49m" + input)
  }

  //log error
  function lerr(location: string, input: any) {
    console.log("\x1b[91mERROR at location " + location + ": " + input);
    errors += 1;
  }

  const input_data = readFileSync(filename, "utf-8");
  const input_lines = input_data.split("\n");

  let in_branch = false;

  for (let line = 0; line < input_lines.length; line++) {
    const location = filename + ":" + (line + 1);
    //const location = filename.substring(filename.lastIndexOf("/")) + ":" + line.toString();

    const cur = input_lines[line].replace(/\r/g, "");
    const cur_split = cur.split(" ");
    //console.log(cur_split);
    switch (cur_split[0]) {
      case ":character":
        if (cur_split.length == 4) {
          //:character shortcut originalname attributeID
          const found_character = characters.find((element) => element[0] === cur_split[1]);
          if (found_character != null) {
            lerr(
              location,
              "character shortcut '" +
                cur_split[1] +
                "' already exists for character " +
                found_character[1]
            );
            break;
          }
          if (parseInt(cur_split[3]) > num_attributeIDs) {
            lerr(
              location,
              "elementID " +
                parseInt(cur_split[3]) +
                " is too large. max is set to " +
                num_attributeIDs +
                ". if this is wrong, it can be changed at the top of the parser.ts file"
            );
            break;
          }

          characters.push([cur_split[1], cur_split[2], parseInt(cur_split[3])]);
          lverb("added character shortcut " + cur_split[1] + " for character " + cur_split[2]);
        } else {
          lerr(
            location,
            "tried setting character shortcut using :character, but there aren't enough arguments. make sure you are using the ':character shortcut charactername' syntax"
          );
          break;
        }
        break;
      case ":import":
        console.log(cur.substring(7));
        parse_file(
          filename.substring(0, filename.lastIndexOf("/") + 1) + cur.substring(7).trimStart(),
          rideid,
          branches,
          characters
        );
        break;
      case ":default":
        if (cur_split.length == 2) {
          //:default shortcut
          default_character = -1;
          for (let char = 0; char < characters.length; char++) {
            if (characters[char][0] == cur_split[1]) {
              default_character = char;
              lverb("default character is now " + characters[char][1]);
              break;
            }
          }
          if (default_character == -1) {
            lerr(
              location,
              "character " +
                cur_split[1] +
                " wasn't defined before. use ':character shortcut charactername' to add a character, or use a character you already defined."
            );
            break;
          }
        } else {
          lerr(
            location,
            "tried setting default character using :default, but there aren't enough arguments. make sure you are using the ':default charactername' syntax"
          );
          break;
        }
        break;
      case ":end":
        if (in_branch) {
          branches.slice(-1)[0].fallthrough = false;
        } else {
          lerr(location, "tried to end branch, but no branch is open.");
        }
        in_branch = false;
        break;
      case ":rideid":
        rideid.rideid = parseInt(cur_split[1]);
        //TODO error checking
        break;

      default:
        if (cur_split[0][0] == "#") {
          let new_branch_name = "";
          if (cur_split[0][0] == "#" && cur_split[0][1] == "#" && cur_split[0][2] == "#") {
            if (!in_branch) {
              lerr(
                location,
                "tried inserting a label, but we are currently not in a branch. did you accidentally end the previous one?"
              );
            }
            branches.slice(-1)[0].fallthrough = false; //set previous branch to fallthrough
            new_branch_name = cur.substring(3, cur.length).trimStart(); //remove # and whitespace in front of name.
          } else if (cur_split[0][0] == "#" && cur_split[0][1] == "#") {
            if (!in_branch) {
              lerr(
                location,
                "tried inserting a label, but we are currently not in a branch. did you accidentally end the previous one?"
              );
            }
            branches.slice(-1)[0].fallthrough = true; //set previous branch to fallthrough
            new_branch_name = cur.substring(2, cur.length).trimStart(); //remove # and whitespace in front of name.
          } else {
            // for making a new branch with #branch
            new_branch_name = cur.substring(1, cur.length).trimStart();
            if (in_branch) {
              lerr(
                location,
                "tried starting a new branch, but the previous branch hasn't been ended yet. Did you forget an ':end'"
              );
            }
          }

          if (branches.find(({ name }) => name === new_branch_name)) {
            lerr(location, "branch name " + new_branch_name + " already exists");
            break;
          }

          branches.push(new Branch());
          if (cur_split[0] == "##") {
            //if we're a label, set root name to previous root name
            if (branches.length == 1) {
              lerr(location, "tried to put down a label, but we don't have a root branch yet.");
              branches.pop();
              break;
            }
            branches.slice(-1)[0].root_name = branches.slice(-2)[0].root_name;
          } else {
            branches.slice(-1)[0].root_name = new_branch_name;
          }
          branches.slice(-1)[0].name = new_branch_name;
          branches.slice(-1)[0].original_location = location;
          lverb("creating branch " + branches.slice(-1)[0].name);
          in_branch = true;
          //lerr(location, new_branch_name + " :: " + branches.slice(-1)[0].root_name);
          break;
        }
        if (cur == "") {
          //lverb("empty string")
          break;
        }
        if (cur_split[0][0] == "/" && cur_split[0][1] == "/") {
          //comments
          //lverb("comment")
          break;
        } else {
          //normal text
          if (!in_branch) {
            lerr(location, "tried adding text while not in branch. start a branch first.");
            break;
          }

          const new_passage = new Passage();

          const speaker = cur.substring(0, cur.indexOf("}")); //get string until first occurence of ], which will have the speaker's name (if any)
          if (speaker != "") {
            const speaker_full = characters.find((char) => char[0] == speaker);
            if (speaker_full == null) {
              lerr(
                location,
                "couldn't find speaker " +
                  speaker +
                  " in characters. please note what characters you will use by using ':character shortcut charactername'"
              );
              break;
            }
            new_passage.speaker = speaker_full[1];
            new_passage.attributeID = speaker_full[2];
          } else {
            //use default speaker
            if (default_character == -1) {
              lerr(
                location,
                "you didn't specify a speaker, and also didn't set a default speaker. either specify the speaker by adding 'name}' to the front of the sentence, or set a default character by using ':default charactername'."
              );
              break;
            }
            new_passage.speaker = characters[default_character][1];
            new_passage.attributeID = characters[default_character][2];
          }

          const linestart = cur.indexOf("}") ? cur.indexOf("}") + 1 : 0;
          const branch_split = cur.substring(linestart, cur.length).split(/(\[|:|\])/g); //remove speaker (if present) and split on {, :, and } character.
          //console.log(branch_split)
          let finalized_text = "";
          for (let part = 0; part < branch_split.length; part++) {
            const elem = branch_split[part];
            if (elem == "[") {
              //TODO: check if there are enough parts left for the structure (and test)
              if (branch_split[part + 2] != ":" || branch_split[part + 4] != "]") {
                lerr(location, "branch structure is missing : and/or ]");
                break;
              }

              const button_text = branch_split[part + 1];
              const button_link = branch_split[part + 3]; //TODO: put in "You" etc if needed

              if (button_text == "" || button_link == "") {
                lerr(
                  location,
                  "branch structure is incomplete: missing the text or link in the '[text:link]' structure"
                );
                break;
              }

              //include "1" after link since the first passage in the branch is called that.
              finalized_text +=
                "<span onclick=\"branch('" +
                button_link +
                "1')\"><mark>" +
                button_text +
                "</mark></span>";

              new_passage.links_to.push(button_link); //add link to structure so we can verify it exists later.

              part += 4;
              continue;
            } else if (elem == "]") {
              lerr(location, "expected '[' character before '" + elem + "'"); //don't check on : since it can be used in normal sentences
              break;
            } else {
              finalized_text += elem;
            }
          }
          lverb("line (" + new_passage.speaker + "): " + finalized_text);
          new_passage.original_location = location; //to allow error reporting with line number when we verify links later
          new_passage.text = finalized_text;
          branches.slice(-1)[0].passages.push(new_passage);
        }
        break;
    }
  }
  return errors;
}

//filename is the filename of the root file
function check_branches(
  filename: string,
  rideid: { rideid: number },
  branches: Array<Branch>,
  characters: Array<[string, string, number]>
): number {
  let errors = 0;

  //log error
  function lerr(location: string, input: any) {
    console.log("\x1b[91mERROR at location " + location + ": " + input);
    errors += 1;
  }

  //check rideid
  if (rideid.rideid == -1) {
    lerr(filename, "rideID wasn't set!");
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
    if (branch.name == "start") {
      continue;
    } //skip starting branch (since it's fine if it's unreachable)
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
    if (branches.find(({ name }) => name === "start") == null) {
      lerr(filename, "no start branch exists");
    }
  } else {
    lerr(filename, "no branches have been defined. you need at least one branch.");
  }
  return errors;
}

function generate_output(branches: Array<Branch>, rideid: { rideid: number }): string {
  const output_array: Array<object> = [];

  for (let i = 0; i < branches.length; i++) {
    const branch = branches[i];
    let you_dialogue = 1;
    let other_dialogue = 1;
    for (let j = 0; j < branch.passages.length; j++) {
      const passage = branch.passages[j];

      //make passage name
      let passage_name = branch.name;

      if (branch.name == "start") {
        passage_name += "Trunk";
      }

      if (passage.speaker == "You") {
        passage_name += "You" + you_dialogue.toString();
        you_dialogue += 1;
      } else {
        passage_name += other_dialogue.toString();
        other_dialogue += 1;
      }

      //fill output map
      const m = new Map();
      m.set("passage_name", passage_name);
      m.set("content", passage.text);
      m.set("rideId", rideid.rideid);
      m.set("speaker", passage.speaker);
      m.set("attributeId", passage.attributeID);
      if (branch.name == "start") {
        m.set("trunk", true);
        m.set("branch_name", "Trunk");
      } else {
        m.set("branch_name", branch.root_name);
        m.set("trunk", false);
      }
      if (j == branch.passages.length - 1) {
        //if at last passage of branch
        m.set("continue_button", branch.fallthrough); //no continue button if there is no fallthrough
      }

      //add branch to output
      const output_obj = Object.fromEntries(m.entries());
      output_array.push(output_obj);
    }
  }

  console.log(JSON.stringify(output_array, null, 2));
  return JSON.stringify(output_array);
}
