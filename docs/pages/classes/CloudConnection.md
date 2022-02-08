# CloudConnection

The class to use cloud variables. Accessible through `Project.createCloudConnection`.

## Methods

### setVariable

Sets a cloud variable

#### Parameters

- `variable` (`string`) The variable name
- `value` (`string` | `number`) The value to set the variable to

### getVariable

Gets a cloud variable

#### Parameters

- `variable` (`string`) The variable name

#### Returns

This returns a `string` containing the value of the variable.

### close

Closes the cloud connection.

## Properties

### variables

Returns an object with the cloud variable data.

### connection

Returns a websocket connection. This uses the [ws](https://github.com/websockets/ws) library.
