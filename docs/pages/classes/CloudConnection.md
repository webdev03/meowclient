# CloudConnection

The class to use cloud variables. Accessible through `Project.createCloudConnection`.

**Note: This is also an EventEmitter!**

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

## EventEmitter

There are different events:

- `set` (Set a variable)
- `connect` (Connect to cloud data)
- `reconnect` (Reconnect to cloud data)
- `error` (Error in WS connection)

You can use it like this:

```ts
CloudConnection.on("set", (data) => {
  console.log(`Variable ${data.name} set to ${data.value}`);
});
```
