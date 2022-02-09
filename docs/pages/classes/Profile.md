# Profile

The class to get and set a user's Scratch profile data. Accessible through `ScratchSession.getProfile`.

## Functions

### getStatus

Gets the current status of the user.

#### Returns

Returns either `Scratcher`, `New Scratcher`, or `Scratch Team`.

### getComments

Gets the comments on the user's profile.

#### Parameters

- `page` (`number`) The page of comments to view

#### Returns

This returns an Array of `ProfileComment`s.

```ts
[
  {
    id: string,
    username: string,
    content: string,
    apiID: string,
    replies: [
      {
        id: string,
        username: string,
        content: string,
        apiID: string
      },
      {
        id: string,
        username: string,
        content: string,
        apiID: string
      }
    ]
  }
];
```

### deleteComment

Deletes a comment from the user's profile page.

#### Parameters

- `id` (`string` or `number`) The ID of the comment to delete. Must be `12345`, **not** `comment-12345`.

### getUserAPI

Gets the response from `https://api.scratch.mit.edu/users/:user`.

#### Returns

```ts
id: number,
username: string,
scratchteam: boolean,
history: {
  joined: string
},
profile: {
  id: number,
  images: {
    '90x90': string,
    '60x60': string,
    '55x55': string,
    '50x50': string,
    '32x32': string
  },
  status: string,
  bio: string,
  country: string
}
```
