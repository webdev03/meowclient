# Profile
The class to get and set a user's Scratch profile data. Accessible through `ScratchSession.getProfile`.
## Functions
### getComments
Gets the comments on the user's profile
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
]
```