import { randomUUID } from "node:crypto";
import type { TaskRequestInput, TaskRequestRecord } from "@agora/shared/domain";

const taskRequests: TaskRequestRecord[] = [];

export function listTaskRequests() {
  return taskRequests;
}

export function createTaskRequest(input: TaskRequestInput) {
  const record: TaskRequestRecord = {
    ...input,
    id: randomUUID(),
    status: "submitted",
    createdAt: new Date().toISOString()
  };

  taskRequests.unshift(record);
  return record;
}
