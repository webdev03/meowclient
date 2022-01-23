# meowclient
a very cool library!

## example (async)
```js
import ScratchSession from "meowclient";
const session = new ScratchSession();
await session.init("user", "pass");
const me = session.getProfile(session.username);
// next line gets html and stores it so only 1 fetch request and no .init function
console.log("My status is " + await me.getStatus());
```
you might be able to use this without even logging in by not running .init on the session

## awesome features

CJS **and** ESM support powered by tsup package!
This is made with _typescript_ so you will also get .d.ts definition file and I will try my best to make good documentation! Some JSDoc comments are there too.

work in progress, not on npm yet.

## why not _insert library name here_?
esm support, typescript, comments parsing

## extra things
I will not add any social actions to the library because then less chance of people getting banned from Scratch.

## thanks
Thanks to [Scratchclient](https://github.com/CubeyTheCube/scratchclient) and Raihan142857 ([CubeyTheCube](https://github.com/CubeyTheCube)) for a lot of the login stuff!
