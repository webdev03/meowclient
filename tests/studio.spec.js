import tap from "tap";
import { ScratchSession } from "../dist/index.js";

const session = new ScratchSession();

// get studio
const studio = session.getStudio(30136012);
const apiData = await studio.getAPIData();
// main tests
tap.test("make sure api data has correct types", (t) => {
  t.type(apiData.id, "number");
  t.type(apiData.title, "string");
  t.type(apiData.description, "string");
  t.type(apiData.host, "number");
  t.type(apiData.stats.comments, "number");
  t.type(apiData.stats.followers, "number");
  t.type(apiData.stats.managers, "number");
  t.type(apiData.stats.projects, "number");
  t.type(apiData.open_to_all, "boolean");
  t.type(apiData.public, "boolean");
  t.end();
});

const projects = await studio.getProjects();

tap.test("make sure studio projects returned have correct types", (t) => {
  const project = projects[0];
  t.type(project.id, "number");
  t.type(project.title, "string");
  t.type(project.image, "string");
  t.type(project.actor_id, "number");
  t.type(project.creator_id, "number");
  t.type(project.username, "string");

  // avatar
  t.type(project.avatar["90x90"], "string");
  t.type(project.avatar["60x60"], "string");
  t.type(project.avatar["55x55"], "string");
  t.type(project.avatar["50x50"], "string");
  t.type(project.avatar["32x32"], "string");
  t.end();
});
