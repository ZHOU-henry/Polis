import type { RunStatusUpdateInput } from "@agora/shared/domain";

const allowedTransitions: Record<string, string[]> = {
  submitted: ["running", "completed", "failed"],
  running: ["completed", "failed"],
  completed: [],
  failed: []
};

export function canTransitionRun(current: string, next: RunStatusUpdateInput["status"]) {
  return allowedTransitions[current]?.includes(next) ?? false;
}

export function canReviewRun(status: string) {
  return status === "completed" || status === "failed";
}
