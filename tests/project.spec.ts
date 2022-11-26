import tap from "tap";
import { ScratchSession } from "../src";

const session = new ScratchSession();

// basic variables
const projectID = 601968190;
const project = session.getProject(projectID);
const apiData = await project.getAPIData();
const comments = await project.getComments();

tap.test("make sure project stats are numbers", (t) => {
  t.type(apiData.stats.views, "number");
  t.type(apiData.stats.favorites, "number");
  t.type(apiData.stats.loves, "number");
  t.type(apiData.stats.remixes, "number");
  t.end();
});

tap.test("make sure project comments are object", (t) => {
  t.type(comments, "object");
  t.end();
});

tap.test("make sure project comments are iterable", (t) => {
  t.type(comments.forEach, "function");
  t.end();
});

tap.test("make sure project comment replies work", async (t) => {
  const id = comments[0].id;
  const replies = await project.getCommentReplies(id, 0, 20);
  const reply = replies[0];
  t.type(reply, "object");
  t.end();
});
