# Studio

Gets a studio. Accessible through `ScratchSession.getStudio`.

## Functions

### getAPIData

Gets the API data for the studio.

### setTitle

Sets the title of the studio.

#### Parameters

- `value` (`string`) The value to set the title to.

#### Returns

A `Response` object.

### setDescription

Sets the description of the studio.

#### Parameters

- `value` (`string`) The value to set the description to.

#### Returns

A `Response` object.

### inviteCurator

Invites a user to be a curator of the studio.

#### Parameters

- `username` (`string`) The username of the user to invite.

#### Returns

A `Response` object.

### removeCurator

Removes a user from the studio.

#### Parameters

- `username` (`string`) The username of the user to remove.

#### Returns

A `Response` object.

### addProject

Adds a project to the studio.

#### Parameters

- `project` (`number`) The ID of the project to add.

#### Returns

A `Response` object.

### removeProject

Removes a project from the studio.

#### Parameters

- `project` (`number`) The ID of the project to remove.

#### Returns

A `Response` object.

### getCurators

Gets the curators of the studio.

#### Parameters

- `limit` (`number`) The maximum number of curators to return.
- `offset` (`number`) The offset of the curators to return.

#### Returns

A `Promise` that resolves to an array of `User` objects (which are curators).

### getManagers

Gets the managers of the studio.

#### Parameters

- `limit` (`number`) The maximum number of managers to return.
- `offset` (`number`) The offset of the managers to return.

### Returns

A `Promise` that resolves to an array of `User` objects (which are managers).

### getProjects

Gets the projects in the studio.

#### Parameters

- `limit` (`number`) The maximum number of projects to return.
- `offset` (`number`) The offset of the projects to return.

#### Returns

A `Promise` that resolves to an array containing:

```ts
interface OldProjectResponse {
  id: number;
  title: string;
  image: string;
  creator_id: number;
  username: string;
  avatar: {
    "90x90": string;
    "60x60": string;
    "55x55": string;
    "50x50": string;
    "32x32": string;
  };
  actor_id: number;
}
```
