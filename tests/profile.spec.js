import tap from "tap";
import { ScratchSession } from "../dist/index.js";

const session = new ScratchSession();

// basic variables
const username = "-Akroation-";
const user = session.getProfile(username);

tap.test("make sure status is string", async (t) => {
  t.type(await user.getStatus(), "string");
  t.end();
});

tap.test("make sure status is not empty", async (t) => {
  if ((await user.getStatus()) === "") {
    throw new Error("Status is empty");
  }
  t.end();
});

// profile comments
const profileComments = await user.getComments();

tap.test("make sure comments is an object (also array)", (t) => {
  t.type(profileComments, "object");
  t.end();
});

tap.test("make sure comments is not empty", (t) => {
  if (profileComments.length === 0) {
    throw new Error("Comments is empty");
  }
  t.end();
});

tap.test("make sure comments has correct type", (t) => {
  profileComments.forEach((comment) => {
    t.type(comment.id, "string");
    t.type(comment.username, "string");
    t.type(comment.content, "string");
    t.type(comment.replies, "object");
  });
  t.end();
});

// comment replies
tap.test("make sure replies has correct type", (t) => {
  profileComments.forEach((comment) => {
    comment.replies.forEach((reply) => {
      t.type(reply.id, "string");
      t.type(reply.username, "string");
      t.type(reply.content, "string");
    });
  });
  t.end();
});
