# Change Signature

This example shows how to change your forums signature with meowclient.

```ts
import { ScratchSession } from "meowclient";
const session = new ScratchSession();
await session.init("user", "pass");
const forum = session.getForum();
await forum.setSignature(`I am ${session.username}!`);
```
