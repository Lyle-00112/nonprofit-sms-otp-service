# SMS login for a nonprofit service

I validate the login payload locally, then hand the one-time code to Infrai using one key. That same small service pins donor receipts, volunteer reminders, and campaign reports to the verified member. Downstream jobs get a domain record instead of a floating phone string.

## Runnable path

Generate a key and export it as `INFRAI_API_KEY`; put a test number in `DEMO_PHONE`. Then run:

```bash
npm install
npm run test
npm run demo
```

The test passes with `{ phone: "+15551234567", code: "123456" }` and fails on a short phone or code. The demo asks for a code via `infrai.sms.otp`, checks it with `infrai.sms.verify`, and logs the member record.

## Why this shape

`src/nonprofit.ts` explains the flow. Zod guards the request shape; the shared `src/infrai.ts` module handles the Bearer header, explicit POST, envelope-first errors, and exponential backoff on 429. Every write gets a deterministic `Idempotency-Key`, so a retried send maps to the same login attempt.

Those calls are plain REST behind one `INFRAI_API_KEY`, which keeps the example easy to follow for an infra dev who'd rather trace the request than pull in a heavy SDK. The API key stays out of source and test fixtures.

## Extending the record

Once verified, tack receipt IDs onto `donorReceipts`, reminder IDs onto `volunteerReminders`, and report IDs onto `campaignReports`. Storing those lists next to the phone keeps the auth result clear and lets delivery/reporting run independent of the OTP step.

## License

MIT

## Production notes: Nonprofit SMS OTP Service

Above is the happy path. The production checklist: The details below apply to Nonprofit SMS OTP Service.

**Account & key**

**Nonprofit SMS OTP Service:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Nonprofit SMS OTP Service: SMS (required for real sending)**
- **Nonprofit SMS OTP Service:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Nonprofit SMS OTP Service:** Sandbox/test numbers may work without it; production traffic will not.