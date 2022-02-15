# Forums

Access the Scratch forums through meowclient. Accessible with `ScratchSession.getForum`.

## getForum

Gets a forum.

### Parameters

- `id` (optional): The id of the forum. If not provided, only a few options will work.

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

- `id`: The id of the topic.

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
