import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type { AuthUser } from "../lib/auth.js";
import {
  workflowStepDefinitions,
  type AdminActionRecord,
  type ConsultationAttachment,
  type ConsultationNotification,
  type ConsultationRecord,
  type ConsultationStatus,
  type ConsultationWorkflowStage,
  type StatusHistoryRecord,
  type UploadedDocumentKind,
  type WorkflowAdminAction,
  type WorkflowLogRecord,
  type WorkflowStageKey,
  type WorkflowStageStatus
} from "../types/consultation.js";
import type { ConsultationSubmissionInput, WorkflowStageActionInput } from "../validation/consultation.js";
import { publishConsultationUpdate } from "./consultationWorkflowEvents.js";

type WorkflowActor = Pick<AuthUser, "id" | "email" | "role">;

const consultationInclude = {
  workflowStages: true,
  workflowLogs: true,
  uploadedDocuments: true,
  adminActions: true,
  statusHistory: true
} satisfies Prisma.ConsultationInclude;

type ConsultationWithRelations = Prisma.ConsultationGetPayload<{
  include: typeof consultationInclude;
}>;

let prismaEnabled = false;
let memoryConsultations: ConsultationRecord[] = [];

export function setConsultationPrismaEnabled(value: boolean): void {
  prismaEnabled = value;
}

function iso(value: Date | string | null | undefined): string | undefined {
  if (!value) return undefined;
  return new Date(value).toISOString();
}

function stageLabelFor(status: WorkflowStageStatus): string {
  if (status === "active") return "Waiting for Approval";
  if (status === "completed") return "Completed";
  if (status === "rejected") return "Rejected";
  if (status === "waiting") return "Waiting";
  return "Locked";
}

function appendAdminNote(existing: string | null | undefined, note: string | undefined, actor: WorkflowActor, now: Date): string | undefined {
  if (!note) return existing || undefined;

  const nextLine = `[${now.toISOString()}] ${actor.email}: ${note}`;
  return existing ? `${existing}\n${nextLine}` : nextLine;
}

function defaultWorkflowStages(now: Date): ConsultationWorkflowStage[] {
  return workflowStepDefinitions.map((step, index) => {
    const isSubmitted = step.key === "consultation_submitted";
    const isInternalReview = step.key === "internal_review";
    const status: WorkflowStageStatus = isSubmitted ? "completed" : isInternalReview ? "active" : "locked";

    return {
      id: randomUUID(),
      key: step.key,
      title: step.title,
      description: step.description,
      position: index + 1,
      status,
      stateLabel: stageLabelFor(status),
      startedAt: isSubmitted || isInternalReview ? now.toISOString() : undefined,
      unlockedAt: isSubmitted || isInternalReview ? now.toISOString() : undefined,
      completedAt: isSubmitted ? now.toISOString() : undefined,
      rejectedAt: undefined,
      updatedAt: now.toISOString(),
      responseDocuments: []
    };
  });
}

function defaultWorkflowStageRows(consultationId: string, now: Date) {
  return workflowStepDefinitions.map((step, index) => {
    const isSubmitted = step.key === "consultation_submitted";
    const isInternalReview = step.key === "internal_review";
    const status: WorkflowStageStatus = isSubmitted ? "completed" : isInternalReview ? "active" : "locked";

    return {
      consultationId,
      key: step.key,
      title: step.title,
      description: step.description,
      position: index + 1,
      status,
      stateLabel: stageLabelFor(status),
      startedAt: isSubmitted || isInternalReview ? now : undefined,
      unlockedAt: isSubmitted || isInternalReview ? now : undefined,
      completedAt: isSubmitted ? now : undefined
    };
  });
}

function mapDocument(document: ConsultationWithRelations["uploadedDocuments"][number]): ConsultationAttachment {
  return {
    id: document.id,
    filename: document.filename,
    mimeType: document.mimeType,
    size: document.size,
    url: document.url || undefined,
    provider: (document.provider as ConsultationAttachment["provider"]) || "metadata",
    providerId: document.providerId || undefined,
    kind: document.kind as UploadedDocumentKind,
    stageKey: document.stageKey || undefined,
    uploadedBy: document.uploadedBy,
    createdAt: iso(document.createdAt)
  };
}

