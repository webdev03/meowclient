# Forums

Access the Scratch forums through meowclient!

## getForum

Gets a forum. Accessible with `ScratchSession.getForum`.

### Parameters

- `id` (`number`): The id of the forum. If not provided, only a few options will work.

### Returns

A `Forum` object.

## Forum

### getTopics (Promise)

Gets the topics in the forum. Only works when `id` is provided.

#### Returns

An array of `Topic` objects.

### getTopic

Gets a topic.

#### Parameters

- `id` (`number`): The id of the topic.

#### Returns

A `Topic` object.

## Topic

### getPosts (Promise)

Gets the posts in the topic.

#### Returns

An array of `Post` objects.

### follow (Promise)

Follows the topic.

#### Returns

A `Promise` that resolves to a number.
**Note: This _will_ change in future updates!**

### unfollow (Promise)

Unfollows the topic.

#### Returns

A `Promise` that resolves to a number.
**Note: This _will_ change in future updates!**

## Post

- `id` (`number`): The id of the post.
- `author` (`string`): The author of the post.
- `content` (`string`): The content of the post.
- `parsableContent` (`HTMLElement`): Parsable content with `node-html-parser`.
- `time` (`Date`): The time the post was created.

### edit (Promise)

Edits the post.

#### Returns

A `Promise` that resolves to a number.
**Note: This _will_ change in future updates!**
