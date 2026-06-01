import { Buffer } from "node:buffer";
import { NextResponse } from "next/server";
import { Resend, type Attachment } from "resend";
import { z } from "zod";
import {
  createFallbackConsultationRecord,
  updateFallbackConsultationNotification
} from "@/lib/consultationWorkflowFallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MAX_TOTAL_ATTACHMENT_SIZE = 35 * 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const DEFAULT_RECIPIENT = "kalandars2004@gmail.com";
const DEFAULT_FROM = "Ractysh Consultation Desk <onboarding@resend.dev>";
const DEFAULT_API_URL = "http://localhost:5000";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".dwg", ".dxf", ".ifc", ".rvt"];
const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/acad",
  "application/x-acad",
  "application/autocad_dwg",
  "application/x-autocad",
  "application/dwg",
  "application/x-dwg",
  "application/octet-stream"
];

const consultationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .max(120, "Name is too long."),
  emailAddress: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .max(180, "Email is too long.")
    .refine((value) => value.length === 0 || emailPattern.test(value), "Please enter a valid email."),
  companyName: z
    .string()
    .trim()
    .min(1, "Please enter your company.")
    .max(160, "Company is too long."),
  serviceType: z
    .string()
    .trim()
    .min(1, "Please select a consultation topic.")
    .max(120, "Consultation topic is too long."),
  projectDescription: z
    .string()
    .trim()
    .min(1, "Please enter your message.")
    .max(4000, "Message is too long."),
  phoneNumber: z.string().trim().max(40, "Phone number is too long.").optional(),
  budgetRange: z.string().trim().max(80, "Budget range is too long.").optional(),
  projectTimeline: z.string().trim().max(80, "Project timeline is too long.").optional(),
  preferredConsultationType: z.string().trim().max(80, "Consultation type is too long.").optional()
});

type ConsultationPayload = z.infer<typeof consultationSchema>;

type ApiValidationIssue = {
  path: string[];
  message: string;
};

type SubmissionNotification = {
  sent: boolean;
  skipped?: boolean;
  error?: string;
  sentAt?: string;
};

type ConsultationWorkflowRecord = {
  _id?: string;
  id?: string;
  trackingToken?: string;
  notification?: SubmissionNotification;
};

type BackendConsultationResponse = {
  message?: string;
  consultation?: ConsultationWorkflowRecord;
};

type WorkflowSubmissionResult = {
  consultation?: ConsultationWorkflowRecord;
  error?: string;
  fallback?: boolean;
};

function textFromFormData(formData: FormData, ...keys: string[]): string {
  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value === "string") return value;
  }

  return "";
}

function textFromJson(payload: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string") return value;
  }

  return "";
}

function isUploadedFile(value: FormDataEntryValue): value is File {
  return typeof value !== "string" && typeof value.name === "string" && value.name.length > 0 && value.size > 0;
}

function getUploadedFiles(formData: FormData | null): File[] {
  if (!formData) return [];
  return formData.getAll("requirementFiles").filter(isUploadedFile);
}

function validateFiles(files: File[]): ApiValidationIssue[] {
  if (files.length > MAX_FILES) {
    return [{ path: ["requirementFiles"], message: "Upload up to 5 files." }];
  }

  const tooLarge = files.find((file) => file.size > MAX_FILE_SIZE);
  if (tooLarge) {
    return [{ path: ["requirementFiles"], message: "Each file must be 15MB or less." }];
  }

  const totalSize = files.reduce((total, file) => total + file.size, 0);
  if (totalSize > MAX_TOTAL_ATTACHMENT_SIZE) {
    return [{ path: ["requirementFiles"], message: "Combined uploads must be 35MB or less." }];
  }

  const unsupported = files.find((file) => {
    const lowerName = file.name.toLowerCase();
    return (
      !file.type.startsWith("image/") &&
      !allowedMimeTypes.includes(file.type) &&
      !allowedExtensions.some((extension) => lowerName.endsWith(extension))
    );
  });

  if (unsupported) {
    return [{ path: ["requirementFiles"], message: "Upload PDFs, images or blueprint files only." }];
  }

  return [];
}

