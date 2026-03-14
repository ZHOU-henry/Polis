import { prisma } from "../lib/prisma.js";

type EngagementScaffoldDb = Pick<
  typeof prisma,
  | "engagementMilestone"
  | "engagementDeliverable"
  | "engagementReview"
  | "engagementAgreement"
  | "engagementQuoteItem"
  | "engagementCommercialDecision"
  | "engagementCustomerConfirmation"
>;

type EngagementScaffoldMode = "live" | "demo";

type EngagementScaffoldParams = {
  engagementId: string;
  taskRequestId: string;
  mode?: EngagementScaffoldMode;
};

function getScaffoldTemplates(
  taskRequestId: string,
  mode: EngagementScaffoldMode
) {
  const milestones =
    mode === "demo"
      ? [
          {
            id: `milestone-${taskRequestId}-kickoff`,
            title: "Kickoff alignment",
            summary:
              "Confirm the customer goal, success boundary, and first deployment scope.",
            status: "completed",
            dueLabel: "day 1"
          },
          {
            id: `milestone-${taskRequestId}-scoping`,
            title: "Delivery scoping",
            summary:
              "Freeze the first pilot boundary, data assumptions, and operator touchpoints.",
            status: "in_progress",
            dueLabel: "week 1"
          },
          {
            id: `milestone-${taskRequestId}-pilot`,
            title: "Pilot build",
            summary:
              "Ship the first scenario-specific pilot slice for operator validation.",
            status: "planned",
            dueLabel: "week 2-3"
          }
        ]
      : [
          {
            id: `milestone-${taskRequestId}-kickoff`,
            title: "Kickoff alignment",
            summary:
              "Lock the customer objective, pilot boundary, and operating owner before delivery begins.",
            status: "in_progress",
            dueLabel: "next 3 days"
          },
          {
            id: `milestone-${taskRequestId}-scoping`,
            title: "Delivery scoping",
            summary:
              "Translate the accepted response into a bounded first-phase scope and rollout plan.",
            status: "planned",
            dueLabel: "week 1"
          },
          {
            id: `milestone-${taskRequestId}-pilot`,
            title: "Pilot build",
            summary:
              "Prepare the first customer-visible pilot slice for validation with operators.",
            status: "planned",
            dueLabel: "week 2-4"
          }
        ];

  const deliverables =
    mode === "demo"
      ? [
          {
            id: `deliverable-${taskRequestId}-scope`,
            title: "Pilot scope brief",
            summary:
              "Define the first bounded delivery scope, rollout limits, and operator touchpoints.",
            artifactType: "brief",
            status: "approved"
          },
          {
            id: `deliverable-${taskRequestId}-workflow`,
            title: "Workflow prototype",
            summary:
              "The first runnable workflow artifact for customer-side evaluation.",
            artifactType: "prototype",
            status: "in_review"
          }
        ]
      : [
          {
            id: `deliverable-${taskRequestId}-scope`,
            title: "Pilot scope brief",
            summary:
              "Capture the first delivery boundary, success measures, and implementation assumptions.",
            artifactType: "brief",
            status: "planned"
          },
          {
            id: `deliverable-${taskRequestId}-workflow`,
            title: "Workflow prototype",
            summary:
              "Build the first reviewable workflow or interaction prototype tied to the accepted response.",
            artifactType: "prototype",
            status: "planned"
          }
        ];

  const reviews =
    mode === "demo"
      ? [
          {
            id: `review-${taskRequestId}-scope`,
            verdict: "approved",
            notes:
              "Scope is tight enough for a first pilot and aligned with the customer's actual operating pain.",
            deliverableId: `deliverable-${taskRequestId}-scope`
          },
          {
            id: `review-${taskRequestId}-workflow`,
            verdict: "needs_work",
            notes:
              "Workflow prototype is promising, but operator explanations still need sharper language before rollout.",
            deliverableId: `deliverable-${taskRequestId}-workflow`
          }
        ]
      : [];

  const agreement =
    mode === "demo"
      ? {
          status: "confirmed",
          engagementMode: "pilot",
          billingModel: "fixed scope",
          budgetLabel: "RMB 80k - 150k",
          startWindow: "within 2 weeks",
          notes:
            "Commercial frame is still intentionally light, but the customer and builder have aligned on a bounded pilot and a first budget band."
        }
      : {
          status: "draft",
          engagementMode: "pilot",
          billingModel: "to be confirmed",
          budgetLabel: "to be scoped",
          startWindow: "kickoff pending",
          notes:
            "This engagement has been accepted into delivery, but the commercial frame still needs explicit confirmation."
        };

  const customerConfirmation =
    mode === "demo"
      ? {
          status: "issues_reported",
          summary: "Customer validation exposed a few rollout issues before broader acceptance.",
          notes:
            "Operators confirmed the pilot value, but they still need night-shift glare handling and false-positive reduction before signing off.",
          nextStep: "Tighten the edge model for night-shift lighting and return a patched pilot build.",
          confirmedAt: null
        }
      : {
          status: "pending",
          summary: "Customer confirmation has not started yet.",
          notes:
            "Delivery is in motion, but the customer has not yet confirmed whether the pilot is acceptable in the field.",
          nextStep: "Move the engagement to delivered, then collect a formal customer confirmation.",
          confirmedAt: null
        };

  const quoteItems =
    mode === "demo"
      ? [
          {
            id: `quote-item-${taskRequestId}-pilot`,
            title: "Pilot deployment package",
            summary:
              "Covers rollout design, first-line deployment, operator enablement, and the first validation cycle.",
            amountLabel: "RMB 80k - 150k",
            scopeLabel: "phase 1 / pilot",
            status: "included"
          }
        ]
      : [
          {
            id: `quote-item-${taskRequestId}-pilot`,
            title: "Pilot rollout package",
            summary:
              "Initial delivery scope covering deployment prep, first workflow release, and validation support.",
            amountLabel: "to be quoted",
            scopeLabel: "phase 1 / pilot",
            status: "proposed"
          }
        ];

  const commercialDecision =
    mode === "demo"
      ? {
          status: "request_changes",
          notes:
            "The customer is aligned on the pilot shape but wants tighter payment terms before signature.",
          decidedAt: null
        }
      : {
          status: "pending",
          notes:
            "No customer-side commercial decision has been recorded yet.",
          decidedAt: null
        };

  return {
    milestones,
    deliverables,
    reviews,
    agreement,
    customerConfirmation,
    quoteItems,
    commercialDecision
  };
}

