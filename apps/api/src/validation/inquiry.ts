import { z } from "zod";

function trimInput(value: unknown) {
  return typeof value === "string" ? value.trim() : value;
}

const requiredText = (message: string, max = 4000) =>
  z.preprocess(
    trimInput,
    z.string({ required_error: message, invalid_type_error: message }).min(1, message).max(max)
  );

const optionalText = (max = 4000) =>
  z.preprocess(
    trimInput,
    z
      .string()
      .max(max)
      .optional()
      .transform((value) => value ?? "")
  );

const email = z.preprocess(
  trimInput,
  z
    .string({ required_error: "Please enter your email.", invalid_type_error: "Please enter your email." })
    .min(1, "Please enter your email.")
    .email("Please enter a valid email.")
    .max(180)
);

export const contactInquirySchema = z.object({
  fullName: requiredText("Please enter your name.", 120),
  email,
  phone: optionalText(40),
  companyName: optionalText(160),
  interest: requiredText("Please select a coordination focus.", 140),
  message: requiredText("Please enter your message.", 4000)
});

export const demoInquirySchema = z.object({
  fullName: requiredText("Please enter your name.", 120),
  email,
  phone: optionalText(40),
  companyName: optionalText(160),
  discussionTopic: requiredText("Please select a discussion topic.", 140),
  message: optionalText(4000)
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;
export type DemoInquiryInput = z.infer<typeof demoInquirySchema>;
