# Meowclient [![Test](https://github.com/webdev03/meowclient/actions/workflows/test.yml/badge.svg)](https://github.com/webdev03/meowclient/actions/workflows/test.yml)

<h3>A feature-rich library to connect to <a href="https://scratch.mit.edu/">Scratch.</a></h3>

## Getting Started

Follow the steps below:

### ⏳ Installation

If you run this install command you will get the latest version of meowclient in your `package.json`.

```bash
 npm install meowclient
```

## Example (async)

```javascript
import { ScratchSession } from "meowclient";
const session = new ScratchSession();
await session.init("user", "pass");
const me = session.getProfile(session.username);
console.log("My status is " + (await me.getStatus()));
```

Some features are available without logging in if you don't run the `session.init` function.

### The CJS way (if you still use it)

```js
const { ScratchSession } = require("meowclient");
const session = new ScratchSession();
await session.init("user", "pass");
const me = session.getProfile(session.username);
// User.getStatus gets the status of the user, either "New Scratcher", "Scratcher" or "Scratch Team"
console.log("My status is " + (await me.getStatus()));
```

## Note

Automating social actions such as loving, favouriting, commenting, or following users is not allowed in the Scratch Terms of Use so I won't add those features to meowclient unless you have a good reason, although if you know how to use the Scratch API you can definitely make your own fetch requests with the session.

## Thanks

Thanks to [Scratchclient](https://github.com/CubeyTheCube/scratchclient) and Raihan142857 ([CubeyTheCube](https://github.com/CubeyTheCube)) for a lot of the login stuff!