export async function ensureEngagementScaffold(
  db: EngagementScaffoldDb,
  { engagementId, taskRequestId, mode = "live" }: EngagementScaffoldParams
) {
  const overwriteExisting = mode === "demo";
  const templates = getScaffoldTemplates(taskRequestId, mode);

  for (const milestone of templates.milestones) {
    await db.engagementMilestone.upsert({
      where: {
        id: milestone.id
      },
      update: overwriteExisting
        ? {
            title: milestone.title,
            summary: milestone.summary,
            status: milestone.status,
            dueLabel: milestone.dueLabel,
            engagementId
          }
        : {},
      create: {
        id: milestone.id,
        title: milestone.title,
        summary: milestone.summary,
        status: milestone.status,
        dueLabel: milestone.dueLabel,
        engagementId
      }
    });
  }

  for (const deliverable of templates.deliverables) {
    await db.engagementDeliverable.upsert({
      where: {
        id: deliverable.id
      },
      update: overwriteExisting
        ? {
            title: deliverable.title,
            summary: deliverable.summary,
            artifactType: deliverable.artifactType,
            status: deliverable.status,
            engagementId
          }
        : {},
      create: {
        id: deliverable.id,
        title: deliverable.title,
        summary: deliverable.summary,
        artifactType: deliverable.artifactType,
        status: deliverable.status,
        engagementId
      }
    });
  }

  for (const review of templates.reviews) {
    await db.engagementReview.upsert({
      where: {
        id: review.id
      },
      update: overwriteExisting
        ? {
            verdict: review.verdict,
            notes: review.notes,
            engagementId,
            deliverableId: review.deliverableId
          }
        : {},
      create: {
        id: review.id,
        verdict: review.verdict,
        notes: review.notes,
        engagementId,
        deliverableId: review.deliverableId
      }
    });
  }

  await db.engagementAgreement.upsert({
    where: {
      engagementId
    },
    update: overwriteExisting
      ? {
          status: templates.agreement.status,
          engagementMode: templates.agreement.engagementMode,
          billingModel: templates.agreement.billingModel,
          budgetLabel: templates.agreement.budgetLabel,
          startWindow: templates.agreement.startWindow,
          notes: templates.agreement.notes
        }
      : {},
    create: {
      engagementId,
      status: templates.agreement.status,
      engagementMode: templates.agreement.engagementMode,
      billingModel: templates.agreement.billingModel,
      budgetLabel: templates.agreement.budgetLabel,
      startWindow: templates.agreement.startWindow,
      notes: templates.agreement.notes
    }
  });

  const agreement = await db.engagementAgreement.findUniqueOrThrow({
    where: {
      engagementId
    }
  });

  for (const item of templates.quoteItems) {
    await db.engagementQuoteItem.upsert({
      where: {
        id: item.id
      },
      update: overwriteExisting
        ? {
            title: item.title,
            summary: item.summary,
            amountLabel: item.amountLabel,
            scopeLabel: item.scopeLabel,
            status: item.status,
            agreementId: agreement.id
          }
        : {},
      create: {
        id: item.id,
        agreementId: agreement.id,
        title: item.title,
        summary: item.summary,
        amountLabel: item.amountLabel,
        scopeLabel: item.scopeLabel,
        status: item.status
      }
    });
  }

  await db.engagementCommercialDecision.upsert({
    where: {
      agreementId: agreement.id
    },
    update: overwriteExisting
      ? {
          status: templates.commercialDecision.status,
          notes: templates.commercialDecision.notes,
          decidedAt: templates.commercialDecision.decidedAt
        }
      : {},
    create: {
      agreementId: agreement.id,
      status: templates.commercialDecision.status,
      notes: templates.commercialDecision.notes,
      decidedAt: templates.commercialDecision.decidedAt
    }
  });

  await db.engagementCustomerConfirmation.upsert({
    where: {
      engagementId
    },
    update: overwriteExisting
      ? {
          status: templates.customerConfirmation.status,
          summary: templates.customerConfirmation.summary,
          notes: templates.customerConfirmation.notes,
          nextStep: templates.customerConfirmation.nextStep,
          confirmedAt: templates.customerConfirmation.confirmedAt
        }
      : {},
    create: {
      engagementId,
      status: templates.customerConfirmation.status,
      summary: templates.customerConfirmation.summary,
      notes: templates.customerConfirmation.notes,
      nextStep: templates.customerConfirmation.nextStep,
      confirmedAt: templates.customerConfirmation.confirmedAt
    }
  });
}
