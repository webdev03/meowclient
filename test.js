import ScratchSession from "./dist/index.js";
const profile = new ScratchSession().getProfile("god286");
(async () => {
  console.log(await profile.getStatus());
  console.log(await profile.getStatus());
  console.log(await profile.getStatus());
  console.log(await profile.getStatus());
})();
