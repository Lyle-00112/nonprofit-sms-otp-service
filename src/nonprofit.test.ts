import assert from "node:assert/strict";
import { loginBody } from "./nonprofit.js";

assert.equal(loginBody.safeParse({ phone: "+15551234567", code: "123456" }).success, true);
assert.equal(loginBody.safeParse({ phone: "12", code: "123" }).success, false);
console.log("login request boundary passes");
