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
import { ScratchSession } from "meowclient";
(async () => {
  const session = new ScratchSession();
  await session.init("user", "pass"); // change these to your scratch login credentials
  const me = session.getProfile(session.username);
  console.log("My status is " + (await me.getStatus()));
})();
```

Documentation is **work in progress** and not all things have been added yet.
