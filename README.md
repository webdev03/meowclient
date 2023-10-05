# Meowclient

A library to connect to [Scratch](https://scratch.mit.edu/).

### Installation

Run this command in a terminal.

```bash
npm install meowclient
```

## Example

```javascript
import { ScratchSession, Profile } from "meowclient";
const session = new ScratchSession();
await session.init("user", "pass");
const me = new Profile(session, session.username);
console.log("My status is " + (await me.getStatus()));
await session.logout();
```
This uses exclusively ESM (ECMAScript Modules) instead of CJS due to some dependencies meowclient uses.

## Getting Help
You can get help using Meowclient from the [official Meowclient forum topic](https://scratch.mit.edu/discuss/topic/574321/)

## Thanks

Thanks to all of the people who use my library!

Thanks to [Scratchclient](https://github.com/CubeyTheCube/scratchclient) and Raihan142857 ([CubeyTheCube](https://github.com/CubeyTheCube)) for a lot of the login stuff!
