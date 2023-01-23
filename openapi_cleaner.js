import * as fs from "fs";
import { resolve } from "path";

const filePath = resolve("./openapi.json");
const openapiContent = JSON.parse(fs.readFileSync(filePath, "utf8"));

for (const pathData of Object.values(openapiContent["paths"])) {
  for (const operation of Object.values(pathData)) {
    const tag = operation["tags"][0];
    const operationId = operation["operationId"];
    const toRemove = `${tag}-`;
    const newOperationId = operationId.slice(toRemove.length);
    operation["operationId"] = newOperationId;
  }
}

fs.writeFileSync(filePath, JSON.stringify(openapiContent), "utf8");
