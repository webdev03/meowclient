# Meowclient [![Test](https://github.com/webdev03/meowclient/actions/workflows/test.yml/badge.svg)](https://github.com/webdev03/meowclient/actions/workflows/test.yml)

**A library to connect to [Scratch](https://scratch.mit.edu/).**

### Installation

If you run this install command you will get the latest version of meowclient in your `package.json`.

```bash
 npm install meowclient
```

## Example (async)

```javascript
import { ScratchSession, Profile } from "meowclient";
const session = new ScratchSession();
await session.init("user", "pass");
const me = new Profile(session, session.username);
console.log("My status is " + (await me.getStatus()));
```

Some features are available without logging in if you don't run the `session.init` function.

### The CJS way (if you still use it)

```js
const { ScratchSession } = require("meowclient");
const session = new ScratchSession();
await session.init("user", "pass");
const me = new Profile(session, session.username);
// User.getStatus gets the status of the user, either "New Scratcher", "Scratcher" or "Scratch Team"
console.log("My status is " + (await me.getStatus()));
```

## Note

Automating social actions such as loving, favouriting, commenting, or following users is not allowed if you run it automatically! Only use these features if you are doing it manually! I am not responsible if your Scratch account gets restricted because of you being reckless with this!

## Thanks

Thanks to [Scratchclient](https://github.com/CubeyTheCube/scratchclient) and Raihan142857 ([CubeyTheCube](https://github.com/CubeyTheCube)) for a lot of the login stuff!
