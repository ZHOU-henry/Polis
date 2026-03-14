"use client";

import { useState } from "react";
import {
  EngagementDeliverableStatusUpdateInputSchema,
  EngagementDetailSchema,
  EngagementReviewInputSchema,
  EngagementStatusUpdateInputSchema,
  type EngagementDetail
} from "@agora/shared/domain";
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

export function EngagementOpsControls({
  initialEngagement,
  locale
}: EngagementOpsControlsProps) {
  const readOnlyPreview = isReadOnlyPreviewMode();
  const [engagement, setEngagement] = useState(initialEngagement);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewVerdict, setReviewVerdict] = useState<(typeof reviewVerdicts)[number]>("approved");
  const [reviewDeliverableId, setReviewDeliverableId] = useState("");
  const [error, setError] = useState("");
  const [pendingKey, setPendingKey] = useState("");

  const t =
    locale === "zh"
      ? {
          eyebrow: "运营控制",
          title: "推进承接状态、交付物与审核",
          previewDisabled: "当前是受保护的交互模式才允许修改；只读模式下这些操作被禁用。",
          engagementStatus: "承接状态",
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
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : t.failed);
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
