import { Tester } from "neotest";
import { ScratchSession } from "../dist/index.js"

const r = new Tester();
const session = new ScratchSession();

// basic variables
const username = "-Akroation-";
const user = session.getProfile(username);

r.test('make sure status is string', async () => {
  r.expectTypeOf(await user.getStatus(), "string");
}); 

r.test('make sure status is not empty', async () => {
  if (await user.getStatus() === "") {
    throw new Error("Status is empty");
  }
});
