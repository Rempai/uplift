import { get } from "https";
import { createWriteStream, readFileSync } from "fs";

const url = "https://127.0.0.1:8000/openapi.json";
const dest = "./openapi.json";
const options = {
  cert: readFileSync("./cert.pem"),
  key: readFileSync("./key.pem"),
  rejectUnauthorized: false
};

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    get(url, options, (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download file. Status code: ${response.statusCode}`));
      }
      response.pipe(createWriteStream(dest));
      response.on("end", resolve);
      response.on("error", (err) => reject(err));
    });
  });
};

download(url, dest);
