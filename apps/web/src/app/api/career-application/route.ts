import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_RECIPIENT = "kalandars2004@gmail.com";
const DEFAULT_FROM = "Ractysh Recruitment Desk <onboarding@resend.dev>";
const MAX_RESUME_SIZE = 15 * 1024 * 1024;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const resumeExtensions = [".pdf", ".doc", ".docx"];
const resumeMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream"
];

const applicationSchema = z.object({
  jobRole: z.string().trim().min(1, "Job role is required.").max(140, "Job role is too long."),
  fullName: z.string().trim().min(1, "Please enter your full name.").max(120, "Full name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .max(180, "Email is too long.")
    .refine((value) => value.length === 0 || emailPattern.test(value), "Please enter a valid email."),
  phone: z.string().trim().min(1, "Please enter your phone number.").max(40, "Phone number is too long."),
  portfolio: z
    .string()
    .trim()
    .min(1, "Please add a portfolio or LinkedIn profile.")
    .max(240, "Portfolio link is too long."),
  message: z
    .string()
    .trim()
    .min(1, "Please share why you want to join Ractysh.")
    .max(4000, "Message is too long.")
});

type ApplicationPayload = z.infer<typeof applicationSchema>;

type ApiValidationIssue = {
  path: string[];
  message: string;
};

type ResendAttachment = {
  filename: string;
  content: string;
  content_type?: string;
};

type CloudinaryUploadResult = {
  secure_url?: string;
  public_id?: string;
  resource_type?: string;
};

function textFromFormData(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function normalizeFormPayload(formData: FormData): ApplicationPayload {
  return {
    jobRole: textFromFormData(formData, "jobRole"),
    fullName: textFromFormData(formData, "fullName"),
    email: textFromFormData(formData, "email"),
    phone: textFromFormData(formData, "phone"),
    portfolio: textFromFormData(formData, "portfolio"),
    message: textFromFormData(formData, "message")
  };
}

function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return typeof value !== "string" && Boolean(value?.name) && typeof value?.size === "number" && value.size > 0;
}

function isAllowedResume(file: File): boolean {
  const lowerName = file.name.toLowerCase();

  return resumeMimeTypes.includes(file.type) || resumeExtensions.some((extension) => lowerName.endsWith(extension));
}

function validateResume(file: File | null): ApiValidationIssue[] {
  if (!file) {
    return [{ path: ["resume"], message: "Please upload your resume." }];
  }

  if (file.size > MAX_RESUME_SIZE) {
    return [{ path: ["resume"], message: "Resume must be 15MB or less." }];
  }

  if (!isAllowedResume(file)) {
    return [{ path: ["resume"], message: "Upload a PDF, DOC or DOCX resume." }];
  }

  return [];
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function displayValue(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "Not provided";
}

function recipients(): string[] {
  const configured = process.env.CAREERS_MAIL_TO || process.env.MAIL_TO || DEFAULT_RECIPIENT;
  const parsed = configured
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);

  return parsed.length ? parsed : [DEFAULT_RECIPIENT];
}

function buildPlainTextEmail(
  payload: ApplicationPayload,
  submittedAt: string,
  resume: File,
  cloudinaryUpload: CloudinaryUploadResult | null
): string {
  return [
    `Job Role: ${payload.jobRole}`,
    `Name: ${payload.fullName}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Portfolio: ${payload.portfolio}`,
    `Submitted At: ${submittedAt}`,
    "",
    "Message:",
    payload.message,
    "",
    "Resume Attachment:",
    `${resume.name} (${Math.round(resume.size / 1024)} KB)`,
    cloudinaryUpload?.secure_url ? `Cloudinary URL: ${cloudinaryUpload.secure_url}` : ""
  ]
    .filter(Boolean)
    .join("\n");
}

function buildHtmlEmail(
  payload: ApplicationPayload,
  submittedAt: string,
  resume: File,
  cloudinaryUpload: CloudinaryUploadResult | null
): string {
  const rows: Array<[string, string | undefined]> = [
    ["Job role", payload.jobRole],
    ["Name", payload.fullName],
    ["Email", payload.email],
    ["Phone", payload.phone],
    ["Portfolio", payload.portfolio],
    ["Submitted at", submittedAt],
    ["Resume", `${resume.name} (${Math.round(resume.size / 1024)} KB)`],
    ["Cloudinary URL", cloudinaryUpload?.secure_url]
  ];
  const tableRows = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) => `
        <tr>
          <td style="width:34%;padding:13px 16px;color:#776a58;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.09em;border-bottom:1px solid #ece3d3">${escapeHtml(label)}</td>
          <td style="padding:13px 16px;color:#181512;font-size:15px;font-weight:700;border-bottom:1px solid #ece3d3">${escapeHtml(displayValue(value))}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="margin:0;padding:0;background:#f8f3e8;color:#181512;font-family:Inter,Arial,sans-serif">
      <div style="padding:32px 16px">
        <div style="max-width:720px;margin:0 auto;overflow:hidden;border-radius:24px;border:1px solid #e3d4b7;background:#fffaf0;box-shadow:0 24px 72px rgba(23,18,15,.14)">
          <div style="background:#17120f;padding:28px 30px;color:#fff8ec">
            <p style="margin:0 0 8px;color:#d6b45f;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.14em">Ractysh recruitment desk</p>
            <h1 style="margin:0;font-size:25px;line-height:1.2;font-weight:700">New career application received</h1>
          </div>
          <table role="presentation" style="width:100%;border-collapse:collapse">${tableRows}</table>
          <div style="padding:26px 30px">
            <p style="margin:0 0 10px;color:#776a58;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.09em">Why this candidate wants to join Ractysh</p>
            <div style="white-space:pre-wrap;margin:0;color:#181512;font-size:15px;line-height:1.75">${escapeHtml(payload.message)}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function buildResumeAttachment(resume: File): Promise<ResendAttachment> {
  return {
    filename: resume.name,
    content: Buffer.from(await resume.arrayBuffer()).toString("base64"),
    content_type: resume.type || undefined
  };
}

function cloudinarySignature(params: Record<string, string>, apiSecret: string): string {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${serialized}${apiSecret}`).digest("hex");
}

