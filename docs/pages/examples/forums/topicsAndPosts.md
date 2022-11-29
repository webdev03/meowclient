# Topics and Posts

This example shows how to get topics in a subforum. To get the subforum ID, go to the page of the subforum (for example, [https://scratch.mit.edu/discuss/31](https://scratch.mit.edu/discuss/31) for the Advanced Topics subforum) and get the numbers at the end of the URL (for the Advanced Topics it is 31).

```ts
import { ScratchSession } from "meowclient";
const session = new ScratchSession();
await session.init("user", "pass");

const subforumID = 31;
const forum = session.getForum(subforumID);
const topics = await forum.getTopics();
for (const topic of topics) {
  topic.title; // The title of the topic
  topic.id; // The ID of the topic
  topic.replyCount; // The number of replies in the topic

  await topic.follow(); // Follow the topic
  await topic.unfollow(); // Unfollow the topic

  const posts = await topic.getPosts();
  for (const post of posts) {
    post.id; // The ID of the post
    post.content; // The content of the post
    post.parsableContent; // The content of the post that can be parsed (uses node-html-parser)
    post.author; // The username of the post author
    post.time; // The time when the post was made

    await post.edit(`This is a post by ${post.author}!`); // Edits the post
  }
}
```
