import { Readable } from "node:stream";
// https://stackoverflow.com/a/49428486/17333186
export function streamToString(stream: Readable): Promise<string> {
  let chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}
