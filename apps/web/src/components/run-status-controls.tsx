"use client";

import { useState } from "react";
import {
  RunStatusUpdateInputSchema,
  TaskRunDetailSchema,
  type TaskRunDetail,
  type TaskRunStatus
} from "@agora/shared/domain";
import { apiBaseUrl } from "../lib/api";

const statusOptions: TaskRunStatus[] = ["running", "completed", "failed"];

type RunStatusControlsProps = {
  initialRun: TaskRunDetail;
};

export function RunStatusControls({ initialRun }: RunStatusControlsProps) {
  const [run, setRun] = useState(initialRun);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function applyStatus(status: TaskRunStatus) {
    setError("");
    setIsSubmitting(true);

    const parsed = RunStatusUpdateInputSchema.safeParse({
      status,
      message
    });

    if (!parsed.success) {
      setError("Invalid status update.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/task-runs/${run.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsed.data)
      });

      const payload = (await response.json()) as {
        item?: unknown;
        error?: string;
      };

      const parsedItem = TaskRunDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(payload.error ?? "Run status update failed");
      }

      setRun(parsedItem.data);
      setMessage("");
    } catch (updateError) {
      setError(
        updateError instanceof Error ? updateError.message : "Run status update failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <h2>Run Controls</h2>
      <p className="tagline">Current status: {run.status}</p>
      <label className="stack">
        <span>Status message</span>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Add an execution note"
        />
      </label>
      <div className="buttonrow">
        {statusOptions.map((status) => (
          <button
            key={status}
            type="button"
            disabled={isSubmitting}
            onClick={() => applyStatus(status)}
          >
            Mark {status}
          </button>
        ))}
      </div>
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
