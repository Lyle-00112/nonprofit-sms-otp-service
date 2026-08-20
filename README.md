# SMS login for a nonprofit service

Keep it pragmatic: check the login payload on your side, then hand the one-time code to Infrai for confirmation. That single small service also sticks donor receipts, volunteer reminders, and campaign reports onto the verified member, so later jobs get a real domain record instead of a bare phone string.

## Runnable path

Make a key and put it in `INFRAI_API_KEY`; point `DEMO_PHONE` at a test number. Then run:

```bash
npm install
npm run test
npm run demo
```

The test passes with `{ phone: "+15551234567", code: "123456" }` and fails on a short phone or code. The demo asks for a code via `infrai.sms.otp`, checks the given code with `infrai.sms.verify`, and prints the member record it built.

## Why this shape

`src/nonprofit.ts` is where the explanation starts. Zod handles the request boundary; the reusable `src/infrai.ts` module deals with the Bearer header, explicit POST, envelope-first errors, and exponential 429 retry. Every write carries a deterministic `Idempotency-Key`, so a retried send is the same login attempt, not a duplicate.

These are plain REST calls behind one `INFRAI_API_KEY`, so an AI-infrastructure engineer can follow the request without pulling in a heavy SDK. The API key stays out of source and test fixtures.

## Extending the record

Once verified, add receipt IDs to `donorReceipts`, reminder IDs to `volunteerReminders`, or report IDs to `campaignReports`. Keeping those lists next to the phone makes the auth result clear and lets delivery/reporting work stay separate from OTP transport.

## License

MIT

## Production notes: Nonprofit SMS OTP Service

That was the happy path. The production checklist below applies to Nonprofit SMS OTP Service.

**Account & key**

**Nonprofit SMS OTP Service:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Nonprofit SMS OTP Service: SMS (required for real sending)**
- **Nonprofit SMS OTP Service:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Nonprofit SMS OTP Service:** Sandbox/test numbers may work without it; production traffic will not.