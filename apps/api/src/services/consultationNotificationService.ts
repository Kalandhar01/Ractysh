import type { Attachment } from "resend";
import type { ConsultationRecord } from "../types/consultation.js";
import { parseEmailList, sendResendEmail } from "./emailDeliveryService.js";

const DEFAULT_RECIPIENT = "kalandars2004@gmail.com";
const DEFAULT_FROM = "Ractysh Consultation Desk <onboarding@resend.dev>";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function field(label: string, value: string): string {
  return `${label}: ${value || "Not provided"}`;
}

function recipients(): string[] {
  return parseEmailList(
    process.env.CONSULTATION_NOTIFY_TO || process.env.MAIL_TO || process.env.ADMIN_EMAIL,
    DEFAULT_RECIPIENT
  );
}

function sender(): string {
  return process.env.CONSULTATION_NOTIFY_FROM || process.env.MAIL_FROM || process.env.RESEND_FROM || DEFAULT_FROM;
}

function attachments(files: Express.Multer.File[]): Attachment[] | undefined {
  if (process.env.CONSULTATION_EMAIL_ATTACHMENTS === "false") return undefined;

  return files.map((file) => ({
    filename: file.originalname,
    content: file.buffer,
    contentType: file.mimetype || undefined
  }));
}

export async function sendConsultationNotification(
  consultation: ConsultationRecord,
  files: Express.Multer.File[]
): Promise<ConsultationRecord["notification"]> {
  const subjectName = consultation.companyName || consultation.fullName;
  const lines = [
    field("Full name", consultation.fullName),
    field("Company", consultation.companyName),
    field("Email", consultation.emailAddress),
    field("Phone", consultation.phoneNumber),
    field("Service", consultation.serviceType),
    field("Budget", consultation.budgetRange),
    field("Timeline", consultation.projectTimeline),
    field("Consultation type", consultation.preferredConsultationType),
    "",
    "Project description:",
    consultation.projectDescription,
    "",
    "Uploaded files:",
    consultation.attachments.length
      ? consultation.attachments
          .map((attachment) => `${attachment.filename}${attachment.url ? ` - ${attachment.url}` : ""}`)
          .join("\n")
      : "No files uploaded"
  ];
  const htmlRows = [
    ["Full name", consultation.fullName],
    ["Company", consultation.companyName],
    ["Email", consultation.emailAddress],
    ["Phone", consultation.phoneNumber],
    ["Service", consultation.serviceType],
    ["Budget", consultation.budgetRange],
    ["Timeline", consultation.projectTimeline],
    ["Consultation type", consultation.preferredConsultationType]
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:10px 14px;color:#69717d;border-bottom:1px solid #e7e3d8">${escapeHtml(
          label
        )}</td><td style="padding:10px 14px;color:#17243a;font-weight:600;border-bottom:1px solid #e7e3d8">${escapeHtml(
          value || "Not provided"
        )}</td></tr>`
    )
    .join("");

  const result = await sendResendEmail({
    from: sender(),
    to: recipients(),
    replyTo: consultation.emailAddress,
    subject: `New Ractysh consultation request - ${subjectName}`,
    text: lines.join("\n"),
    html: `
      <div style="font-family:Inter,Arial,sans-serif;background:#f8f6ef;padding:28px;color:#17243a">
        <div style="max-width:720px;margin:0 auto;background:#fffefa;border:1px solid #e7dfd1;border-radius:22px;overflow:hidden">
          <div style="padding:26px 28px;background:#17243a;color:white">
            <p style="margin:0 0 8px;color:#d9bf73;font-size:12px;font-weight:700;text-transform:uppercase">Ractysh consultation desk</p>
            <h1 style="margin:0;font-size:24px;line-height:1.2">New enterprise consultation request</h1>
          </div>
          <table style="width:100%;border-collapse:collapse">${htmlRows}</table>
          <div style="padding:24px 28px">
            <p style="margin:0 0 10px;color:#69717d;font-size:13px;font-weight:700;text-transform:uppercase">Project description</p>
            <p style="margin:0;line-height:1.7;color:#17243a">${escapeHtml(consultation.projectDescription)}</p>
          </div>
        </div>
      </div>
    `,
    attachments: attachments(files),
    tags: [{ name: "source", value: "consultation-api" }],
    idempotencyKey: consultation.id
  });

  return {
    sent: result.sent,
    skipped: result.skipped,
    error: result.error,
    sentAt: result.sentAt
  };
}