function normalizeFormPayload(formData: FormData): ConsultationPayload {
  return {
    fullName: textFromFormData(formData, "fullName", "name"),
    emailAddress: textFromFormData(formData, "emailAddress", "email"),
    companyName: textFromFormData(formData, "companyName", "company"),
    serviceType: textFromFormData(formData, "serviceType", "consultationTopic"),
    projectDescription: textFromFormData(formData, "projectDescription", "message"),
    phoneNumber: textFromFormData(formData, "phoneNumber", "phone"),
    budgetRange: textFromFormData(formData, "budgetRange"),
    projectTimeline: textFromFormData(formData, "projectTimeline"),
    preferredConsultationType: textFromFormData(formData, "preferredConsultationType")
  };
}

function normalizeJsonPayload(payload: Record<string, unknown>): ConsultationPayload {
  return {
    fullName: textFromJson(payload, "fullName", "name"),
    emailAddress: textFromJson(payload, "emailAddress", "email"),
    companyName: textFromJson(payload, "companyName", "company"),
    serviceType: textFromJson(payload, "serviceType", "consultationTopic"),
    projectDescription: textFromJson(payload, "projectDescription", "message"),
    phoneNumber: textFromJson(payload, "phoneNumber", "phone"),
    budgetRange: textFromJson(payload, "budgetRange"),
    projectTimeline: textFromJson(payload, "projectTimeline"),
    preferredConsultationType: textFromJson(payload, "preferredConsultationType")
  };
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

function buildPlainTextEmail(payload: ConsultationPayload, submittedAt: string, files: File[]): string {
  const lines = [
    `Name: ${payload.fullName}`,
    `Email: ${payload.emailAddress}`,
    `Company: ${payload.companyName}`,
    `Consultation Topic: ${payload.serviceType}`,
    "Message:",
    payload.projectDescription,
    `Submitted At: ${submittedAt}`
  ];

  const optionalRows: Array<[string, string | undefined]> = [
    ["Phone", payload.phoneNumber],
    ["Budget Range", payload.budgetRange],
    ["Project Timeline", payload.projectTimeline],
    ["Preferred Consultation Type", payload.preferredConsultationType]
  ];
  const optionalLines = optionalRows.filter(([, value]) => value);

  if (optionalLines.length) {
    lines.push(
      "",
      "Additional Context:",
      ...optionalLines.map(([label, value]) => `${label}: ${displayValue(value)}`)
    );
  }

  if (files.length) {
    lines.push("", "Attached Files:", ...files.map((file) => `${file.name} (${Math.round(file.size / 1024)} KB)`));
  }

  return lines.join("\n");
}

function buildHtmlEmail(payload: ConsultationPayload, submittedAt: string, files: File[]): string {
  const rowData: Array<[string, string | undefined]> = [
    ["Name", payload.fullName],
    ["Email", payload.emailAddress],
    ["Company", payload.companyName],
    ["Consultation Topic", payload.serviceType],
    ["Submitted At", submittedAt],
    ["Phone", payload.phoneNumber],
    ["Budget Range", payload.budgetRange],
    ["Project Timeline", payload.projectTimeline],
    ["Preferred Consultation Type", payload.preferredConsultationType]
  ];
  const rows = rowData
    .filter(([, value]) => value)
    .map(
      ([label, value]) => `
        <tr>
          <td style="width:34%;padding:13px 16px;color:#6f6a60;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #ece5d7">${escapeHtml(label)}</td>
          <td style="padding:13px 16px;color:#17243a;font-size:15px;font-weight:700;border-bottom:1px solid #ece5d7">${escapeHtml(displayValue(value))}</td>
        </tr>
      `
    )
    .join("");

  const fileList = files.length
    ? `<div style="margin-top:20px;padding:16px;border-radius:16px;background:#fbfaf6;border:1px solid #ece5d7">
        <p style="margin:0 0 10px;color:#6f6a60;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.09em">Attached files</p>
        <ul style="margin:0;padding-left:18px;color:#17243a;line-height:1.7">${files
          .map((file) => `<li>${escapeHtml(file.name)} (${Math.round(file.size / 1024)} KB)</li>`)
          .join("")}</ul>
      </div>`
    : "";

  return `
    <div style="margin:0;padding:0;background:#f8f6ef;color:#17243a;font-family:Inter,Arial,sans-serif">
      <div style="padding:32px 16px">
        <div style="max-width:720px;margin:0 auto;overflow:hidden;border-radius:24px;border:1px solid #e8deca;background:#fffefa;box-shadow:0 24px 72px rgba(23,36,58,.12)">
          <div style="background:#17243a;padding:28px 30px;color:#fff">
            <p style="margin:0 0 8px;color:#d8ba68;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.12em">Ractysh consultation desk</p>
            <h1 style="margin:0;font-size:25px;line-height:1.2;font-weight:700">New consultation request received</h1>
          </div>
          <table role="presentation" style="width:100%;border-collapse:collapse">${rows}</table>
          <div style="padding:26px 30px">
            <p style="margin:0 0 10px;color:#6f6a60;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.09em">Message</p>
            <div style="white-space:pre-wrap;margin:0;color:#17243a;font-size:15px;line-height:1.75">${escapeHtml(payload.projectDescription)}</div>
            ${fileList}
          </div>
        </div>
      </div>
    </div>
  `;
}

async function buildAttachments(files: File[]): Promise<Attachment[]> {
  return Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || undefined
    }))
  );
}

