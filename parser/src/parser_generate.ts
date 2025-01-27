import { Branch } from "./parser.js";

class OutputObject {
  branch = "Trunk";
  passage = "";
  content = "";
  rideId = 0;
  speaker = "You";
  attributeId = 1;
  continueButton = true;
  emotion = 0;
}

export function generate_output(
  unsorted_branches: Array<Branch>,
  ridedata: { id: number; name: string },
  print_debug: boolean
): string {
  const output_array: Array<OutputObject> = [];

  //move start branch to first position and importantly, leave the others in the same order
  const objectIndex = unsorted_branches.findIndex((obj) =>
    obj.name.startsWith(ridedata.name + "start")
  );
  const branches = unsorted_branches.sort((a, b) => {
    if (a === unsorted_branches[objectIndex]) {
      return -1;
    } else if (b === unsorted_branches[objectIndex]) {
      return 1;
    } else {
      return unsorted_branches.indexOf(a) - unsorted_branches.indexOf(b);
    }
  });

  let last_root = "";
  let you_dialogue = 1;
  let other_dialogue = 1;

  for (let i = 0; i < branches.length; i++) {
    const branch = branches[i];
    if (last_root != branch.root_name) {
      you_dialogue = 1;
      other_dialogue = 1;
      last_root = branch.root_name;
    }

    for (let j = 0; j < branch.passages.length; j++) {
      const passage = branch.passages[j];

      //make passage name
      let passage_name = branch.name.split("_")[0];
      let edited_root_name = branch.root_name.split("_")[0];

      if (branch.name.endsWith("start")) {
        passage_name = "Trunk";
        edited_root_name = "Trunk";
      }

      if (branch.finish_number != -1) {
        edited_root_name = ridedata.name + "Finish";
      }

      if (branch.passages.length - 1 == j && branch.finish_number != -1) {
        edited_root_name += "Now";
      }

      if (branch.finish_number != -1) {
        edited_root_name += branch.finish_number.toString();
      }

      if (passage.speaker == "You") {
        passage_name += "You" + you_dialogue.toString();
        you_dialogue += 1;
      } else {
        passage_name += other_dialogue.toString();
        other_dialogue += 1;
      }

      for (let b = 0; b < branches.length; b++) {
        for (let p = 0; p < branches[b].passages.length; p++) {
          const inner_passage = branches[b].passages[p];
          const regex = /(?<={)[^{}]*(?=})/g;
          const found = inner_passage.text.match(regex);
          (found ?? []).forEach((element) => {
            if (element.toString() == branch.name) {
              const old = "{" + branch.name + "}";
              inner_passage.text = inner_passage.text.replace(old, passage_name);
            }
          });
        }
      }

      //fill output map
      const o = new OutputObject();
      if (branch.root_name != "start") {
        o.branch = edited_root_name;
      }
      o.passage = passage_name;
      o.content = branches[i].passages[j].text;
      o.rideId = ridedata.id;
      o.speaker = passage.speaker;
      o.attributeId = passage.attributeID;
      o.emotion = passage.emotion;
      if (j == branch.passages.length - 1) {
        //if at last passage of branch
        if (passage.original_location.includes("_endings")) {
          o.continueButton = true;
        } else {
          o.continueButton = branch.fallthrough ?? true; //no continue button if there is no fallthrough
        }
      }

      //add branch to output
      output_array.push(o);
    }
  }

  let a = 0;
  for (let i = 0; i < branches.length; i++) {
    const branch = branches[i];
    for (let j = 0; j < branch.passages.length; j++) {
      const passage = branch.passages[j];
      output_array[a].content = passage.text;
      a++;
    }
  }

  if (print_debug) {
    console.error(JSON.stringify(output_array, null, 2));
  }

  return (
    '"' +
    JSON.stringify(output_array)
      .replace(/[\\]/g, "\\\\")
      .replace(/["]/g, '\\"')
      .replace(/[/]/g, "\\/")
      .replace(/[\b]/g, "\\b")
      .replace(/[\f]/g, "\\f")
      .replace(/[\n]/g, "\\n")
      .replace(/[\r]/g, "\\r")
      .replace(/[\t]/g, "\\t") +
    '"'
  );
}
