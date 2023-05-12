import { Branch, Passage } from "./parser.js";
import { readFileSync } from "fs";

const num_attributeIDs = 3; //the max attributeID value, before giving an error

export function parse_file(
  filename: string,
  ridedata: { id: number; name: string },
  branches: Array<Branch>,
  characters: Array<[string, string, number]>,
  print_debug: boolean
): number {
  let errors = 0;
  let default_character = -1; //index to characters array, defines what character should be used when the line doesn't begin with "charname;"

  //log verbose
  function lverb(input: any) {
    if (print_debug) {
      console.error("\x1b[39;49m" + input);
    }
  }

  //log error
  function lerr(location: string, input: any) {
    if (print_debug) {
      console.error("\x1b[91mERROR at location " + location + ": " + input);
      errors += 1;
    }
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
        lverb(cur.substring(7));
        parse_file(
          filename.substring(0, filename.lastIndexOf("/") + 1) + cur.substring(7).trimStart(),
          ridedata,
          branches,
          characters,
          print_debug
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
        ridedata.id = parseInt(cur_split[1]);
        //TODO error checking
        break;
      case ":patience":
        if(in_branch) {
          if(branches.slice(-1)[0].passages.length != 1){
            branches.slice(-1)[0].passages.slice(-1)[0].emotion = parseInt(cur_split[1]);
          }
          else {
            lerr(location, "tried to give patience to a passage, but there's no passage in this branch yet.");
          }
        }
        else {
          lerr(location, "tried to patience to a passage, but we're not currently in a branch");
        }
        break;
      case ":finish":
        if(in_branch) {
          branches.slice(-1)[0].finish_number = parseInt(cur_split[1]);
        }
        else {
          lerr(location, "tried to give the branch a finish number, but we're not currently in a branch");
        }
        break;
      case ":ridename":
        //TODO error checking
        if (ridedata.name != "") {
          lerr(
            location,
            "tried to rename ridename, this isn't supported. current name: " + ridedata.name
          );
        }
        ridedata.name = cur.substring(cur.indexOf(" ", 1)).trimStart();
        break;
      default:
        if (cur_split[0][0] == "#") {
          if (ridedata.name == "") {
            lerr(location, "no ride name set, set it with :ridename name");
          }
          let new_branch_name = ridedata.name;
          branches.push(new Branch());
          if (
            cur_split[0][0] == "#" &&
            cur_split[0][1] == "#" &&
            cur_split[0][2] == "#" &&
            cur_split[0][3] == "#"
          ) {
            //no-link branches (for endings, which aren't linked to in the file itself.)
            new_branch_name += cur.substring(4, cur.length).trimStart();
            branches.slice(-1)[0].requires_linking = false;
            if (in_branch) {
              lerr(
                location,
                "tried starting a new ending branch, but the previous branch hasn't been ended yet. Did you forget an ':end'"
              );
            }
          } else if (cur_split[0][0] == "#" && cur_split[0][1] == "#" && cur_split[0][2] == "#") {
            if (!in_branch) {
              lerr(
                location,
                "tried inserting a label, but we are currently not in a branch. did you accidentally end the previous one?"
              );
            }
            branches.slice(-2)[0].fallthrough = false; //set previous branch to fallthrough
            new_branch_name += cur.substring(3, cur.length).trimStart(); //remove # and whitespace in front of name.
          } else if (cur_split[0][0] == "#" && cur_split[0][1] == "#") {
            if (!in_branch) {
              lerr(
                location,
                "tried inserting a label, but we are currently not in a branch. did you accidentally end the previous one?"
              );
            }
            branches.slice(-2)[0].fallthrough = true; //set previous branch to fallthrough
            new_branch_name += cur.substring(2, cur.length).trimStart(); //remove # and whitespace in front of name.
          } else {
            // for making a new branch with #branch
            new_branch_name += cur.substring(1, cur.length).trimStart();
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

          if (cur_split[0][0] == "#" && cur_split[0][1] == "#" && cur_split[0][3] != "#") {
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

              if (ridedata.name == "") {
                lerr(filename, "ride name wasn't set (set with :ridename in root file)");
              }

              const button_text = branch_split[part + 1];
              //const botched_link = branch_split[part + 3].split("_")[0];
              const real_link = ridedata.name + branch_split[part + 3];
              const button_link = "{" + ridedata.name + branch_split[part + 3] + "}"; //TODO: put in "You" etc if needed

              if (button_text == "" || button_link == "") {
                lerr(
                  location,
                  "branch structure is incomplete: missing the text or link in the '[text:link]' structure"
                );
                break;
              }

              finalized_text +=
                "<span onclick=\"branch('" +
                button_link +
                "')\"><mark>" +
                button_text +
                "</mark></span>";

              new_passage.links_to.push(real_link); //add link to structure so we can verify it exists later.

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
