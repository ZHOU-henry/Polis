import type { TaskRequestInput } from "@agora/shared/domain";
import { prisma } from "../lib/prisma.js";

export function listTaskRequests() {
  return prisma.taskRequest.findMany({
    include: {
      agent: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export function createTaskRequest(input: TaskRequestInput) {
  return prisma.taskRequest.create({
    data: {
      agentId: input.agentId,
      title: input.title,
      description: input.description,
      contextNote: input.contextNote,
      status: "submitted"
    },
    include: {
      agent: true
    }
  });
}
