import { z } from "zod";
import { infrai } from "./infrai.js";

export const loginBody = z.object({ phone: z.string().min(7), code: z.string().length(6) });
export type LoginBody = z.infer<typeof loginBody>;
export type MemberRecord = { phone: string; donorReceipts: string[]; volunteerReminders: string[]; campaignReports: string[] };

export async function sendLoginCode(phone: string) {
  return infrai.sms.otp({ to: phone }, `login-${phone}`);
}

export async function verifyLogin(input: unknown, expectedCode: string): Promise<MemberRecord | null> {
  const parsed = loginBody.safeParse(input);
  if (!parsed.success || parsed.data.code !== expectedCode) return null;
  await infrai.sms.verify({ to: parsed.data.phone, code: parsed.data.code }, `verify-${parsed.data.phone}-${parsed.data.code}`);
  return { phone: parsed.data.phone, donorReceipts: [], volunteerReminders: [], campaignReports: [] };
}
