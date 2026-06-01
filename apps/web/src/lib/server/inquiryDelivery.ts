import { parseEmailList, sendResendEmail, type EmailDeliveryResult } from "./emailDelivery";

const DEFAULT_API_URL = "http://localhost:5000";
const DEFAULT_RECIPIENT = "kalandars2004@gmail.com";
const DEFAULT_FROM = "Ractysh Enterprise Desk <onboarding@resend.dev>";

export type InquiryKind = "contact" | "book-demo";

export interface ContactInquiryPayload {
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  interest: string;
  message: string;
}

export interface DemoInquiryPayload {
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  discussionTopic: string;
  message?: string;
}

export type InquiryPayload = ContactInquiryPayload | DemoInquiryPayload;

export interface BackendInquiryResult {
  ok: boolean;
  status: number;
  id?: string;
  stored?: boolean;
  message?: string;
  notification?: EmailDeliveryResult;
  error?: string;
}

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

function getBackendApiUrl(): string {
  return (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, "");
}

function endpoint(kind: InquiryKind): string {
  return kind === "book-demo" ? "/api/inquiries/book-demo" : "/api/inquiries/contact";
}

function recipients(kind: InquiryKind): string[] {
  const configured =
    kind === "book-demo"
      ? process.env.DEMO_MAIL_TO || process.env.MAIL_TO
      : process.env.CONTACT_MAIL_TO || process.env.MAIL_TO;

  return parseEmailList(configured, DEFAULT_RECIPIENT);
}

function sender(kind: InquiryKind): string {
  if (kind === "book-demo") {
    return process.env.DEMO_MAIL_FROM || process.env.MAIL_FROM || DEFAULT_FROM;
  }

  return process.env.CONTACT_MAIL_FROM || process.env.MAIL_FROM || DEFAULT_FROM;
}

function rows(kind: InquiryKind, payload: InquiryPayload, submittedAt: string, inquiryId?: string): Array<[string, string | undefined]> {
  if (kind === "book-demo") {
    const demo = payload as DemoInquiryPayload;
    return [
      ["Name", demo.fullName],
      ["Email", demo.email],
      ["Company", demo.companyName],
      ["Phone", demo.phone],
      ["Discussion topic", demo.discussionTopic],
      ["Submitted at", submittedAt],
      ["Inquiry id", inquiryId]
    ];
  }

  const contact = payload as ContactInquiryPayload;
  return [
    ["Name", contact.fullName],
    ["Email", contact.email],
    ["Company", contact.companyName],
    ["Phone", contact.phone],
    ["Coordination focus", contact.interest],
    ["Submitted at", submittedAt],
    ["Inquiry id", inquiryId]
  ];
}

function message(kind: InquiryKind, payload: InquiryPayload): string | undefined {
  return kind === "book-demo" ? (payload as DemoInquiryPayload).message : (payload as ContactInquiryPayload).message;
}

function plainText(kind: InquiryKind, payload: InquiryPayload, submittedAt: string, inquiryId?: string): string {
  return [
    ...rows(kind, payload, submittedAt, inquiryId).map(([label, value]) => `${label}: ${display(value)}`),
    "",
    "Message:",
    display(message(kind, payload))
  ].join("\n");
}

function html(kind: InquiryKind, payload: InquiryPayload, submittedAt: string, inquiryId?: string): string {
  const title = kind === "book-demo" ? "New private demo request" : "New executive contact inquiry";
  const eyebrow = kind === "book-demo" ? "Ractysh booking desk" : "Ractysh enterprise contact desk";
  const tableRows = rows(kind, payload, submittedAt, inquiryId)
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
          <table role="presentation" style="width:100%;border-collapse:collapse">${tableRows}</table>
          <div style="padding:26px 30px">
            <p style="margin:0 0 10px;color:#776a58;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.09em">Message</p>
            <div style="white-space:pre-wrap;margin:0;color:#181512;font-size:15px;line-height:1.75">${escapeHtml(display(message(kind, payload)))}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function persistInquiry(
  kind: InquiryKind,
  payload: InquiryPayload,
  skipNotification: boolean
): Promise<BackendInquiryResult> {
  try {
    const response = await fetch(`${getBackendApiUrl()}${endpoint(kind)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(skipNotification ? { "x-ractysh-skip-notification": "true" } : {})
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12_000)
    });
    const result = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      status: response.status,
      id: typeof result?.inquiry?.id === "string" ? result.inquiry.id : undefined,
      stored: typeof result?.inquiry?.stored === "boolean" ? result.inquiry.stored : undefined,
      message: typeof result?.message === "string" ? result.message : undefined,
      notification: result?.notification,
      error: typeof result?.inquiry?.storageError === "string" ? result.inquiry.storageError : undefined
    };
  } catch (error) {
    return {
      ok: false,
      status: 503,
      error: error instanceof Error ? error.message : "Backend inquiry service unavailable."
    };
  }
}

export async function sendInquiryEmail(
  kind: InquiryKind,
  payload: InquiryPayload,
  submittedAt: string,
  inquiryId?: string
): Promise<EmailDeliveryResult> {
  const subject =
    kind === "book-demo"
      ? `New Ractysh demo request - ${payload.fullName}`
      : `New Ractysh contact inquiry - ${payload.fullName}`;

  return sendResendEmail({
    from: sender(kind),
    to: recipients(kind),
    replyTo: payload.email,
    subject,
    text: plainText(kind, payload, submittedAt, inquiryId),
    html: html(kind, payload, submittedAt, inquiryId),
    tags: [{ name: "source", value: kind }],
    idempotencyKey: inquiryId
  });
}
