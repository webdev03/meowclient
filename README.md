
# Meowclient [![Test](https://github.com/webdev03/meowclient/actions/workflows/test.yml/badge.svg)](https://github.com/webdev03/meowclient/actions/workflows/test.yml)
 
<h3 align="center"> A very cool library to connect to <a href="https://scratch.mit.edu/">Scratch.</a>  </h3>

##  Getting Started

Follow the steps below:

###  ⏳ Installation

Install Meowclient with this **Quickstart** command to install the latest version of meowclient in your `package.json`.

```bash
 npm install meowclient
```

This command generates a brand new project with the default features.
#### The library supports both CJS and ESM.

## Example (async)

```javascript
import { ScratchSession } from "meowclient";
const session = new ScratchSession();
await session.init("user", "pass");
const me = session.getProfile(session.username);
// next line gets html and stores it so only 1 fetch request and no .init function - recreate the object to reset it
console.log("My status is " + (await me.getStatus()));
```

You might be able to use this **without even logging in by not running .init** on the session.

### The CJS way (if you still use it)

```js
const { ScratchSession } = require("meowclient");
const session = new ScratchSession();
await session.init("user", "pass");
const me = session.getProfile(session.username);
// next line gets html and stores it so only 1 fetch request and no .init function - recreate the object to reset it
console.log("My status is " + (await me.getStatus()));
```

## Awesome features

CJS **and** ESM support powered by tsup package!
This is made with _typescript_ so you will also get .d.ts definition file and I will try my best to make good documentation! Some JSDoc comments are there too.

## Why not _insert library name here_?

ESM support, typescript, comments parsing

## Extra things

I will not add any social actions to the library because then less chance of people getting banned from Scratch.

## Thanks

Thanks to [Scratchclient](https://github.com/CubeyTheCube/scratchclient) and Raihan142857 ([CubeyTheCube](https://github.com/CubeyTheCube)) for a lot of the login stuff!