function mapWorkflowStage(
  stage: ConsultationWithRelations["workflowStages"][number],
  documents: ConsultationAttachment[]
): ConsultationWorkflowStage {
  return {
    id: stage.id,
    key: stage.key,
    title: stage.title,
    description: stage.description,
    position: stage.position,
    status: stage.status,
    stateLabel: stage.stateLabel,
    adminNotes: stage.adminNotes || undefined,
    startedAt: iso(stage.startedAt),
    unlockedAt: iso(stage.unlockedAt),
    completedAt: iso(stage.completedAt),
    rejectedAt: iso(stage.rejectedAt),
    updatedAt: iso(stage.updatedAt) || new Date().toISOString(),
    responseDocuments: documents.filter((document) => document.kind === "response" && document.stageKey === stage.key)
  };
}

function mapWorkflowLog(log: ConsultationWithRelations["workflowLogs"][number]): WorkflowLogRecord {
  return {
    id: log.id,
    consultationId: log.consultationId,
    stageId: log.stageId || undefined,
    stageKey: log.stageKey || undefined,
    action: log.action,
    actorId: log.actorId || undefined,
    actorEmail: log.actorEmail || undefined,
    actorRole: log.actorRole || undefined,
    note: log.note || undefined,
    createdAt: iso(log.createdAt) || new Date().toISOString()
  };
}

function mapStatusHistory(history: ConsultationWithRelations["statusHistory"][number]): StatusHistoryRecord {
  return {
    id: history.id,
    consultationId: history.consultationId,
    stageId: history.stageId || undefined,
    stageKey: history.stageKey || undefined,
    fromStatus: history.fromStatus || undefined,
    toStatus: history.toStatus,
    label: history.label || undefined,
    changedBy: history.changedBy || undefined,
    note: history.note || undefined,
    createdAt: iso(history.createdAt) || new Date().toISOString()
  };
}

function mapAdminAction(action: ConsultationWithRelations["adminActions"][number]): AdminActionRecord {
  return {
    id: action.id,
    consultationId: action.consultationId,
    stageId: action.stageId || undefined,
    stageKey: action.stageKey || undefined,
    action: action.action,
    statusBefore: action.statusBefore || undefined,
    statusAfter: action.statusAfter || undefined,
    notes: action.notes || undefined,
    adminId: action.adminId || undefined,
    adminEmail: action.adminEmail || undefined,
    createdAt: iso(action.createdAt) || new Date().toISOString()
  };
}

