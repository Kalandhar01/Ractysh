import { z } from "zod";

export const consultationServiceTypes = [
  "Trade Operations",
  "Logistics Coordination",
  "Architecture Demo",
  "Architecture Consultation",
  "Interior Design",
  "Infrastructure Planning",
  "Turnkey Projects",
  "Enterprise Advisory"
] as const;

export const consultationTypes = ["Virtual Meeting", "Office Consultation", "Site Visit"] as const;

function trimInput(value: unknown) {
  return typeof value === "string" ? value.trim() : value;
}

const requiredText = (requiredMessage: string, minimumLength: number, minimumMessage: string, maximumLength: number) =>
  z.preprocess(
    trimInput,
    z
      .string({ required_error: requiredMessage, invalid_type_error: requiredMessage })
      .min(1, requiredMessage)
      .min(minimumLength, minimumMessage)
      .max(maximumLength)
  );

const optionalText = (maximumLength: number) =>
  z.preprocess(
    trimInput,
    z
      .string()
      .max(maximumLength)
      .optional()
      .transform((value) => value ?? "")
  );

const serviceInterestSchema = z.preprocess(
  trimInput,
  z
    .string({ required_error: "Please select a service interest.", invalid_type_error: "Please select a service interest." })
    .min(1, "Please select a service interest.")
    .refine((value) => consultationServiceTypes.includes(value as (typeof consultationServiceTypes)[number]), {
      message: "Please select a service interest."
    })
);

const preferredConsultationTypeSchema = z.preprocess(
  (value) => {
    const trimmed = trimInput(value);
    return trimmed === "" ? undefined : trimmed;
  },
  z.enum(consultationTypes).default("Virtual Meeting")
);

export const consultationSubmissionSchema = z.object({
  fullName: requiredText("Please enter your full name.", 3, "Full name must be at least 3 characters.", 120),
  companyName: optionalText(160),
  emailAddress: z.preprocess(
    trimInput,
    z
      .string({ required_error: "Please enter your email.", invalid_type_error: "Please enter your email." })
      .min(1, "Please enter your email.")
      .email("Please enter a valid email.")
      .max(180)
  ),
  phoneNumber: optionalText(40),
  serviceType: serviceInterestSchema,
  budgetRange: optionalText(80),
  projectTimeline: optionalText(80),
  projectDescription: requiredText(
    "Please enter your project details.",
    1,
    "Please enter your project details.",
    4000
  ),
  preferredConsultationType: preferredConsultationTypeSchema
});

export const consultationStatusSchema = z.object({
  status: z.enum(["new", "reviewed", "contacted", "archived"])
});

export const workflowStageKeySchema = z.enum([
  "consultation_submitted",
  "internal_review",
  "approval_verification",
  "strategy_discussion",
  "execution_planning",
  "project_kickoff"
]);

export const workflowStageStatusSchema = z.enum(["locked", "active", "waiting", "completed", "rejected"]);

export const workflowStageActionSchema = z
  .object({
    action: z.enum(["approve", "reject", "move_next", "add_note", "update_status"]),
    status: workflowStageStatusSchema.optional(),
    stateLabel: z.string().trim().min(2).max(120).optional(),
    notes: z.string().trim().max(2000).optional()
  })
  .superRefine((value, context) => {
    if (value.action === "update_status" && !value.status) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A workflow status is required for update_status actions.",
        path: ["status"]
      });
    }
  });

export type ConsultationSubmissionInput = z.infer<typeof consultationSubmissionSchema>;
export type WorkflowStageActionInput = z.infer<typeof workflowStageActionSchema>;
