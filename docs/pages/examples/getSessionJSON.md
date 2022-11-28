# Get Session JSON

This example shows how to get your session JSON.

```ts
import { ScratchSession } from "meowclient";
const session = new ScratchSession();
await session.init("user", "pass");
console.log(session.sessionJSON);
```
