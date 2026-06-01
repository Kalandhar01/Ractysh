import { NextResponse } from "next/server";
import { z } from "zod";
import { persistInquiry, sendInquiryEmail, type ContactInquiryPayload } from "@/lib/server/inquiryDelivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactSchema = z.object({
  fullName: z.string().trim().min(1, "Please enter your name.").max(120, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .max(180, "Email is too long.")
    .refine((value) => emailPattern.test(value), "Please enter a valid email."),
  phone: z.string().trim().max(40, "Phone number is too long.").optional(),
  companyName: z.string().trim().max(160, "Company is too long.").optional(),
  interest: z.string().trim().min(1, "Please select a coordination focus.").max(140, "Focus is too long."),
  message: z.string().trim().min(1, "Please enter your message.").max(4000, "Message is too long.")
});

function textFromFormData(formData: FormData, ...keys: string[]): string {
  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value === "string") return value;
  }

  return "";
}

async function requestPayload(request: Request): Promise<ContactInquiryPayload> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await request.formData();

    return {
      fullName: textFromFormData(formData, "fullName", "name"),
      email: textFromFormData(formData, "email", "emailAddress"),
      phone: textFromFormData(formData, "phone", "phoneNumber"),
      companyName: textFromFormData(formData, "companyName", "company"),
      interest: textFromFormData(formData, "interest", "service", "coordinationFocus"),
      message: textFromFormData(formData, "message")
    };
  }

  const json = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  return {
    fullName: typeof json.fullName === "string" ? json.fullName : typeof json.name === "string" ? json.name : "",
    email: typeof json.email === "string" ? json.email : "",
    phone: typeof json.phone === "string" ? json.phone : "",
    companyName: typeof json.companyName === "string" ? json.companyName : typeof json.company === "string" ? json.company : "",
    interest: typeof json.interest === "string" ? json.interest : typeof json.service === "string" ? json.service : "",
    message: typeof json.message === "string" ? json.message : ""
  };
}

export async function POST(request: Request) {
  try {
    const parsed = contactSchema.safeParse(await requestPayload(request));

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Please complete the required contact fields.",
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.map(String),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const submittedAt = new Date().toISOString();
    const hasAppRouterEmail = Boolean(process.env.RESEND_API_KEY);
    const backend = await persistInquiry("contact", parsed.data, hasAppRouterEmail);
    const notification = hasAppRouterEmail
      ? await sendInquiryEmail("contact", parsed.data, submittedAt, backend.id)
      : backend.notification || { sent: false, skipped: true, error: "RESEND_API_KEY is not configured." };

    if (!notification.sent) {
      return NextResponse.json(
        {
          message: notification.skipped ? "Contact email delivery is not configured." : "Unable to deliver contact inquiry email.",
          submittedAt,
          inquiry: {
            id: backend.id,
            stored: backend.stored,
            storageError: backend.error
          },
          notification
        },
        { status: notification.skipped ? 503 : 502 }
      );
    }

    return NextResponse.json(
      {
        message: "Inquiry successfully routed to the enterprise desk.",
        submittedAt,
        inquiry: {
          id: backend.id,
          stored: backend.stored,
          storageError: backend.error
        },
        notification
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact inquiry route failed:", error);

    return NextResponse.json({ message: "Unable to route inquiry. Please try again." }, { status: 500 });
  }
}
