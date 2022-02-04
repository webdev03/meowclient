import { Tester } from "neotest";
import { ScratchSession } from "../dist/index.js";

const r = new Tester();
const session = new ScratchSession();

// get studio
const studio = session.getStudio(30136012);
const apiData = await studio.getAPIData();
// main tests
r.test("make sure api data has correct types", () => {
  r.expectTypeOf(apiData.id, "number");
  r.expectTypeOf(apiData.title, "string");
  r.expectTypeOf(apiData.description, "string");
  r.expectTypeOf(apiData.host, "number");
  r.expectTypeOf(apiData.stats.comments, "number");
  r.expectTypeOf(apiData.stats.followers, "number");
  r.expectTypeOf(apiData.stats.managers, "number");
  r.expectTypeOf(apiData.stats.projects, "number");
  r.expectTypeOf(apiData.open_to_all, "boolean");
  r.expectTypeOf(apiData.public, "boolean");
});
