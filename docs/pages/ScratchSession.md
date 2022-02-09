# ScratchSession

The main part of meowclient.

## Methods

### init

Initialises the `ScratchSession` to perform authenticated actions. You can perform limited actions without calling this method.

#### Parameters

- `user` (`string`) - The username of the user you want to log in to
- `pass` (`string`) - The password of the user you want to log in to

### getProject

Gets a project.

#### Parameters

- `id` (`number`) - The ID of the project you want to get.

#### Returns

This returns a `Project` class.

### getProfile

Gets a profile.

#### Parameters

- `username` (`string`) - The username of the profile you want to get.

#### Returns

This returns a `Profile` class.

### getStudio

Gets a studio.

#### Parameters

- `id` (`number`) - The ID of the studio you want to get.

### logout

Logs out of Scratch.
**Note:** Currently it still keeps `csrfToken`, `token`, and `sessionJSON` intact. If you want to re-login, use the `init` method or create a new `ScratchSession`.
