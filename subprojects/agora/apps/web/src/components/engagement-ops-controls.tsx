"use client";

import { startTransition, useEffect, useState } from "react";
import {
  EngagementAgreementInputSchema,
  EngagementDeliverableStatusUpdateInputSchema,
  EngagementDeliverableInputSchema,
  EngagementDetailSchema,
  EngagementMilestoneInputSchema,
  EngagementQuoteItemInputSchema,
  EngagementReviewInputSchema,
  EngagementStatusUpdateInputSchema,
  type EngagementDetail
} from "@agora/shared/domain";
import { useRouter } from "next/navigation";
import { browserApiBasePath } from "../lib/api";
import type { Locale } from "../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../lib/presenters";
import { isReadOnlyPreviewMode } from "../lib/runtime";

type EngagementOpsControlsProps = {
  initialEngagement: EngagementDetail;
  locale: Locale;
};

const engagementStatuses = ["kickoff", "scoping", "building", "review", "delivered"] as const;
const deliverableStatuses = ["planned", "in_progress", "in_review", "approved", "needs_work"] as const;
const reviewVerdicts = ["approved", "needs_work"] as const;
const agreementStatuses = ["draft", "sent", "negotiating", "confirmed"] as const;

export function EngagementOpsControls({
  initialEngagement,
  locale
}: EngagementOpsControlsProps) {
  const router = useRouter();
  const readOnlyPreview = isReadOnlyPreviewMode();
  const [engagement, setEngagement] = useState(initialEngagement);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewVerdict, setReviewVerdict] = useState<(typeof reviewVerdicts)[number]>("approved");
  const [reviewDeliverableId, setReviewDeliverableId] = useState("");
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneSummary, setMilestoneSummary] = useState("");
  const [milestoneDueLabel, setMilestoneDueLabel] = useState("");
  const [deliverableTitle, setDeliverableTitle] = useState("");
  const [deliverableSummary, setDeliverableSummary] = useState("");
  const [deliverableType, setDeliverableType] = useState("");
  const [agreementStatus, setAgreementStatus] = useState<
    (typeof agreementStatuses)[number]
  >(
    initialEngagement.agreement?.status ?? "draft"
  );
  const [agreementMode, setAgreementMode] = useState(
    initialEngagement.agreement?.engagementMode ?? "pilot"
  );
  const [agreementBillingModel, setAgreementBillingModel] = useState(
    initialEngagement.agreement?.billingModel ?? ""
  );
  const [agreementBudgetLabel, setAgreementBudgetLabel] = useState(
    initialEngagement.agreement?.budgetLabel ?? ""
  );
  const [agreementStartWindow, setAgreementStartWindow] = useState(
    initialEngagement.agreement?.startWindow ?? ""
  );
  const [agreementQuoteReference, setAgreementQuoteReference] = useState(
    initialEngagement.agreement?.quoteReference ?? ""
  );
  const [agreementPaymentTerms, setAgreementPaymentTerms] = useState(
    initialEngagement.agreement?.paymentTerms ?? ""
  );
  const [agreementServiceWindow, setAgreementServiceWindow] = useState(
    initialEngagement.agreement?.serviceWindow ?? ""
  );
  const [agreementNotes, setAgreementNotes] = useState(
    initialEngagement.agreement?.notes ?? ""
  );
  const [quoteItemTitle, setQuoteItemTitle] = useState("");
  const [quoteItemSummary, setQuoteItemSummary] = useState("");
  const [quoteItemAmountLabel, setQuoteItemAmountLabel] = useState("");
  const [quoteItemScopeLabel, setQuoteItemScopeLabel] = useState("");
  const [quoteItemStatus, setQuoteItemStatus] = useState<"proposed" | "included" | "optional">(
    "proposed"
  );
  const [error, setError] = useState("");
  const [pendingKey, setPendingKey] = useState("");

  useEffect(() => {
    setEngagement(initialEngagement);
    setAgreementStatus(initialEngagement.agreement?.status ?? "draft");
    setAgreementMode(initialEngagement.agreement?.engagementMode ?? "pilot");
    setAgreementBillingModel(initialEngagement.agreement?.billingModel ?? "");
    setAgreementBudgetLabel(initialEngagement.agreement?.budgetLabel ?? "");
    setAgreementStartWindow(initialEngagement.agreement?.startWindow ?? "");
    setAgreementQuoteReference(initialEngagement.agreement?.quoteReference ?? "");
    setAgreementPaymentTerms(initialEngagement.agreement?.paymentTerms ?? "");
    setAgreementServiceWindow(initialEngagement.agreement?.serviceWindow ?? "");
    setAgreementNotes(initialEngagement.agreement?.notes ?? "");
  }, [initialEngagement]);

  const t =
    locale === "zh"
      ? {
          eyebrow: "运营控制",
          title: "推进承接状态、交付物与审核",
          previewDisabled: "当前是受保护的交互模式才允许修改；只读模式下这些操作被禁用。",
          engagementStatus: "承接状态",
          milestoneTitle: "新增里程碑",
          milestoneName: "里程碑标题",
          milestoneSummary: "里程碑说明",
          milestoneDue: "目标时间",
          milestoneSubmit: "新增里程碑",
          deliverableTitle: "新增交付物",
          deliverableName: "交付物标题",
          deliverableSummary: "交付物说明",
          deliverableType: "交付物类型",
          deliverableSubmit: "新增交付物",
          agreementTitle: "商务确认",
          agreementStatus: "商务状态",
          agreementMode: "合作方式",
          agreementBilling: "计费方式",
          agreementBudget: "预算区间",
          agreementStart: "启动窗口",
          agreementQuoteReference: "报价编号",
          agreementPaymentTerms: "付款条款",
          agreementServiceWindow: "服务窗口",
          agreementNotes: "商务备注",
          agreementSubmit: "保存商务信息",
          quoteTitle: "新增报价项",
          quoteItemTitle: "报价项标题",
          quoteItemSummary: "报价项说明",
          quoteItemAmount: "金额标签",
          quoteItemScope: "范围标签",
          quoteItemStatus: "报价项状态",
          quoteSubmit: "新增报价项",
          reviewTitle: "提交审核记录",
          verdict: "审核结论",
          notes: "审核备注",
          notesPlaceholder: "写下这次审核为何通过或要求返工。",
          reviewTarget: "关联交付物",
          submitReview: "提交审核",
          failed: "操作失败"
        }
      : {
          eyebrow: "Operations",
          title: "Advance engagement, deliverables, and review",
          previewDisabled: "These actions are available only in protected interactive mode. They are disabled in read-only mode.",
          engagementStatus: "Engagement status",
          milestoneTitle: "Add milestone",
          milestoneName: "Milestone title",
          milestoneSummary: "Milestone summary",
          milestoneDue: "Target window",
          milestoneSubmit: "Add milestone",
          deliverableTitle: "Add deliverable",
          deliverableName: "Deliverable title",
          deliverableSummary: "Deliverable summary",
          deliverableType: "Artifact type",
          deliverableSubmit: "Add deliverable",
          agreementTitle: "Commercial frame",
          agreementStatus: "Commercial status",
          agreementMode: "Engagement mode",
          agreementBilling: "Billing model",
          agreementBudget: "Budget band",
          agreementStart: "Start window",
          agreementQuoteReference: "Quote reference",
          agreementPaymentTerms: "Payment terms",
          agreementServiceWindow: "Service window",
          agreementNotes: "Commercial notes",
          agreementSubmit: "Save commercial frame",
          quoteTitle: "Add quote item",
          quoteItemTitle: "Quote item title",
          quoteItemSummary: "Quote item summary",
          quoteItemAmount: "Amount label",
          quoteItemScope: "Scope label",
          quoteItemStatus: "Quote item status",
          quoteSubmit: "Add quote item",
          reviewTitle: "Submit review log",
          verdict: "Verdict",
          notes: "Notes",
          notesPlaceholder: "Explain why this review approves or requests rework.",
          reviewTarget: "Linked deliverable",
          submitReview: "Submit review",
          failed: "Operation failed"
        };

  async function applyEngagementStatus(status: (typeof engagementStatuses)[number]) {
    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey(`engagement:${status}`);

    const parsed = EngagementStatusUpdateInputSchema.safeParse({ status });
    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(`${browserApiBasePath}/engagements/${engagement.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsed.data)
      });

      const payload = (await response.json()) as { item?: unknown; error?: string };
      const parsedItem = EngagementDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(payload.error ?? t.failed);
      }

      setEngagement(parsedItem.data);
      startTransition(() => {
        router.refresh();
      });
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : t.failed);
    } finally {
      setPendingKey("");
    }
  }

  async function applyDeliverableStatus(
    deliverableId: string,
    status: (typeof deliverableStatuses)[number]
  ) {
    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey(`deliverable:${deliverableId}:${status}`);

    const parsed = EngagementDeliverableStatusUpdateInputSchema.safeParse({ status });
    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(
        `${browserApiBasePath}/engagement-deliverables/${deliverableId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(parsed.data)
        }
      );

      const payload = (await response.json()) as { item?: unknown; error?: string };
      const parsedItem = EngagementDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(payload.error ?? t.failed);
      }

      setEngagement(parsedItem.data);
      startTransition(() => {
        router.refresh();
      });
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : t.failed);
    } finally {
      setPendingKey("");
    }
  }

  async function submitMilestone(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey("milestone");

    const parsed = EngagementMilestoneInputSchema.safeParse({
      title: milestoneTitle,
      summary: milestoneSummary,
      dueLabel: milestoneDueLabel
    });

    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(
        `${browserApiBasePath}/engagements/${engagement.id}/milestones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(parsed.data)
        }
      );

      const payload = (await response.json()) as { item?: unknown; error?: string };
      const parsedItem = EngagementDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(payload.error ?? t.failed);
      }

      setEngagement(parsedItem.data);
      setMilestoneTitle("");
      setMilestoneSummary("");
      setMilestoneDueLabel("");
      startTransition(() => {
        router.refresh();
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.failed);
    } finally {
      setPendingKey("");
    }
  }

  async function submitDeliverable(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey("deliverable:new");

    const parsed = EngagementDeliverableInputSchema.safeParse({
      title: deliverableTitle,
      summary: deliverableSummary,
      artifactType: deliverableType
    });

    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(
        `${browserApiBasePath}/engagements/${engagement.id}/deliverables`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(parsed.data)
        }
      );

      const payload = (await response.json()) as { item?: unknown; error?: string };
      const parsedItem = EngagementDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(payload.error ?? t.failed);
      }

      setEngagement(parsedItem.data);
      setDeliverableTitle("");
      setDeliverableSummary("");
      setDeliverableType("");
      startTransition(() => {
        router.refresh();
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.failed);
    } finally {
      setPendingKey("");
    }
  }

  async function submitAgreement(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey("agreement");

    const parsed = EngagementAgreementInputSchema.safeParse({
      status: agreementStatus,
      engagementMode: agreementMode,
      billingModel: agreementBillingModel,
      budgetLabel: agreementBudgetLabel,
      startWindow: agreementStartWindow,
      quoteReference: agreementQuoteReference,
      paymentTerms: agreementPaymentTerms,
      serviceWindow: agreementServiceWindow,
      notes: agreementNotes
    });

    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(
        `${browserApiBasePath}/engagements/${engagement.id}/agreement`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(parsed.data)
        }
      );

      const payload = (await response.json()) as { item?: unknown; error?: string };
      const parsedItem = EngagementDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(payload.error ?? t.failed);
      }

      setEngagement(parsedItem.data);
      startTransition(() => {
        router.refresh();
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.failed);
    } finally {
      setPendingKey("");
    }
  }

  async function submitQuoteItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey("quote-item");

    const parsed = EngagementQuoteItemInputSchema.safeParse({
      title: quoteItemTitle,
      summary: quoteItemSummary,
      amountLabel: quoteItemAmountLabel,
      scopeLabel: quoteItemScopeLabel,
      status: quoteItemStatus
    });

    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(
        `${browserApiBasePath}/engagements/${engagement.id}/quote-items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(parsed.data)
        }
      );

      const payload = (await response.json()) as { item?: unknown; error?: string };
      const parsedItem = EngagementDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(payload.error ?? t.failed);
      }

      setEngagement(parsedItem.data);
      setQuoteItemTitle("");
      setQuoteItemSummary("");
      setQuoteItemAmountLabel("");
      setQuoteItemScopeLabel("");
      setQuoteItemStatus("proposed");
      startTransition(() => {
        router.refresh();
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.failed);
    } finally {
      setPendingKey("");
    }
  }

  async function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey("review");

    const parsed = EngagementReviewInputSchema.safeParse({
      verdict: reviewVerdict,
      notes: reviewNotes,
      deliverableId: reviewDeliverableId || null
    });

    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(`${browserApiBasePath}/engagements/${engagement.id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsed.data)
      });

      const payload = (await response.json()) as { item?: unknown; error?: string };
      const parsedItem = EngagementDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(payload.error ?? t.failed);
      }

      setEngagement(parsedItem.data);
      setReviewNotes("");
      setReviewDeliverableId("");
      setReviewVerdict("approved");
      startTransition(() => {
        router.refresh();
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.failed);
    } finally {
      setPendingKey("");
    }
  }

  return (
    <section className="panel">
      <div className="sectionhead">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2>{t.title}</h2>
      </div>
      {readOnlyPreview ? <p className="small">{t.previewDisabled}</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="microstack">
        <p className="microeyebrow">{t.engagementStatus}</p>
        <div className="buttonrow">
          {engagementStatuses.map((status) => (
            <button
              key={status}
              type="button"
              disabled={pendingKey.length > 0}
              onClick={() => applyEngagementStatus(status)}
            >
              {humanizeToken(status, locale)}
            </button>
          ))}
        </div>
      </div>

      <div className="surface-grid surface-grid-two">
        <form className="form" onSubmit={submitMilestone}>
          <div className="sectionhead">
            <p className="eyebrow">{t.milestoneTitle}</p>
          </div>
          <label>
            <span>{t.milestoneName}</span>
            <input
              value={milestoneTitle}
              onChange={(event) => setMilestoneTitle(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.milestoneSummary}</span>
            <textarea
              value={milestoneSummary}
              onChange={(event) => setMilestoneSummary(event.target.value)}
              rows={3}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.milestoneDue}</span>
            <input
              value={milestoneDueLabel}
              onChange={(event) => setMilestoneDueLabel(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <button type="submit" disabled={pendingKey.length > 0}>
            {t.milestoneSubmit}
          </button>
        </form>

        <form className="form" onSubmit={submitDeliverable}>
          <div className="sectionhead">
            <p className="eyebrow">{t.deliverableTitle}</p>
          </div>
          <label>
            <span>{t.deliverableName}</span>
            <input
              value={deliverableTitle}
              onChange={(event) => setDeliverableTitle(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.deliverableSummary}</span>
            <textarea
              value={deliverableSummary}
              onChange={(event) => setDeliverableSummary(event.target.value)}
              rows={3}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.deliverableType}</span>
            <input
              value={deliverableType}
              onChange={(event) => setDeliverableType(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <button type="submit" disabled={pendingKey.length > 0}>
            {t.deliverableSubmit}
          </button>
        </form>
      </div>

      <div className="timeline">
        {engagement.deliverables.map((deliverable) => (
          <article key={deliverable.id} className="timelineitem">
            <div className="timelinehead">
              <p className="tagline">{deliverable.title}</p>
              <span className={`statuspill ${toneClass(deliverable.status)}`}>
                {humanizeToken(deliverable.status, locale)}
              </span>
            </div>
            <p>{deliverable.summary}</p>
            <p className="tagline">{deliverable.artifactType}</p>
            <div className="buttonrow">
              {deliverableStatuses.map((status) => (
                <button
                  key={`${deliverable.id}-${status}`}
                  type="button"
                  disabled={pendingKey.length > 0}
                  onClick={() => applyDeliverableStatus(deliverable.id, status)}
                >
                  {humanizeToken(status, locale)}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>

      <form className="form" onSubmit={submitAgreement}>
        <div className="sectionhead">
          <p className="eyebrow">{t.agreementTitle}</p>
        </div>
        <div className="surface-grid surface-grid-two">
          <label>
            <span>{t.agreementStatus}</span>
            <select
              value={agreementStatus}
              onChange={(event) =>
                setAgreementStatus(
                  event.target.value as (typeof agreementStatuses)[number]
                )
              }
              disabled={pendingKey.length > 0}
            >
              {agreementStatuses.map((status) => (
                <option key={status} value={status}>
                  {humanizeToken(status, locale)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t.agreementMode}</span>
            <input
              value={agreementMode}
              onChange={(event) => setAgreementMode(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.agreementBilling}</span>
            <input
              value={agreementBillingModel}
              onChange={(event) => setAgreementBillingModel(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.agreementBudget}</span>
            <input
              value={agreementBudgetLabel}
              onChange={(event) => setAgreementBudgetLabel(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.agreementStart}</span>
            <input
              value={agreementStartWindow}
              onChange={(event) => setAgreementStartWindow(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.agreementQuoteReference}</span>
            <input
              value={agreementQuoteReference}
              onChange={(event) => setAgreementQuoteReference(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.agreementPaymentTerms}</span>
            <input
              value={agreementPaymentTerms}
              onChange={(event) => setAgreementPaymentTerms(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.agreementServiceWindow}</span>
            <input
              value={agreementServiceWindow}
              onChange={(event) => setAgreementServiceWindow(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
        </div>
        <label>
          <span>{t.agreementNotes}</span>
          <textarea
            value={agreementNotes}
            onChange={(event) => setAgreementNotes(event.target.value)}
            rows={4}
            disabled={pendingKey.length > 0}
          />
        </label>
        <button type="submit" disabled={pendingKey.length > 0}>
          {t.agreementSubmit}
        </button>
      </form>

      <form className="form" onSubmit={submitQuoteItem}>
        <div className="sectionhead">
          <p className="eyebrow">{t.quoteTitle}</p>
        </div>
        <div className="surface-grid surface-grid-two">
          <label>
            <span>{t.quoteItemTitle}</span>
            <input
              value={quoteItemTitle}
              onChange={(event) => setQuoteItemTitle(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.quoteItemAmount}</span>
            <input
              value={quoteItemAmountLabel}
              onChange={(event) => setQuoteItemAmountLabel(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.quoteItemScope}</span>
            <input
              value={quoteItemScopeLabel}
              onChange={(event) => setQuoteItemScopeLabel(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.quoteItemStatus}</span>
            <select
              value={quoteItemStatus}
              onChange={(event) =>
                setQuoteItemStatus(
                  event.target.value as "proposed" | "included" | "optional"
                )
              }
              disabled={pendingKey.length > 0}
            >
              <option value="proposed">{humanizeToken("proposed", locale)}</option>
              <option value="included">{humanizeToken("included", locale)}</option>
              <option value="optional">{humanizeToken("optional", locale)}</option>
            </select>
          </label>
        </div>
        <label>
          <span>{t.quoteItemSummary}</span>
          <textarea
            value={quoteItemSummary}
            onChange={(event) => setQuoteItemSummary(event.target.value)}
            rows={3}
            disabled={pendingKey.length > 0}
          />
        </label>
        <button type="submit" disabled={pendingKey.length > 0}>
          {t.quoteSubmit}
        </button>
      </form>

      {engagement.quoteItems.length > 0 ? (
        <div className="timeline">
          {engagement.quoteItems.map((item) => (
            <article key={item.id} className="timelineitem">
              <div className="timelinehead">
                <p className="tagline">{item.title}</p>
                <span className={`statuspill ${toneClass(item.status)}`}>
                  {humanizeToken(item.status, locale)}
                </span>
              </div>
              <p>{item.summary}</p>
              <p className="tagline">
                {item.amountLabel} / {item.scopeLabel}
              </p>
            </article>
          ))}
        </div>
      ) : null}

      <form className="form" onSubmit={submitReview}>
        <div className="sectionhead">
          <p className="eyebrow">{t.reviewTitle}</p>
        </div>
        <label>
          <span>{t.verdict}</span>
          <select
            value={reviewVerdict}
            onChange={(event) =>
              setReviewVerdict(event.target.value as (typeof reviewVerdicts)[number])
            }
          >
            {reviewVerdicts.map((verdict) => (
              <option key={verdict} value={verdict}>
                {humanizeToken(verdict, locale)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{t.reviewTarget}</span>
          <select
            value={reviewDeliverableId}
            onChange={(event) => setReviewDeliverableId(event.target.value)}
          >
            <option value="">-</option>
            {engagement.deliverables.map((deliverable) => (
              <option key={deliverable.id} value={deliverable.id}>
                {deliverable.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{t.notes}</span>
          <textarea
            value={reviewNotes}
            onChange={(event) => setReviewNotes(event.target.value)}
            rows={4}
            placeholder={t.notesPlaceholder}
          />
        </label>
        <button type="submit" disabled={pendingKey.length > 0}>
          {t.submitReview}
        </button>
      </form>

      <div className="timeline">
        {engagement.reviews.map((review) => (
          <article key={review.id} className="timelineitem">
            <div className="timelinehead">
              <p className="tagline">
                {locale === "zh" ? "审核记录" : "Review log"}
              </p>
              <span className={`statuspill ${toneClass(review.verdict)}`}>
                {humanizeToken(review.verdict, locale)}
              </span>
            </div>
            <p>{review.notes}</p>
            {review.deliverableId ? (
              <p className="tagline">
                {locale === "zh" ? "关联交付物" : "Deliverable"} / {review.deliverableId}
              </p>
            ) : null}
            <p className="timestamp">{formatTimestamp(review.createdAt, locale)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