async function uploadResumeToCloudinary(resume: File): Promise<CloudinaryUploadResult | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return null;

  const timestamp = String(Math.floor(Date.now() / 1000));
  const folder = process.env.CLOUDINARY_CAREERS_FOLDER || "ractysh-career-applications";
  const signature = cloudinarySignature({ folder, timestamp }, apiSecret);
  const uploadForm = new FormData();

  uploadForm.append("file", resume, resume.name);
  uploadForm.append("folder", folder);
  uploadForm.append("timestamp", timestamp);
  uploadForm.append("api_key", apiKey);
  uploadForm.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: uploadForm
  });

  if (!response.ok) {
    throw new Error(await response.text().catch(() => "Cloudinary upload failed."));
  }

  return (await response.json()) as CloudinaryUploadResult;
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { message: "Career applications must be submitted as multipart form data." },
        { status: 415 }
      );
    }

    const formData = await request.formData();
    const normalizedPayload = normalizeFormPayload(formData);
    const parsed = applicationSchema.safeParse(normalizedPayload);
    const resume = formData.get("resume");
    const uploadedResume = isUploadedFile(resume) ? resume : null;
    const resumeIssues = validateResume(uploadedResume);

    if (!parsed.success || resumeIssues.length || !uploadedResume) {
      const issues: ApiValidationIssue[] = [
        ...(parsed.success
          ? []
          : parsed.error.issues.map((issue) => ({
              path: issue.path.map(String),
              message: issue.message
            }))),
        ...resumeIssues
      ];

      return NextResponse.json(
        { message: "Please complete the required application fields.", issues },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { message: "Recruitment email delivery is not configured." },
        { status: 500 }
      );
    }

    let cloudinaryUpload: CloudinaryUploadResult | null = null;

    try {
      cloudinaryUpload = await uploadResumeToCloudinary(uploadedResume);
    } catch (error) {
      console.error("Cloudinary career resume upload failed:", error);
    }

    const submittedAt = new Date().toISOString();
    const attachment = await buildResumeAttachment(uploadedResume);
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.CAREERS_MAIL_FROM || process.env.MAIL_FROM || DEFAULT_FROM,
        to: recipients(),
        reply_to: parsed.data.email,
        subject: `New Ractysh Career Application - ${parsed.data.jobRole}`,
        text: buildPlainTextEmail(parsed.data, submittedAt, uploadedResume, cloudinaryUpload),
        html: buildHtmlEmail(parsed.data, submittedAt, uploadedResume, cloudinaryUpload),
        attachments: [attachment]
      })
    });

    if (!response.ok) {
      const resendError = await response.text().catch(() => "");
      console.error("Resend career application email failed:", resendError);

      return NextResponse.json(
        { message: "Unable to route application. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      message: "Application successfully routed to the recruitment desk.",
      submittedAt
    });
  } catch (error) {
    console.error("Career application route failed:", error);

    return NextResponse.json(
      { message: "Unable to route application. Please try again." },
      { status: 500 }
    );
  }
}
