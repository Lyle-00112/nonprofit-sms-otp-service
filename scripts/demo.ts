import { sendLoginCode, verifyLogin } from "../src/nonprofit.js";

const phone = process.env.DEMO_PHONE;
const code = process.env.DEMO_CODE ?? "123456";
if (!phone) throw new Error("DEMO_PHONE is required");
await sendLoginCode(phone);
const member = await verifyLogin({ phone, code }, code);
console.log("verified nonprofit member:", member);
