import type { ContactInquiryInput, DemoInquiryInput } from "../validation/inquiry.js";
import { parseEmailList, sendResendEmail, type EmailDeliveryResult } from "./emailDeliveryService.js";

const DEFAULT_RECIPIENT = "kalandars2004@gmail.com";
const DEFAULT_FROM = "Ractysh Enterprise Desk <onboarding@resend.dev>";

type InquiryNotificationInput =
  | (ContactInquiryInput & { kind: "contact"; inquiryId?: string })
  | (DemoInquiryInput & { kind: "book-demo"; inquiryId?: string });

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function display(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "Not provided";
}

function recipients(kind: InquiryNotificationInput["kind"]): string[] {
  const configured =
    kind === "book-demo"
      ? process.env.DEMO_MAIL_TO || process.env.MAIL_TO || process.env.CONSULTATION_NOTIFY_TO
      : process.env.CONTACT_MAIL_TO || process.env.MAIL_TO || process.env.CONSULTATION_NOTIFY_TO;

  return parseEmailList(configured, DEFAULT_RECIPIENT);
}

function sender(kind: InquiryNotificationInput["kind"]): string {
  if (kind === "book-demo") {
    return process.env.DEMO_MAIL_FROM || process.env.MAIL_FROM || process.env.CONSULTATION_NOTIFY_FROM || DEFAULT_FROM;
  }

  return process.env.CONTACT_MAIL_FROM || process.env.MAIL_FROM || process.env.CONSULTATION_NOTIFY_FROM || DEFAULT_FROM;
}

function inquiryRows(payload: InquiryNotificationInput, submittedAt: string): Array<[string, string | undefined]> {
  if (payload.kind === "book-demo") {
    return [
      ["Name", payload.fullName],
      ["Email", payload.email],
      ["Company", payload.companyName],
      ["Phone", payload.phone],
      ["Discussion topic", payload.discussionTopic],
      ["Submitted at", submittedAt],
      ["Inquiry id", payload.inquiryId]
    ];
  }

  return [
    ["Name", payload.fullName],
    ["Email", payload.email],
    ["Company", payload.companyName],
    ["Phone", payload.phone],
    ["Coordination focus", payload.interest],
    ["Submitted at", submittedAt],
    ["Inquiry id", payload.inquiryId]
  ];
}

function plainText(payload: InquiryNotificationInput, submittedAt: string): string {
  const message = payload.kind === "book-demo" ? payload.message : payload.message;
  const rows = inquiryRows(payload, submittedAt).map(([label, value]) => `${label}: ${display(value)}`);

  return [...rows, "", "Message:", display(message)].join("\n");
}

function html(payload: InquiryNotificationInput, submittedAt: string): string {
  const title = payload.kind === "book-demo" ? "New private demo request" : "New executive contact inquiry";
  const eyebrow = payload.kind === "book-demo" ? "Ractysh booking desk" : "Ractysh enterprise contact desk";
  const message = payload.kind === "book-demo" ? payload.message : payload.message;
  const rows = inquiryRows(payload, submittedAt)
    .filter(([, value]) => value)
    .map(
      ([label, value]) => `
        <tr>
          <td style="width:34%;padding:13px 16px;color:#776a58;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.09em;border-bottom:1px solid #ece3d3">${escapeHtml(label)}</td>
          <td style="padding:13px 16px;color:#181512;font-size:15px;font-weight:700;border-bottom:1px solid #ece3d3">${escapeHtml(display(value))}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="margin:0;padding:0;background:#f8f3e8;color:#181512;font-family:Inter,Arial,sans-serif">
      <div style="padding:32px 16px">
        <div style="max-width:720px;margin:0 auto;overflow:hidden;border-radius:24px;border:1px solid #e3d4b7;background:#fffaf0;box-shadow:0 24px 72px rgba(23,18,15,.14)">
          <div style="background:#17120f;padding:28px 30px;color:#fff8ec">
            <p style="margin:0 0 8px;color:#d6b45f;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.14em">${escapeHtml(eyebrow)}</p>
            <h1 style="margin:0;font-size:25px;line-height:1.2;font-weight:700">${escapeHtml(title)}</h1>
          </div>
          <table role="presentation" style="width:100%;border-collapse:collapse">${rows}</table>
          <div style="padding:26px 30px">
            <p style="margin:0 0 10px;color:#776a58;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.09em">Message</p>
            <div style="white-space:pre-wrap;margin:0;color:#181512;font-size:15px;line-height:1.75">${escapeHtml(display(message))}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function sendInquiryNotification(
  payload: InquiryNotificationInput,
  submittedAt: string
): Promise<EmailDeliveryResult> {
  const subject =
    payload.kind === "book-demo"
      ? `New Ractysh demo request - ${payload.fullName}`
      : `New Ractysh contact inquiry - ${payload.fullName}`;

  return sendResendEmail({
    from: sender(payload.kind),
    to: recipients(payload.kind),
    replyTo: payload.email,
    subject,
    text: plainText(payload, submittedAt),
    html: html(payload, submittedAt),
    tags: [{ name: "source", value: payload.kind }],
    idempotencyKey: payload.inquiryId
  });
}