function mailRecipients(): string[] {
  const recipients = (process.env.MAIL_TO || DEFAULT_RECIPIENT)
    .split(",")
    .map((recipient) => recipient.trim())
    .filter((recipient) => emailPattern.test(recipient));

  return recipients.length ? recipients : [DEFAULT_RECIPIENT];
}

function getBackendApiUrl(): string {
  return (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, "");
}

function clientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || "anonymous";
}

function rateLimitRetryAfter(request: Request): number | null {
  const now = Date.now();
  const key = clientIdentifier(request);

  if (rateLimitBuckets.size > 1000) {
    for (const [bucketKey, bucket] of rateLimitBuckets) {
      if (bucket.resetAt <= now) rateLimitBuckets.delete(bucketKey);
    }
  }

  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS
    });
    return null;
  }

  bucket.count += 1;

  if (bucket.count <= RATE_LIMIT_MAX_REQUESTS) {
    return null;
  }

  return Math.ceil((bucket.resetAt - now) / 1000);
}

async function createWorkflowRecord(
  payload: ConsultationPayload,
  files: File[],
  skipNotification: boolean
): Promise<WorkflowSubmissionResult> {
  const apiUrl = getBackendApiUrl();
  const workflowForm = new FormData();

  workflowForm.append("fullName", payload.fullName);
  workflowForm.append("companyName", payload.companyName);
  workflowForm.append("emailAddress", payload.emailAddress);
  workflowForm.append("phoneNumber", payload.phoneNumber || "");
  workflowForm.append("serviceType", payload.serviceType);
  workflowForm.append("budgetRange", payload.budgetRange || "");
  workflowForm.append("projectTimeline", payload.projectTimeline || "");
  workflowForm.append("projectDescription", payload.projectDescription);
  workflowForm.append("preferredConsultationType", payload.preferredConsultationType || "Virtual Meeting");
  files.forEach((file) => workflowForm.append("requirementFiles", file, file.name));

  try {
    const requestInit: RequestInit = {
      method: "POST",
      body: workflowForm,
      signal: AbortSignal.timeout(12_000)
    };

    if (skipNotification) {
      requestInit.headers = {
        "x-ractysh-skip-notification": "true"
      };
    }

    const response = await fetch(`${apiUrl}/api/consultations`, {
      ...requestInit
    });
    const result = (await response.json().catch(() => ({}))) as BackendConsultationResponse;

    if (!response.ok || !result.consultation) {
      return {
        error: result.message || `Workflow API returned ${response.status}.`
      };
    }

    return { consultation: result.consultation };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Workflow API is unavailable."
    };
  }
}

