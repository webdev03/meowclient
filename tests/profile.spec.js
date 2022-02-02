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

// profile comments
const profileComments = await user.getComments();

r.test('make sure comments is an object (also array)', () => {
  r.expectTypeOf(profileComments, "object");
})

r.test('make sure comments is not empty', () => {
  if (profileComments.length === 0) {
    throw new Error("Comments is empty");
  }
});

r.test('make sure comments has correct type', () => {
  profileComments.forEach(comment => {
    r.expectTypeOf(comment.id, "string");
    r.expectTypeOf(comment.username, "string");
    r.expectTypeOf(comment.content, "string");
    r.expectTypeOf(comment.replies, "object");
  });
});