function mapConsultation(record: ConsultationWithRelations): ConsultationRecord {
  const documents = [...record.uploadedDocuments]
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map(mapDocument);
  const workflowStages = [...record.workflowStages]
    .sort((a, b) => a.position - b.position)
    .map((stage) => mapWorkflowStage(stage, documents));

  return {
    _id: record.id,
    id: record.id,
    trackingToken: record.trackingToken,
    fullName: record.fullName,
    companyName: record.companyName,
    emailAddress: record.emailAddress,
    phoneNumber: record.phoneNumber,
    serviceType: record.serviceType as ConsultationSubmissionInput["serviceType"],
    budgetRange: record.budgetRange,
    projectTimeline: record.projectTimeline,
    projectDescription: record.projectDescription,
    preferredConsultationType: record.preferredConsultationType as ConsultationSubmissionInput["preferredConsultationType"],
    attachments: documents.filter((document) => document.kind === "submission"),
    documents,
    workflowStages,
    logs: [...record.workflowLogs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(mapWorkflowLog),
    statusHistory: [...record.statusHistory]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map(mapStatusHistory),
    adminActions: [...record.adminActions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(mapAdminAction),
    currentStageKey: record.currentStageKey,
    status: record.status,
    source: record.source,
    notification: {
      sent: record.notificationSent,
      skipped: record.notificationSkipped || undefined,
      error: record.notificationError || undefined,
      sentAt: iso(record.notificationSentAt)
    },
    createdAt: iso(record.createdAt) || new Date().toISOString(),
    updatedAt: iso(record.updatedAt) || new Date().toISOString()
  };
}

function normalizeMemoryRecord(record: ConsultationRecord): ConsultationRecord {
  return {
    ...record,
    attachments: record.attachments.map((attachment) => ({ ...attachment })),
    documents: record.documents.map((document) => ({ ...document })),
    workflowStages: record.workflowStages.map((stage) => ({
      ...stage,
      responseDocuments: stage.responseDocuments.map((document) => ({ ...document }))
    })),
    logs: record.logs.map((log) => ({ ...log })),
    statusHistory: record.statusHistory.map((history) => ({ ...history })),
    adminActions: record.adminActions.map((action) => ({ ...action }))
  };
}

async function findPrismaConsultation(id: string): Promise<ConsultationRecord | null> {
  const record = await prisma.consultation.findUnique({
    where: { id },
    include: consultationInclude
  });

  return record ? mapConsultation(record) : null;
}

export async function createConsultation(
  input: ConsultationSubmissionInput & { attachments: ConsultationAttachment[]; source: string }
): Promise<ConsultationRecord> {
  const now = new Date();

  if (!prismaEnabled) {
    const id = randomUUID();
    const stages = defaultWorkflowStages(now);
    const submittedStage = stages.find((stage) => stage.key === "consultation_submitted");
    const documents = input.attachments.map((attachment) => ({
      ...attachment,
      id: randomUUID(),
      kind: "submission" as const,
      stageKey: "consultation_submitted" as const,
      uploadedBy: "client",
      createdAt: now.toISOString()
    }));
    const record: ConsultationRecord = {
      ...input,
      _id: id,
      id,
      trackingToken: randomUUID(),
      status: "new",
      currentStageKey: "internal_review",
      attachments: documents,
      documents,
      workflowStages: stages.map((stage) =>
        stage.key === submittedStage?.key ? { ...stage, responseDocuments: [] } : stage
      ),
      logs: [
        {
          id: randomUUID(),
          consultationId: id,
          stageId: submittedStage?.id,
          stageKey: "consultation_submitted",
          action: "submitted",
          actorRole: "client",
          note: "Consultation documents submitted by client.",
          createdAt: now.toISOString()
        }
      ],
      statusHistory: [
        {
          id: randomUUID(),
          consultationId: id,
          stageId: submittedStage?.id,
          stageKey: "consultation_submitted",
          toStatus: "completed",
          label: "Consultation Submitted",
          changedBy: "client",
          createdAt: now.toISOString()
        },
        {
          id: randomUUID(),
          consultationId: id,
          stageKey: "internal_review",
          toStatus: "active",
          label: "Waiting for Approval",
          changedBy: "system",
          createdAt: now.toISOString()
        }
      ],
      adminActions: [],
      notification: { sent: false, skipped: true },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    memoryConsultations = [record, ...memoryConsultations].slice(0, 200);
    publishConsultationUpdate(id);
    return normalizeMemoryRecord(record);
  }

  const createdId = await prisma.$transaction(async (tx) => {
    const consultation = await tx.consultation.create({
      data: {
        fullName: input.fullName,
        companyName: input.companyName,
        emailAddress: input.emailAddress,
        phoneNumber: input.phoneNumber,
        serviceType: input.serviceType,
        budgetRange: input.budgetRange,
        projectTimeline: input.projectTimeline,
        projectDescription: input.projectDescription,
        preferredConsultationType: input.preferredConsultationType,
        source: input.source,
        status: "new",
        currentStageKey: "internal_review"
      }
    });

    await tx.workflowStage.createMany({
      data: defaultWorkflowStageRows(consultation.id, now)
    });

    const submittedStage = await tx.workflowStage.findUnique({
      where: {
        consultationId_key: {
          consultationId: consultation.id,
          key: "consultation_submitted"
        }
      }
    });
    const internalReviewStage = await tx.workflowStage.findUnique({
      where: {
        consultationId_key: {
          consultationId: consultation.id,
          key: "internal_review"
        }
      }
    });

    if (input.attachments.length) {
      await tx.uploadedDocument.createMany({
        data: input.attachments.map((attachment) => ({
          consultationId: consultation.id,
          stageId: submittedStage?.id,
          stageKey: "consultation_submitted",
          kind: "submission",
          filename: attachment.filename,
          mimeType: attachment.mimeType,
          size: attachment.size,
          url: attachment.url,
          provider: attachment.provider || "metadata",
          providerId: attachment.providerId,
          uploadedBy: "client"
        }))
      });
    }

    await tx.workflowLog.create({
      data: {
        consultationId: consultation.id,
        stageId: submittedStage?.id,
        stageKey: "consultation_submitted",
        action: "submitted",
        actorRole: "client",
        note: "Consultation documents submitted by client."
      }
    });
    await tx.statusHistory.createMany({
      data: [
        {
          consultationId: consultation.id,
          stageId: submittedStage?.id,
          stageKey: "consultation_submitted",
          toStatus: "completed",
          label: "Consultation Submitted",
          changedBy: "client"
        },
        {
          consultationId: consultation.id,
          stageId: internalReviewStage?.id,
          stageKey: "internal_review",
          toStatus: "active",
          label: "Waiting for Approval",
          changedBy: "system"
        }
      ]
    });

    return consultation.id;
  });

  const record = await findPrismaConsultation(createdId);
  if (!record) throw new Error("Consultation workflow could not be loaded after creation.");

  publishConsultationUpdate(createdId);
  return record;
}

export async function listConsultations(): Promise<ConsultationRecord[]> {
  if (!prismaEnabled) {
    return memoryConsultations.map(normalizeMemoryRecord);
  }

  const records = await prisma.consultation.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: consultationInclude
  });

  return records.map(mapConsultation);
}

export async function getConsultationWorkflow(
  id: string,
  trackingToken?: string
): Promise<ConsultationRecord | null> {
  if (!prismaEnabled) {
    const record = memoryConsultations.find((item) => item._id === id || item.id === id);
    if (!record) return null;
    if (trackingToken && record.trackingToken !== trackingToken) return null;
    return normalizeMemoryRecord(record);
  }

  const record = await findPrismaConsultation(id);
  if (!record) return null;
  if (trackingToken && record.trackingToken !== trackingToken) return null;
  return record;
}

export async function updateConsultationStatus(
  id: string,
  status: ConsultationStatus,
  actor?: WorkflowActor
): Promise<ConsultationRecord | null> {
  const now = new Date();

  if (!prismaEnabled) {
    let updated: ConsultationRecord | null = null;
    memoryConsultations = memoryConsultations.map((record) => {
      if (record._id !== id && record.id !== id) return record;

      updated = {
        ...record,
        status,
        updatedAt: now.toISOString(),
        statusHistory: [
          {
            id: randomUUID(),
            consultationId: record.id,
            fromStatus: record.status,
            toStatus: status,
            label: "Consultation status updated",
            changedBy: actor?.email || "admin",
            createdAt: now.toISOString()
          },
          ...record.statusHistory
        ]
      };
      return updated;
    });

    const result = updated as ConsultationRecord | null;
    if (result) publishConsultationUpdate(result.id);
    return result ? normalizeMemoryRecord(result) : null;
  }

  const updatedId = await prisma.$transaction(async (tx) => {
    const current = await tx.consultation.findUnique({ where: { id } });
    if (!current) return null;

    await tx.consultation.update({
      where: { id },
      data: { status }
    });
    await tx.statusHistory.create({
      data: {
        consultationId: id,
        fromStatus: current.status,
        toStatus: status,
        label: "Consultation status updated",
        changedBy: actor?.email || "admin"
      }
    });

    return id;
  });

  if (!updatedId) return null;

  const record = await findPrismaConsultation(updatedId);
  publishConsultationUpdate(updatedId);
  return record;
}

export async function updateConsultationNotification(
  id: string | undefined,
  notification: ConsultationNotification
): Promise<void> {
  if (!id) return;

  if (!prismaEnabled) {
    memoryConsultations = memoryConsultations.map((record) =>
      record._id === id || record.id === id
        ? {
            ...record,
            notification,
            updatedAt: new Date().toISOString()
          }
        : record
    );
    publishConsultationUpdate(id);
    return;
  }

  await prisma.consultation.update({
    where: { id },
    data: {
      notificationSent: notification.sent,
      notificationSkipped: Boolean(notification.skipped),
      notificationError: notification.error,
      notificationSentAt: notification.sentAt ? new Date(notification.sentAt) : undefined
    }
  });
  publishConsultationUpdate(id);
}

function updateMemoryWorkflow(
  record: ConsultationRecord,
  stageKey: WorkflowStageKey,
  input: WorkflowStageActionInput,
  actor: WorkflowActor
): ConsultationRecord {
  const now = new Date();
  const stages = record.workflowStages.map((stage) => ({
    ...stage,
    responseDocuments: stage.responseDocuments.map((document) => ({ ...document }))
  }));
  const targetIndex = stages.findIndex((stage) => stage.key === stageKey);
  const target = stages[targetIndex];

  if (!target) return record;

  const before = target.status;
  let after = before;
  let currentStageKey = record.currentStageKey;
  let consultationStatus = record.status;

  if (input.action === "approve" || input.action === "move_next") {
    stages[targetIndex] = {
      ...target,
      status: "completed",
      stateLabel: "Completed",
      adminNotes: appendAdminNote(target.adminNotes, input.notes, actor, now),
      completedAt: now.toISOString(),
      rejectedAt: undefined,
      updatedAt: now.toISOString()
    };
    after = "completed";

    const nextIndex = stages.findIndex((stage) => stage.position > target.position && stage.status !== "completed");
    const next = stages[nextIndex];
    if (next) {
      stages[nextIndex] = {
        ...next,
        status: "active",
        stateLabel: "Waiting for Approval",
        startedAt: next.startedAt || now.toISOString(),
        unlockedAt: next.unlockedAt || now.toISOString(),
        rejectedAt: undefined,
        updatedAt: now.toISOString()
      };
      currentStageKey = next.key;
    } else {
      currentStageKey = target.key;
    }

    if (target.key === "internal_review" && consultationStatus === "new") {
      consultationStatus = "reviewed";
    }
  }

  if (input.action === "reject") {
    stages[targetIndex] = {
      ...target,
      status: "rejected",
      stateLabel: "Rejected",
      adminNotes: appendAdminNote(target.adminNotes, input.notes, actor, now),
      rejectedAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    after = "rejected";
  }

  if (input.action === "add_note") {
    stages[targetIndex] = {
      ...target,
      adminNotes: appendAdminNote(target.adminNotes, input.notes, actor, now),
      updatedAt: now.toISOString()
    };
  }

  if (input.action === "update_status" && input.status) {
    stages[targetIndex] = {
      ...target,
      status: input.status,
      stateLabel: input.stateLabel || stageLabelFor(input.status),
      adminNotes: appendAdminNote(target.adminNotes, input.notes, actor, now),
      startedAt: ["active", "waiting"].includes(input.status) ? target.startedAt || now.toISOString() : target.startedAt,
      unlockedAt: ["active", "waiting"].includes(input.status) ? target.unlockedAt || now.toISOString() : target.unlockedAt,
      completedAt: input.status === "completed" ? now.toISOString() : target.completedAt,
      rejectedAt: input.status === "rejected" ? now.toISOString() : target.rejectedAt,
      updatedAt: now.toISOString()
    };
    after = input.status;
    if (input.status === "active" || input.status === "waiting") currentStageKey = target.key;
  }

  const action: AdminActionRecord = {
    id: randomUUID(),
    consultationId: record.id,
    stageId: target.id,
    stageKey: target.key,
    action: input.action as WorkflowAdminAction,
    statusBefore: before,
    statusAfter: after,
    notes: input.notes,
    adminId: actor.id,
    adminEmail: actor.email,
    createdAt: now.toISOString()
  };
  const history: StatusHistoryRecord | null =
    before !== after
      ? {
          id: randomUUID(),
          consultationId: record.id,
          stageId: target.id,
          stageKey: target.key,
          fromStatus: before,
          toStatus: after,
          label: stages[targetIndex]?.stateLabel || stageLabelFor(after),
          changedBy: actor.email,
          note: input.notes,
          createdAt: now.toISOString()
        }
      : null;

  return {
    ...record,
    status: consultationStatus,
    currentStageKey,
    workflowStages: stages,
    adminActions: [action, ...record.adminActions],
    logs: [
      {
        id: randomUUID(),
        consultationId: record.id,
        stageId: target.id,
        stageKey: target.key,
        action: input.action,
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        note: input.notes,
        createdAt: now.toISOString()
      },
      ...record.logs
    ],
    statusHistory: history ? [history, ...record.statusHistory] : record.statusHistory,
    updatedAt: now.toISOString()
  };
}

export async function updateWorkflowStage(
  id: string,
  stageKey: WorkflowStageKey,
  input: WorkflowStageActionInput,
  actor: WorkflowActor
): Promise<ConsultationRecord | null> {
  if (!prismaEnabled) {
    let updated: ConsultationRecord | null = null;
    memoryConsultations = memoryConsultations.map((record) => {
      if (record._id !== id && record.id !== id) return record;
      updated = updateMemoryWorkflow(record, stageKey, input, actor);
      return updated;
    });

    const result = updated as ConsultationRecord | null;
    if (result) publishConsultationUpdate(result.id);
    return result ? normalizeMemoryRecord(result) : null;
  }

  const updatedId = await prisma.$transaction(async (tx) => {
    const consultation = await tx.consultation.findUnique({
      where: { id },
      include: { workflowStages: true }
    });
    if (!consultation) return null;

    const now = new Date();
    const stages = [...consultation.workflowStages].sort((a, b) => a.position - b.position);
    const target = stages.find((stage) => stage.key === stageKey);
    if (!target) return null;

    const before = target.status;
    let after: WorkflowStageStatus = before;
    let currentStageKey = consultation.currentStageKey;
    let consultationStatus: ConsultationStatus = consultation.status;
    const adminNotes = appendAdminNote(target.adminNotes, input.notes, actor, now);

    if (input.action === "approve" || input.action === "move_next") {
      after = "completed";
      await tx.workflowStage.update({
        where: { id: target.id },
        data: {
          status: "completed",
          stateLabel: "Completed",
          adminNotes,
          completedAt: now,
          rejectedAt: null
        }
      });

      const next = stages.find((stage) => stage.position > target.position && stage.status !== "completed");
      if (next) {
        await tx.workflowStage.update({
          where: { id: next.id },
          data: {
            status: "active",
            stateLabel: "Waiting for Approval",
            startedAt: next.startedAt || now,
            unlockedAt: next.unlockedAt || now,
            rejectedAt: null
          }
        });
        await tx.statusHistory.create({
          data: {
            consultationId: id,
            stageId: next.id,
            stageKey: next.key,
            fromStatus: next.status,
            toStatus: "active",
            label: "Waiting for Approval",
            changedBy: "system",
            note: `Unlocked after ${target.title}.`
          }
        });
        currentStageKey = next.key;
      } else {
        currentStageKey = target.key;
      }

      if (target.key === "internal_review" && consultationStatus === "new") {
        consultationStatus = "reviewed";
      }
    }

    if (input.action === "reject") {
      after = "rejected";
      await tx.workflowStage.update({
        where: { id: target.id },
        data: {
          status: "rejected",
          stateLabel: "Rejected",
          adminNotes,
          rejectedAt: now
        }
      });
    }

    if (input.action === "add_note") {
      await tx.workflowStage.update({
        where: { id: target.id },
        data: { adminNotes }
      });
    }

    if (input.action === "update_status" && input.status) {
      after = input.status;
      const isLive = input.status === "active" || input.status === "waiting";
      if (isLive) currentStageKey = target.key;

      await tx.workflowStage.update({
        where: { id: target.id },
        data: {
          status: input.status,
          stateLabel: input.stateLabel || stageLabelFor(input.status),
          adminNotes,
          startedAt: isLive ? target.startedAt || now : target.startedAt,
          unlockedAt: isLive ? target.unlockedAt || now : target.unlockedAt,
          completedAt: input.status === "completed" ? now : target.completedAt,
          rejectedAt: input.status === "rejected" ? now : target.rejectedAt
        }
      });
    }

    await tx.consultation.update({
      where: { id },
      data: {
        currentStageKey,
        status: consultationStatus
      }
    });

    await tx.adminAction.create({
      data: {
        consultationId: id,
        stageId: target.id,
        stageKey: target.key,
        action: input.action as WorkflowAdminAction,
        statusBefore: before,
        statusAfter: after,
        notes: input.notes,
        adminId: actor.id,
        adminEmail: actor.email
      }
    });
    await tx.workflowLog.create({
      data: {
        consultationId: id,
        stageId: target.id,
        stageKey: target.key,
        action: input.action,
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        note: input.notes
      }
    });

    if (before !== after) {
      await tx.statusHistory.create({
        data: {
          consultationId: id,
          stageId: target.id,
          stageKey: target.key,
          fromStatus: before,
          toStatus: after,
          label: input.stateLabel || stageLabelFor(after),
          changedBy: actor.email,
          note: input.notes
        }
      });
    }

    return id;
  });

  if (!updatedId) return null;

  const record = await findPrismaConsultation(updatedId);
  publishConsultationUpdate(updatedId);
  return record;
}

export async function addWorkflowResponseDocuments(
  id: string,
  stageKey: WorkflowStageKey,
  documents: ConsultationAttachment[],
  actor: WorkflowActor
): Promise<ConsultationRecord | null> {
  if (!documents.length) {
    return getConsultationWorkflow(id);
  }

  const now = new Date();

  if (!prismaEnabled) {
    let updated: ConsultationRecord | null = null;
    memoryConsultations = memoryConsultations.map((record) => {
      if (record._id !== id && record.id !== id) return record;

      const stage = record.workflowStages.find((item) => item.key === stageKey);
      if (!stage) return record;

      const responseDocuments = documents.map((document) => ({
        ...document,
        id: randomUUID(),
        kind: "response" as const,
        stageKey,
        uploadedBy: actor.email,
        createdAt: now.toISOString()
      }));

      updated = {
        ...record,
        documents: [...record.documents, ...responseDocuments],
        workflowStages: record.workflowStages.map((item) =>
          item.key === stageKey
            ? {
                ...item,
                responseDocuments: [...item.responseDocuments, ...responseDocuments],
                updatedAt: now.toISOString()
              }
            : item
        ),
        adminActions: [
          {
            id: randomUUID(),
            consultationId: record.id,
            stageId: stage.id,
            stageKey,
            action: "upload_response",
            notes: `${responseDocuments.length} response document(s) uploaded.`,
            adminId: actor.id,
            adminEmail: actor.email,
            createdAt: now.toISOString()
          },
          ...record.adminActions
        ],
        logs: [
          {
            id: randomUUID(),
            consultationId: record.id,
            stageId: stage.id,
            stageKey,
            action: "upload_response",
            actorId: actor.id,
            actorEmail: actor.email,
            actorRole: actor.role,
            note: `${responseDocuments.length} response document(s) uploaded.`,
            createdAt: now.toISOString()
          },
          ...record.logs
        ],
        updatedAt: now.toISOString()
      };

      return updated;
    });

    const result = updated as ConsultationRecord | null;
    if (result) publishConsultationUpdate(result.id);
    return result ? normalizeMemoryRecord(result) : null;
  }

  const updatedId = await prisma.$transaction(async (tx) => {
    const stage = await tx.workflowStage.findUnique({
      where: {
        consultationId_key: {
          consultationId: id,
          key: stageKey
        }
      }
    });
    if (!stage) return null;

    await tx.uploadedDocument.createMany({
      data: documents.map((document) => ({
        consultationId: id,
        stageId: stage.id,
        stageKey,
        kind: "response",
        filename: document.filename,
        mimeType: document.mimeType,
        size: document.size,
        url: document.url,
        provider: document.provider || "metadata",
        providerId: document.providerId,
        uploadedBy: actor.email
      }))
    });
    await tx.adminAction.create({
      data: {
        consultationId: id,
        stageId: stage.id,
        stageKey,
        action: "upload_response",
        notes: `${documents.length} response document(s) uploaded.`,
        adminId: actor.id,
        adminEmail: actor.email
      }
    });
    await tx.workflowLog.create({
      data: {
        consultationId: id,
        stageId: stage.id,
        stageKey,
        action: "upload_response",
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        note: `${documents.length} response document(s) uploaded.`
      }
    });

    return id;
  });

  if (!updatedId) return null;

  const record = await findPrismaConsultation(updatedId);
  publishConsultationUpdate(updatedId);
  return record;
}