export async function POST(request: Request) {
  try {
    const retryAfter = rateLimitRetryAfter(request);
    if (retryAfter) {
      return NextResponse.json(
        { message: "Too many consultation requests. Please try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter)
          }
        }
      );
    }

    const contentType = request.headers.get("content-type") || "";
    const isFormRequest =
      contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded");
    const formData = isFormRequest ? await request.formData() : null;
    const jsonPayload = formData ? null : ((await request.json().catch(() => ({}))) as Record<string, unknown>);
    const normalizedPayload = formData ? normalizeFormPayload(formData) : normalizeJsonPayload(jsonPayload || {});
    const parsed = consultationSchema.safeParse(normalizedPayload);
    const files = getUploadedFiles(formData);
    const fileIssues = validateFiles(files);

    if (!parsed.success || fileIssues.length) {
      const issues: ApiValidationIssue[] = [
        ...(parsed.success
          ? []
          : parsed.error.issues.map((issue) => ({
              path: issue.path.map(String),
              message: issue.message
            }))),
        ...fileIssues
      ];

      return NextResponse.json(
        { message: "Please complete the required consultation fields.", issues },
        { status: 400 }
      );
    }

    const submittedAt = new Date().toISOString();
    const apiKey = process.env.RESEND_API_KEY;
    let workflow = await createWorkflowRecord(parsed.data, files, Boolean(apiKey));

    if (workflow.error) {
      console.warn("Consultation workflow API unavailable; using local fallback record:", workflow.error);

      workflow = {
        consultation: createFallbackConsultationRecord(parsed.data, files, submittedAt, {
          sent: false,
          skipped: true,
          error: apiKey
            ? `Workflow API fallback activated: ${workflow.error}`
            : `Workflow API fallback activated and email delivery is not configured: ${workflow.error}`
        }),
        error: workflow.error,
        fallback: true
      };
    }

    const backendNotification = workflow.consultation?.notification;
    const notification: SubmissionNotification = backendNotification
      ? { ...backendNotification }
      : apiKey
      ? { sent: false }
      : {
          sent: false,
          skipped: true,
          error: "Email delivery is not configured."
        };
    let emailId: string | undefined;

    if (apiKey) {
      notification.sent = false;
      notification.skipped = false;
      try {
        const attachments = await buildAttachments(files);
        const resend = new Resend(apiKey);
        const email = await resend.emails.send({
          from: process.env.MAIL_FROM || DEFAULT_FROM,
          to: mailRecipients(),
          replyTo: parsed.data.emailAddress,
          subject: "New Ractysh Consultation Request",
          text: buildPlainTextEmail(parsed.data, submittedAt, files),
          html: buildHtmlEmail(parsed.data, submittedAt, files),
          attachments: attachments.length ? attachments : undefined,
          tags: [{ name: "source", value: "book-consultation" }]
        });

        if (email.error) {
          console.error("Resend consultation email failed:", email.error);
          notification.error = email.error.message || "Email delivery failed after workflow capture.";
        } else {
          notification.sent = true;
          notification.sentAt = new Date().toISOString();
          notification.error = undefined;
          emailId = email.data?.id;
        }
      } catch (emailError) {
        console.error("Resend consultation email failed:", emailError);
        notification.error = "Email delivery failed after workflow capture.";
      }
    }

    if (workflow.fallback) {
      const updatedFallback = updateFallbackConsultationNotification(
        workflow.consultation?._id || workflow.consultation?.id,
        notification
      );
      if (updatedFallback) workflow.consultation = updatedFallback;
    } else if (workflow.consultation) {
      workflow.consultation = {
        ...workflow.consultation,
        notification
      };
    }

    if (!notification.sent) {
      return NextResponse.json(
        {
          message: notification.skipped
            ? "Consultation email delivery is not configured."
            : "Unable to deliver consultation email.",
          submittedAt,
          consultation: workflow.consultation,
          workflow: {
            created: Boolean(workflow.consultation),
            fallback: Boolean(workflow.fallback),
            upstreamError: workflow.fallback ? workflow.error : undefined
          },
          notification
        },
        { status: notification.skipped ? 503 : 502 }
      );
    }

    return NextResponse.json(
      {
        message: "Your consultation request has been securely submitted.",
        submittedAt,
        emailId,
        consultation: workflow.consultation,
        workflow: {
          created: Boolean(workflow.consultation),
          fallback: Boolean(workflow.fallback),
          upstreamError: workflow.fallback ? workflow.error : undefined
        },
        notification
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Consultation email route failed:", error);

    return NextResponse.json(
      { message: "Unable to send request. Please try again." },
      { status: 500 }
    );
  }
}
