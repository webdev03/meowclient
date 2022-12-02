# meowclient

An easy to use library to connect to [Scratch](https://scratch.mit.edu).

## Installation

Just run

```bash
npm install meowclient
```

This installs the latest version of meowclient in your `package.json`.

## Usage

The library supports both CJS and ESM. In this documentation there is only ESM used. Here's how to import the ScratchSession into your code through CJS.

```js
const { ScratchSession } = require("meowclient");
```

A basic starter program:

```js
import { ScratchSession, Profile } from "meowclient";
const session = new ScratchSession();
await session.init("user", "pass"); // change these to your scratch login credentials
const me = new Profile(session, session.username);
console.log("My status is " + (await me.getStatus()));
```

If you use VS Code, you should be able to use the JSDoc documentation. If you use TypeScript you can also take full advantage of the types.

This will soon be a collection of examples for using meowclient. If you cannot find what you want, you can go through the [source code](https://github.com/webdev03/meowclient) or you can ask for help in the [official meowclient forum topic](https://scratch.mit.edu/discuss/topic/574321).
