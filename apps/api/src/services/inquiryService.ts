import { prisma } from "../lib/prisma.js";
import type { ContactInquiryInput, DemoInquiryInput } from "../validation/inquiry.js";

export type InquiryKind = "contact" | "book-demo";

export interface StoredInquiryResult {
  stored: boolean;
  id?: string;
  error?: string;
}

export type InquiryPayload =
  | (ContactInquiryInput & { kind: "contact" })
  | (DemoInquiryInput & { kind: "book-demo" });

export async function createInquiry(payload: InquiryPayload): Promise<StoredInquiryResult> {
  try {
    const record = await prisma.contactInquiry.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone || undefined,
        companyName: payload.companyName || undefined,
        interest: payload.kind === "contact" ? payload.interest : payload.discussionTopic,
        message:
          payload.kind === "contact"
            ? payload.message
            : payload.message || `Book demo request for ${payload.discussionTopic}.`,
        source: payload.kind,
        metadata: {
          kind: payload.kind,
          discussionTopic: payload.kind === "book-demo" ? payload.discussionTopic : undefined
        }
      }
    });

    return { stored: true, id: record.id };
  } catch (error) {
    console.error("Prisma inquiry persistence failed:", error);
    return {
      stored: false,
      error: error instanceof Error ? error.message : "Inquiry persistence failed."
    };
  }
}
