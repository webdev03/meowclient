# Project
The class to get and set a user's Scratch profile data. Accessible through `ScratchSession.getProject`.
## Methods
### getAPIData
Gets the API data of the project.
#### Returns
```ts
id: number,
title: string,
description: string,
instructions: string,
visibility: string,
public: boolean,
comments_allowed: boolean,
is_published: boolean,
author: {
  id: number,
  username: string,
  scratchteam: boolean,
  history: {
    joined: string
  },
  profile: {
    id: null | number, // unsure about this one
    images: {
      '90x90': string,
      '60x60': string,
      '55x55': string,
      '50x50': string,
      '32x32': string
    }
  }
}
image: string,
images: {
  '282x218': string,
  '216x163': string,
  '200x200': string,
  '144x108': string,
  '135x102': string,
  '100x80': string
},
history: {
  created: string,
  modified: string,
  shared: string
},
stats: {
  views: number,
  loves: number,
  favorites: number,
  remixes: number
},
remix: {
  parent: null | number,
  root: null | number
}
```

### getComments
Gets the comments on the project.
#### Parameters
- `offset` (`number`) The offset of comments to return
- `limit` (`number`) The limit of comments to return
#### Returns
This fetches and returns the data from the project comments - for example from [https://api.scratch.mit.edu/users/griffpatch/projects/612229554/comments?offset=0&limit=20](https://api.scratch.mit.edu/users/griffpatch/projects/612229554/comments?offset=0&limit=20). Type definitions will be added soon.

### setTitle
Sets the project title (requires you to own the project).
#### Parameters
- `value` (`string`) The value to set the title to

### setInstructions
Sets the project instructions (requires you to own the project).
#### Parameters
- `value` (`string`) The value to set the instructions to

### setNotesAndCredits
Sets the project Notes and Credits (requires you to own the project).
#### Parameters
- `value` (`string`) The value to set the Notes and Credits to

### unshare
Unshares the project (requires you to own the project).

### share
Shares the project (requires you to own the project).

### createCloudConnection
Creates a cloud connection
#### Returns
This returns a CloudConnection class.
