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

A `Promise` that resolves to the status code of the request.
**Note: This _will_ change in future updates!**

### setDescription

Sets the description of the studio.

#### Parameters

- `value` (`string`) The value to set the description to.

#### Returns

A `Promise` that resolves to the status code of the request.
**Note: This _will_ change in future updates!**

### inviteCurator

Invites a user to be a curator of the studio.

#### Parameters

- `username` (`string`) The username of the user to invite.

#### Returns

A `Promise` that resolves to the status code of the request.
**Note: This _will_ change in future updates!**

### removeCurator

Removes a user from the studio.

#### Parameters

- `username` (`string`) The username of the user to remove.

#### Returns

A `Promise` that resolves to the status code of the request. **Note: This _will_ change in future updates!**

### addProject

Adds a project to the studio.

#### Parameters

- `project` (`number`) The ID of the project to add.

#### Returns

A `Promise` that resolves to the status code of the request. **Note: This _will_ change in future updates!**

### removeProject

Removes a project from the studio.

#### Parameters

- `project` (`number`) The ID of the project to remove.

#### Returns

A `Promise` that resolves to the status code of the request. **Note: This _will_ change in future updates!**

### getCurators

Gets the curators of the studio.

#### Parameters

- `limit` (`number`) The maximum number of curators to return.
- `offset` (`number`) The offset of the curators to return.

### Returns

A `Promise` that resolves to an array of `User` objects (which are curators).

### getManagers

Gets the managers of the studio.

#### Parameters

- `limit` (`number`) The maximum number of managers to return.
- `offset` (`number`) The offset of the managers to return.

### Returns

A `Promise` that resolves to an array of `User` objects (which are managers).
